export interface AuthUser {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

export interface AuthState {
  authenticated: boolean;
  user: AuthUser | null;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  sub: string;
  role?: string;
  fullName?: string;
  userId?: string;
  exp: number;
  iat: number;
}
