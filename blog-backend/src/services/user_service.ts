
import { PrismaClient } from '@prisma/client';
import { User } from '../utilis/users';

const prisma = new PrismaClient();

export class UserService {
  updatePassword(userId: any, hashedPassword: string) {
    throw new Error('Method not implemented.');
  }
  async findById(id: number): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id }
    }) as unknown as User;
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email }
    }) as unknown as User;
  }

  async findByUsername(username: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { username }
    }) as unknown as User;
  }

  async findByEmailOrUsername(email: string, username: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    }) as unknown as User;
  }

  async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'lastLogin'>): Promise<User> {
    return prisma.user.create({
      data: userData
    }) as unknown as User;
  }

  async update(id: number, userData: Partial<Omit<User, 'id' | 'createdAt' | 'password'>>): Promise<User | null> {
    return prisma.user.update({
      where: { id },
      data: userData
    }) as unknown as User;
  }

  async updateLastLogin(id: number): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: {
        lastLogin: new Date()
      }
    });
  }

  async changePassword(id: number, hashedPassword: string): Promise<User | null> {
    return prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
        updatedAt: new Date()
      }
    }) as unknown as User;
  }

  async delete(id: number): Promise<User | null> {
    return prisma.user.delete({
      where: { id }
    }) as unknown as User;
  }

  async findAll(skip = 0, take = 10): Promise<{ users: Omit<User, 'password'>[]; total: number }> {
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take,
        select: {
          id: true,
          username: true,
          email: true,
          fullName: true,
          avatar: true,
          bio: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          lastLogin: true,
         
        }
      }),
      prisma.user.count()
    ]);

    return {
      users: users as unknown as Omit<User, 'password'>[],
      total
    };
  }
}