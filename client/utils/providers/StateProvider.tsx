import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import * as SecureStore from "expo-secure-store";
import { getAuth } from "@/api/checktoken";

export function useAuth() {
  return useContext(AuthContext);
}


type AuthContextValue = {
  isLoggedIn: boolean;
  setIsLoggedIn: (v: boolean) => void;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextValue>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  loading: true,
});

// 앱 전체에서 사용할 AuthProvider
export function StateProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // 앱 시작 시 한 번 로그인 상태 초기화
  useEffect(() => {
    const resetLogin = async () => {
      try {
        const res = await getAuth();  
        if (res.code === "TOKEN_VALID") {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
        
      } catch (e) {
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };
    resetLogin();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, loading }}>
      {children}
    </AuthContext.Provider>
  );
}