import { User } from './users';


export interface JwtPayload {
  userId: number;
  username: string;
  email: string;
  role: string;
  iat?: number; // Issued at timestamp
  exp?: number; // Expiration timestamp
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
  refreshToken?: string;
}