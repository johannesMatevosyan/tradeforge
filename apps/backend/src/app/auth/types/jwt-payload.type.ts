import { UserRole } from '@tradeforge/shared-types';

export type JwtPayload = {
  sub: string;
  email: string;
  role: UserRole;
};
