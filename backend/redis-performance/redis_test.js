const axios = require("axios");
const fs = require("fs");

const TEST_URL = "http://localhost:3000/api/games"; 
const NUM_REQUESTS = 50;

async function testResponseTime() {
    let totalTime = 0;
    for (let i = 0; i < NUM_REQUESTS; i++) {
        const start = Date.now();
        await axios.get(TEST_URL);
        const duration = Date.now() - start;
        totalTime += duration;
    }
    return (totalTime / NUM_REQUESTS).toFixed(2);
}

async function generateReport(withRedis) {
    const responseTime = await testResponseTime();
    const report = `
    === Redis Performance Report ===
    Scenario: ${withRedis ? "With Redis" : "Without Redis"}
    -----------------------------------
    Avg Response Time: ${responseTime} ms
    -----------------------------------
    `;
    
    const filename = withRedis ? "performance_with_redis.txt" : "performance_with_redis.txt";
    fs.writeFileSync(filename, report);
    console.log(`Report saved: ${filename}`);
}

(async () => {
    console.log("Running performance test...");
    await generateReport(process.argv[2] === "withRedis");
    process.exit(0);
})();