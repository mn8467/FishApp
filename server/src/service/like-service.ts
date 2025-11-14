import { LikeReqDTO } from "../dto/like-dto";
import { insertLikeComment } from "../repository/like-repository";

export async function updateLike(user_id:number, comment_id:number):Promise<boolean>{
    try{
        const checkInsert = await insertLikeComment(user_id,comment_id);
    
    return checkInsert;

    }catch(err){
        console.log(err)

        throw new Error("REFRESH_INVALID");
    }
    
}