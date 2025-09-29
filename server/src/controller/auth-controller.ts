import { LoginRequestDTO,LoginResponseDTO } from "../dto/auth-dto";
import express, { Request, Response,NextFunction  } from "express";
import passport from "passport";
import { issueTokens } from "../service/auth-service";

export const logoutUser = ( req:any, res:any, next:NextFunction) => {

}

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