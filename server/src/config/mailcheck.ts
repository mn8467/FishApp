import { Transporter } from "nodemailer";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
// 환경변수 로드 (.env 경로 맞게 수정)
dotenv.config({ path: path.resolve(__dirname, "../../.env") });


console.log("NAVER_USER:", process.env.NAVER_USER);
console.log("NAVER_PASS:", process.env.NAVER_PASS ? "******" : "NOT FOUND");

export const transporter: Transporter = nodemailer.createTransport({
  host: "smtp.naver.com", // SMTP 서버명
  port: 465,              // SMTP 포트
  secure: true,           // TLS 보안 연결 (465 포트에서는 true)
  auth: {
    user: process.env.NAVER_USER as string,  // 네이버 아이디
    pass: process.env.NAVER_PASS as string,  // 네이버 비밀번호/앱 비밀번호
  },
});
