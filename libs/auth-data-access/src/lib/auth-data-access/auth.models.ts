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
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  name?: string;
}

export interface UpdateUserRequest {
  name?: string;
  role?: UserRole;
}
