import pool from "../db";
import { CommentCreateDTO, CommentDTO, ResponseCommentDTO } from "../dto/comment-dto";
import { DbError } from "../utils/error";  

//상세 물고기 페이지의 코멘트 => fish_id 는 1을 조건으로 함
export async function findCommentByFishId(fish_id:number): Promise<ResponseCommentDTO[]> {
    const sql = `
                      SELECT
                        c.comment_id AS "commentId",
                        c.user_id    AS "userId",
                        u.nickname   AS "nickname",
                        c.fish_id    AS "fishId",
                        c.body,
                        c.is_deleted AS "isDeleted",
                        c.created_at AS "createdAt",
                        c.updated_at AS "updatedAt",
                        c.is_modified AS "isModified",
                        COUNT(k.comment_id) AS "likeCount"     -- ✅ 좋아요 개수
                      FROM comments c
                      JOIN users u
                        ON u.user_id = c.user_id
                      LEFT JOIN comment_likes k               -- ✅ LEFT JOIN이면 좋아요 0개도 포함
                        ON c.comment_id = k.comment_id
                      WHERE c.fish_id = $1
                      GROUP BY
                        c.comment_id,
                        c.user_id,
                        u.nickname,
                        c.fish_id,
                        c.body,
                        c.is_deleted,
                        c.created_at,
                        c.updated_at,
                        c.is_modified
                      ORDER BY c.created_at DESC;
                `
    try {
    const { rows } = await pool.query<ResponseCommentDTO>(sql, [fish_id]);
        return rows; // 조건에 맞는 모든 행의 목록
  } catch (e) {
    throw new DbError("DbError 발생", e);
  }
}

export async function insertComment(user_id: number, fish_id: number, body: string) {
  const sql = `
    INSERT INTO comments (user_id, fish_id, body, is_deleted, created_at, updated_at)
    VALUES ($1, $2, $3, FALSE, NOW(), NOW())
    RETURNING comment_id AS "commentId";
  `;
  const { rows, rowCount } = await pool.query(sql, [user_id, fish_id, body]);
  if (rowCount !== 1) throw new DbError("INSERT_FAILED");
  return rows[0]; // { commentId: ... }
}

export async function vaildUserIdByCommentId(comment_id:number){
  const sql = `
                SELECT user_id
                FROM comments 
                WHERE comment_id = $1
              `
    try {
        const { rows } = await pool.query(sql, [comment_id]);
        return rows[0]?.user_id ?? null;
      } catch (e) {
        throw new DbError("Can not find comment_id", e);
      }
}

export async function updateComment(body: string,comment_id: number) {
  const sql = `
              update comments 
              set 
              body = $1,
              is_modified = true,
              updated_at = NOW()
              where comment_id = $2;
              `
      try {
        const { rows } = await pool.query(sql, [body,comment_id]);
        return rows[0] ?? null;
      } catch (e) {
        throw new DbError("Can not find comment_id OR Can not find body", e);
      }
}