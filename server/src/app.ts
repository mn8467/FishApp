import express, { Request, Response } from "express";
import cors from "cors";
import userRouter from "./controller/user-controller";

const app = express();
const port = 8080;

// CORS 설정
app.use(
  cors({
    origin: "http://localhost:8081", // 프론트엔드 주소
    credentials: true, // 쿠키/세션 허용
  })
);

// 바디 파서 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 라우트 예시
app.get("/api/home", (req: Request, res: Response) => {
  res.send("서버 연결 완료!");
});

//user 경로 라우터
app.use('/api',userRouter)


// 서버 실행
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});