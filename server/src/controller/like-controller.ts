import { Response,Request,NextFunction } from "express";
import { LikeReqDTO } from "../dto/like-dto";

export async function LikeComment(req:Request, res:Response): Promise<void>{
    const commentId = Number(req.params.commentId);
        // 토큰 받아서 user_id 추출필요
    try{
        
    }catch(err){

    }

} 
