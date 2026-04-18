import { UserRole } from '@tradeforge/shared-types';

export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
  role: UserRole;
}
