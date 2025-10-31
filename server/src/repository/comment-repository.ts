import pool from "../db";
import { ResponseCommentDTO } from "../dto/comment-dto";
import { NotFoundError,DbError } from "../utils/error";  

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
                      c.updated_at AS "updatedAt"
                    FROM comments c
                    JOIN users u
                      ON u.user_id = c.user_id
                    WHERE c.fish_id = $1;
                `
    try {
    const { rows } = await pool.query<ResponseCommentDTO>(sql, [fish_id]);
        return rows; // 조건에 맞는 모든 행의 목록
  } catch (e) {
    throw new DbError("DbError 발생", e);
  }
}
