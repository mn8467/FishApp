import { LoginRequestDTO,LoginResponseDTO } from "../dto/auth-dto";
import { Request, Response,NextFunction  } from "express";
import passport from "passport";
import {issueTokens,delRefreshToken, extractUserId, getUserData } from "../service/auth-service";

export const authToken = async(req:Request, res:Response , next:NextFunction)=>{
  try{ 
        const reissued = !!res.getHeader("x-new-access-token");
      return res.status(200).json({
        success: true,
        code: reissued ? "TOKEN_REISSUED" : "TOKEN_VALID",
      });
  }catch(err){
       console.error("authToken error:", err);
    return res.status(500).json({
      success: false,
      code: "SERVER_ERROR",
      message: "검증 처리 중 오류",
    });
  }
}


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

