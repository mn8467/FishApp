// hooks/useMe.ts
import { useQuery } from "@tanstack/react-query";

import { getAuth } from "@/api/checktoken";
import { ResMessageDTO } from "@/dto/messageDTO";

export function useVerifyTokenUsable() {
  return useQuery<ResMessageDTO>({
    queryKey: ["token"],
    queryFn: getAuth
  });
}
