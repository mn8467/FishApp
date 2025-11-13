import redisClient from "../redis";
import bcrypt from 'bcrypt';
import {LoginRequestDTO,LoginResponseDTO,TokenPayload}  from "../dto/auth-dto";
import {AuthMapper} from "../mapper/auth-mapper"
import { findByUserName, findByUserId, findByUserIdforCache } from '../repository/auth-repository';
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction } from "express";
import { TokenStatus } from "../utils/type";

const JWT_SECRET = process.env.JWT_SECRET as string

export async function validateUserByUserId(user_id:number) {
  const user = await findByUserId(user_id);
  return user; // 성공 시 user 반환
}



export async function extractUserId(
  access: string
): Promise<number> {
  try {
    // 1) 유효한 경우 → verify 통과
    const decoded = jwt.verify(access, JWT_SECRET) as JwtPayload;
    return Number(decoded.userId);
  } catch (err: any) {
    // 2) 만료된 경우 → decode만 허용 (payload만 추출)
    if (err.name === "TokenExpiredError") {
      const decoded = jwt.decode(access) as JwtPayload | null;
      if (decoded?.userId) {
        return Number(decoded.userId);
      }
      throw new Error("USER_ID_NOT_FOUND");
    }
    // 3) 그 외 에러 → 토큰 자체가 위조됨
    throw new Error("INVALID_TOKEN");
  }
}

export async function delRefreshToken(user_id: number): Promise<boolean> {
  try {
    const result = await redisClient.del(`refresh:${user_id}`);
    if (result === 1) {
      console.log(`✅ Refresh Token 삭제 완료: refresh:${user_id}`);
      return true;
    } else {
      console.warn(`⚠️ 삭제할 Refresh Token이 없음: refresh:${user_id}`);
      return false;
    }
  } catch (error) {
    console.error("❌ Refresh Token 삭제 중 오류:", error);
    return false;
  } finally {
    console.log(`🧹 delRefreshToken 함수 실행 완료 (user_id: ${user_id})`);
  }
}



export async function authenticateUserByEmail(user:LoginRequestDTO) {

    const userRaw = await findByUserName(user.userName); // DB에서 가져온 data (snake case 상태)
    console.log("잘 가져왔니", userRaw)
    const userEntity:LoginResponseDTO = AuthMapper.toEntity(userRaw);    //Entity는 DB 테이블과 1:1로 매핑되는 객체를 의미
                                                                        // 여기서 Entity는 “가공된 사용자 객체”
    
    if (!userEntity) throw new Error('NOT_FOUND');

    if (userEntity.userStatus === 'inactive') throw new Error('INACTIVE');
    const isMatch = await bcrypt.compare(user.password,userEntity.password); //compare 첫번째인자는 input 에서 받은 값, 두번째 인자는 db에서 가져온 값
    
    if (!isMatch) throw new Error('INVALID_PASSWORD');

        return userEntity; // 성공 시 user 반환
    };




export async function reIssueAccessToken(userId:number) { // user_id 쿼리에 사용하기 위해서 변수 변환
  const userRaw = await findByUserId(userId);
  const userEntity = AuthMapper.toEntity(userRaw);
  const accessToken = jwt.sign(
    { userId: userEntity.userId,
      userName: userEntity.userName, 
      nickname: userEntity.nickname, 
      userRole: userEntity.userRole,
      userStatus: userEntity.userStatus
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "5m" }
  );
  return { accessToken }; // 객체(Object)로 주고받는게 더 깔끔함
}

export async function issueTokens(user: LoginResponseDTO) {
  // Access Token (5분)
  const accessToken = jwt.sign(
    { userId: user.userId, 
      userRole: user.userRole,
      userStatus: user.userStatus
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "1m" }
  );

  // Refresh Token (10분) 수정
  const refreshToken = jwt.sign(
    { userId: user.userId },
    process.env.JWT_SECRET as string, 
    { expiresIn: "2m" }
  );

    // 기존 refresh 토큰 무효화 (rotation 대비)
  await redisClient.del(`refresh:${user.userId}`);

  // Redis 저장 (만료 10분)
  await redisClient.set(`refresh:${user.userId}`, refreshToken, { EX: 60 * 2 });

  return { accessToken, refreshToken };
}

export async function reIssueAccessIfValid(access: string): Promise<string> {
  // 1) 만료된 Access에서 userId 추출
  const decoded = jwt.decode(access) as JwtPayload | null;
  const userId = Number(decoded?.userId);

  if (!userId) {
    throw new Error("INVALID_PAYLOAD");
  }

  // 2) Redis에서 Refresh 확인
  const storedRefresh = await redisClient.get(`refresh:${userId}`);
  if (!storedRefresh) {
    throw new Error("REFRESH_NOT_FOUND");
  }

  // 3) Refresh 검증
  try {
    const refreshPayload = jwt.verify(storedRefresh, JWT_SECRET,{ ignoreExpiration: true }) as JwtPayload;
    if (Number(refreshPayload.userId) !== userId) {
      throw new Error("CROSS_USER");
    }
  } catch (err: any) {
    if (err.name === "TokenExpiredError") throw new Error("REFRESH_EXPIRED");
    throw new Error("REFRESH_INVALID");
  }

  // 4) 새 Access 발급
  const { accessToken: newAccess } = await reIssueAccessToken(userId);

  return newAccess;
}

//토큰 검증 함수
export async function verifyAccessToken(token: string): Promise<TokenStatus> {
  try {
    console.log("여기까지 오는가?");
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("검증 통과, 디코딩된 payload:", decoded);
    return "VALID";
  } catch (err: any) {
  
    console.error(`에러 발생: ${err.name}: ${err.message}`);
  
  if (err.name === "TokenExpiredError"){
    console.log("새로운 토큰을 생성하는 Logic") 
    return "EXPIRED";
  }
  return "INVALID";
 }
}