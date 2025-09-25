import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { authenticateUserByEmail,validateUserByUserId } from "../service/auth-service"; // 유저 검증 로직
import { LoginRequestDTO,LoginResponseDTO  } from "../dto/auth-dto";
import { AuthMapper } from "../mapper/auth-mapper";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import dotenv from "dotenv";
import path from "path";


dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

// console.log("env 체크", process.env.JWT_SECRET)


passport.use(
  new LocalStrategy(
    {
      usernameField: "userName",    // req.body.email
      passwordField: "password", // req.body.password
      session: false,            // 세션 대신 JWT 사용
    },
    async (
      userName: string,
      password: string,
      done: (error: any, user?: LoginResponseDTO  | false, options?: { message: string }) => void
    ) => {
      try {
        const userFormData = {userName,password}
        const user: LoginResponseDTO = await authenticateUserByEmail(userFormData);

        console.log("찍히나 테스트 : ", user);

        // 필요한 필드만 넘기도록 제한하는 게 보안상 안전함
        return done(null, user)
      } catch (err: any) {
        if (err.message === "NOT_FOUND") {
          return done(null, false, { message: "존재하지 않는 이메일입니다." });
        }
        if (err.message === "INACTIVE") {
          return done(null, false, { message: "탈퇴한 회원입니다." });
        }
        if (err.message === "INVALID_PASSWORD") {
          return done(null, false, { message: "비밀번호가 일치하지 않습니다." });
        }
        return done(err); // 예상치 못한 에러
      }
    }
  )
);


// JwtStrategy - Access Token 토큰 검증
passport.use(new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET as string
  },
  async (payload, done) => {
    try {
      console.log("페이로드 확인 : ", payload.userId)
      const user = await validateUserByUserId(payload.userId); // DB에서 유저 조회
      if (!user) return done(null, false);
      return done(null, user); // req.user에 저장됨
    } catch (err) {
      return done(err, false);
    }
  }
));

export default passport;
