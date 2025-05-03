const mongoose = require("mongoose");
const user = require("../models/accountschema");
const game_details = require("../models/gameschema");
const express = require("express");
const path = require("path");
const bcrypt = require("bcryptjs");
const community = require("../models/commmunitySchema");
const home = require("./dashboardController");
const app = express();
const transaction = require("../models/transactionSchema");

async function getadmindata(req, res) {


  try {
  let total_games = await game_details.countDocuments();
  let total_users = await user.countDocuments();

  // total purhcases:-
  let total_purchases = await transaction.countDocuments();

  const now = new Date();

  // Get current time for today
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const currentMoment = new Date(now);

  // Get the equivalent time range for yesterday
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(todayStart.getDate() - 1);
  const yesterdayEnd = new Date(currentMoment);
  yesterdayEnd.setDate(currentMoment.getDate() - 1);

  // Count today's sales
  const today_sales = await transaction.countDocuments({
    date: { $gte: todayStart, $lt: currentMoment },
  });

  // Count yesterday's sales
  const yesterday_sales = await transaction.countDocuments({
    date: { $gte: yesterdayStart, $lt: yesterdayEnd },
  });

  // Calculate sales increase
  const sales_increase = today_sales - yesterday_sales;

  let data = {
    total_games: total_games,
    total_users: total_users,
    total_purchases: total_purchases,
    today_sales: today_sales,
    sales_increase: sales_increase,
  };
  // console.log(data);
  res.status(200).json(data);
}
  catch (error) {
    console.error("Error fetching admin data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

//To Update Username

async function getTransactions(req, res) {
  try {
    const transactions = await transaction.find({});
    res.json(transactions);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server error !" });
  }
}

async function getGames(req, res) {
  try {
    const games = await game_details.find({});
    res.json(games);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server error !" });
  }
}

async function getallUsers(req, res) {
  try {
    // Get total users
    const total_users = await user.countDocuments();

    // Total visits
    const total_visits = total_users; // Assuming all users are visits

    // Get the count of users created in the last 7 days
    const weekly_visits = await Promise.all(
      Array.from({ length: 7 }).map(async (_, i) => {
        const startOfDay = new Date();
        startOfDay.setDate(startOfDay.getDate() - i);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(startOfDay);
        endOfDay.setHours(23, 59, 59, 999);

        const count = await user.countDocuments({
          createdAt: { $gte: startOfDay, $lt: endOfDay },
        });

        return count;
      })
    );

    // Prepare final data
    const final_data = {
      total_users,
      total_visits,
      weekly_visits,
    };

    // Send response
    res.json(final_data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error!" });
  }
}

async function admin_update_user(req, res) {
  try {
    // console.log("update user");
    const { username, newPassword } = req.body;
    const existing_user = await user.findOne({ username });
    if (!existing_user) {
      return res.status(404).send("User not found");
    }
    existing_user.password = newPassword;
    await existing_user.save();
    res.send("Password updated successfully");
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).send("Error updating password");
  }
}

async function admin_create_user(req, res) {
  try {
    const { username, email, password } = req.body;
    password = await bcrypt.hash(password, 10);
    const existing_user = await user.find({ username });
    if (existing_user.length) {
      return res.status(400).send("User already exists");
    }
    // Check if the email already exists
    const existingEmail = await user.find({ email });
    if (existingEmail.length) {
      return res.status(400).send("Email already exists");
    }
    const newUser = new user({ username, email, password, role: "user" });
    await newUser.save();
    res.status(201).send("User created successfully");
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("Error creating user");
  }
}

// new chages

async function admin_delete_user(req, res) {
  try {
    const { username } = req.body;

    const existing_user = await user.findOne({ username });
    if (!existing_user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.deleteOne({ username });
    console.log("User deleted successfully");
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send("Error deleting user");
  }
}

async function admin_delete_community(req, res) {
  try {
    const { community_name } = req.body;

    const existing_community = await community.findOne({
      name: community_name,
    });

    console.log(existing_community);
    if (!existing_community) {
      return res.status(404).json({ message: "Community not found " });
    }
    await community.deleteOne({ name: community_name });

    console.log("Community deleted successfully");
    res.status(200).json({ message: "Community deleted successfully" });
  } catch (error) {
    console.error("Error deleting community:", error);
    res.status(500).send("Error deleting community");
  }
}

async function admin_delete_community_message(req, res) {
  try {
    const { community_name } = req.body;
    console.log(community_name);
    const existing_community = await community.findOne({
      name: community_name,
    });
    if (!existing_community) {
      return res.status(404).json({ message: "Community not found" });
    }
    await community.updateOne(
      { name: community_name },
      { $set: { messages: [] } }
    );

    console.log("Message deleted successfully");
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).send("Error deleting message");
  }
}
module.exports = {
  getadmindata,
  getTransactions,
  getGames,
  getallUsers,
  admin_update_user,
  admin_create_user,
  admin_delete_user,
  admin_delete_community,
  admin_delete_community_message,
};
