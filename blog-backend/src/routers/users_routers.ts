import { Router } from 'express';
import { UserService } from '../services/user_service';

import { UserController } from '../controllers/user.controllers';
import { authMiddleware } from '../middleware/auth_middleware';


const router = Router();
const userService = new UserService();
const userController = new UserController(userService);

// User profile routes (authenticated)
router.get('/profile', authMiddleware, (req, res) => userController.getProfile(req, res));
router.put('/profile', authMiddleware, (req, res) => userController.updateProfile(req, res));
router.post('/change-password', authMiddleware, (req, res) => userController.changePassword(req, res));

// Admin routes
router.get('/', authMiddleware, roleGuard(['admin']), (req, res) => userController.getAllUsers(req, res));
router.get('/:id', authMiddleware, roleGuard(['admin']), (req, res) => userController.getUserById(req, res));
router.put('/:id/role', authMiddleware, roleGuard(['admin']), (req, res) => userController.updateUserRole(req, res));
router.delete('/:id', authMiddleware, roleGuard(['admin']), (req, res) => userController.deleteUser(req, res));

export default router;