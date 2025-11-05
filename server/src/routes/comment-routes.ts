    import { Router } from "express";
    import { createComment, getCommentsByFishId} from "../controller/comment-controller";
import { verifyAuthToken } from "../utils/middleware";
    const router = Router();

    router.get("/:fishId",getCommentsByFishId)
    router.post("/:fishId/new" , verifyAuthToken, createComment)
    
    export default router;