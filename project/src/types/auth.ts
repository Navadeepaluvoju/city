export interface AuthUser {
  id: string;
  email: string;
  role: 'worker' | 'customer';
  avatar_url?: string;
  full_name?: string;
  last_login?: string;
  login_count?: number;
  last_location?: string;
  bio?: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string, role: 'worker' | 'customer') => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (profileData: Partial<AuthUser>) => Promise<boolean>;
}