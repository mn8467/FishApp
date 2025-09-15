const { Pool } = require('pg');
require('dotenv').config({ path: '../.env' });

console.log('DB_HOST:', process.env.DB_HOST); // 환경 변수 출력 확인

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// 연결 테스트용 함수
(async () => {
  try {
    const result = await pool.query('SELECT* from tests');
    console.log('DB 연결 성공:', result.rows[0]);
  } catch (err) {
    console.error('DB 연결 실패:', err);
  } finally {
    await pool.end();
  }
})();


module.exports = pool;