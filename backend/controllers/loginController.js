const express = require('express')
const path = require('path');
const bcrypt = require("bcryptjs");
const cookie_parser = require("cookie-parser");
const user = require('../models/accountschema');
var arr=[];


async function postlogin(req, res) {
  const { username, password } = req.body;

  console.log( "Username:", username);
  try {
    const exists = await user.findOne({ username });
   
    if (!exists) {
      // console.log("User not found for username:-", username);
      return res.status(401).json({ errorMessage: "Username not found" });
    }

    const isPass = await bcrypt.compare(password, exists.password);

    if (isPass) {
   const options = {
httpOnly: true ,
secure: true,
sameSite: 'none',
domain: 'p2p-digital-games-marketplace.onrender.com',
}

  
     
      return res.json({ userrole: exists.role });
    } else {
      // console.log("Incorrect password for username:-", username);
      return res.status(401).json({ errorMessage: "Incorrect password" });
    }
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ errorMessage: "Error processing data" });
  }
}

module.exports = { postlogin};
