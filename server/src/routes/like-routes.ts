import { Router } from "express";
import { verifyAuthToken } from "../utils/middleware";
import { LikeComment } from "../controller/like-controller";

    const router = Router();

    router.post("/like/:commentId",verifyAuthToken, LikeComment)

    export default router;
