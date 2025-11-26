    import { Router } from "express";
    import { getFishIdandName } from "../controller/fish-controller";
import { getPetIdandName } from "../controller/pet-controller";
    const router = Router();

    router.get("/info",getPetIdandName )
    // router.get("/data", findAllFish) 데이터 바인딩 확인을 위한 URL
    // router.get("/:petId",)
    export default router;