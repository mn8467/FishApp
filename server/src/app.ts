import express, { Request, Response } from "express";
import cors from "cors";
import userRouter from "./routes/user-routes";
import loginRouter from "./routes/auth-routes";
import fishRouter from "./routes/fish-routes";
import commentRouter from "./routes/comment-routes";
import passport from "./config/passport";
import likeRouter from "./routes/like-routes"
const app = express();
const port = 8080;

// CORS 설정
app.use(
  cors({
    origin: "http://localhost:8081", // 프론트엔드 주소
    credentials: true, // 쿠키/세션 허용
  })
);

app.use(passport.initialize()); // 이게 있어야 passport local 실행가능


// 바디 파서 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 라우트 예시
app.get("/api/home", (req: Request, res: Response) => {
  res.send("서버 연결 완료!");
});

//user 경로 라우터
app.use('/api/comments',commentRouter)
app.use('/api/users',userRouter)
app.use('/api/auth',loginRouter) // 요청시 userId, access token 발급
app.use('/api/fish',fishRouter )
app.use('/api/request', likeRouter)


//jwt 테스트 코드
app.get('/api/protected',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({ message: 'JWT 인증 성공', user: req.user });
  }
);

// 서버 실행
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
