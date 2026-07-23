import { User } from '../models/User';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/generateToken';

export class AuthService {
  static async register(email: string, password: string) {
    // Check for duplicate email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error('Email already registered');
      (error as any).status = 409;
      throw error;
    }

    // Create user
    const user = await User.create({ email, password });
    
    // Do not return password
    const userResponse = {
      id: user._id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return userResponse;
  }

  static async login(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error('Invalid credentials');
      (error as any).status = 401;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error('Invalid credentials');
      (error as any).status = 401;
      throw error;
    }

    const token = generateToken(user._id.toString(), user.email);

    const userResponse = {
      id: user._id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return { token, user: userResponse };
  }
}
