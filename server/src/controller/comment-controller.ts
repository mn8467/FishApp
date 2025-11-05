import { Response,Request,NextFunction } from "express";
import { listCommentByFishId, writeComment } from "../service/comment-service";
import { extractUserId, verifyAccessToken } from "../service/auth-service";

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
