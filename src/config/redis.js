import { createClient } from "redis";

const redis = createClient({
  url: "redis://default:OaOAXXRhO4DupqpaQ45Ue96j8zVu8Jfa@redis-17348.c9.us-east-1-4.ec2.cloud.redislabs.com:17348",
});

redis.on("error", (err) => {
  console.log("Redis Client Error", err);
});

await redis.connect();
console.log("Connected to Redis successfully!");

export default redis;
