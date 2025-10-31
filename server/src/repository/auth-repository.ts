import pool from "../db";
import { NotFoundError,DbError } from "../utils/error";  
import type { authUserRow } from "../dto/auth-dto";

export async function findByUserName(user_name: string): Promise<authUserRow | null> {
  const sql = `
    SELECT user_id, user_name, nickname, password, email, user_role, user_status, created_at, updated_at
    FROM users
    WHERE user_name = $1
    LIMIT 1
  `;
  try {
    const { rows } = await pool.query(sql, [user_name]);
    return rows[0] ?? null;
  } catch (e) {
    throw new DbError("findByUserName failed", e);
  }
}

export async function findByUserId(user_id: number): Promise<authUserRow | null> {
  const sql = `
    SELECT user_id, user_name, nickname, password, email, user_role, user_status, created_at, updated_at
    FROM users
    WHERE user_id = $1
    LIMIT 1
  `;
  try {
    const { rows } = await pool.query(sql, [user_id]);
    return rows[0] ?? null;
  } catch (e) {
    throw new DbError("findByUserId failed", e);
  }
}


