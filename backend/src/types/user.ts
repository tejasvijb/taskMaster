export type JwtUserPayload = PersistedUser;

export interface LoginUserBody {
  email: string;
  password: string;
}

export interface PersistedUser extends UserBase {
  id: string;
}

export interface RegisterUserBody extends UserBase {
  password: string;
}

export type UserRole = "admin" | "user";

interface UserBase {
  email: string;
  firstname: string;
  lastname: string;
  role: UserRole;
}
