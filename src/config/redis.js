import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

async function checkRedisConnection() {
  try {
    const result = await redis.ping();

    if (result === "PONG") {
      console.log("✅ Redis/Upstash connected");
      return true;
    }

    console.log("⚠️ Redis responded unexpectedly:", result);
    return false;
  } catch (error) {
    console.error("❌ Redis/Upstash connection failed:", error.message);
    return false;
  }
}

checkRedisConnection();

export default redis;
