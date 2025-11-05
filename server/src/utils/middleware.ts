import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { extractUserId, getUserData, reIssueAccessIfValid, verifyAccessToken } from "../service/auth-service";

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
    console.log("검증 성공!!")
  return next(); // 검증 완료됐으니 다음으로
 
//   res.status(200).json({
//     success: true,
//     code: "TOKEN_VALID",
//     message: "토큰 검증 성공",
//   });
}
  if (status === "EXPIRED") {
    try {
      const newAccess = await reIssueAccessIfValid(access);

      // 새 Access 토큰을 헤더로 내려줌
      res.setHeader("x-new-access-token", newAccess);
      res.setHeader("Access-Control-Expose-Headers", "x-new-access-token");
      console.log("새로운 토큰!! :",newAccess)
      console.log("새토큰 생성 성공!!")
 
      return next(); 
    //   res.status(200).json({
    //   success: true,
    //   code: "TOKEN_VALID",
    //   message: "Access token 재발급 성공"

    }catch (err: any) {
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