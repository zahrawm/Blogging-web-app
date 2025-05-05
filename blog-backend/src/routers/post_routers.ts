// src/routes/postRoutes.ts
import express from 'express';
import * as PostController from '../controllers/post.controllers';
import { authenticate, isPostAuthor } from '../middleware/auth_middleware';

const router = express.Router();

router.get('/posts', PostController.getAllPost);
router.get('/posts/:id', PostController.getPostById);

router.post('/posts', authenticate, PostController.createPost);


router.put('/posts/:id', authenticate, isPostAuthor, PostController.updatePost);
router.delete('/posts/:id', authenticate, isPostAuthor, PostController.deletePost);

export default router;