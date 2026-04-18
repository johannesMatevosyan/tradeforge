import { UserRole } from "@tradeforge/shared-types";

export class AuthResponseDto {
  accessToken!: string;

  user!: {
    id: string;
    email: string;
    name?: string | null;
    role: UserRole;
  };
}
