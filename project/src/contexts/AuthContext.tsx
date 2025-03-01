import { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextType, AuthUser } from '../types/auth';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { updateLoginAnalytics, detectSuspiciousLogin } from '../lib/analytics';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Create or update profile
  async function upsertProfile(
    userId: string,
    email: string,
    role: 'worker' | 'customer' = 'customer',
    fullName?: string,
    avatarUrl?: string
  ) {
    try {
      // First, check if profile exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (fetchError) throw fetchError;

      // If profile doesn't exist, create it
      if (!existingProfile) {
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([
            {
              id: userId,
              email,
              role,
              full_name: fullName || email.split('@')[0],
              avatar_url: avatarUrl,
              updated_at: new Date().toISOString()
            }
          ])
          .select()
          .single();

        if (insertError) throw insertError;
        return newProfile;
      }

      // If profile exists, update it with new data while preserving existing data
      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .update({
          email,
          role: existingProfile.role || role,
          full_name: fullName || existingProfile.full_name,
          avatar_url: avatarUrl || existingProfile.avatar_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (updateError) throw updateError;
      return updatedProfile;
    } catch (error) {
      console.error('Error upserting profile:', error);
      throw error;
    }
  }

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (session?.user && mounted) {
          const profile = await upsertProfile(
            session.user.id,
            session.user.email || '',
            'customer',
            session.user.user_metadata?.full_name,
            session.user.user_metadata?.avatar_url
          );

          // Update login analytics
          await updateLoginAnalytics(session.user.id);
          
          setUser({
            id: profile.id,
            email: profile.email,
            role: profile.role,
            full_name: profile.full_name,
            avatar_url: profile.avatar_url,
            last_login: profile.last_login,
            login_count: profile.login_count,
            last_location: profile.last_location,
            bio: profile.bio
          });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        toast.error('Failed to initialize authentication');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        try {
          if (session?.user) {
            const profile = await upsertProfile(
              session.user.id,
              session.user.email || '',
              'customer',
              session.user.user_metadata?.full_name,
              session.user.user_metadata?.avatar_url
            );

            // Update login analytics
            await updateLoginAnalytics(session.user.id);
            
            // Check for suspicious login
            const isSuspicious = await detectSuspiciousLogin(session.user.id);
            if (isSuspicious) {
              toast.warning('Unusual login location detected! Please verify your identity.');
            }

            setUser({
              id: profile.id,
              email: profile.email,
              role: profile.role,
              full_name: profile.full_name,
              avatar_url: profile.avatar_url,
              last_login: profile.last_login,
              login_count: profile.login_count,
              last_location: profile.last_location,
              bio: profile.bio
            });
          }
        } catch (error) {
          console.error('Error in auth state change:', error);
          setUser(null);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }

      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function signInWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account'
          }
        }
      });

      if (error) throw error;
      
      if (data?.url) {
        // Store the current path to redirect back after auth
        sessionStorage.setItem('authRedirectPath', window.location.pathname);
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      toast.error('Failed to sign in with Google. Please try again.');
      throw error;
    }
  }

  async function signUp(email: string, password: string, role: 'worker' | 'customer') {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            role
          }
        }
      });

      if (error) throw error;
      if (!data?.user) throw new Error('Sign up failed: No user returned');

      await upsertProfile(data.user.id, email, role);
      
      toast.success('Account created successfully! You can now sign in.');
      navigate('/signin');
    } catch (error) {
      console.error('Sign up error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create account');
      throw error;
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      if (!data?.user) throw new Error('Sign in failed: No user returned');

      const profile = await upsertProfile(data.user.id, email);
      
      // Update login analytics
      await updateLoginAnalytics(data.user.id);
      
      // Check for suspicious login
      const isSuspicious = await detectSuspiciousLogin(data.user.id);
      if (isSuspicious) {
        toast.warning('Unusual login location detected! Please verify your identity.');
      }

      setUser({
        id: profile.id,
        email: profile.email,
        role: profile.role,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        last_login: profile.last_login,
        login_count: profile.login_count,
        last_location: profile.last_location,
        bio: profile.bio
      });

      // Check if user is a provider
      const { data: workerProfile, error: workerError } = await supabase
        .from('worker_profiles')
        .select('id')
        .eq('id', data.user.id)
        .maybeSingle();

      if (workerError) {
        console.error('Error checking worker profile:', workerError);
      }

      toast.success('Signed in successfully!');

      // Get the stored redirect path or default to home
      const redirectPath = sessionStorage.getItem('authRedirectPath') || '/';
      sessionStorage.removeItem('authRedirectPath');

      if (workerProfile) {
        navigate('/profile');
      } else if (profile.role === 'worker') {
        navigate('/complete-profile');
      } else {
        navigate(redirectPath);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to sign in');
      throw error;
    }
  }

  async function signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      navigate('/');
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  }

  async function updateProfile(profileData: Partial<AuthUser>) {
    try {
      if (!user) throw new Error('No user logged in');

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.full_name,
          avatar_url: profileData.avatar_url,
          bio: profileData.bio,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      setUser({
        ...user,
        ...profileData
      });

      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
      return false;
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}