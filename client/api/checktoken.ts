import api from "./axiosInstance";
import {ResMessageDTO } from "@/dto/messageDTO";

export async function getAuth(): Promise<ResMessageDTO>{
    const res = await api.get<ResMessageDTO>("/auth/verify"); // 로그인 인증 로직으로 넘어가게끔
  return res.data;
}