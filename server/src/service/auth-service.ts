import redisClient from "../redis";
import bcrypt from 'bcrypt';
import {LoginRequestDTO,LoginResponseDTO}  from "../dto/auth-dto";
import {AuthMapper} from "../mapper/auth-mapper"
import { findByUserName, findByUserId } from '../repository/auth-repository';
import jwt from "jsonwebtoken";

export async function validateUserByUserId(user_id:number) {
  const user = await findByUserId(user_id);
  return user; // 성공 시 user 반환
}

export async function delRefreshToken(user_id: string): Promise<boolean> {
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
    const isMatch = await bcrypt.compare(user.password,userEntity.password);
            //    compare 첫번째인자는 input 에서 받은 값, 두번째 인자는 db에서 가져온 값
    if (!isMatch) throw new Error('INVALID_PASSWORD');

        return userEntity; // 성공 시 user 반환
    };




export async function issueTokens(user: LoginResponseDTO) {
  // Access Token (5분)
  const accessToken = jwt.sign(
    { userId: user.userId,
      userName: user.userName, 
      nickname: user.nickname, 
      userRole: user.userRole,
      userStatus: user.userStatus
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "5m" }
  );

  // Refresh Token (10분)
  const refreshToken = jwt.sign(
    { userId: user.userId },
    process.env.JWT_SECRET as string,
    { expiresIn: "10m" }
  );

    // 기존 refresh 토큰 무효화 (rotation 대비)
  await redisClient.del(`refresh:${user.userId}`);

  // Redis 저장 (만료 10분)
  await redisClient.set(`refresh:${user.userId}`, refreshToken, { EX: 60 * 10 });

  return { accessToken, refreshToken };
}

