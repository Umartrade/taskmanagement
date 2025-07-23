import jwt from 'jsonwebtoken';
import userRepository from '../repository/userRepository.js';
import { AppError } from '../utils/appError.js';

export class AuthService {
  generateToken(userId) {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
  }

  async register(userData) {
    const { email, username, password, role = 'user' } = userData;

    // Check if user already exists
    const existingEmail = await userRepository.findByEmail(email);
    if (existingEmail) {
      throw new AppError('Email already registered', 400);
    }

    const existingUsername = await userRepository.findByUsername(username);
    if (existingUsername) {
      throw new AppError('Username already taken', 400);
    }

    // Create user
    const user = await userRepository.create({
      email,
      username,
      password,
      role
    });

    // Generate token
    const token = this.generateToken(user._id);

    return {
      user,
      token
    };
  }

  async login(credentials) {
    const { email, password } = credentials;

    // Find user with password
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    // Check if user is active
    if (!user.isActive) {
      throw new AppError('Account is deactivated', 401);
    }

    // Generate token
    const token = this.generateToken(user._id);

    // Remove password from response
    const userResponse = user.toJSON();

    return {
      user: userResponse,
      token
    };
  }

  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
      const user = await userRepository.findById(decoded.userId);
      
      if (!user || !user.isActive) {
        throw new AppError('Token is invalid', 401);
      }

      return user;
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new AppError('Token is invalid', 401);
      }
      if (error.name === 'TokenExpiredError') {
        throw new AppError('Token has expired', 401);
      }
      throw error;
    }
  }

  async refreshToken(oldToken) {
    const user = await this.verifyToken(oldToken);
    const newToken = this.generateToken(user._id);
    
    return {
      user,
      token: newToken
    };
  }
}

export default new AuthService();