const redis = require('redis');
require("dotenv").config();
// connect to redis
const redis_client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);

redis_client.on('connect', function () {
    console.log('redis client connected');
});


(async () => {
    try {
        await redis_client.connect();
    } catch (err) {
        console.error('Error connecting to Redis:', err);
    }
})();

module.exports = redis_client;