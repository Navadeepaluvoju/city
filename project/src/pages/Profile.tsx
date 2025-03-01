import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { User, MapPin, Phone, Star, Calendar, LogOut, Edit, Headphones, Mail, Clock, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { customerCare } from '../data';
import { format } from 'date-fns';

interface UserProfile {
  full_name: string | null;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  role: 'worker' | 'customer';
  last_login: string | null;
  login_count: number | null;
  last_location: string | null;
  bio: string | null;
}

interface WorkerProfile {
  service_category: string;
  experience_years: number;
  hourly_rate: number;
  rating: number;
  total_jobs: number;
  verification_status: 'pending' | 'verified' | 'rejected';
}

export default function Profile() {
  const { user, signOut, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [workerProfile, setWorkerProfile] = useState<WorkerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    bio: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    async function loadProfile() {
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;

        setProfile(profileData);
        setFormData({
          full_name: profileData.full_name || '',
          bio: profileData.bio || ''
        });

        if (profileData.role === 'worker') {
          const { data: workerData, error: workerError } = await supabase
            .from('worker_profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (workerError) throw workerError;
          setWorkerProfile(workerData);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    try {
      const success = await updateProfile({
        full_name: formData.full_name,
        bio: formData.bio
      });

      if (success) {
        setIsEditing(false);
        // Update local state
        if (profile) {
          setProfile({
            ...profile,
            full_name: formData.full_name,
            bio: formData.bio
          });
        }
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile changes');
    }
  };

  const handleCancelEdit = () => {
    // Reset form data to current profile values
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        bio: profile.bio || ''
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Profile Not Found</h2>
          <p className="mt-2 text-gray-600">Please sign in to view your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Customer Support Section */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2 flex items-center">
          <Headphones className="h-5 w-5 mr-2" />
          Customer Support
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <Phone className="h-5 w-5 text-blue-600 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Helpline</p>
              <p className="font-medium">{customerCare.phone}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Mail className="h-5 w-5 text-blue-600 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Email Support</p>
              <p className="font-medium">{customerCare.email}</p>
            </div>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-600">
              Available {customerCare.hours} for your assistance
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="relative h-32 bg-blue-600">
          <div className="absolute -bottom-16 left-8">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-white overflow-hidden">
              {profile.avatar_url ? (
                <img
                  src={`${supabase.storage.from('profiles').getPublicUrl(profile.avatar_url).data.publicUrl}`}
                  alt={profile.full_name || 'Profile'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-full h-full p-4 text-gray-400" />
              )}
            </div>
          </div>
          <div className="absolute top-4 right-4 flex space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSaveProfile}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleEditProfile}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
                <button
                  onClick={handleSignOut}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>

        {/* Profile Info */}
        <div className="pt-20 px-8 pb-8">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {profile.full_name || 'Anonymous User'}
                </h1>
                <p className="text-gray-600">{profile.email}</p>
                {profile.bio && (
                  <p className="mt-4 text-gray-700">
                    {profile.bio}
                  </p>
                )}
              </div>
              <div className="flex items-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 capitalize">
                  {profile.role}
                </span>
              </div>
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {profile.phone && (
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 mr-2" />
                <span>{profile.phone}</span>
              </div>
            )}
            
            {profile.last_login && (
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Last Login</p>
                  <p className="font-medium">{format(new Date(profile.last_login), 'PPp')}</p>
                </div>
              </div>
            )}
            
            {profile.login_count !== null && (
              <div className="flex items-center">
                <Info className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Login Count</p>
                  <p className="font-medium">{profile.login_count}</p>
                </div>
              </div>
            )}
            
            {profile.last_location && (
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Last Location</p>
                  <p className="font-medium">{profile.last_location}</p>
                </div>
              </div>
            )}
          </div>

          {/* Worker Profile Section */}
          {workerProfile && (
            <div className="mt-8 border-t pt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Service Category</p>
                  <p className="mt-1 font-medium capitalize">{workerProfile.service_category}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Experience</p>
                  <p className="mt-1 font-medium">{workerProfile.experience_years} years</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Hourly Rate</p>
                  <p className="mt-1 font-medium">₹{workerProfile.hourly_rate}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Rating</p>
                  <div className="mt-1 flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="ml-1 font-medium">{workerProfile.rating.toFixed(1)}</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Total Jobs</p>
                  <div className="mt-1 flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="font-medium">{workerProfile.total_jobs}</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Verification Status</p>
                  <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                    workerProfile.verification_status === 'verified'
                      ? 'bg-green-100 text-green-800'
                      : workerProfile.verification_status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {workerProfile.verification_status}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}