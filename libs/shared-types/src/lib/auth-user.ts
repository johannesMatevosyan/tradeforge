import { UserRole } from './user-role';

export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
  role: UserRole;
}
