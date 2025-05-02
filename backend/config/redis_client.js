require('dotenv').config();
const { createClient } = require("redis");

const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: true,
    rejectUnauthorized: false
  }
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

redisClient.connect()
  .then(() => console.log("Connected to Redis"))
  .catch(console.error);

module.exports = redisClient;
