import { Router } from "express";
import { verifyAuthToken } from "../utils/middleware";
import { likeComment, unlikeComment } from "../controller/like-controller";

    const router = Router();

    router.post("/like/:commentId",verifyAuthToken, likeComment)
    router.post("/unlike/:commentId",verifyAuthToken, unlikeComment)


    export default router;
