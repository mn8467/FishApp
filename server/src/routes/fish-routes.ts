    import { Router } from "express";
    import { findAllFish, getByFishId, getFishIdandName } from "../controller/fish-controller";
    const router = Router();

    router.get("/data",getFishIdandName)
    // router.get("/data", findAllFish) 데이터 바인딩 확인을 위한 URL
    router.get("/:fishId",getByFishId)
    export default router;