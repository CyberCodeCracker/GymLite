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
