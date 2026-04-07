import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { User, AuthContextType, RegisterData } from '@/types';
import { mockUsers, getUserByEmail } from '@/data/mockData';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, any password works with existing emails
      const foundUser = getUserByEmail(email);
      
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('user', JSON.stringify(foundUser));
      } else {
        throw new Error('Invalid credentials');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email already exists
      const existingUser = getUserByEmail(data.email);
      if (existingUser) {
        throw new Error('Email already registered');
      }
      
      // Create new user
      const newUser: User = {
        id: String(mockUsers.length + 1),
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: data.role,
        status: data.role === 'driver' ? 'approved' : 'pending',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.email}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        isEmailVerified: false,
      };
      
      mockUsers.push(newUser);
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
  }, []);

  const updateUser = useCallback(async (data: Partial<User>) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (user) {
        const updatedUser = { ...user, ...data, updatedAt: new Date() };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Update in mock data
        const index = mockUsers.findIndex(u => u.id === user.id);
        if (index !== -1) {
          mockUsers[index] = updatedUser;
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Check for saved user on mount
  React.useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
