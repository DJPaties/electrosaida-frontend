"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { mockUsers } from "./mockUsers"; // Adjust the import path as necessary

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextProps {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  login: () => false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("mockUser");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    const found = mockUsers.find(
      (u) => u.email === email && u.password === password
    );
    if (found) {
      const { password, ...safeUser } = found;
      localStorage.setItem("mockUser", JSON.stringify(safeUser));
      setUser(safeUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("mockUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
