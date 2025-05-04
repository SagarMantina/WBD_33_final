const express = require("express");
const cookieparser = require("cookie-parser");
const path = require("path");
const router = express.Router();
const user = require("../models/accountschema");
const app = express();
app.set("view  engine", "ejs");
const game_details = require("../models/gameschema");
router.use(cookieparser());
router.use(express.static(path.join(__dirname, "public")));

const { sellerdeleteGame, updateGame } = require("../controllers/sellerController");
const { adminRoute } = require("../middleware/authRoute");

const { getSellerdata ,  sellGame, getsellerMyGames,getsellerTransactions} = require("../controllers/sellerController");
const {createCommunity,
  joinCommunity,
  getCommunity,
  getcommunityChat,
  sendMessage,
  getUserCommunities,} = require("../controllers/communityController");
const {
  getuserdata,
  signout,

} = require("../controllers/dashboardController");
const {  updateuserdetails,getuserTransactions,getuserMyGames, checkUser } = require("../controllers/userController");
const { postlogin } = require("../controllers/loginController");
const { postregister } = require("../controllers/registerController");
const { postregister2 } = require("../controllers/register2Controller");
const {
  getallUsers,

} = require("../controllers/adminController");
const {
  addtocart,
  getcartgames,
  removetocart,
} = require("../controllers/cartController");
const {
  getComparisons,
  postreview,
  getclickgame,
} = require("../controllers/gamepageController");

const { paygame, cartpaygame} = require("../controllers/paymentController");
const { getTopSellingGames , getTopRevenueGames} = require("../controllers/paymentController");

const  {geteveryUser} = require("../controllers/dashboardController");

const { getadmindata } = require("../controllers/adminController");
const { homeGames , getcategories, searchgames } = require("../controllers/homeController");
const {getGames } = require("../controllers/adminController");
const {  getaTransactions} = require("../controllers/dashboardController");

const {admindeletegame} = require("../controllers/dashboardController"); 


const {authRoute} = require("../middleware/authRoute");
const {admin_update_user, admin_create_user, admin_delete_user,admin_delete_community_message,admin_delete_community} = require("../controllers/adminController");
const  {getRole} = require("../controllers/redisController");


router.delete("/admin/delete_user", adminRoute, admin_delete_user);
router.delete("/admin/delete_community", adminRoute, admin_delete_community);
router.delete("/admin/delete_community_message", adminRoute, admin_delete_community_message);

//to get all the users
router.get("/admin/all_users", adminRoute, geteveryUser);

//to use to update the details


/**
 * @swagger
 * /updateuser:
 *   post:
 *     summary: Update user details
 *     description: Update user details in the database. Allows updating the username, email, or password.
 *     tags: 
 *       - User
 *       - Seller
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: New username (optional).
 *               email:
 *                 type: string
 *                 description: New email address (optional).
 *               password:
 *                 type: string
 *                 description: New password (optional).
 *     responses:
 *       200:
 *         description: User details updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User details updated successfully.
 *       400:
 *         description: No valid fields provided to update.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorMessage:
 *                   type: string
 *                   example: No valid fields provided to update.
 *       401:
 *         description: Unauthorized or user not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorMessage:
 *                   type: string
 *                   example: User not found.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorMessage:
 *                   type: string
 *                   example: Internal server issues.
 */

router.post("/updateuser", updateuserdetails);




router.post("/admin/delete_game", admindeletegame);


/**
 * @swagger
 * /sell/games:
 *   post:
 *     summary: Create a new game
 *     description: Allows a seller to create a new game and save it to the database.
 *     tags: 
 *       - Seller
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               gameName:
 *                 type: string
 *                 description: Name of the game.
 *                 example: "Adventure Quest"
 *               description:
 *                 type: string
 *                 description: Description of the game.
 *                 example: "An exciting adventure game."
 *               poster:
 *                 type: string
 *                 description: URL of the game's poster image.
 *                 example: "https://example.com/poster.jpg"
 *               mainImage:
 *                 type: string
 *                 description: URL of the game's main image.
 *                 example: "https://example.com/main.jpg"
 *               subImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of URLs for additional images.
 *                 example: ["https://example.com/sub1.jpg", "https://example.com/sub2.jpg"]
 *               gifs:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of URLs for GIFs related to the game.
 *                 example: ["https://example.com/gif1.gif", "https://example.com/gif2.gif"]
 *               category:
 *                 type: string
 *                 description: Category of the game.
 *                 example: "Action"
 *               releaseDate:
 *                 type: string
 *                 format: date
 *                 description: Release date of the game.
 *                 example: "2025-05-01"
 *               gamePrice:
 *                 type: number
 *                 description: Price of the game.
 *                 example: 19.99
 *               about:
 *                 type: string
 *                 description: Additional information about the game.
 *                 example: "This game offers an immersive experience."
 *     responses:
 *       201:
 *         description: Game created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Game created successfully!
 *                 game:
 *                   type: object
 *                   description: Details of the created game.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error creating game.
 *                 error:
 *                   type: string
 *                   example: Detailed error message.
 */
router.post("/sell/games", async (req, res) => {
  try {
    const {
      gameName,
      description,
      poster,
      mainImage,
      subImages,
      gifs,
      category,
      releaseDate,
      gamePrice,
      about,
    } = req.body;
    const username = req.cookies.username;
    console.log(username);
    const newGame = new game_details({
      game_name: gameName,
      description,
      poster,
      main_image: mainImage,
      sub_images: subImages,
      gifs,
      category,
      releaseDate,
      seller: username,
      price: gamePrice,
      about,
    });
    console.log(newGame);
    await newGame.save();
    res.status(201).json({ message: "Game created successfully!", game: newGame });
  } catch (error) {
    res.status(500).json({ message: "Error creating game", error: error.message });
  }
});



// const adminRoute = async (req, res, next) => {
//   try {
     

//       const user_name = req.cookies.username;
      

//       if (!user_name) {
//           return res.status(401).json({ message: "Login First" });
//       }

//       const user_db = await user.findOne({ username: user_name });
//       if (!user_db) {
//           return res.status(401).json({ message: "User Not Found" });
//       }

//       req.user = user_db;
//       next();
//   } catch (error) {
//       return res.status(500).json({ message: "Server Error" });
//   }
// };

// router.put("/admin/update_user", adminRoute,  async (req, res) => {
//   try {
    
//     const { username, newPassword } = req.body;
//     const existing_user = await user.findOne({ username });
//     if (!existing_user) {
//       return res.status(404).send("User not found");
//     }
//     existing_user.password = newPassword;
//     await existing_user.save();
//     res.send("Password updated successfully");
//   } catch (error) {
//     console.error("Error updating password:", error);
//     res.status(500).send("Error updating password");
//   }
// });

// router.post("/admin/create_user", adminRoute, async (req, res) => {
//   try {
   
//     const { username, email, password } = req.body;
//     const newUser = new user({ username, email, password, role: "user" });
//     await newUser.save();
//     res.status(201).send("User created successfully");
//   } catch (error) {
//     console.error("Error creating user:", error);
//     res.status(500).send("Error creating user");
//   }
// });


/**
 * @swagger
 * /admin/update_user:
 *   put:
 *     summary: Update a user's password
 *     description: Allows an admin to update the password of an existing user.
 *     tags: 
 *       - Admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username of the user whose password needs to be updated.
 *                 example: "john_doe"
 *               newPassword:
 *                 type: string
 *                 description: The new password for the user.
 *                 example: "new_secure_password123"
 *     responses:
 *       200:
 *         description: Password updated successfully.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Password updated successfully
 *       404:
 *         description: User not found.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: User not found
 *       500:
 *         description: Internal server error.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Error updating password
 */
router.put("/admin/update_user", adminRoute, admin_update_user);


/**
 * @swagger
 * /admin/create_user:
 *   post:
 *     summary: Create a new user
 *     description: Allows an admin to create a new user with a username, email, and password.
 *     tags: 
 *       - Admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username for the new user.
 *                 example: "john_doe"
 *               email:
 *                 type: string
 *                 description: The email address for the new user.
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 description: The password for the new user.
 *                 example: "secure_password123"
 *     responses:
 *       201:
 *         description: User created successfully.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: User created successfully
 *       400:
 *         description: User or email already exists.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: User already exists
 *       500:
 *         description: Internal server error.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Error creating user
 */
router.post("/admin/create_user", adminRoute, admin_create_user);


/**
 * @swagger
 * /user/role:
 *   get:
 *     summary: Get the role of the logged-in user
 *     description: Fetches the role of the user based on the username stored in cookies. The role is cached in Redis for faster subsequent requests.
 *     tags: 
 *       - User
 *     responses:
 *       200:
 *         description: Role fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 role:
 *                   type: string
 *                   description: The role of the user.
 *                   example: "admin"
 *       400:
 *         description: Username cookie is missing.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorMessage:
 *                   type: string
 *                   example: Username cookie is missing
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorMessage:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorMessage:
 *                   type: string
 *                   example: Internal server error
 */
router.get("/user/role" , authRoute, getRole);

//handle the default route for all
// router.get("/", getdashboard);




//admin routes
//this route for getting admin all the game count, user count smth like that

/**
 * @swagger
 * /admin_data:
 *   get:
 *     summary: Get admin dashboard data
 *     description: Fetches data for the admin dashboard, including total games, total users, total purchases, today's sales, and sales increase compared to yesterday.
 *     tags: 
 *       - Admin
 *     responses:
 *       200:
 *         description: Admin data fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total_games:
 *                   type: integer
 *                   description: Total number of games.
 *                   example: 150
 *                 total_users:
 *                   type: integer
 *                   description: Total number of users.
 *                   example: 500
 *                 total_purchases:
 *                   type: integer
 *                   description: Total number of purchases.
 *                   example: 1200
 *                 today_sales:
 *                   type: integer
 *                   description: Number of sales made today.
 *                   example: 50
 *                 sales_increase:
 *                   type: integer
 *                   description: Increase in sales compared to yesterday.
 *                   example: 10
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.get("/admin_data",  getadmindata);


/**
 * @swagger
 * /api/top-selling:
 *   get:
 *     summary: Get the top 10 selling games
 *     description: Fetches the top 10 games sorted by the quantity sold in descending order.
 *     tags: 
 *       - Games
 *     responses:
 *       200:
 *         description: Top 10 games by quantity sold fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Top 10 Games by Quantity Sold
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       game_name:
 *                         type: string
 *                         description: Name of the game.
 *                         example: "Adventure Quest"
 *                       quantity_sold:
 *                         type: integer
 *                         description: Quantity of the game sold.
 *                         example: 500
 *                       price:
 *                         type: number
 *                         description: Price of the game.
 *                         example: 19.99
 *                       category:
 *                         type: string
 *                         description: Category of the game.
 *                         example: "Action"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorMessage:
 *                   type: string
 *                   example: Internal server error
 */
router.get("/api/top-selling",getTopSellingGames );


/**
 * @swagger
 * /api/top-revenue:
 *   get:
 *     summary: Get the top 10 games by highest revenue
 *     description: Fetches the top 10 games sorted by the highest revenue (price * quantity sold) in descending order.
 *     tags: 
 *       - Games
 *     responses:
 *       200:
 *         description: Top 10 games by highest revenue fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Top 10 Games by Highest Revenue
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       game_name:
 *                         type: string
 *                         description: Name of the game.
 *                         example: "Adventure Quest"
 *                       price:
 *                         type: number
 *                         description: Price of the game.
 *                         example: 19.99
 *                       quantity_sold:
 *                         type: integer
 *                         description: Quantity of the game sold.
 *                         example: 500
 *                       totalRevenue:
 *                         type: number
 *                         description: Total revenue generated by the game.
 *                         example: 9995
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorMessage:
 *                   type: string
 *                   example: Internal server error
 */
router.get("/api/top-revenue",getTopRevenueGames)

//admin, seller and user routes


/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user with their username and password. Sets a cookie with the username upon successful login.
 *     tags: 
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user.
 *                 example: "john_doe"
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *                 example: "secure_password123"
 *     responses:
 *       200:
 *         description: Login successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userrole:
 *                   type: string
 *                   description: The role of the logged-in user.
 *                   example: "admin"
 *       401:
 *         description: Unauthorized - Username not found or incorrect password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorMessage:
 *                   type: string
 *                   example: "Username not found or Incorrect password"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorMessage:
 *                   type: string
 *                   example: "Error processing data"
 */
router.post("/login", postlogin);

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     description: Allows a new user to register by providing their email, username, password, and confirmation password. The first user to register is assigned the "admin" role.
 *     tags: 
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address of the user.
 *                 example: "john.doe@example.com"
 *               username:
 *                 type: string
 *                 description: The username of the user.
 *                 example: "john_doe"
 *               password:
 *                 type: string
 *                 description: The password for the user.
 *                 example: "secure_password123"
 *               confirm_pass:
 *                 type: string
 *                 description: Confirmation of the password.
 *                 example: "secure_password123"
 *               userrole:
 *                 type: string
 *                 description: The role of the user (optional). Defaults to "user" unless it's the first user, who is assigned "admin".
 *                 example: "user"
 *     responses:
 *       201:
 *         description: Registration successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Registration successful!
 *       401:
 *         description: Validation error (e.g., username or email already exists, passwords do not match).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorMessage:
 *                   type: string
 *                   example: "Username already exists or Email already exists or Please Enter same Password"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Internal Server Error
 */
router.post("/register", postregister);


/**
 * @swagger
 * /register2:
 *   post:
 *     summary: Complete user registration (Step 2)
 *     description: Updates the latest registered user's profile with additional details like date of birth and a backup security key.
 *     tags: 
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 description: The date of birth of the user.
 *                 example: "1990-01-01"
 *               backupKey:
 *                 type: string
 *                 description: A backup security key for the user.
 *                 example: "my_secure_backup_key"
 *     responses:
 *       200:
 *         description: User registration step 2 updated successfully.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: User Registration 2 updated successfully
 *       404:
 *         description: No user found to update.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: No user found
 *       500:
 *         description: Internal server error.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Internal server issues
 */
router.post("/register2", postregister2);



router.get("/signout",authRoute, signout);
// end of user routes


/**
 * @swagger
 * /user/communities:
 *   get:
 *     summary: Get user's communities
 *     description: Fetches all communities associated with the logged-in user based on their username stored in cookies.
 *     tags: 
 *       - User
 *     responses:
 *       200:
 *         description: User's communities fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID of the community.
 *                     example: "645a1b2c3d4e5f6789012345"
 *                   name:
 *                     type: string
 *                     description: Name of the community.
 *                     example: "Gaming Enthusiasts"
 *                   description:
 *                     type: string
 *                     description: Description of the community.
 *                     example: "A community for gaming enthusiasts."
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error.
 */
router.get("/user/communities", getUserCommunities);

/**
 * @swagger
 * /createcommunity:
 *   post:
 *     summary: Create a new community
 *     description: Allows a user to create a new community. The community is associated with the logged-in user based on their username stored in cookies.
 *     tags: 
 *       - Community
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               community_name:
 *                 type: string
 *                 description: The name of the community to be created.
 *                 example: "Gaming Enthusiasts"
 *               description:
 *                 type: string
 *                 description: A brief description of the community.
 *                 example: "A community for gaming enthusiasts to share and discuss games."
 *     responses:
 *       200:
 *         description: Community created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: string
 *                   example: Community created successfully.
 *       400:
 *         description: Community already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Community already exists.
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Internal server issues
 */
router.post("/createcommunity", createCommunity);


/**
 * @swagger
 * /joincommunity:
 *   post:
 *     summary: Join a community
 *     description: Allows a user to join an existing community. The community is associated with the logged-in user based on their username stored in cookies.
 *     tags: 
 *       - Community
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               communityName:
 *                 type: string
 *                 description: The name of the community to join.
 *                 example: "Gaming Enthusiasts"
 *     responses:
 *       200:
 *         description: Successfully joined the community.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: string
 *                   example: Joined the community.
 *       400:
 *         description: User is already a member of the community.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Already a member of the community.
 *       404:
 *         description: User or community not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found or Community not found.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error.
 */
router.post("/joincommunity", joinCommunity);


/**
 * @swagger
 * /community:
 *   get:
 *     summary: Get all communities
 *     description: Fetches a list of all communities available in the database.
 *     tags: 
 *       - Community
 *     responses:
 *       200:
 *         description: List of communities fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID of the community.
 *                     example: "645a1b2c3d4e5f6789012345"
 *                   name:
 *                     type: string
 *                     description: Name of the community.
 *                     example: "Gaming Enthusiasts"
 *                   description:
 *                     type: string
 *                     description: Description of the community.
 *                     example: "A community for gaming enthusiasts."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error.
 */
router.get("/community", getCommunity);

/**
 * @swagger
 * /community/{community}:
 *   get:
 *     summary: Get community chat
 *     description: Fetches the chat messages of a specific community along with user information based on the logged-in user's username stored in cookies.
 *     tags: 
 *       - Community
 *     parameters:
 *       - in: path
 *         name: community
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the community to fetch chat messages for.
 *         example: "Gaming Enthusiasts"
 *     responses:
 *       200:
 *         description: Community chat fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                       description: The username of the logged-in user.
 *                       example: "john_doe"
 *                 community:
 *                   type: string
 *                   description: The name of the community.
 *                   example: "Gaming Enthusiasts"
 *                 messages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       sender:
 *                         type: string
 *                         description: The username of the message sender.
 *                         example: "jane_doe"
 *                       message:
 *                         type: string
 *                         description: The content of the message.
 *                         example: "Hello, everyone!"
 *       404:
 *         description: Community or user not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorMessage:
 *                   type: string
 *                   example: "Community not found. or User not found."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorMessage:
 *                   type: string
 *                   example: "Internal server error."
 */
router.get("/community/:community", getcommunityChat);


/**
 * @swagger
 * /community/{community}:
 *   post:
 *     summary: Send a message to a community
 *     description: Allows a user to send a message to a specific community. The community is identified by its name, and the user is identified by their username stored in cookies.
 *     tags: 
 *       - Community
 *     parameters:
 *       - in: path
 *         name: community
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the community to send the message to.
 *         example: "Gaming Enthusiasts"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: The content of the message to be sent.
 *                 example: "Hello, everyone!"
 *     responses:
 *       200:
 *         description: Message sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 successMessage:
 *                   type: string
 *                   example: Message sent successfully.
 *                 message:
 *                   type: object
 *                   properties:
 *                     sender:
 *                       type: string
 *                       description: The ID of the user who sent the message.
 *                       example: "645a1b2c3d4e5f6789012345"
 *                     message:
 *                       type: string
 *                       description: The content of the message.
 *                       example: "Hello, everyone!"
 *       404:
 *         description: Community or user not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorMessage:
 *                   type: string
 *                   example: "Community not found. or User not found."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorMessage:
 *                   type: string
 *                   example: Internal server error.
 */
router.post("/community/:community", sendMessage);










//get all the users and all the games data



/**
 * @swagger
 * /allusers:
 *   get:
 *     summary: Get all users data
 *     description: Fetches the total number of users, total visits, and the count of users created in the last 7 days.
 *     tags: 
 *       - Admin
 *     responses:
 *       200:
 *         description: Users data fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total_users:
 *                   type: integer
 *                   description: Total number of users.
 *                   example: 500
 *                 total_visits:
 *                   type: integer
 *                   description: Total number of visits (assumed equal to total users).
 *                   example: 500
 *                 weekly_visits:
 *                   type: array
 *                   items:
 *                     type: integer
 *                   description: Array containing the count of users created in the last 7 days (index 0 is today).
 *                   example: [10, 15, 20, 5, 8, 12, 7]
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error!
 */
router.get("/allusers", adminRoute, getallUsers);


/**
 * @swagger
 * /allgames:
 *   get:
 *     summary: Get all games
 *     description: Fetches a list of all games available in the database.
 *     tags: 
 *       - Games
 *     responses:
 *       200:
 *         description: List of games fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID of the game.
 *                     example: "645a1b2c3d4e5f6789012345"
 *                   game_name:
 *                     type: string
 *                     description: Name of the game.
 *                     example: "Adventure Quest"
 *                   description:
 *                     type: string
 *                     description: Description of the game.
 *                     example: "An exciting adventure game."
 *                   price:
 *                     type: number
 *                     description: Price of the game.
 *                     example: 19.99
 *                   category:
 *                     type: string
 *                     description: Category of the game.
 *                     example: "Action"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server error !
 */
router.get("/allgames", getGames);


//seller routes

/**
 * @swagger
 * /sellerdata:
 *   get:
 *     summary: Get seller data
 *     description: Fetches the details of the logged-in seller based on the username stored in cookies.
 *     tags: 
 *       - Seller
 *     responses:
 *       200:
 *         description: Seller data fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 seller:
 *                   type: object
 *                   description: Details of the seller.
 *                   properties:
 *                     username:
 *                       type: string
 *                       description: The username of the seller.
 *                       example: "john_doe"
 *                     email:
 *                       type: string
 *                       description: The email address of the seller.
 *                       example: "john.doe@example.com"
 *                     role:
 *                       type: string
 *                       description: The role of the user (e.g., seller).
 *                       example: "seller"
 *       404:
 *         description: Seller not found or not logged in.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorMessage:
 *                   type: string
 *                   example: PLEASE DO LOGIN!!!
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Internal Server Error
 */
router.get("/sellerdata", getSellerdata);

/**
 * @swagger
 * /sellgame:
 *   post:
 *     summary: Add a new game for sale
 *     description: Allows a seller to add a new game to the database. The seller is identified by their username stored in cookies.
 *     tags: 
 *       - Seller
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               gamename:
 *                 type: string
 *                 description: The name of the game to be added.
 *                 example: "Adventure Quest"
 *               poster:
 *                 type: string
 *                 description: URL of the game's poster image.
 *                 example: "https://example.com/poster.jpg"
 *               main_image:
 *                 type: string
 *                 description: URL of the game's main image.
 *                 example: "https://example.com/main.jpg"
 *               sub_images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of URLs for additional images.
 *                 example: ["https://example.com/sub1.jpg", "https://example.com/sub2.jpg"]
 *               gifs:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of URLs for GIFs related to the game.
 *                 example: ["https://example.com/gif1.gif", "https://example.com/gif2.gif"]
 *               description:
 *                 type: string
 *                 description: A brief description of the game.
 *                 example: "An exciting adventure game."
 *               category:
 *                 type: string
 *                 description: The category of the game.
 *                 example: "Action"
 *               releaseDate:
 *                 type: string
 *                 format: date
 *                 description: The release date of the game.
 *                 example: "2025-05-01"
 *               price:
 *                 type: number
 *                 description: The price of the game.
 *                 example: 19.99
 *               about:
 *                 type: string
 *                 description: Additional information about the game.
 *                 example: "This game offers an immersive experience."
 *     responses:
 *       200:
 *         description: Game added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 successMessage:
 *                   type: string
 *                   example: Game Added Successfully
 *       400:
 *         description: Game already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorMessage:
 *                   type: string
 *                   example: Game Already Exists
 *       401:
 *         description: User not logged in.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorMessage:
 *                   type: string
 *                   example: PLEASE DO LOGIN!!!
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Internal Server Error
 */
router.post("/sellgame", sellGame);


/**
 * @swagger
 * /seller/mygames:
 *   get:
 *     summary: Get seller's games
 *     description: Fetches all games added by the logged-in seller. The seller is identified by their username stored in cookies.
 *     tags: 
 *       - Seller
 *     responses:
 *       200:
 *         description: Seller's games fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 myGames:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: ID of the game.
 *                         example: "645a1b2c3d4e5f6789012345"
 *                       game_name:
 *                         type: string
 *                         description: Name of the game.
 *                         example: "Adventure Quest"
 *                       price:
 *                         type: number
 *                         description: Price of the game.
 *                         example: 19.99
 *                       category:
 *                         type: string
 *                         description: Category of the game.
 *                         example: "Action"
 *       404:
 *         description: Seller not logged in or no games found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorMessage:
 *                   type: string
 *                   example: PLEASE DO LOGIN!!!
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Internal Sever Error
 */
router.get("/seller/mygames", getsellerMyGames);


/**
 * @swagger
 * /seller/transactions:
 *   get:
 *     summary: Get seller's transactions
 *     description: Fetches all transactions associated with the logged-in seller. The seller is identified by their username stored in cookies.
 *     tags: 
 *       - Seller
 *     responses:
 *       200:
 *         description: Seller's transactions fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID of the transaction.
 *                     example: "645a1b2c3d4e5f6789012345"
 *                   game_name:
 *                     type: string
 *                     description: Name of the game sold.
 *                     example: "Adventure Quest"
 *                   buyer:
 *                     type: string
 *                     description: Username of the buyer.
 *                     example: "john_doe"
 *                   price:
 *                     type: number
 *                     description: Price of the game.
 *                     example: 19.99
 *                   date:
 *                     type: string
 *                     format: date-time
 *                     description: Date and time of the transaction.
 *                     example: "2025-05-01T10:30:00Z"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server error !
 */
router.get("/seller/transactions", getsellerTransactions);
//end of seller routes

/**
 * @swagger
 * /user/transactions:
 *   get:
 *     summary: Get user's transactions
 *     description: Fetches all transactions associated with the logged-in user. The user is identified by their username stored in cookies.
 *     tags: 
 *       - User
 *     responses:
 *       200:
 *         description: User's transactions fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID of the transaction.
 *                     example: "645a1b2c3d4e5f6789012345"
 *                   game_name:
 *                     type: string
 *                     description: Name of the game purchased.
 *                     example: "Adventure Quest"
 *                   seller:
 *                     type: string
 *                     description: Username of the seller.
 *                     example: "john_doe"
 *                   price:
 *                     type: number
 *                     description: Price of the game.
 *                     example: 19.99
 *                   date:
 *                     type: string
 *                     format: date-time
 *                     description: Date and time of the transaction.
 *                     example: "2025-05-01T10:30:00Z"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server error !
 */
router.get("/user/transactions", getuserTransactions);

/**
 * @swagger
 * /user/mygames:
 *   get:
 *     summary: Get user's purchased games
 *     description: Fetches all games purchased by the logged-in user. The user is identified by their username stored in cookies.
 *     tags: 
 *       - User
 *     responses:
 *       200:
 *         description: User's purchased games fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 myGames:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: ID of the game.
 *                         example: "645a1b2c3d4e5f6789012345"
 *                       game_name:
 *                         type: string
 *                         description: Name of the game.
 *                         example: "Adventure Quest"
 *                       price:
 *                         type: number
 *                         description: Price of the game.
 *                         example: 19.99
 *                       category:
 *                         type: string
 *                         description: Category of the game.
 *                         example: "Action"
 *       404:
 *         description: User not logged in or no games found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorMessage:
 *                   type: string
 *                   example: "PLEASE DO LOGIN!!! or No games found for this user."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Internal Sever Error
 */
router.get("/user/mygames", getuserMyGames);

/**
 * @swagger
 * /admin/transactions:
 *   get:
 *     summary: Get all transactions
 *     description: Fetches all transactions from the database. Accessible only to admins.
 *     tags: 
 *       - Admin
 *     responses:
 *       200:
 *         description: Transactions fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID of the transaction.
 *                     example: "645a1b2c3d4e5f6789012345"
 *                   game_name:
 *                     type: string
 *                     description: Name of the game involved in the transaction.
 *                     example: "Adventure Quest"
 *                   buyer:
 *                     type: string
 *                     description: Username of the buyer.
 *                     example: "john_doe"
 *                   seller:
 *                     type: string
 *                     description: Username of the seller.
 *                     example: "jane_doe"
 *                   price:
 *                     type: number
 *                     description: Price of the game.
 *                     example: 19.99
 *                   date:
 *                     type: string
 *                     format: date-time
 *                     description: Date and time of the transaction.
 *                     example: "2025-05-01T10:30:00Z"
 *       404:
 *         description: User not logged in or not authorized.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorMessage:
 *                   type: string
 *                   example: Login to see Transactions
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorMessage:
 *                   type: string
 *                   example: Internal server error
 */
router.get("/admin/transactions",adminRoute, getaTransactions);




//route to get userdata of anyone at any instance of time if cookies fail or smth like that


/**
 * @swagger
 * /userdata:
 *   get:
 *     summary: Get user data
 *     description: Fetches the details of the logged-in user based on the username stored in cookies.
 *     tags: 
 *       - User
 *     responses:
 *       200:
 *         description: User data fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: ID of the user.
 *                   example: "645a1b2c3d4e5f6789012345"
 *                 username:
 *                   type: string
 *                   description: The username of the user.
 *                   example: "john_doe"
 *                 email:
 *                   type: string
 *                   description: The email address of the user.
 *                   example: "john.doe@example.com"
 *                 role:
 *                   type: string
 *                   description: The role of the user (e.g., user, admin, seller).
 *                   example: "user"
 *       401:
 *         description: Internal server error or unauthorized access.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorMessage:
 *                   type: string
 *                   example: Internal server error
 */
router.get("/userdata", getuserdata);





//to get the home games

/**
 * @swagger
 * /api/games:
 *   get:
 *     summary: Get home games data
 *     description: Fetches categorized games data for the home page, including new games, highlighted games, featured games, discounted games, and popular games. Data is cached using Redis for faster access.
 *     tags: 
 *       - Games
 *     responses:
 *       200:
 *         description: Home games data fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 new_games:
 *                   type: array
 *                   description: List of newly added games.
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: ID of the game.
 *                         example: "645a1b2c3d4e5f6789012345"
 *                       game_name:
 *                         type: string
 *                         description: Name of the game.
 *                         example: "Adventure Quest"
 *                       price:
 *                         type: number
 *                         description: Price of the game.
 *                         example: 19.99
 *                 highlight_games:
 *                   type: array
 *                   description: List of highlighted games.
 *                   items:
 *                     type: object
 *                 featured_games:
 *                   type: array
 *                   description: List of featured games.
 *                   items:
 *                     type: object
 *                 discounts_games:
 *                   type: array
 *                   description: List of discounted games.
 *                   items:
 *                     type: object
 *                 popular_games:
 *                   type: array
 *                   description: List of popular games.
 *                   items:
 *                     type: object
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */
router.get("/api/games", homeGames);

//To visit to The game(or) product page when on clicked and also get comparisons for the game in the game page


/**
 * @swagger
 * /clickgame/{gamename}:
 *   get:
 *     summary: Get details of a specific game
 *     description: Fetches the details of a specific game based on the game name provided in the URL parameter.
 *     tags: 
 *       - Games
 *     parameters:
 *       - in: path
 *         name: gamename
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the game to fetch details for.
 *         example: "Adventure Quest"
 *     responses:
 *       200:
 *         description: Game details fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: ID of the game.
 *                   example: "645a1b2c3d4e5f6789012345"
 *                 game_name:
 *                   type: string
 *                   description: Name of the game.
 *                   example: "Adventure Quest"
 *                 description:
 *                   type: string
 *                   description: Description of the game.
 *                   example: "An exciting adventure game."
 *                 price:
 *                   type: number
 *                   description: Price of the game.
 *                   example: 19.99
 *                 category:
 *                   type: string
 *                   description: Category of the game.
 *                   example: "Action"
 *                 rating:
 *                   type: number
 *                   description: Average rating of the game.
 *                   example: 4.5
 *       404:
 *         description: Game not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorMessage:
 *                   type: string
 *                   example: Product not found
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorMessage:
 *                   type: string
 *                   example: Internal server error
 */
router.get("/clickgame/:gamename", getclickgame);


/**
 * @swagger
 * /comparisons/{gamename}:
 *   get:
 *     summary: Get game comparisons
 *     description: Fetches a list of games for comparison based on the price range and category of the specified game.
 *     tags: 
 *       - Games
 *     parameters:
 *       - in: path
 *         name: gamename
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the game to fetch comparisons for.
 *         example: "Adventure Quest"
 *     responses:
 *       200:
 *         description: Comparison games fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID of the game.
 *                     example: "645a1b2c3d4e5f6789012345"
 *                   game_name:
 *                     type: string
 *                     description: Name of the game.
 *                     example: "Adventure Quest"
 *                   price:
 *                     type: number
 *                     description: Price of the game.
 *                     example: 19.99
 *                   category:
 *                     type: string
 *                     description: Category of the game.
 *                     example: "Action"
 *       404:
 *         description: Game not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorMessage:
 *                   type: string
 *                   example: Product not found
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorMessage:
 *                   type: string
 *                   example: Internal Server Error
 */
router.get("/comparisons/:gamename", getComparisons);


//To Filter out the games for search and categories

/**
 * @swagger
 * /searchgames:
 *   get:
 *     summary: Search for games
 *     description: Searches for games based on the provided search term. The search is performed on game names and categories.
 *     tags: 
 *       - Games
 *     parameters:
 *       - in: query
 *         name: term
 *         required: true
 *         schema:
 *           type: string
 *         description: The search term to filter games by name or category.
 *         example: "Adventure"
 *     responses:
 *       200:
 *         description: Games matching the search term fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID of the game.
 *                     example: "645a1b2c3d4e5f6789012345"
 *                   game_name:
 *                     type: string
 *                     description: Name of the game.
 *                     example: "Adventure Quest"
 *                   category:
 *                     type: string
 *                     description: Category of the game.
 *                     example: "Action"
 *                   price:
 *                     type: number
 *                     description: Price of the game.
 *                     example: 19.99
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */
router.get("/searchgames", searchgames);


/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Search for game categories
 *     description: Searches for games based on the provided category search term.
 *     tags: 
 *       - Games
 *     parameters:
 *       - in: query
 *         name: search
 *         required: true
 *         schema:
 *           type: string
 *         description: The search term to filter games by category.
 *         example: "Action"
 *     responses:
 *       200:
 *         description: Games matching the category search term fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID of the game.
 *                     example: "645a1b2c3d4e5f6789012345"
 *                   game_name:
 *                     type: string
 *                     description: Name of the game.
 *                     example: "Adventure Quest"
 *                   category:
 *                     type: string
 *                     description: Category of the game.
 *                     example: "Action"
 *                   price:
 *                     type: number
 *                     description: Price of the game.
 *                     example: 19.99
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */
router.get("/categories", getcategories);



//buy game anywhere route

/**
 * @swagger
 * /paygame:
 *   post:
 *     summary: Purchase a game
 *     description: Allows a user to purchase a game. Updates the user's purchase history, increments the game's quantity sold, and creates a new transaction.
 *     tags: 
 *       - Payment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               game_name:
 *                 type: string
 *                 description: The name of the game to be purchased.
 *                 example: "Adventure Quest"
 *     responses:
 *       200:
 *         description: Game purchased successfully or already purchased.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Successfully purchased the game or User has already purchased the game"
 *       404:
 *         description: User not logged in.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorMessage:
 *                   type: string
 *                   example: "Please Login To Purchase"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorMessage:
 *                   type: string
 *                   example: "Internal server error"
 */
router.post("/paygame", paygame);
//buyt game only at cart
// router.post("/cartpaygame", cartpaygame);


/**
 * @swagger
 * /cartpaygame:
 *   get:
 *     summary: Purchase games from the cart
 *     description: Processes the purchase of all games in the user's cart. Updates the user's purchase history, increments the quantity sold for each game, and creates transactions for each purchase.
 *     tags: 
 *       - Payment
 *     responses:
 *       200:
 *         description: Games purchased successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Successfully purchased the game(s)"
 *       400:
 *         description: Cart is empty or contains invalid entries.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorMessage:
 *                   type: string
 *                   example: "Cart is empty or Invalid game entry in cart"
 *       404:
 *         description: User not logged in, user not found, or game not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorMessage:
 *                   type: string
 *                   example: "Please Login To Purchase or User not found or Game {game_name} not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorMessage:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get("/cartpaygame", cartpaygame);


router.get("/check/:username",checkUser);


//post for an review of the game page usually we do it using params
// router level middleware added for posting a review


/**
 * @swagger
 * /postreview/{gamename}:
 *   post:
 *     summary: Post a review for a game
 *     description: Allows a logged-in user to post a review and rating for a specific game. Updates the game's overall rating and adds the review to the game's review list.
 *     tags: 
 *       - Reviews
 *     parameters:
 *       - in: path
 *         name: gamename
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the game to post a review for.
 *         example: "Adventure Quest"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postreview:
 *                 type: string
 *                 description: The review text.
 *                 example: "This game is amazing!"
 *               reviewrating:
 *                 type: integer
 *                 description: The rating for the game (1-5).
 *                 example: 5
 *     responses:
 *       200:
 *         description: Review posted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 updatedGameData:
 *                   type: object
 *                   description: The updated game data with the new review and rating.
 *       401:
 *         description: User not logged in or already reviewed the game.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Please login to post a review! or You have already reviewed and rated the game!"
 *       404:
 *         description: Game not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Game not found!"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.post("/postreview/:gamename", authRoute, postreview);


//cart routes 
// add router level middleware for adding removing items from the cart



/**
 * @swagger
 * /addtocart:
 *   post:
 *     summary: Add a game to the cart
 *     description: Allows a logged-in user to add a game to their cart.
 *     tags: 
 *       - Cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cart_games:
 *                 type: object
 *                 properties:
 *                   game_name:
 *                     type: string
 *                     description: The name of the game to add to the cart.
 *                     example: "Adventure Quest"
 *     responses:
 *       201:
 *         description: Game successfully added to the cart.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 successMsg:
 *                   type: string
 *                   example: "Successfully Added To Cart. Visit Cart To BUY"
 *       400:
 *         description: Invalid game name format.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorMessage:
 *                   type: string
 *                   example: "Invalid game name format"
 *       404:
 *         description: User not logged in.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorMessage:
 *                   type: string
 *                   example: "Login to get access to the cart"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorMessage:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.post("/addtocart",authRoute, addtocart);


/**
 * @swagger
 * /getcartgames:
 *   get:
 *     summary: Get games in the cart
 *     description: Fetches all games currently in the logged-in user's cart.
 *     tags: 
 *       - Cart
 *     responses:
 *       200:
 *         description: Games in the cart fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID of the game.
 *                     example: "645a1b2c3d4e5f6789012345"
 *                   game_name:
 *                     type: string
 *                     description: Name of the game.
 *                     example: "Adventure Quest"
 *                   price:
 *                     type: number
 *                     description: Price of the game.
 *                     example: 19.99
 *                   category:
 *                     type: string
 *                     description: Category of the game.
 *                     example: "Action"
 *       401:
 *         description: User not logged in.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorMessage:
 *                   type: string
 *                   example: "Login First To get Acess of the cart"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorMessage:
 *                   type: string
 *                   example: "Error processing data"
 */
router.get("/getcartgames",authRoute, getcartgames);


/**
 * @swagger
 * /removetocart:
 *   delete:
 *     summary: Remove a game from the cart
 *     description: Allows a logged-in user to remove a game from their cart.
 *     tags: 
 *       - Cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cart_games:
 *                 type: string
 *                 description: The name of the game to remove from the cart.
 *                 example: "Adventure Quest"
 *     responses:
 *       201:
 *         description: Game successfully removed from the cart.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 successMsg:
 *                   type: string
 *                   example: "Removed From Cart"
 *       401:
 *         description: User not logged in or game not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorMessage:
 *                   type: string
 *                   example: "Login First To get Acess of the cart or Game Not Found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorMessage:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.delete("/removetocart",authRoute, removetocart);
//end of cart routes


//seller update and delete game routes


/**
 * @swagger
 * /seller/delete_game/{gameId}:
 *   delete:
 *     summary: Delete a game
 *     description: Allows a seller to delete a specific game they own.
 *     tags: 
 *       - Seller
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the game to delete.
 *         example: "645a1b2c3d4e5f6789012345"
 *     responses:
 *       200:
 *         description: Game deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 successMessage:
 *                   type: string
 *                   example: "Game deleted successfully"
 *       404:
 *         description: Game not found or user not authorized to delete the game.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorMessage:
 *                   type: string
 *                   example: "Game not found!"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Internal Server Error"
 */
router.delete("/seller/delete_game/:gameId", sellerdeleteGame);


/**
 * @swagger
 * /seller/update_game/{gameId}:
 *   put:
 *     summary: Update game details
 *     description: Allows a seller to update the details of a specific game they own.
 *     tags: 
 *       - Seller
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the game to update.
 *         example: "645a1b2c3d4e5f6789012345"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               game_name:
 *                 type: string
 *                 description: The updated name of the game.
 *                 example: "Adventure Quest Updated"
 *               price:
 *                 type: number
 *                 description: The updated price of the game.
 *                 example: 29.99
 *               category:
 *                 type: string
 *                 description: The updated category of the game.
 *                 example: "Adventure"
 *     responses:
 *       200:
 *         description: Game updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 successMessage:
 *                   type: string
 *                   example: "Game updated successfully"
 *                 updatedGame:
 *                   type: object
 *                   description: The updated game details.
 *       404:
 *         description: Game not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorMessage:
 *                   type: string
 *                   example: "Game not found!"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Internal Server Error"
 */
router.put("/seller/update_game/:gameId", updateGame);

module.exports = router;

// router.get("/user_chat",getuserchatpage);
// router.get("/chat",getchat);
// router.post("/send",postsend);
// router.get("/messages/:recipientId",getmessages);
// router.post("/msg",postmessage);
// router.get("/userChat",getuserchat);
