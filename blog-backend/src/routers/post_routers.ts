import { Router } from 'express';
import { authMiddleware } from '../middleware/auth_middleware';

const router = Router();
const postService = new PostService();
const categoryService = new CategoryService();
const tagService = new TagService();
const postController = new PostController(postService, categoryService, tagService);

// Public routes
router.get('/', (req, res) => postController.getAllPosts(req, res));
router.get('/slug/:slug', (req, res) => postController.getPostBySlug(req, res));
router.get('/:id', (req, res) => postController.getPostById(req, res));

// Authenticated routes
router.get('/user/me', authMiddleware, (req, res) => postController.getMyPosts(req, res));
router.post('/', authMiddleware, roleGuard(['admin', 'author']), (req, res) => postController.createPost(req, res));
router.put('/:id', authMiddleware, (req, res) => postController.updatePost(req, res));
router.delete('/:id', authMiddleware, (req, res) => postController.deletePost(req, res));

export default router;