import { api } from './api';
import { API_ENDPOINTS } from '../constants';
import { saveToken, removeToken } from '../utils/tokenManager';
import { User } from '../types';

export interface LoginData {
  email: string;
  password?: string;
}

export interface RegisterData {
  email: string;
  password?: string;
}

interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export const authService = {
  async register(data: RegisterData): Promise<any> {
    const response = await api.post(API_ENDPOINTS.REGISTER, data);
    return response.data;
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(API_ENDPOINTS.LOGIN, data);
    if (response.data.token) {
      await saveToken(response.data.token);
    }
    return response.data;
  },

  async getCurrentUser(): Promise<AuthResponse> {
    // /auth/me doesn't exist in endpoints yet, let's just use raw string or update constants later
    const response = await api.get<AuthResponse>('/auth/me');
    return response.data;
  },

  async logout(): Promise<void> {
    await removeToken();
  }
};
