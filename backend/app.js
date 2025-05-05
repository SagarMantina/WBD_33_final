
const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const gameDetails = require("./models/gameschema");
const user = require("./models/accountschema");
const Message = require("./models/messageschema");
const { connecttomongodb } = require("./models/connect");
const router = require("./routes/router");
const helmet = require("helmet");
const morgan = require("morgan");
const rfs = require("rotating-file-stream");
require('dotenv').config();
const csurf = require("csurf");



// app.use(morgan(":method :url :status :res[content-length] - :response-time ms"));
const { errorHandler, notFoundHandler } = require("./middleware/errorhandlingRoute");
const port = process.env.PORT || 3000;
app.set('trust proxy', 1);
const rateLimit = require("express-rate-limit");

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, 
//   max: 100, // Limit each IP per window
//   message: "Too many requests, please try again later.",
// });

// app.use(limiter);


// const applyIndexing = async () => {
//   try {
//     await user.collection.createIndex({ user : 1 }); 
//     console.log("Indexing applied successfully!");
//   } catch (err) {
//     console.error("Error applying indexing:", err);
//   }
// };




user.on('index', (err) => {
  if (err) {
    console.error('Index creation failed:', err);
  } else {
    console.log('Indexes applied successfully!');
  }
});

app.use(express.static(path.join(__dirname, "..", "frontend", "build")));

app.use(cors({
  origin: [
    "http://localhost:5000",                     // Local frontend URL
    "https://solr-ii1s.onrender.com/solr/#/games_core/select",  // External service URL
    "https://p2p-digital-games-marketplace.onrender.com",  
    "https://p2p-digital-games-marketplace.vercel.app"
  ],
  credentials: true,  // Ensures cookies are allowed to be sent with requests
}));

// app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Security middleware
app.use(helmet());

// Logging with rotating logs
const accessLogStream = rfs.createStream("access.log", {
  interval: "1d", // Rotate logs daily
  path: path.join(__dirname, "logs"),
});
app.use(morgan("combined", { stream: accessLogStream }));


app.use(cookieParser()); 

app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(router);

// Connect to MongoDB and initialize game data
connecttomongodb(`${process.env.MONGO_URI}`)
  .then(async () => {
    console.log("DB CONNECTED");

    const count = await gameDetails.countDocuments();
    if (count === 0) {
      const filePath = path.join(__dirname, "models", "updated_games.json");
      const data = await readDataFromJSONFile(filePath);
      await Promise.all(data.map(async (gameData) => {
        const game = new gameDetails(gameData);
        await game.save();
      }));
      console.log("Data saved successfully to games collection!");

    
    } else {
      console.log(`Data already exists in game_details collection (${count} documents). No new data added.`);
    }

   
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });

// Read JSON file utility
function readDataFromJSONFile(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, "utf8", (err, data) => {
      if (err) reject(err);
      else resolve(JSON.parse(data));
    });
  });
}

// Express routes for contacts and messages
app.get("/contacts", async (req, res) => {
  try {
    const username = req.headers['x-username'];
    if (!currentUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const contacts = new Set();
    const senderMessages = await Message.find({ sender: currentUser });
    senderMessages.forEach((msg) => contacts.add(msg.recipient));

    const recipientMessages = await Message.find({ recipient: currentUser });
    recipientMessages.forEach((msg) => contacts.add(msg.sender));

    res.status(200).json(Array.from(contacts));
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ message: "Error fetching contacts" });
  }
});



app.get("/messages/:recipient", async (req, res) => {
  try {
    const username = req.headers['x-username'];
    const recipient = req.params.recipient;

    const messages = await Message.find({
      $or: [
        { sender: currentUser, recipient },
        { sender: recipient, recipient: currentUser },
      ],
    }).sort("timestamp");

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Error fetching messages" });
  }
});


// Socket.IO for real-time communication
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://p2p-final-backend.onrender.com", 
    methods: ["GET", "POST"],
    credentials: true,
  },
});



io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("joinRoom", (username) => {
    if (username) {
      socket.join(username);
      console.log(`${username} joined the room`);
    }
  });

  socket.on("sendMessage", async ({ sender, recipient, content }) => {
    try {
      const message = new Message({ sender, recipient, content });
      await message.save();

     
      io.to(recipient).emit("receiveMessage", message);
    } catch (error) {
      console.error("Error handling message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});


const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swaggerOptions');

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use(errorHandler);
app.use(notFoundHandler);


app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/build", "index.html"));
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
