    import { Router } from "express";
    import { createComment, getCommentsByFishId, putComment} from "../controller/comment-controller";
import { verifyAuthToken } from "../utils/middleware";
    const router = Router();

    router.get("/:fishId",getCommentsByFishId)
    router.post("/:fishId/new" , verifyAuthToken, createComment)
    router.put("/:fishId/:commentId",verifyAuthToken,putComment)
    export default router;