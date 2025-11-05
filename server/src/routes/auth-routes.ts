import { Router } from "express";
import { authenticateUser,authLogout, authToken, } from "../controller/auth-controller";
import { verifyAuthToken } from "../utils/middleware";

const router = Router();

//로그인
router.post("/login", authenticateUser);
//로그아웃
router.post("/logout", authLogout);
//토큰 검증 로직
router.get("/verify", verifyAuthToken, authToken);



export default router;