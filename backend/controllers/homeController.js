const user = require("../models/accountschema");
const game_details= require("../models/gameschema");
// const redis_client = require("../redis_client");

// const SOLR_URL = "http://localhost:8983/solr/games_core/select";
// const SOLR_URL = "https://solr-ii1s.onrender.com/solr/#/games_core/select";

// using redis
// async function homeGames(req, res) {
//   try { 
//       console.log("Using Redis....");
      
//       var highlight_games = [];
//       var featured_games = [];
//       var discounts_games = [];
//       var popular_games = [];
//       var new_games = [];

   
//       const cachedNewGames = await redis_client.get("new_games");
//       const cachedHighlightGames = await redis_client.get("highlight_games");
//       const cachedFeaturedGames = await redis_client.get("featured_games");
//       const cachedDiscountsGames = await redis_client.get("discounts_games");
//       const cachedPopularGames = await redis_client.get("popular_games");

//       if (cachedNewGames && cachedHighlightGames && cachedFeaturedGames && cachedDiscountsGames && cachedPopularGames) {
         
//           new_games = JSON.parse(cachedNewGames);
//           highlight_games = JSON.parse(cachedHighlightGames);
//           featured_games = JSON.parse(cachedFeaturedGames);
//           discounts_games = JSON.parse(cachedDiscountsGames);
//           popular_games = JSON.parse(cachedPopularGames);
          
//           console.log("Retrieved home games data from cache");
//       } else {
//           console.log("Cache miss for home games data, fetching from database");

//           new_games = await game_details.find().sort({ createdAt: -1 }).limit(8);
//           highlight_games = await game_details.find({ highlight: true });
//           featured_games = await game_details.find({ featured: true }).limit(8);
//           discounts_games = await game_details.find({ discounts: true }).limit(8);
//           popular_games = await game_details.find({ popular: true }).limit(8);

      
//           await redis_client.setex("new_games", 3600, JSON.stringify(new_games));
//           await redis_client.setex("highlight_games", 3600, JSON.stringify(highlight_games));
//           await redis_client.setex("featured_games", 3600, JSON.stringify(featured_games));
//           await redis_client.setex("discounts_games", 3600, JSON.stringify(discounts_games));
//           await redis_client.setex("popular_games", 3600, JSON.stringify(popular_games));
          
//           console.log("Stored home games data in cache");
//       }

//       res.status(200).json({ 
//           "new_games": new_games, 
//           "highlight_games": highlight_games, 
//           "featured_games": featured_games, 
//           "discounts_games": discounts_games, 
//           "popular_games": popular_games
//       });

//   } catch (error) {
//       console.error("Error fetching home games:", error);
//       res.status(500).json({ error: "Internal Server Error" });
//   }
// }


// without redis
async function  homeGames (req, res)  {
  try {   
    console.log("Using MongoDB....")
     var highlight_games = [];
     var featured_games = [];
     var discounts_games = [];
     var popular_games = [];
     var new_games = [];

 
     new_games = await game_details.find().sort({ createdAt: -1 }).limit(8);
     highlight_games = await game_details.find({ highlight: true });
     featured_games = await game_details.find({ featured: true }).limit(8);
     discounts_games = await game_details.find({ discounts: true }).limit(8);
     popular_games = await game_details.find({ popular: true }).limit(8);

    

      

     res.status(200).json({ "new_games" : new_games, "highlight_games" : highlight_games, "featured_games" : featured_games, "discounts_games" : discounts_games, "popular_games" : popular_games});

  }

  catch (error) {
    console.error("Error fetching home games:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}



async function getGame(req,res)
{
    const game_name = req.body.game_name;

    try {
      const gameName = new RegExp(game_name, "i");
      const product = await game_details.findOne({ game_name: gameName });
  
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ errorMessage: "Product not found" });
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ errorMessage: "Internal server error" });
    }
}


async function getcategories(req,res)
{
    try {
        var search_term = req.query.search.toUpperCase();
    
        const searchTermRegex = new RegExp(search_term, "i");
        const games_filtered = await game_details
          .find({ category: { $regex: searchTermRegex } })
          .limit(5);
        res.json(games_filtered);
      } catch (error) {
        console.error("Error finding categories for games:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
}


// async function searchgames(req,res)
// {
//     try {
//         var search_term = req.query.term.toUpperCase();
//         // console.log(search_term);
       

//          const searchTermRegex = new RegExp('^' + search_term, "i"); 
//          const games_filtered = await game_details
//       .find({
//         $or: [{ game_name: searchTermRegex }, { category: searchTermRegex }],
//       })
//       .limit(5);
//         //  console.log(games_filtered);
//         res.json(games_filtered);
//       } catch (error) {
//         console.error("Error searching for games:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//       }
// }



const axios = require('axios');

const SOLR_URL = "https://solr-ii1s.onrender.com/solr/games_core/select";

// Helper to poll Solr until data is ready
async function waitForSolrReady(maxAttempts = 10, intervalMs = 2000) {
  const healthCheckUrl = `${SOLR_URL}?q=*:*&rows=1&wt=json`;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await axios.get(healthCheckUrl);
      if (
        response.data?.response?.docs &&
        response.data.response.docs.length > 0
      ) {
        return true; // Solr is ready
      }
      console.log(`Waiting for Solr... Attempt ${attempt}/${maxAttempts}`);
    } catch (error) {
      console.log(`Solr check failed: ${error.message}`);
    }

    await new Promise((resolve) => setTimeout(resolve, intervalMs)); // Wait before retrying
  }

  return false; // Timeout
}

async function searchgames(req, res) {
  try {
    const searchTerm = req.query.term || "*";

    const isSolrReady = await waitForSolrReady();
    if (!isSolrReady) {
      return res.status(503).json({
        error: "Solr is not ready. Please try again later.",
      });
    }

    const solrQuery = `${SOLR_URL}?q=game_name:${searchTerm}* OR category:${searchTerm}*&wt=json`;

    const response = await axios.get(solrQuery);
    const games = response.data.response.docs;

    games.forEach((game) => {
      console.log(game.game_name);
    });

    res.json(games);
  } catch (error) {
    console.error("Solr Search Error:", error.message);
    res.status(500).json({ error: "Error fetching games from Solr." });
  }
}

module.exports  = { homeGames , getGame , getcategories , searchgames };