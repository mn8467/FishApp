import { LoginRequestDTO,LoginResponseDTO } from "../dto/auth-dto";
import { Request, Response,NextFunction  } from "express";
import passport from "passport";
import {reIssueAccessIfValid, verifyAccessToken,issueTokens,delRefreshToken, extractUserId } from "../service/auth-service";


// 첫 Access token 발급
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
          accessToken
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

// 로그아웃
  export const authLogout = async (req: Request, res: Response) => {
    console.log("컨트롤러 받나?")
  try {
    const raw = req.headers["authorization"];
    const access =
      typeof raw === "string" && raw.startsWith("Bearer ")
        ? raw.slice(7)
        : "";
    console.log("raw 받나?",raw)
    console.log("access 받냐?", access)
    if (!access) {
      return res.status(401).json({
        success: false,
        code: "NO_TOKEN",
        message: "Access Token 없음",
      });
    }

    // ✅ 서비스 함수로 userId 추출
    const userId = await extractUserId(access);

    if (!userId) {
      return res.status(400).json({
        success: false,
        code: "USER_ID_NOT_FOUND",
        message: "토큰에서 userId를 추출할 수 없음",
      });
    }
    
  // 3. Redis Refresh Token 삭제
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
        code: "REFRESH_TOKEN_NOT_FOUND",
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





// 헤더로 받은 Access Token 인가
export const verifyAuthToken = async (req: Request, res: Response, next:NextFunction) => {
  console.log("경로 잘 들어가짐??");
    const raw = req.headers["authorization"]; // ✅ 이렇게
    const access =
    typeof raw === "string" && raw.startsWith("Bearer ")
      ? raw.slice(7)
      : "";
  
      console.log("토큰 뜨나?", access);

  if (!access) {
    return res.status(401).json({
      success: false,
      code: "NO_TOKEN",
      message: "토큰 없음",
    });
  }

 const status = await verifyAccessToken(access);

 console.log("status :",status)
  if (status === "VALID") {
    return res.status(200).json({
      success: true,
      code: "TOKEN_VALID",
      message: "토큰 검증 성공"
    });
  }

  if (status === "EXPIRED") {
    try {
      const newAccess = await reIssueAccessIfValid(access);

      // 새 Access 토큰을 헤더로 내려줌
      res.setHeader("x-new-access-token", newAccess);
      res.setHeader("Access-Control-Expose-Headers", "x-new-access-token");

      return res.status(200).json({
      success: true,
      code: "TOKEN_VALID",
      message: "Access token 재발급 성공"
    });
    } 
    
      catch (err: any) {
      const errorCode = err.message || "REFRESH_INVALID";
      return res.status(401).json({
        success: false,
        code: errorCode,
        message: "토큰 재발급 실패",
      });
    }
  }

  return res.status(401).json({
    success: false,
    code: "INVALID_TOKEN",
    message: "유효하지 않은 토큰",
  });
};
