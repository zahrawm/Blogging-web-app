
import { Post } from '../utilis/post';



let posts: Post[] = [];
let nextId = 1;

export const findAll = async (): Promise<Post[]> => {
  return [...posts];
};

/**
 * Get post by id
 * @param id Post ID
 */
export const findById = async (id: number): Promise<Post | undefined> => {
  return posts.find(todo => todo.id === id);
};

/**

 * @param post  Post data without ID
 */
export const create = async (post: Omit<Post, 'id'>): Promise<Post> => {
  const newPost: Post = {
    id: nextId++,
    ...post
  };
  
  posts.push(newPost);
  return newPost;
};

/**
 * Update a  post
 * @param id Post ID
 * @param updatedPostv Updated post data
 */
export const update = async (id: number, updatedPost: Post): Promise<Post | null> => {
  const index = posts.findIndex(post => post.id === id);
  
  if (index === -1) {
    return null;
  }
  
  posts[index] = updatedPost;
  return updatedPost;
};

/**
 * Delete a post
 * @param id  Post ID
 */
export const remove = async (id: number): Promise<boolean> => {
  const initialLength =  posts.length;
  posts = posts.filter(post => post.id !== id);
  
  return posts.length < initialLength;
};