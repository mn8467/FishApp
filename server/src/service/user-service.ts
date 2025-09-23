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
    from: "CodeTestTeam",
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