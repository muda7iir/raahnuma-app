import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { getProfile, setProfile as saveProfile, type UserProfile } from '../lib/storage';

interface ProfileContextType {
  profile: UserProfile | null;
  setProfile: (p: UserProfile) => void;
  clearProfile: () => void;
  hasProfile: boolean;
}

const ProfileContext = createContext<ProfileContextType>({
  profile: null, setProfile: () => {}, clearProfile: () => {}, hasProfile: false,
});

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<UserProfile | null>(() => getProfile());

  useEffect(() => {
    const stored = getProfile();
    if (stored) setProfileState(stored);
  }, []);

  const setProfile = (p: UserProfile) => {
    setProfileState(p);
    saveProfile(p);
  };

  const clearProfile = () => {
    setProfileState(null);
    localStorage.removeItem('nxraahnuma_profile');
  };

  return (
    <ProfileContext.Provider value={{ profile, setProfile, clearProfile, hasProfile: !!profile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => useContext(ProfileContext);
export default ProfileContext;
