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
     res.cookie("username", username, {
  httpOnly: true,    // Make it inaccessible to JavaScript on the client side (more secure)
  secure: process.env.NODE_ENV === "production",  // Set to true when using HTTPS in production
  sameSite: "None",  // Allows cookies to be sent cross-origin (important for login)
  domain: ".render.com", // Set the domain to allow cross-subdomain cookies (optional, depending on your setup)
});

  
     
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
