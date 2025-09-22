import express, { Request, Response } from "express";
import {UserRequestDTO, UserResponseDTO } from "../dto/user-dto"
import { registerUser } from "../service/user-service";
const router = express.Router();



// 아래 코드 설명  {P},{ResBody},{ReqBody}, {ReqQuery} ==>요건 여기선 없음
// req: Request< {} ,    {}   , UserDTO>  설명

// P = {} → URL 파라미터 없음 (/users/:id 같은 거 없다는 뜻)
// ResBody = {} → 응답 구조는 따로 지정 안 함
// ReqBody = UserDTO → req.body는 반드시 UserDTO 구조여야 함
// ReqQuery = 기본값 → 쿼리스트링 지정 안 함

router.post("/users", async (req: Request<{}, {}, UserRequestDTO>, res: Response): Promise<void> => {
  try {
    const { userName, nickname, password, email } = req.body;

    console.log("데이터 확인", userName, nickname, password, email);

    // 실제 registerUser 함수는 따로 정의/임포트해야 함
    const newUser = await registerUser({
      userName,
      nickname,
      password,
      email,
    });

    console.log(newUser)

    res.status(201).json(newUser);
  } catch (error) {
    console.error("회원가입 중 오류 발생:", error);
    res.status(500).json({ error: "회원가입 실패" });
  }
});

export default router;
