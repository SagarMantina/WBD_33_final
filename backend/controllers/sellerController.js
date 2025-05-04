const mongoose = require("mongoose");
const user = require("../models/accountschema");
const game_details = require("../models/gameschema");
const express = require("express");

const transaction = require("../models/transactionSchema");

const getSellerdata = async (req, res) =>{
  try {
    const username = await req.cookies.username;

    const seller = await user.findOne({ username: username });
    if (seller) {
      res.status(200).json({ seller });
    } else {
      res.status(404).json({ errorMessage: "PLEASE DO LOGIN!!!" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Sever Error");
  }
}

const sellGame = async (req, res) => {
  try {
    const username = req.cookies.username;
    const activeuser = await user.findOne({ username: username });

    if (activeuser) {
      const game_data = req.body;
      const gamename = game_data.gamename;

      const game_exists = await game_details.findOne({ game_name: gamename });
      if (game_exists) {
        return res.status(400).json({ errorMessage: "Game Already Exists" });
      }

      const game = new game_details({
        game_name: game_data.gamename,
        poster: game_data.poster,
        main_image: game_data.main_image,
        sub_images: game_data.sub_images,
        gifs: game_data.gifs,
        description: game_data.description,
        category: game_data.category,
        releaseDate: game_data.releaseDate,
        price: game_data.price,
        about: game_data.about,
      });

    
      await game.save();

      return res.status(200).json({ successMessage: "Game Added Successfully" });
    } else {
      return res.status(401).json({ errorMessage: "PLEASE DO LOGIN!!!" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("Internal Server Error");
  }
};


const getsellerTransactions = async (req, res) => {
  try {
    const transactions = await transaction.find({seller: req.cookies.username});
    res.json(transactions);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server error !" });
  }
}
const getsellerMyGames = async (req, res) => {
  try {
    const username = await req.cookies.username;
    const exists = await user.findOne({ username: username });
    
    if (!exists) {
      return res.status(404).json({ errorMessage: "PLEASE DO LOGIN!!!" });
    }


    const myGames = await game_details.find({ seller: username });
 
    if (myGames) {
     return res.status(200).json({ myGames });
    } 
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Sever Error");
  }
};

const updateGame = async (req, res) => {  
  try {
    const gameId = req.params.gameId;
    const updatedData = req.body;

   
    const updatedGame = await game_details.findByIdAndUpdate(
      gameId,
      {
        $set: {
          game_name: updatedData.game_name,
          price: updatedData.price,
          category: updatedData.category,
        }
      },
      { new: true } 
    );
  

    if (!updatedGame) {
      return res.status(404).json({ errorMessage: "Game not found!" });
    }

    return res.status(200).json({ successMessage: "Game updated successfully", updatedGame });
  }
  catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};


const sellerdeleteGame = async (req, res) => {
  try {


    const gameId = req.params.gameId;
    const username = req.cookies.username;

    const game = await game_details.findOne({ _id: gameId, seller: username });

    if (!game) {
      return res.status(404).json({ errorMessage: "Game not found!" });
    }

    await game_details.deleteOne({ _id: gameId });
    
    return res.status(200).json({ successMessage: "Game deleted successfully" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("Internal Server Error");
  }
};


module.exports = {
  getSellerdata,
  sellGame,
  getsellerMyGames,
  getsellerTransactions,
  sellerdeleteGame,
  updateGame,
};
