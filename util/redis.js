require("dotenv").config();
const redis = require("redis");

const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
  password: process.env.REDIS_PASSWORD,
});

const connect = async () => {
  await redisClient.connect();
};

redisClient.on("error", function (error) {
  console.error(error);
});

redisClient.on("connect", function () {
  console.log("Redis client connected");
});

const get = async (key) => {
  return await redisClient.get(key);
};

const set = async (key, value, ttl = -1) => {
  if (ttl > 0) {
    console.log(`[REDIS] SET ${key} ${value} ${ttl}`);
    return await redisClient.set(key, value, {
      EX: ttl,
    });
  } else {
    return await redisClient.set(key, value);
  }
};

const del = async (key) => {
  return await redisClient.del(key);
};

module.exports = {
  connect,
  get,
  set,
  del,
};
