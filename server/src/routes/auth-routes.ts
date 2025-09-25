import { Router } from "express";
import { authenticateUser } from "../controller/auth-controller";

const router = Router();

// 회원가입 라우팅
router.post("/login", authenticateUser);


export default router;