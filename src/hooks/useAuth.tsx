import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as authApi from '../api/auth';
import { getMe } from '../api/users';
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '../lib/storage';
import { isStaffRole } from '../lib/jwt';
import type { UserProfile } from '../types/api';

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  isStaff: boolean;
  profile: UserProfile | undefined;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [initialized, setInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getAccessToken());

  useEffect(() => {
    setInitialized(true);
  }, []);

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getMe,
    enabled: isAuthenticated && initialized,
    retry: false,
  });

  const isStaff = profile ? isStaffRole(profile.role) : false;

  const login = useCallback(
    async (email: string, password: string) => {
      const tokens = await authApi.login(email, password);
      setTokens(tokens.accessToken, tokens.refreshToken);
      setIsAuthenticated(true);
      await queryClient.refetchQueries({ queryKey: ['profile'] });
    },
    [queryClient],
  );

  const logout = useCallback(async () => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        await authApi.logout(refreshToken);
      } catch {
        // ignore
      }
    }
    clearTokens();
    setIsAuthenticated(false);
    queryClient.clear();
  }, [queryClient]);

  const value = useMemo(
    () => ({
      isAuthenticated,
      isLoading: !initialized || (isAuthenticated && profileLoading),
      isStaff,
      profile,
      login,
      logout,
    }),
    [isAuthenticated, initialized, profileLoading, isStaff, profile, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
