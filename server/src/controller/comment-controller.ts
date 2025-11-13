import { Response,Request,NextFunction } from "express";
import { listCommentByFishId, modifiedComment, writeComment } from "../service/comment-service";

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

// commentId가 파라미터로 옴
export const putComment = async(req:Request,res:Response) =>{
  try{
      const { commentId } = req.params as { commentId?: string };
      const comment_id = Number(commentId)
      if (!Number.isInteger(comment_id) || comment_id <= 0) {
      return res.status(400).json({ message: "invalid comment_id" });
    }
      const { body } = req.body as { body?: string };
      const content = body?.trim() ?? "";
      if (!content) {
      return res.status(400).json({ message: "댓글 내용이 존재하지 않습니다!" });
    }
        const authz = req.headers.authorization ?? "";
        const access = authz.startsWith("Bearer ") ? authz.slice(7) : "";

    if (!access) return res.status(401).json({ message: "NO_TOKEN" });
 
    console.log("변경된내용: ",content)
    const modified = await modifiedComment(comment_id, content, access);
    console.log("쿼리에서 받아오는 값 체크", modified)
    return res
      .status(201)
      .json({ success: true, code: "UPDATE_COMMENT_COMPLETE", ...modified });
      // 예: { success:true, code:"...", commentId:"123" }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "SERVER_ERROR" });
  }
};

export const createComment = async (req: Request, res: Response) => {
  try {
    const { fishId } = req.params as { fishId?: string };
    const fish_id = Number(fishId);
    if (!Number.isInteger(fish_id) || fish_id <= 0) {
      return res.status(400).json({ message: "invalid fishId" });
    }

    const { body } = req.body as { body?: string };
    const content = body?.trim() ?? "";
    if (!content) {
      return res.status(400).json({ message: "댓글 내용이 존재하지 않습니다!" });
    }

    const authz = req.headers.authorization ?? "";
    const access = authz.startsWith("Bearer ") ? authz.slice(7) : "";
    if (!access) return res.status(401).json({ message: "NO_TOKEN" });

    // ✅ 반드시 await
    const created = await writeComment(fish_id, content, access);

    return res
      .status(201)
      .json({ success: true, code: "INSERT_COMMENT_COMPLETE", ...created });
      // 예: { success:true, code:"...", commentId:"123" }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "SERVER_ERROR" });
  }
};
