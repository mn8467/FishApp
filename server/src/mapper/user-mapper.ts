import { UserRequestDTO,UserResponseDTO }  from "../dto/user-dto";

// JS → DB 변환 (camelCase → snake_case) client에서 가져온거 DB에 넣을때
export function toUserRow(entity: UserRequestDTO ){
  return {
    user_name: entity.userName,
    nickname:entity.nickname,
    email: entity.email,
    password: entity.password,
  };
}

// DB → JS 변환 (snake_case → camelCase) DB에서 가져온거 client로 보내줄때
export function toUserEntity(row: UserResponseDTO)  {
  return {
    userId : row.user_id,
    userName: row.user_name,
    nickname: row.nickname,
    email: row.email,
  };
}
