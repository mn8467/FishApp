import { Router } from "express";
import { authenticateUser,authLogout, verifyAuthToken } from "../controller/auth-controller";

const router = Router();

// 회원가입 라우팅
router.post("/login", authenticateUser);
router.post("/logout", authLogout);
router.get("/verify", verifyAuthToken);


export default router;