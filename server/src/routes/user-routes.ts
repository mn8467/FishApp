import { Router } from "express";
import { createUser, mailAuth,confirmNumber } from "../controller/user-controller";

const router = Router();

// 회원가입 라우팅
router.post("/", createUser);

//메일 인증 발송 라우팅
router.post("/mailAuth", mailAuth);

//메일 인증 확인 라우팅
router.post("/checkAuthNum", confirmNumber)

export default router;