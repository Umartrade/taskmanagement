import userRepository from '../repository/userRepository.js';
import { AppError } from '../utils/appError.js';

export class UserService {
  async getUsers(query = {}, options = {}) {
    return await userRepository.findAll(query, options);
  }

  async getUserById(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  async updateUser(userId, updateData, requesterId, requesterRole) {
    // Check permissions
    if (requesterRole !== 'admin' && userId !== requesterId.toString()) {
      throw new AppError('Access denied', 403);
    }

    // Don't allow changing role unless admin
    if (updateData.role && requesterRole !== 'admin') {
      delete updateData.role;
    }

    const user = await userRepository.update(userId, updateData);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  async deleteUser(userId, requesterId, requesterRole) {
    // Check permissions
    if (requesterRole !== 'admin' && userId !== requesterId.toString()) {
      throw new AppError('Access denied', 403);
    }

    const user = await userRepository.delete(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    return { message: 'User deleted successfully' };
  }

  async getLeaderboard(limit = 10) {
    return await userRepository.getLeaderboard(limit);
  }

  async updateProfile(userId, profileData) {
    const updateData = { profile: profileData };
    return await userRepository.update(userId, updateData);
  }

  async getUserStats(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    return {
      tasksCreated: user.stats.tasksCreated,
      tasksCompleted: user.stats.tasksCompleted,
      tasksAssigned: user.stats.tasksAssigned,
      completionRate: user.completionRate
    };
  }
}

export default new UserService();