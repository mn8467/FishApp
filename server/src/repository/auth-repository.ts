import { AuthMapper } from "../mapper/auth-mapper";
import pool from "../db"


export async function findByUserName(user_name: string) {
  const sql = `
    SELECT user_id, user_name, nickname ,password, email, user_role, user_status, created_at, updated_at
    FROM users
    WHERE user_name = $1
    LIMIT 1
  `;
  const { rows } = await pool.query(sql, [user_name]);
  return rows[0] || null;
}


export async function findByUserId(user_id: number) {
  const sql = `
    SELECT user_id, user_name, nickname ,password, email, user_role, user_status, created_at, updated_at
    FROM users
    WHERE user_id = $1
    LIMIT 1
  `;
  console.log('테스트 로그',user_id)
  const { rows } = await pool.query(sql, [user_id]);
  return rows[0] || null;
}

