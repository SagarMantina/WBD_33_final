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

const { deleteGame, updateGame } = require("../controllers/sellerController");
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

const {deletegame} = require("../controllers/dashboardController"); 
const {authRoute} = require("../middleware/authRoute");
const {admin_update_user, admin_create_user, admin_delete_user,admin_delete_community_message,admin_delete_community} = require("../controllers/adminController");
const  {getRole} = require("../controllers/userController");


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




// router.post("/deletegame", deletegame);


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



router.get("/api/top-selling",getTopSellingGames );
router.get("/api/top-revenue",getTopRevenueGames)

//admin, seller and user routes
router.post("/login", postlogin);
router.post("/register", postregister);
router.post("/register2", postregister2);
router.get("/signout",authRoute, signout);
// end of user routes

router.get("/user/communities", getUserCommunities);
router.post("/createcommunity", createCommunity);
router.post("/joincommunity", joinCommunity);
router.get("/community", getCommunity);

router.get("/community/:community", getcommunityChat);
router.post("/community/:community", sendMessage);










//get all the users and all the games data
router.get("/allusers", adminRoute, getallUsers);
router.get("/allgames", getGames);


//seller routes
router.get("/sellerdata", getSellerdata);
router.post("/sellgame", sellGame);
router.get("/seller/mygames", getsellerMyGames);
router.get("/seller/transactions", getsellerTransactions);
//end of seller routes


router.get("/user/transactions", getuserTransactions);
router.get("/user/mygames", getuserMyGames);

router.get("/admin/transactions",adminRoute, getaTransactions);




//route to get userdata of anyone at any instance of time if cookies fail or smth like that
router.get("/userdata", getuserdata);





//to get the home games
router.get("/api/games", homeGames);

//To visit to The game(or) product page when on clicked and also get comparisons for the game in the game page
router.get("/clickgame/:gamename", getclickgame);
router.get("/comparisons/:gamename", getComparisons);


//To Filter out the games for search and categories
router.get("/searchgames", searchgames);
router.get("/categories", getcategories);



//buy game anywhere route
router.post("/paygame", paygame);
//buyt game only at cart
// router.post("/cartpaygame", cartpaygame);


router.get("/cartpaygame", cartpaygame);


router.get("/check/:username",checkUser);


//post for an review of the game page usually we do it using params
// router level middleware added for posting a review
router.post("/postreview/:gamename", authRoute, postreview);


//cart routes 
// add router level middleware for adding removing items from the cart
router.post("/addtocart",authRoute, addtocart);
router.get("/getcartgames",authRoute, getcartgames);
router.delete("/removetocart",authRoute, removetocart);
//end of cart routes


//seller update and delete game routes
router.delete("seller/delete_game/:gameId", deleteGame);
router.put("/seller/update_game/:gameId", updateGame);

module.exports = router;

// router.get("/user_chat",getuserchatpage);
// router.get("/chat",getchat);
// router.post("/send",postsend);
// router.get("/messages/:recipientId",getmessages);
// router.post("/msg",postmessage);
// router.get("/userChat",getuserchat);
