import { Response,Request,NextFunction } from "express";
import { listCommentByFishId } from "../service/comment-service";

export const getCommentsByFishId =  async(req:Request,res:Response,next:NextFunction) =>{
    try{
        const fish_id = Number(req.params.fishId);
            if (!Number.isInteger(fish_id) || fish_id <= 0) {
              return res.status(400).json({ message: "fishId must be a positive integer" });
            }

        const comment = await listCommentByFishId(fish_id)
            if (!comment) {
              return res.status(404).json({ message: "작성된 댓글이 존재하지않습니다." });
            }
      res.status(200).json(comment);
    }catch (e){
        next(e);
    }
}
