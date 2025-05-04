const express=require('express')
const path=require('path')
const bcrypt = require("bcryptjs");
const user=require('../models/accountschema');
const transaction = require("../models/transactionSchema");
const game_details = require("../models/gameschema");

// const redis = require('../config/redis_client');


async function updateuserdetails(req, res) {
  const username = req.headers['x-username'];
  const { name, email, password } = req.body;
 
  // Check if user exists

  const existingUser = await user.findOne({ username : username }).explain("executionStats");
  
  //  console.log(name, email, password);
  if (!existingUser) {
    return res.status(401).json({ errorMessage: "User not found" });
  }
  const exist = await user.findOne({ username });
  try {
  

    let updated = false;

    // Update username if provided
    if (name) {

      exist.username = name;
      updated = true;

      // res.clearCookie('username');
      // res.cookie("username", name, {
      //   httpOnly: false,    // Allow access from the frontend
      //   secure: false,      // Set true in production when using HTTPS
      //   sameSite: "lax",    // Or "strict" based on your use case
      // });
    }

    // Update email if provided
    if (email) {
      exist.email = email;
      updated = true;
    }

    // Update password if provided
    if (password) {
      const isPass = await bcrypt.compare(password, exist.password);
      if (isPass) {
        return res.status(401).json({ errorMessage: "Please enter a different password" });
      } else {
        exist.password = await bcrypt.hash(password, 10); // Hash the new password
        updated = true;
      }
    }

    // If any field was updated, save the user
    if (updated) {
      await exist.save();
      res.status(200).json({ "username": exist.username, "email": exist.email });
    } else {
      res.status(400).json({ errorMessage: "No valid fields provided to update." });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal server issues ");
  }
}



const getuserTransactions = async (req, res) => {
  try {
    const username = req.headers['x-username'];
    const transactions = await transaction.find({buyer: username});
    res.json(transactions);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server error !" });
  }
}
const getuserMyGames = async (req, res) => {
  try {
    const username = req.headers['x-username'];
    const exists = await user.findOne({ username: username });
    
    if (!exists) {
     return res.status(404).json({ errorMessage: "PLEASE DO LOGIN!!!" });
    }
    const myGames = await game_details.find({ broughtBy: username });

    if (myGames.length === 0) {
      return res.status(404).json({ errorMessage: "No games found for this user." });
    }
    if (myGames) {
     return res.status(200).json({ myGames });
    } 
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Sever Error");
  }
};



const checkUser = async (req, res) => {
  try{
    const { username } = req.params;

    // console.log(username);
    const db_user = await user.findOne({ username });
    if(!db_user){
     return  res.status(404).json({ errorMessage: "User not found" });
    }
    return res.status(200).json({ message: "User found successfully." });
  }
  catch(error){
    console.error("Error:", error);
   return  res.status(500).send("Internal server issues ");

  }
}

// use redis to cache the role of the user
// const getRole = async (req, res) => {
//   try {
//     // Check if the username exists 
//     const username = req.headers['x-username'];
//     if (!username) {
//       return res.status(400).json({ errorMessage: "Username cookie is missing" });
//     }

//     // Check if the role is already cached in Redis
//     const cachedRole = await redis.get(username);
//     if (cachedRole) {
//       console.log("Role fetched from Redis cache:");
//       return res.status(200).json({ role: cachedRole });
//     }

//     // If not cached, fetch the role from MongoDB
//     const userData = await user.findOne({ username });
//     if (!userData) {
//       return res.status(404).json({ errorMessage: "User not found" });
//     }

//     const role = userData.role; // Assuming the role is stored in the user document

//     // Cache the role in Redis for future requests
//     await redis.set(username, role, 'EX', 3600); // Cache for 1 hour
//     console.log("Role fetched from MongoDB and cached in Redis:", role);

//     return res.status(200).json({ role });

//   } catch (error) {
//     console.error("Error:", error);
//     return res.status(500).json({ errorMessage: "Internal server error" });
//   }
// }

module.exports={updateuserdetails,getuserTransactions,getuserMyGames,checkUser};