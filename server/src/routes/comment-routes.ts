    import { Router } from "express";
    import { getCommentsByFishId} from "../controller/comment-controller";
    const router = Router();

    router.get("/data/:fishId",getCommentsByFishId)

    export default router;