import { ResponseCommentDTO } from "../dto/comment-dto";
import { findCommentByFishId, insertComment, updateComment, vaildUserIdByCommentId } from "../repository/comment-repository";
import { extractUserId } from "./auth-service";


export async function listCommentByFishId(fish_id:number): Promise<ResponseCommentDTO[]>{
    const rows = await findCommentByFishId(fish_id);
    return rows;
}

export async function writeComment(fish_id: number, content: string, access: string) {
  const userId = await extractUserId(access);
  const user_id = Number(userId);
  if (!Number.isInteger(user_id) || user_id <= 0) {
    throw new Error("INVALID_USER");
  }
  // ✅ 실제 호출
  return insertComment(user_id, fish_id, content);
}

export async function modifiedComment(comment_id:number, content: string, access:string){
  const userId = await extractUserId(access);
  const user_id = Number(userId);
  if (!Number.isInteger(user_id) || user_id <= 0) {
    throw new Error("INVALID_USER");
  }
  const validUserId = await vaildUserIdByCommentId(comment_id);
  
  if(!(user_id === validUserId)){
    throw new Error("You don't have the authority to modify comments.") 
  }
  
    return updateComment(comment_id, content);
}