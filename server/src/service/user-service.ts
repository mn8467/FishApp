import bcrypt from 'bcrypt';
import { UserRequestDTO, UserResponseDTO } from '../dto/user-dto';
import { toUserRow, toUserEntity } from '../mapper/user-mapper';
import { insertUser } from '../repository/user-repository';


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

}