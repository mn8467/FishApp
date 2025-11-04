import { UserDTO } from "@/dto/userDTO";
import api from "./axiosInstance";

export async function getMe(): Promise<UserDTO>{
    const res = await api.get<UserDTO>("/myinfo"); // 인터셉터가 토큰 자동 부착
  return res.data;
}