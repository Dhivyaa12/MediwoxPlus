// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor';
  specialty?: string;
}

interface AuthContextType {
  user: User | null;
  login: (
    email: string,
    password: string,
    role: 'patient' | 'doctor',
    fullName?: string
  ) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (
    email: string,
    password: string,
    role: 'patient' | 'doctor',
    fullName: string = ''
  ): Promise<boolean> => {
    try {
      const response = await fetch(
        'https://9dkceq681h.execute-api.ap-southeast-2.amazonaws.com/prod/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, userType: role }),
        }
      );

      const result = await response.json();

      if (
        result.message?.includes('successful') ||
        result.status === 'pending_verification'
      ) {
        setUser({
          id: result.id || '',
          name: result.name || fullName || '', // <- Full name fallback
          email: result.email || email,
          role: role,
          specialty: result.specialty || undefined,
        });

        return true;
      } else {
        console.error('Login failed:', result.message);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

