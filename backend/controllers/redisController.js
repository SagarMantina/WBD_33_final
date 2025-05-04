const express=require('express')
const path=require('path')
const bcrypt = require("bcryptjs");
const user=require('../models/accountschema');
const transaction = require("../models/transactionSchema");
const game_details = require("../models/gameschema");

const redis = require('../config/redis_client');




const getRole = async (req, res) => {
  try {
    // Check if the username exists 
    const username = req.headers['x-username'];
    if (!username) {
      return res.status(400).json({ errorMessage: "Username cookie is missing" });
    }

    // Check if the role is already cached in Redis
    const cachedRole = await redis.get(username);
    if (cachedRole) {
      console.log("Role fetched from Redis cache:");
      return res.status(200).json({ role: cachedRole });
    }

    // If not cached, fetch the role from MongoDB
    const userData = await user.findOne({ username });
    if (!userData) {
      return res.status(404).json({ errorMessage: "User not found" });
    }

    const role = userData.role; // Assuming the role is stored in the user document

    // Cache the role in Redis for future requests
    await redis.set(username, role, 'EX', 3600); // Cache for 1 hour
    console.log("Role fetched from MongoDB and cached in Redis:", role);

    return res.status(200).json({ role });

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ errorMessage: "Internal server error" });
  }
}


module.exports={getRole};