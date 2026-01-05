"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';

interface ProfileContextType {
  profileImage: string | null;
  updateProfileImage: (imageUrl: string | null) => void;
  uploadProfileImage: (file: File) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const updateProfileImage = useCallback((imageUrl: string | null) => {
    setProfileImage(imageUrl);
  }, []);

  const uploadProfileImage = useCallback(async (file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setProfileImage(result);
        resolve();
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }, []);

  return (
    <ProfileContext.Provider value={{
      profileImage,
      updateProfileImage,
      uploadProfileImage
    }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}