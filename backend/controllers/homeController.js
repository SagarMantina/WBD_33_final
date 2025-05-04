// const user = require("../models/accountschema");
// const game_details= require("../models/gameschema");
// // const redis_client = require("../redis_client");

// const redis = require('../config/redis_client');


// // const SOLR_URL = "http://localhost:8983/solr/games_core/select";

// // using redis
// async function homeGames(req, res) {
//   try { 
//       console.log("Using Redis....");
      
//       var highlight_games = [];
//       var featured_games = [];
//       var discounts_games = [];
//       var popular_games = [];
//       var new_games = [];

   
//       const cachedNewGames = await redis.get("new_games");
//       const cachedHighlightGames = await redis.get("highlight_games");
//       const cachedFeaturedGames = await redis.get("featured_games");
//       const cachedDiscountsGames = await redis.get("discounts_games");
//       const cachedPopularGames = await redis.get("popular_games");

//       if (cachedNewGames && cachedHighlightGames && cachedFeaturedGames && cachedDiscountsGames && cachedPopularGames) {
         
//           new_games = JSON.parse(cachedNewGames);
//           highlight_games = JSON.parse(cachedHighlightGames);
//           featured_games = JSON.parse(cachedFeaturedGames);
//           discounts_games = JSON.parse(cachedDiscountsGames);
//           popular_games = JSON.parse(cachedPopularGames);
          
//           console.log("Cache Hit, Retrieved home games data from Redis Cache");
//       } else {
//           console.log("Cache miss for home games data, fetching from database");

//           new_games = await game_details.find().sort({ createdAt: -1 }).limit(8);
//           highlight_games = await game_details.find({ highlight: true });
//           featured_games = await game_details.find({ featured: true }).limit(8);
//           discounts_games = await game_details.find({ discounts: true }).limit(8);
//           popular_games = await game_details.find({ popular: true }).limit(8);

      
//           // Store the fetched data in Redis cache with an expiration time of 1 hour (3600 seconds)
//           await redis.set("new_games", JSON.stringify(new_games), { EX: 3600 });
//           await redis.set("discounts_games", JSON.stringify(discounts_games), { EX: 3600 });
//           await redis.set("highlight_games", JSON.stringify(highlight_games), { EX: 3600 });
//           await redis.set("featured_games", JSON.stringify(featured_games), { EX: 3600 });
//           await redis.set("popular_games", JSON.stringify(popular_games), { EX: 3600 });

       
          
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


// // without redis
// // async function  homeGames (req, res)  {
// //   try {   
// //     console.log("Using MongoDB....")
// //      var highlight_games = [];
// //      var featured_games = [];
// //      var discounts_games = [];
// //      var popular_games = [];
// //      var new_games = [];

 
// //      new_games = await game_details.find().sort({ createdAt: -1 }).limit(8);
// //      highlight_games = await game_details.find({ highlight: true });
// //      featured_games = await game_details.find({ featured: true }).limit(8);
// //      discounts_games = await game_details.find({ discounts: true }).limit(8);
// //      popular_games = await game_details.find({ popular: true }).limit(8);

    

      

// //      res.status(200).json({ "new_games" : new_games, "highlight_games" : highlight_games, "featured_games" : featured_games, "discounts_games" : discounts_games, "popular_games" : popular_games});

// //   }

// //   catch (error) {
// //     console.error("Error fetching home games:", error);
// //     res.status(500).json({ error: "Internal Server Error" });
// //   }
// // }



// async function getGame(req,res)
// {
//     const game_name = req.body.game_name;

//     try {
//       const gameName = new RegExp(game_name, "i");
//       const product = await game_details.findOne({ game_name: gameName });
  
//       if (product) {
//         res.json(product);
//       } else {
//         res.status(404).json({ errorMessage: "Product not found" });
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       res.status(500).json({ errorMessage: "Internal server error" });
//     }
// }


// async function getcategories(req,res)
// {
//     try {
//         var search_term = req.query.search.toUpperCase();
    
//         const searchTermRegex = new RegExp(search_term, "i");
//         const games_filtered = await game_details
//           .find({ category: { $regex: searchTermRegex } })
//           .limit(5);
//         res.json(games_filtered);
//       } catch (error) {
//         console.error("Error finding categories for games:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//       }
// }


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



// const axios = require('axios');

// const SOLR_URL = "https://solr-ii1s.onrender.com/solr/games_core/select";

// // Helper to poll Solr until data is ready
// async function waitForSolrReady(maxAttempts = 10, intervalMs = 2000) {
//   const healthCheckUrl = `${SOLR_URL}?q=*:*&rows=1&wt=json`;

//   for (let attempt = 1; attempt <= maxAttempts; attempt++) {
//     try {
//       const response = await axios.get(healthCheckUrl);
//       if (
//         response.data?.response?.docs &&
//         response.data.response.docs.length > 0
//       ) {
//         return true; // Solr is ready
//       }
//       console.log(`Waiting for Solr... Attempt ${attempt}/${maxAttempts}`);
//     } catch (error) {
//       console.log(`Solr check failed: ${error.message}`);
//     }

//     await new Promise((resolve) => setTimeout(resolve, intervalMs)); // Wait before retrying
//   }

//   return false; // Timeout
// }

// async function searchgames(req, res) {
//   try {
//     const searchTerm = (req.query.term || "").trim();
//     const solrQuery = `${SOLR_URL}?q=game_name:${searchTerm}* OR category:${searchTerm}*&wt=json`;

//     const isSolrReady = await waitForSolrReady();

//     let games = [];

//     if (isSolrReady) {
//       try {
//         const response = await axios.get(solrQuery);
//         games = response.data.response.docs;
//       } catch (solrError) {
//         console.log("Solr query failed, falling back to MongoDB:", solrError.message);
//       }
//     }

//     // Fallback to MongoDB if Solr fails or returns nothing
//     if (!isSolrReady || games.length === 0) {
//       console.log("Using MongoDB fallback for search");
//       const searchRegex = new RegExp("^" + searchTerm, "i");

//       games = await game_details.find({
//         $or: [
//           { game_name: searchRegex },
//           { category: searchRegex }
//         ]
//       }).limit(5);
//     }

//     res.json(games);
//   } catch (error) {
//     console.error("Search Error:", error.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// }

// module.exports  = { homeGames , getGame , getcategories , searchgames };
const user = require("../models/accountschema");
const game_details= require("../models/gameschema");
// const redis_client = require("../redis_client");

const redis = require('../config/redis_client');


// const SOLR_URL = "http://localhost:8983/solr/games_core/select";

// using redis
async function homeGames(req, res) {
  try { 
      console.log("Using Redis....");
      
      var highlight_games = [];
      var featured_games = [];
      var discounts_games = [];
      var popular_games = [];
      var new_games = [];

   
      const cachedNewGames = await redis.get("new_games");
      const cachedHighlightGames = await redis.get("highlight_games");
      const cachedFeaturedGames = await redis.get("featured_games");
      const cachedDiscountsGames = await redis.get("discounts_games");
      const cachedPopularGames = await redis.get("popular_games");

      if (cachedNewGames && cachedHighlightGames && cachedFeaturedGames && cachedDiscountsGames && cachedPopularGames) {
         
          new_games = JSON.parse(cachedNewGames);
          highlight_games = JSON.parse(cachedHighlightGames);
          featured_games = JSON.parse(cachedFeaturedGames);
          discounts_games = JSON.parse(cachedDiscountsGames);
          popular_games = JSON.parse(cachedPopularGames);
          
          console.log("Cache Hit, Retrieved home games data from Redis Cache");
      } else {
          console.log("Cache miss for home games data, fetching from database");

          new_games = await game_details.find().sort({ createdAt: -1 }).limit(8);
          highlight_games = await game_details.find({ highlight: true });
          featured_games = await game_details.find({ featured: true }).limit(8);
          discounts_games = await game_details.find({ discounts: true }).limit(8);
          popular_games = await game_details.find({ popular: true }).limit(8);

      
          // Store the fetched data in Redis cache with an expiration time of 1 hour (3600 seconds)
          await redis.set("new_games", JSON.stringify(new_games), { EX: 3600 });
          await redis.set("discounts_games", JSON.stringify(discounts_games), { EX: 3600 });
          await redis.set("highlight_games", JSON.stringify(highlight_games), { EX: 3600 });
          await redis.set("featured_games", JSON.stringify(featured_games), { EX: 3600 });
          await redis.set("popular_games", JSON.stringify(popular_games), { EX: 3600 });

       
          
          console.log("Stored home games data in cache");
      }

      res.status(200).json({ 
          "new_games": new_games, 
          "highlight_games": highlight_games, 
          "featured_games": featured_games, 
          "discounts_games": discounts_games, 
          "popular_games": popular_games
      });

  } catch (error) {
      console.error("Error fetching home games:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
}


// without redis
// async function  homeGames (req, res)  {
//   try {   
//     console.log("Using MongoDB....")
//      var highlight_games = [];
//      var featured_games = [];
//      var discounts_games = [];
//      var popular_games = [];
//      var new_games = [];

 
//      new_games = await game_details.find().sort({ createdAt: -1 }).limit(8);
//      highlight_games = await game_details.find({ highlight: true });
//      featured_games = await game_details.find({ featured: true }).limit(8);
//      discounts_games = await game_details.find({ discounts: true }).limit(8);
//      popular_games = await game_details.find({ popular: true }).limit(8);

    

      

//      res.status(200).json({ "new_games" : new_games, "highlight_games" : highlight_games, "featured_games" : featured_games, "discounts_games" : discounts_games, "popular_games" : popular_games});

//   }

//   catch (error) {
//     console.error("Error fetching home games:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// }



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
// async function waitForSolrReady(maxAttempts = 10, intervalMs = 2000) {
//   const healthCheckUrl = `${SOLR_URL}?q=*:*&rows=1&wt=json`;

//   for (let attempt = 1; attempt <= maxAttempts; attempt++) {
//     try {
//       const response = await axios.get(healthCheckUrl);
//       if (
//         response.data?.response?.docs &&
//         response.data.response.docs.length > 0
//       ) {
//         return true; // Solr is ready
//       }
//       console.log(`Waiting for Solr... Attempt ${attempt}/${maxAttempts}`);
//     } catch (error) {
//       console.log(`Solr check failed: ${error.message}`);
//     }

//     await new Promise((resolve) => setTimeout(resolve, intervalMs)); // Wait before retrying
//   }

//   return false; // Timeout
// }

// async function searchgames(req, res) {
//   try {
//     const searchTerm = (req.query.term || "").trim();
//     const solrQuery = `${SOLR_URL}?q=game_name:${searchTerm}* OR category:${searchTerm}*&wt=json`;

//     const isSolrReady = await waitForSolrReady();

//     let games = [];

//     if (isSolrReady) {
//       try {
//         const response = await axios.get(solrQuery);
//         games = response.data.response.docs;
//       } catch (solrError) {
//         console.log("Solr query failed, falling back to MongoDB:", solrError.message);
//       }
//     }

//     // Fallback to MongoDB if Solr fails or returns nothing
//     if (!isSolrReady || games.length === 0) {
//       console.log("Using MongoDB fallback for search");
//       const searchRegex = new RegExp("^" + searchTerm, "i");

//       games = await game_details.find({
//         $or: [
//           { game_name: searchRegex },
//           { category: searchRegex }
//         ]
//       }).limit(5);
//     }

//     res.json(games);
//   } catch (error) {
//     console.error("Search Error:", error.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// }


let solrDownUntil = 0;
const SOLR_COOLDOWN_MS = 5000;

async function isSolrAllowed() {
  return Date.now() >= solrDownUntil;
}

async function checkSolrReady() {
  const healthUrl = `${SOLR_URL}?q=*:*&rows=1&wt=json`;
  try {
    const response = await axios.get(healthUrl);
    if (response.data?.response?.docs?.length > 0) {
      return true;
    }
  } catch (err) {}
  return false;
}

async function searchgames(req, res) {
  try {
    const term = (req.query.term || "").trim();
    const solrQuery = `${SOLR_URL}?q=game_name:${term}* OR category:${term}*&wt=json`;
    let games = [];

    if (await isSolrAllowed()) {
      if (await checkSolrReady()) {
        try {
          console.log("using solr")
          const solrRes = await axios.get(solrQuery);
          games = solrRes.data.response.docs;
        } catch (solrQueryErr) {
          console.log("Solr query failed, fallback to Mongo:", solrQueryErr.message);
          solrDownUntil = Date.now() + SOLR_COOLDOWN_MS; // only on query fail
        }
      } else {
        solrDownUntil = Date.now() + SOLR_COOLDOWN_MS; // on health check fail
      }
    }

    if (games.length === 0) {
      
      console.log("Using MongoDB fallback for search");
      const regex = new RegExp("^" + term, "i");
      games = await game_details.find({
        $or: [
          { game_name: regex },
          { category: regex }
        ]
      }).limit(5);
    }

    res.json(games);
  } catch (err) {
    console.error("Search Error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports  = { homeGames , getGame , getcategories , searchgames };