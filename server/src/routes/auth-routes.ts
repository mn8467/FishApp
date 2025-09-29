import { Router } from "express";
import { authenticateUser,authLogout } from "../controller/auth-controller";

const router = Router();

// 회원가입 라우팅
router.post("/login", authenticateUser);
router.post("/logout", authLogout);


export default router;