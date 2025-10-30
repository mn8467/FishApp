
// 로그인 요청 DTO (client -> server)
export interface LoginRequestDTO {
  userName: string;
  password: string;
}


// 로그인 응답 DTO (server -> client) 대신 매퍼로 snake case => camel case 로 변환해줘야함
export interface LoginResponseDTO  {
    userId: number;
    userName: string;
    nickname: string;
    password: string;
    email: string;
    userRole: string;
    userStatus: string;
}


//DB에서 반환 받은 값 리턴해줄때 타입
export interface authUserRow {
  user_id: number;
  user_name: string;
  nickname: string;
  password: string;
  email: string;
  user_role: string;
  user_status: string;
}

//토큰 페이로드 틀
export interface TokenPayload {
  userId: string;
  userName: string;
  userRole: string;
  userStatus: string;
  exp: number;
  iat: number;
}