import { LoginRequestDTO,LoginResponseDTO } from "../dto/auth-dto";
import express, { Request, Response,NextFunction  } from "express";
import passport from "passport";
import { issueTokens } from "../service/auth-service";
import { delRefreshToken } from "../service/auth-service";
import jwt from "jsonwebtoken";


export const authenticateUser = (
  req: Request<{}, {}, LoginRequestDTO>,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "local",
    { session: false },
    async (err: any, user: LoginResponseDTO, info: { message?: string }) => {
      try {
        if (err) return next(err);
        if (!user) {
          return res
            .status(400)
            .json({ success: false, message: info?.message || "로그인 실패" });
        }

        // Access Token, Refresh Token 생성
        const { accessToken } = await issueTokens(user);
        // issueTokens 안에서 refreshToken은 Redis에 저장하는 로직만 실행

        console.log("발급된 Access Token:", accessToken);

        // 클라이언트에는 Access Token만 내려줌
        return res.status(200).json({
          success: true,
          accessToken,
          userId : user.userId
        });
      } catch (error) {
        console.error("로그인 중 오류:", error);
        return res
          .status(500)
          .json({ success: false, message: "로그인 중 서버 오류" });
      }
    }
  )(req, res, next);
};

  export const authLogout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.body;
      console.log("로그아웃 요청 userId:", userId);

      if (!userId) {
        return res.status(400).json({
          success: false,
          code: "USER_ID_REQUIRED", // 에러 식별 코드
          message: "userId 필요",
        });
      }

      // ✅ Redis에서 Refresh Token 삭제
      const deleted = await delRefreshToken(userId);

      if (deleted) {
        return res.status(200).json({
          success: true,
          code: "LOGOUT_SUCCESS",
          message: "로그아웃 완료 (Refresh Token 삭제됨)",
        });
      } else {
        return res.status(404).json({
          success: false,
          code: "REFRESH_TOKEN_NOT_FOUND", // ✅ 프론트는 이 코드로 분기
          message: "삭제할 Refresh Token이 없습니다.",
        });
      }
    } catch (err) {
      console.error("로그아웃 중 오류:", err);
      return res.status(500).json({
        success: false,
        code: "LOGOUT_ERROR",
        message: "로그아웃 실패",
      });
    }
  };

export const verifyAuthToken = (req: Request, res: Response) => {
  console.log("경로 잘 들어가짐??");
  const token = req.headers.authorization?.split(" ")[1];
  console.log("토큰 뜨나?", token);

  if (!token) {
    return res.status(401).json({
      success: false,
      code: "NO_TOKEN",
      message: "토큰 없음",
    });
  }

  try {
    return res.status(200).json({
      success: true,
      code: "TOKEN_VALID",
      message: "토큰 검증 성공"
    });
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        code: "TOKEN_EXPIRED",
        message: "토큰 만료됨",
      });
    }
    return res.status(401).json({
      success: false,
      code: "INVALID_TOKEN",
      message: "유효하지 않은 토큰",
    });
  }
};