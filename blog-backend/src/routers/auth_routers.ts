
import express from 'express';
import * as AuthController from '../controllers/auth.controllers';
import { authenticate } from '../middleware/auth_middleware';

const router = express.Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);


router.get('/profile', authenticate, AuthController.getProfile);

export default router;