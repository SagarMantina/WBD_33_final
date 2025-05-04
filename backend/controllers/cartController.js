const express = require('express')
const user = require('../models/accountschema');
const path = require('path')
const game_details = require("../models/gameschema");

// async function addtocart(req, res) {
//   try {
//       const username = req.headers['x-username'];
//       if (req.cookies.username) {
//           const curr_user = req.cookies.username;
//           const cart_games = req.body.cart_games;
        
  
//           const exists_user = await user.findOne({ username: curr_user });

      
//           if (typeof cart_games.game_name === 'string') {
//               exists_user.cart.push(cart_games.game_name);
//           } else {
            
//               return res.status(400).json({ errorMessage: "Invalid game name format" });
//           }
          
//           await exists_user.save();
//           res.status(201).json({ successMsg: "Successfully Added To Cart. Visit Cart To BUY" });
//       } else {
//           res.status(404).json({ errorMessage: "Login to get access to the cart" });
//       }
//   } catch (error) {
//       console.log("Internal Server Error", error);
//       res.status(500).json({ errorMessage: "Internal Server Error" });
//   }
// }



// async function getcartgames(req,res){
//     try {
//       const username = req.headers['x-username'];
//         if (username) {
//           const curr_user = username;
//           const user_data = await user.findOne({ username: curr_user });
    
//           const cart_game = [];
    
//           for (const ip of user_data.cart) {
//             const game = await game_details.findOne({ game_name: ip });
    
//             if (game) {
//               cart_game.push(game);
//             }
//           }

//           res.json(cart_game);
//         }

//         else{
//             res.status(401).json({
//                 errorMessage: "Login First To get Acess of the cart ",
//               });
//         }
//       } catch (error) {
//         console.error("Error:", error);
//         res.status(500).json({ errorMessage: "Error processing data" });
//       }
// }

// async function removetocart(req,res)
// {
//     try {
//        const username = req.headers['x-username'];
//         if (username) {
//           const curr_user = username;
//           const cart_games = req.body.cart_games;
           
          
//           const game= await game_details.findOne({ game_name: cart_games });
//           if(!game){
//             return res.status(401).json({ errorMessage: "Game Not Found" });
//           }
//           const exists_user = await user.findOneAndUpdate(
//             { username: curr_user },
//             { $pull: { cart: cart_games } }
//           );
    
//           res.status(201).json({ successMsg: "Removed From Cart" });
//         } else {
//           console.log("Login First To get Acess of the cart ");
//           res.status(401).json({
//             errorMessage: "Login First To get Acess of the cart ",
//           });
//         }
//       } catch (error) {
//         console.error("Internal Server Error" + error);
//         res.status(500).json({ errorMessage: "Internal Server Error" });
//       }
// }

async function addtocart(req, res) {
  try {
      const username = req.headers['x-username']; // sent from frontend header
      const cart_games = req.body.cart_games;

      if (!username) {
          return res.status(401).json({ errorMessage: "Login to get access to the cart" });
      }

      const exists_user = await user.findOne({ username });

      if (!exists_user) {
          return res.status(404).json({ errorMessage: "User Not Found" });
      }

      if (typeof cart_games.game_name === 'string') {
          exists_user.cart.push(cart_games.game_name);
      } else {
          return res.status(400).json({ errorMessage: "Invalid game name format" });
      }

      await exists_user.save();
      res.status(201).json({ successMsg: "Successfully Added To Cart. Visit Cart To BUY" });
  } catch (error) {
      console.log("Internal Server Error", error);
      res.status(500).json({ errorMessage: "Internal Server Error" });
  }
}

async function getcartgames(req, res) {
  try {
    const username = req.headers['x-username'];

    if (!username) {
      return res.status(401).json({
        errorMessage: "Login First To Get Access To The Cart",
      });
    }

    const user_data = await user.findOne({ username });

    if (!user_data) {
      return res.status(404).json({ errorMessage: "User Not Found" });
    }

    const cart_game = [];

    for (const ip of user_data.cart) {
      const game = await game_details.findOne({ game_name: ip });
      if (game) cart_game.push(game);
    }

    res.json(cart_game);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ errorMessage: "Error processing data" });
  }
}

async function removetocart(req, res) {
  try {
    const username = req.headers['x-username'];

    if (!username) {
      return res.status(401).json({
        errorMessage: "Login First To Get Access To The Cart",
      });
    }

    const cart_game_name = req.body.cart_games;

    const game = await game_details.findOne({ game_name: cart_game_name });

    if (!game) {
      return res.status(404).json({ errorMessage: "Game Not Found" });
    }

    const updateResult = await user.findOneAndUpdate(
      { username },
      { $pull: { cart: cart_game_name } }
    );

    if (!updateResult) {
      return res.status(404).json({ errorMessage: "User Not Found" });
    }

    res.status(200).json({ successMsg: "Removed From Cart" });

  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).json({ errorMessage: "Internal Server Error" });
  }
}


// async function clearcart(req,res){ 

//   try {
//     if (req.cookies.username) {
//       const curr_user = req.cookies.username;
//       const cart_games = req.body.cart_games;
//       const exists_user = await user.findOneAndUpdate(
//         { username: curr_user },
//         { $set: { cart: [] } }
//       );
//       res.status(201).json({ successMsg: "Cleared Cart" });
//     } else {
//       console.log("Login First To get Acess of the cart ");
//       res.status(401).json({
//         errorMessage: "Login First To get Acess of the cart ",
//       });
//     }
//   } catch (error) {
//     console.error("Internal Server Error" + error);
//     res.status(500).json({ errorMessage: "Internal Server Error" });
//   }
  
// }

module.exports={addtocart,getcartgames,removetocart};