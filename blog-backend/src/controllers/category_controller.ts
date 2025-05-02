import { Request, Response } from 'express';
import { CategoryService } from '../services/category_service';

export class CategoryController {
  private categoryService: CategoryService;

  constructor(categoryService: CategoryService) {
    this.categoryService = categoryService;
  }

  async getAllCategories(req: Request, res: Response): Promise<Response> {
    try {
      const categories = await this.categoryService.findAll();
      return res.status(200).json(categories);
    } catch (error) {
      console.error('Get all categories error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getCategoryById(req: Request, res: Response): Promise<Response> {
    try {
      const categoryId = parseInt(req.params.id);
      
      if (isNaN(categoryId)) {
        return res.status(400).json({ message: 'Invalid category ID' });
      }
      
      const category = await this.categoryService.findById(categoryId);
      
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      
      return res.status(200).json(category);
    } catch (error) {
      console.error('Get category by ID error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getCategoryBySlug(req: Request, res: Response): Promise<Response> {
    try {
      const slug = req.params.slug;
      
      const category = await this.categoryService.findBySlug(slug);
      
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      
      return res.status(200).json(category);
    } catch (error) {
      console.error('Get category by slug error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async createCategory(req: Request, res: Response): Promise<Response> {
    try {
      const { name, description } = req.body;
      
      if (!name) {
        return res.status(400).json({ message: 'Name is required' });
      }
      
      const category = await this.categoryService.create(name, description);
      
      return res.status(201).json(category);
    } catch (error) {
      console.error('Create category error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async updateCategory(req: Request, res: Response): Promise<Response> {
    try {
      const categoryId = parseInt(req.params.id);
      
      if (isNaN(categoryId)) {
        return res.status(400).json({ message: 'Invalid category ID' });
      }
      
      const { name, description } = req.body;
      
      if (!name && description === undefined) {
        return res.status(400).json({ message: 'At least one field to update is required' });
      }
      
      const updatedCategory = await this.categoryService.update(categoryId, name, description);
      
      if (!updatedCategory) {
        return res.status(404).json({ message: 'Category not found' });
      }
      
      return res.status(200).json(updatedCategory);
    } catch (error) {
      console.error('Update category error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async deleteCategory(req: Request, res: Response): Promise<Response> {
    try {
      const categoryId = parseInt(req.params.id);
      
      if (isNaN(categoryId)) {
        return res.status(400).json({ message: 'Invalid category ID' });
      }
      
      const deletedCategory = await this.categoryService.delete(categoryId);
      
      if (!deletedCategory) {
        return res.status(400).json({ 
          message: 'Cannot delete category. It may have associated posts or not exist.' 
        });
      }
      
      return res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
      console.error('Delete category error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}