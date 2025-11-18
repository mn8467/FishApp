import { Response,Request,NextFunction } from "express";
import { LikeReqDTO } from "../dto/like-dto";
import { number } from "zod";
import { updateLike, updateUnlike } from "../service/like-service";
import { extractUserId } from "../service/auth-service";

// 트러블 슈팅 꼼꼼히 공부하기 위해만든 모범 표본
export const likeComment = async(req:Request,res:Response) =>{
    try{                                                    //시작하자마자 try구문으로 바로 직행 2025-11-14

        const {commentId}  = req.params as { commentId?: string };
        const comment_id = Number(commentId);
                                                         //  +
        if (!commentId || Number.isNaN(commentId)) {  // 만약 commentId가 NaN 이라면 어떤 원본 값이 넘어왔는지 알아야하기 때문
          console.warn("[LikeComment] Invalid commentId:", commentId); // 트러블 슈팅 로그를 신경쓰기 위함!! 2025 -11 -14
          res.status(400).json({ message: "INVALID_COMMENT_ID" });
          return;
        }

        const raw = req.headers.authorization;
        if (!raw || typeof raw !== "string" || !raw.startsWith("Bearer ")) {
          console.warn("[LikeComment] Missing or invalid Authorization header");  // 역시 마찬가지로 트러블 슈팅 로그 신경쓰기 위함!!
          res.status(401).json({ message: "NO_TOKEN" }); // 권한 없음 상태코드 401
          return;
        }
        const access = raw.slice(7); //토큰만 access 변수에 넣음
        
        const user_id = await extractUserId(access);
        const created = await updateLike(user_id, comment_id);

          if (!created) {
                // 이미 좋아요 누른 상태일때..
                res.status(200).json({ message: "ALREADY_LIKED" });
            return;
        }
      
          res.status(201).json({ message: "LIKED" }); // 좋아요 성공!
        } catch (err) {
          console.error("[LikeComment] Unexpected error:", err);
        }
    
    }

export const unlikeComment = async(req:Request,res:Response) =>{
  try{                                                    //시작하자마자 try구문으로 바로 직행 2025-11-14
        const {commentId}  = req.params as { commentId?: string };
        const comment_id = Number(commentId);
                                                         //  +
        if (!commentId || Number.isNaN(commentId)) {  // 만약 commentId가 NaN 이라면 어떤 원본 값이 넘어왔는지 알아야하기 때문
          console.warn("[LikeComment] Invalid commentId:", commentId); // 트러블 슈팅 로그를 신경쓰기 위함!! 2025 -11 -14
          res.status(400).json({ message: "INVALID_COMMENT_ID" });
          return;
        }

        const raw = req.headers.authorization;
        if (!raw || typeof raw !== "string" || !raw.startsWith("Bearer ")) {
          console.warn("[LikeComment] Missing or invalid Authorization header");  // 역시 마찬가지로 트러블 슈팅 로그 신경쓰기 위함!!
          res.status(401).json({ message: "NO_TOKEN" }); // 권한 없음 상태코드 401
          return;
        }
        const access = raw.slice(7); //토큰만 access 변수에 넣음
        
        const user_id = await extractUserId(access);
        const deleted = await updateUnlike(user_id,comment_id);

          if (!deleted) {
                // 이미 좋아요 누른 상태일때..
                res.status(200).json({ message: "ALREADY_UNLIKED" });
        }

          res.status(201).json({ message: "LIKE ==> UNLIKED" }); // 좋아요 성공!
        } catch (err) {
          console.error("[LikeComment] Unexpected error:", err);
        }
    

}


