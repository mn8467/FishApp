import { createClient, RedisClientType } from "redis";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, ".env") });

interface RedisEnv {
  REDIS_URL: string;
}

const { REDIS_URL } = process.env as unknown as RedisEnv;

console.log("REDIS_URL:", REDIS_URL); // 환경 변수 확인용

export const redisClient: RedisClientType = createClient({
  url: REDIS_URL,
});

redisClient.on("error", (err: Error) => {
  console.error("Redis Client Error", err);
});

(async () => {
  try {
    console.log("🚀 Connecting to Redis...");
    await redisClient.connect();
    console.log("✅ Redis Connected");
  } catch (err) {
    console.error("❌ Redis Connection Failed", err);
  }
})();

export default redisClient;