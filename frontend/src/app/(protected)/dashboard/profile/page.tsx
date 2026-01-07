'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  role?: string;
  createdAt?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchProfile();
    }
  }, [mounted]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold">Error</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <p className="text-gray-600">No profile data available</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Profile</h1>
        
        <div className="space-y-4">
          <div className="border-b pb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Username
            </label>
            <p className="text-lg text-gray-900">{profile.username}</p>
          </div>

          <div className="border-b pb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <p className="text-lg text-gray-900">{profile.email}</p>
          </div>

          {profile.fullName && (
            <div className="border-b pb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Full Name
              </label>
              <p className="text-lg text-gray-900">{profile.fullName}</p>
            </div>
          )}

          {profile.role && (
            <div className="border-b pb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Role
              </label>
              <p className="text-lg text-gray-900 capitalize">{profile.role}</p>
            </div>
          )}

          {profile.createdAt && (
            <div className="border-b pb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Member Since
              </label>
              <p className="text-lg text-gray-900">
                {new Date(profile.createdAt).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 flex gap-4">
          <button
            onClick={() => router.push('/dashboard/profile/edit')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Edit Profile
          </button>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
