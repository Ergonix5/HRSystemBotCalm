"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserData {
  name: string;
  employeeId: string;
  company: string;
  department: string;
  position: string;
  email: string;
  phone: string;
  hotline: string;
}

interface UserContextType {
  user: UserData | null;
  setUser: (user: UserData) => void;
  loading: boolean;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/employee/profile');
      
      if (response.status === 401) {
        // User is not authenticated, this is expected
        console.log('User not authenticated');
        setUser(null);
        setIsAuthenticated(false);
        return;
      }
      
      const data = await response.json();
      
      if (response.ok && data.employee) {
        const employee = data.employee;
        setUser({
          name: `${employee.first_name} ${employee.last_name}`,
          employeeId: employee.employee_id,
          company: employee.organization?.name || "BotCalm Private Limited",
          department: employee.designation?.name || "No Department",
          position: employee.role?.name || "No Position",
          email: employee.email,
          phone: employee.phone || "",
          hotline: "0412246557",
        });
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, isAuthenticated, refreshUser: fetchUserData }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}