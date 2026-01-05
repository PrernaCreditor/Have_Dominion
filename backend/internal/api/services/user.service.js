const User = require('../../database/models/User');
const { AppError } = require('../../common/error-handler');
const { logger } = require('../../common/logger');

class UserService {
  async getUserById(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new AppError('User not found', 404, 'USER_NOT_FOUND');
      }
      return user.toJSON();
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Get user error', { error: error.message });
      throw new AppError('Failed to fetch user', 500, 'FETCH_ERROR');
    }
  }

  async updateUser(userId, updateData) {
    try {
      const user = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
        runValidators: true,
      });

      if (!user) {
        throw new AppError('User not found', 404, 'USER_NOT_FOUND');
      }

      logger.info('User updated', { userId });
      return user.toJSON();
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Update user error', { error: error.message });
      throw new AppError('Failed to update user', 500, 'UPDATE_ERROR');
    }
  }

  async deleteUser(userId) {
    try {
      const user = await User.findByIdAndDelete(userId);
      if (!user) {
        throw new AppError('User not found', 404, 'USER_NOT_FOUND');
      }

      logger.info('User deleted', { userId });
      return { message: 'User deleted successfully' };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Delete user error', { error: error.message });
      throw new AppError('Failed to delete user', 500, 'DELETE_ERROR');
    }
  }

  async getUserProfile(userId) {
    try {
      const user = await User.findById(userId).select('-password');
      if (!user) {
        throw new AppError('User not found', 404, 'USER_NOT_FOUND');
      }
      return user;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Get profile error', { error: error.message });
      throw new AppError('Failed to fetch profile', 500, 'FETCH_ERROR');
    }
  }
}

module.exports = new UserService();