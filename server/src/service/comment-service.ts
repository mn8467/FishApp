import { ResponseCommentDTO } from "../dto/comment-dto";
import { findCommentByFishId } from "../repository/comment-repository";


export async function listCommentByFishId(fish_id:number): Promise<ResponseCommentDTO[]>{
    const rows = await findCommentByFishId(fish_id);
    return rows;
}