import { httpClient } from '@/lib/http/httpClient';

export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

export interface UpdateProfileDto {
  name?: string;
  phone?: string;
  avatar?: string;
}

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  status: 'active' | 'locked';
  avatar?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

const userService = {
  /**
   * Get current user profile
   * API: GET /api/users/me
   * Auth: Required
   */
  getProfile: async (): Promise<UserProfile> => {
    const response = await httpClient.get<{ success: boolean; data: UserProfile }>(
      '/users/me',
      { requiresAuth: true }
    );

    if (!response.success || !response.data) {
      throw new Error('Failed to fetch profile');
    }

    return response.data;
  },

  /**
   * Update user profile
   * API: PUT /api/users/me
   * Auth: Required
   */
  updateProfile: async (dto: UpdateProfileDto): Promise<UserProfile> => {
    const response = await httpClient.put<{ success: boolean; data: UserProfile }>(
      '/users/me',
      dto,
      { requiresAuth: true }
    );

    if (!response.success || !response.data) {
      throw new Error('Failed to update profile');
    }

    return response.data;
  },

  /**
   * Change password
   * API: PUT /api/users/me/change-password
   * Auth: Required
   */
  changePassword: async (dto: ChangePasswordDto): Promise<{ message: string }> => {
    const response = await httpClient.put<{ success: boolean; message: string }>(
      '/users/me/change-password',
      dto,
      { requiresAuth: true }
    );

    if (!response.success) {
      throw new Error(response.message || 'Failed to change password');
    }

    return { message: response.message };
  },
};

export default userService;
