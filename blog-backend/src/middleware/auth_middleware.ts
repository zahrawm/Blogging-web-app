
import { Request, Response, NextFunction } from 'express';
import * as AuthService from '../services/authservices';


export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
 
  const authHeader = req?.headers?.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }
  
  const token = authHeader.split(' ')[1];
  
 
  const decoded = AuthService.verifyToken(token);
  if (!decoded) {
    res.status(401).json({ error: 'Invalid or expired token' });
    return;
  }
  
 
  (req as any).userId = decoded.userId;
  

  next();
};

export const isPostAuthor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const postId = parseInt(req.params.id);
    const userId = (req as any).userId;
    
    if (isNaN(postId)) {
      res.status(400).json({ error: 'Invalid post ID' });
      return;
    }
    
    
    const PostService = require('../services/postservices');
    
    
    const post = await PostService.findById(postId);
    
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
    
   
    const user = await AuthService.getUserById(userId);
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    
    if (user.username !== post.author) {
      res.status(403).json({ error: 'You are not authorized to modify this post' });
      return;
    }
    
   
    next();
  } catch (error) {
    console.error('Error in isPostAuthor middleware:', error);
    res.status(500).json({ error: 'Server error' });
  }
};