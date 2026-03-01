import { createContext, useContext } from "react";

export interface AuthUser {
  name: string;
  username: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  logout: () => {},
});

export const AuthProvider = AuthContext.Provider;
export const useAuth = () => useContext(AuthContext);
