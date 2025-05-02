import { Router } from 'express';
import { AuthController } from '../controllers/auth.controllers';
import { authMiddleware } from '../middleware/auth_middleware';

const router = Router();
const authController = new AuthController();

// Public routes
router.post('/login', (req, res) => authController.login(req, res));
router.post('/register', (req, res) => authController.register(req, res));
router.post('/refresh-token', (req, res) => authController.refreshToken(req, res));
router.post('/logout', (req, res) => authController.logout(req, res));
router.post('/forgot-password', (req, res) => authController.requestPasswordReset(req, res));
router.post('/reset-password', (req, res) => authController.resetPassword(req, res));

// Protected route example
router.get('/me', authMiddleware, (req, res) => {
  res.status(200).json({ 
    message: 'Protected route accessed successfully',
    user: req.user 
  });
});

export default router;