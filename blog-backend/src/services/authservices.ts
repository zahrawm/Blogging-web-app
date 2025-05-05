
import { User } from '../utilis/users';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


let users: User[] = [];
let nextUserId = 1;


const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const TOKEN_EXPIRY = '24h';

/**
 * Register a new user
 * @param username Username
 * @param email Email address
 * @param password Plain text password (will be hashed)
 */
export const register = async (
  username: string,
  email: string,
  password: string
): Promise<Omit<User, 'password'> | null> => {
  // Check if user already exists
  const existingUser = users.find(
    (u) => u.username === username || u.email === email
  );
  
  if (existingUser) {
    return null;
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  
  const now = new Date();
  const newUser: User = {
    id: nextUserId++,
    username,
    email,
    password: hashedPassword,
    createdAt: now,
    updatedAt: now
  };
  
  users.push(newUser);
  
  // Don't return the password
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

/**
 * Login user and generate JWT token
 * @param email User email
 * @param password User plain text password
 */
export const login = async (
  email: string,
  password: string
): Promise<{ token: string; user: Omit<User, 'password'> } | null> => {
  // Find user by email
  const user = users.find((u) => u.email === email);
  if (!user) {
    return null;
  }
  
  // Verify password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return null;
  }
  
  // Generate JWT token
  const payload = {
    userId: user.id,
    username: user.username,
    email: user.email
  };
  
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
  
  // Don't return the password
  const { password: _, ...userWithoutPassword } = user;
  
  return {
    token,
    user: userWithoutPassword
  };
};

/**
 * Get user by ID
 * @param id User ID
 */
export const getUserById = async (id: number): Promise<Omit<User, 'password'> | null> => {
  const user = users.find((u) => u.id === id);
  
  if (!user) {
    return null;
  }
  
  // Don't return the password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

/**
 * Verify JWT token
 * @param token JWT token
 */
export const verifyToken = (token: string): { userId: number } | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    return decoded;
  } catch (error) {
    return null;
  }
};