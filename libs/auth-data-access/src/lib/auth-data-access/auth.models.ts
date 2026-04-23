import { AuthUser, UserRole } from '@tradeforge/shared-types';
export type { AuthUser };

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name?: string;
  email: string;
  password: string;
}

export interface UserListItem {
  id: string;
  email: string;
  name?: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  name?: string;
}

export interface UpdateUserRequest {
  name?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface CreateUserRequest {
  name?: string;
  email: string;
  password: string;
  role?: UserRole;
}
