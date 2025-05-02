
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserService } from './user_service';
import { AuthResponse, JwtPayload } from '../utilis/auth';
import { User } from '../utilis/users';

export class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  private readonly JWT_EXPIRES_IN = '24h';
  private readonly REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret-key';
  private readonly REFRESH_TOKEN_EXPIRES_IN = '7d';
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async validateUser(email: string, password: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.userService.findByEmail(email);
    
    if (!user) {
      return null;
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return null;
    }
    
    const { password: _, ...result } = user;
    return result;
  }

  async login(email: string, password: string): Promise<AuthResponse | null> {
    const user = await this.validateUser(email, password);
    
    if (!user) {
      return null;
    }
    
    // Update last login timestamp
    await this.userService.updateLastLogin(user.id);
    
    const payload: JwtPayload = {
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    };
    
    const token = this.generateToken(payload);
    const refreshToken = this.generateRefreshToken(payload);
    
    return {
      user,
      token,
      refreshToken
    };
  }

  async register(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'lastLogin' | 'role'>): Promise<AuthResponse | null> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const newUser = await this.userService.create({
      ...userData,
      password: hashedPassword,
      role: 'subscriber', // Default role for new users
    });
    
    if (!newUser) {
      return null;
    }
    
    const { password: _, ...userWithoutPassword } = newUser;
    
    const payload: JwtPayload = {
      userId: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role
    };
    
    const token = this.generateToken(payload);
    const refreshToken = this.generateRefreshToken(payload);
    
    return {
      user: userWithoutPassword,
      token,
      refreshToken
    };
  }

  refreshToken(refreshToken: string): { token: string, refreshToken: string } | null {
    try {
      const payload = jwt.verify(refreshToken, this.REFRESH_TOKEN_SECRET) as JwtPayload;
      
      const newPayload: JwtPayload = {
        userId: payload.userId,
        username: payload.username,
        email: payload.email,
        role: payload.role
      };
      
      const newToken = this.generateToken(newPayload);
      const newRefreshToken = this.generateRefreshToken(newPayload);
      
      return {
        token: newToken,
        refreshToken: newRefreshToken
      };
    } catch (error) {
      return null;
    }
  }

  verifyToken(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, this.JWT_SECRET) as JwtPayload;
    } catch (error) {
      return null;
    }
  }

  private generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.JWT_SECRET, { expiresIn: this.JWT_EXPIRES_IN });
  }

  private generateRefreshToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.REFRESH_TOKEN_SECRET, { expiresIn: this.REFRESH_TOKEN_EXPIRES_IN });
  }
}