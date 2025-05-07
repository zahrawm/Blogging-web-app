
import type { Post } from '../utils/post';
import api from './api';


export const getAllPosts = () => api.get<Post[]>('/posts');
export const getPostById = (id: number) => api.get<Post>(`/posts/${id}`);
export const createPost = (data: Partial<Post>) => api.post<Post>('/posts', data);
export const updatePost = (id: number, data: Partial<Post>) => api.put<Post>(`/posts/${id}`, data);
export const deletePost = (id: number) => api.delete(`/posts/${id}`);
