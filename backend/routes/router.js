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


router.delete("/admin/delete_user", adminRoute, admin_delete_user);
router.delete("/admin/delete_community", adminRoute, admin_delete_community);
router.delete("/admin/delete_community_message", adminRoute, admin_delete_community_message);

//to get all the users
router.get("/admin/all_users", adminRoute, geteveryUser);

//to use to update the details
router.post("/updateuser", updateuserdetails);
router.post("/deletegame", deletegame);

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


router.put("/admin/update_user", adminRoute, admin_update_user);
router.post("/admin/create_user", adminRoute, admin_create_user);



//handle the default route for all
// router.get("/", getdashboard);




//admin routes
//this route for getting admin all the game count, user count smth like that
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
