import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

// 환경변수 타입 정의 (선택적으로 작성하면 안전함)
interface DBEnv {
  DB_HOST: string;
  DB_USER: string;
  DB_NAME: string;
  DB_PASSWORD: string;
  DB_PORT: string;
}

// 환경변수 로딩
const {
  DB_HOST,
  DB_USER,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT
} = process.env as unknown as DBEnv;

console.log("DB_HOST:", DB_HOST); // 환경 변수 출력 확인

// 풀 생성
const pool = new Pool({
  host: DB_HOST,
  user: DB_USER,
  database: DB_NAME,
  password: DB_PASSWORD,
  port: parseInt(DB_PORT, 10), // string → number 변환
});

// // 연결 테스트용 함수
// (async () => {
//   try {
//     const result = await pool.query("SELECT * FROM tests");
//     console.log("DB 연결 성공:", result.rows[0]);
//   } catch (err) {
//     console.error("DB 연결 실패:", err);
//   } finally {
//     await pool.end();
//   }
// })();

export default pool;