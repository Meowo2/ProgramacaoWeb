import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

interface User {
  id: number;
  nome: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext =
  createContext<AuthContextType>(
    {} as AuthContextType
  );

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user] = useState<User | null>(
    null
  );

  const login = (token: string) => {
    localStorage.setItem("token", token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () =>
  useContext(AuthContext);