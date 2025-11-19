    import { Router } from "express";
    import { createComment, getCommentsByFishId, putComment} from "../controller/comment-controller";
    import { optionalAuth, verifyAuthToken } from "../utils/middleware";
    const router = Router();

    router.get("/:fishId", optionalAuth,getCommentsByFishId)
    router.post("/:fishId/new" , verifyAuthToken, createComment)
    router.put("/:fishId/:commentId",verifyAuthToken,putComment)
    export default router;