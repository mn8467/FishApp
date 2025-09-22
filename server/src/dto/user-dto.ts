//DTO 네이밍은 파스칼 케이스로 => 모든단어의 첫문자는 대문자
// Client 에서 데이터 받을때 사용하는 타입

export interface UserRequestDTO{
  userName: string;
  nickname: string;
  password: string;
  email: string;
}

//DB에서 반환 받은 값 리턴해줄때 타입
export interface UserResponseDTO {
  user_id: number;
  user_name: string;
  nickname: string;
  email: string;
}

// dto/user-dto.ts 
//user-service에서 받아 인자 타입 정의시 사용 
export interface UserRow {  
  user_name: string;
  nickname: string;
  password: string;
  email: string;
  // nick_name: string;  // DB에 있으면 추가
}