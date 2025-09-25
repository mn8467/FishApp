import express, { Request, Response } from "express";
import {UserRequestDTO, UserResponseDTO } from "../dto/user-dto"
import { registerUser,sendAuthNumber,checkThrottle,checkAuthNumber } from "../service/user-service";
import {transporter} from "../config/mailcheck";
import { request } from "http";

// 아래 코드 설명  {P},{ResBody},{ReqBody}, {ReqQuery} ==>요건 여기선 없음
// req: Request< {} ,    {}   , UserDTO>  설명

// P = {} → URL 파라미터 없음 (/users/:id 같은 거 없다는 뜻)
// ResBody = {} → 응답 구조는 따로 지정 안 함
// ReqBody = UserDTO → req.body는 반드시 UserDTO 구조여야 함
// ReqQuery = 기본값 → 쿼리스트링 지정 안 함

// 회원가입
export const createUser = async (
  req: Request<{}, {}, UserRequestDTO>,
  res: Response
): Promise<void> => {
  try {
    const { userName, nickname, password, email } = req.body;

    const newUser = await registerUser({ userName, nickname, password, email });

    res.status(201).json(newUser);
  } catch (error) {
    console.error("회원가입 중 오류 발생:", error);
    res.status(500).json({ error: "회원가입 실패" });
  }
};

export const confirmNumber = async (req: Request, res: Response) => {
  const { authNumber, email } = req.body;


   console.log("받은 정보확인", email, authNumber); 

  const allowed = await checkAuthNumber(authNumber,email); // 순서 주의 + await 추가

  if (!allowed) {
    return res.status(400).json({
      success: false,
      code: "INVALID_CODE",
      message: "인증번호가 일치하지 않거나 만료되었습니다.",
    });
  }

  return res.status(200).json({
    success: true,
    message: "인증이 완료되었습니다.",
  });
};

// 인증 메일 발송
export const mailAuth = async (req: Request, res: Response) => {
 const { email } = req.body;

 console.log('받은 이메일 :',email)

  // 1) 입력 검증
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({
      success: false,
      code: "INVALID_EMAIL",
      message: "유효한 이메일을 입력하세요.",
    });
  }

  // 2) 레이트 리미트 (60초 동안 동일 이메일 재요청 불가)
  const allowed = await checkThrottle(email);
  if (!allowed) {
    return res.status(429).json({
      success: false,
      code: "RATE_LIMIT",
      message: "잠시 후 다시 시도하세요.",
    });
  }

  try {
    // 3) 메일 발송 (실패 시 throw 발생)
    await sendAuthNumber(email);

    return res.status(200).json({
      success: true,
      message: "인증 메일을 발송했습니다.",
    });
  } catch (err) {
    console.error("메일 발송 실패:", err);

    // SMTP/외부 메일 서버 문제 → 502
    return res.status(502).json({
      success: false,
      code: "SMTP_ERROR",
      message: "메일 서버 오류로 발송에 실패했습니다.",
    });
  }
};


