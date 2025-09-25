
import { UserRow } from '../dto/user-dto';
import pool from "../db"

// 여기엔 쿼리만

export async function insertUser(row:UserRow) {
    //  주석과 변수명 불일치 → 일치시킴
    const { user_name, nickname, password,  email } = row; // 기존 userId → user_id
    const query = `
        INSERT INTO users (user_name,nickname,password,email,user_role,user_status)
        VALUES ($1, $2, $3, $4, 'user', 'active'  );    
        `;

    const values = [user_name, nickname, password, email];
    const result = await pool.query(query, values);

    if (result.rowCount && result.rowCount > 0) {
  return { success: true };
}
}
