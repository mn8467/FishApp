import { Router } from "express";
import { findAllFish } from "../controller/fish-controller";
const router = Router();


//메일 인증 확인 라우팅
router.get("/data", findAllFish)

export default router;