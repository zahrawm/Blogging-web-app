import { Request, Response } from 'express';

import bcrypt from 'bcrypt';
import { UserService } from '../services/user_service';

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async getProfile(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const user = await this.userService.findById(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const { password: _, ...userWithoutPassword } = user;
      
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error('Get profile error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async updateProfile(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const { fullName, bio, avatar } = req.body;
      
      const updatedUser = await this.userService.update(userId, {
        fullName,
        bio,
        avatar,
        updatedAt: new Date()
      });
      
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const { password: _, ...userWithoutPassword } = updatedUser;
      
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error('Update profile error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async changePassword(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Current password and new password are required' });
      }
      
      const user = await this.userService.findById(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.userService.changePassword(userId, hashedPassword);
      
      return res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
      console.error('Change password error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Admin only - get all users
  async getAllUsers(req: Request, res: Response): Promise<Response> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;
      
      const { users, total } = await this.userService.findAll(skip, limit);
      
      return res.status(200).json({
        users,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Get all users error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Admin only - get user by ID
  async getUserById(req: Request, res: Response): Promise<Response> {
    try {
      const userId = parseInt(req.params.id);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
      
      const user = await this.userService.findById(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const { password: _, ...userWithoutPassword } = user;
      
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error('Get user by ID error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Admin only - update user role
  async updateUserRole(req: Request, res: Response): Promise<Response> {
    try {
      const userId = parseInt(req.params.id);
      const { role } = req.body;
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
      
      if (!role || !['admin', 'author', 'subscriber'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
      }
      
      const updatedUser = await this.userService.update(userId, { role });
      
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const { password: _, ...userWithoutPassword } = updatedUser;
      
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error('Update user role error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Admin only - delete user
  async deleteUser(req: Request, res: Response): Promise<Response> {
    try {
      const userId = parseInt(req.params.id);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
      
      // Prevent deleting yourself
      if (userId === req.user?.id) {
        return res.status(400).json({ message: 'Cannot delete your own account through this endpoint' });
      }
      
      await this.userService.delete(userId);
      
      return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Delete user error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}