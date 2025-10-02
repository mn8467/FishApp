import { Router } from "express";
import { authenticateUser,authLogout, verifyAuthToken} from "../controller/auth-controller";

const router = Router();

//로그인
router.post("/login", authenticateUser);
//로그아웃
router.post("/logout", authLogout);
//토큰 검증 로직
router.get("/verify", verifyAuthToken);

export default router;