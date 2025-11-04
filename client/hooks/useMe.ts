// hooks/useMe.ts
import { useQuery, useQueryClient } from "@tanstack/react-query";
import  {UserDTO} from "@/dto/userDTO"
import api from "@/api/axiosInstance";

export function useMe() {
  return useQuery<UserDTO>({
    queryKey: ["me"],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: UserDTO }>("/myinfo");
      return data.data;
    },
    staleTime: 5 * 60_000,
    gcTime: 30 * 60_000,
    retry: false,
  });
}
export function useAuthCache() {
  const qc = useQueryClient();
  return {
    refreshMe: () => qc.invalidateQueries({ queryKey: ["me"] }), // 리프레시 후 재요청
    clearMe: () => qc.removeQueries({ queryKey: ["me"] }),       // 로그아웃 시 캐시 삭제
  };
}
