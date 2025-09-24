import bcrypt from 'bcrypt';
import { UserRequestDTO, UserResponseDTO } from '../dto/user-dto';
import { toUserRow, toUserEntity } from '../mapper/user-mapper';
import { insertUser } from '../repository/user-repository';
import { transporter } from '../config/mailcheck';
import redisClient from "../redis";



export async function registerUser(dto: UserRequestDTO){
    const hashedPassword = await bcrypt.hash(dto.password, 10); // 비밀번호 해싱
    const userRaw = {
                      userName: dto.userName,
                      nickname: dto.nickname,
                      password: hashedPassword,
                      email: dto.email
                    };

                    console.log('암호화 완료된 데이터',userRaw)
    const persistUser = toUserRow(userRaw)
    const savedUser = await insertUser(persistUser);
    return savedUser
};

export const sendAuthNumber = async (email: string): Promise<void> => {
  const authNumber = Math.floor(Math.random() * 888888) + 111111;

  const mailOptions = {
    from: "mn8467@naver.com",
    to: email,
    subject: "[ScratchNow] 이메일 확인 인증번호 안내",
    text: `인증번호: ${authNumber}`,
  };

  await transporter.sendMail(mailOptions);
  await redisClient.set(`auth:${email}`, authNumber.toString(), { EX: 60 * 10 });
};


 export const checkThrottle = async(email: string):Promise<boolean> =>{
  const result = await redisClient.set(`throttle:${email}`, "1", {
    EX: 60, // 60초 동안 유효
    NX: true, // 키가 없을 때만 set
  });
  return result === "OK"; 
  // OK면 발송 가능, null이면 이미 쿨타임 중
};

export const checkAuthNumber = async(authNumber: string, email:string): Promise<boolean> => {
  const storedValue = await redisClient.get(`auth:${email}`);
    if (!storedValue) {
    console.log("인증번호 만료 또는 존재하지 않음");
    return false;
  }

  if (storedValue === authNumber) {
    await redisClient.del(`auth:${email}`); // 인증 성공 시 삭제
    console.log("일치합니다");
    return true;
  }

  console.log("불일치합니다");
  return false;
};