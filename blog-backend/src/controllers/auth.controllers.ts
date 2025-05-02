import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserService } from '../services/user_service';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';


export const authenticateJwt = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
   
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      res.status(401).json({ message: 'Authorization header missing' });
      return;
    }
    
  
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      res.status(401).json({ message: 'Invalid authorization format' });
      return;
    }
    
    const token = parts[1];

    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    
    // Get the user from database
    const userService = new UserService();
    const user = await userService.findById(decoded.userId);
    
    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }
    
    // Attach the user to the request object
    req.user = user;
    
    // Continue to the next middleware/route handler
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: 'Token expired' });
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: 'Invalid token' });
    } else {
      console.error('Auth middleware error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

export const optionalAuthenticateJwt = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    // If no authentication header, just continue
    if (!authHeader) {
      next();
      return;
    }
    
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      next();
      return;
    }
    
    const token = parts[1];
    
    // Try to verify the token
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
      
      const userService = new UserService();
      const user = await userService.findById(decoded.userId);
      
      if (user) {
        req.user = user;
      }
    } catch (tokenError) {
      // Ignore token errors, just continue without user
    }
    
    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next();
  }
};

/**
 * Role-based authorization middleware
 * @param roles Array of allowed roles
 */
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Not authenticated' });
        return;
      }
      
      // Check if user has one of the required roles
      if (!roles.includes(req.user.role)) {
        res.status(403).json({ message: 'Insufficient permissions' });
        return;
      }
      
      next();
    } catch (error) {
      console.error('Authorization middleware error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
};