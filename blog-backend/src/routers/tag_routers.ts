import express from 'express';
import { TagController } from '../controllers/tag.controllers';

const router = express.Router();
const tagController = new TagController();

// Get all tags
router.get('/', (req, res) => tagController.getAllTags(req, res));

// Get tag by slug
router.get('/slug/:slug', (req, res) => tagController.getTagBySlug(req, res));

// Get tag by ID
router.get('/:id', (req, res) => tagController.getTagById(req, res));

// Create a new tag
router.post('/', (req, res) => tagController.createTag(req, res));

// Update an existing tag
router.put('/:id', (req, res) => tagController.updateTag(req, res));

// Delete a tag
router.delete('/:id', (req, res) => tagController.deleteTag(req, res));

export default router;