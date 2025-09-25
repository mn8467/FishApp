import { LoginRequestDTO, LoginResponseDTO,authUserRow  } from "../dto/auth-dto";

export const AuthMapper = {
  // JS → DB 변환 (camelCase → snake_case)
  toRow(entity: LoginRequestDTO) {
    return {
      user_name: entity.userName,
      password: entity.password,
    };
  },

  // DB → JS 변환 (snake_case → camelCase)
  toEntity(row: authUserRow) {
    return {
      userId: row.user_id,
      userName: row.user_name,
      nickname: row.nickname,
      password: row.password,
      email: row.email,
      userRole: row.user_role,
      userStatus: row.user_status
    }
  },
};
