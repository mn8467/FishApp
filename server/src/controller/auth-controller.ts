import { LoginRequestDTO,LoginResponseDTO } from "../dto/auth-dto";
import express, { Request, Response,NextFunction  } from "express";
import passport from "passport";
import { issueTokens } from "../service/auth-service";

export const authenticateUser = (
  req: Request<{}, {}, LoginRequestDTO>,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate("local", { session: false }, async (err: any, user:LoginResponseDTO, info: { message?: string }) => {
    try {
      if (err) return next(err);
      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: info?.message || "로그인 실패" });
      }

      const { accessToken, refreshToken } = await issueTokens(user);

      console.log("토큰 검사", accessToken)
      console.log("refresh", refreshToken)

      return res.json({
        success: true,
        accessToken,
        refreshToken,
        user,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "로그인 중 서버 오류" });
    }
  })(req, res, next);
};