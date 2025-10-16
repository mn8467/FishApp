    import { Router } from "express";
    import { findAllFish, getByFishId } from "../controller/fish-controller";
    const router = Router();


    router.get("/data", findAllFish)
    router.get("/:fishId",getByFishId)
    export default router;