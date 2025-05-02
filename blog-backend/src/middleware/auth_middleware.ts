import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { UserService } from '../services/user_service';
import { AuthService } from '../services/auth_services';



declare global {
  namespace Express {
    interface Request {
      user?: any;
      jwtPayload?: JwtPayload;
    }
  }
}

const userService = new UserService();
const authService = new AuthService(userService);

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = extractTokenFromHeader(req);
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication token is missing' });
    }
    
    const payload = authService.verifyToken(token);
    
    if (!payload) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    
    
    const user = await userService.findById(payload.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    
    const { password: _, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;
    req.jwtPayload = payload;
    
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed' });
  }
};

export const roleGuard = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
    
    next();
  };
};

const extractTokenFromHeader = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  return authHeader.split(' ')[1];
};