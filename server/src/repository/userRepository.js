import User from '../models/User.js';

export class UserRepository {
  async create(userData) {
    const user = new User(userData);
    return await user.save();
  }

  async findById(id) {
    return await User.findById(id).select('-password');
  }

  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async findByUsername(username) {
    return await User.findOne({ username });
  }

  async findAll(query = {}, options = {}) {
    const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;
    const skip = (page - 1) * limit;

    const users = await User.find(query)
      .select('-password')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    return {
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    };
  }

  async update(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, { 
      new: true, 
      runValidators: true 
    }).select('-password');
  }

  async delete(id) {
    return await User.findByIdAndDelete(id);
  }

  async updateStats(userId, statsUpdate) {
    return await User.findByIdAndUpdate(
      userId,
      { $inc: statsUpdate },
      { new: true }
    ).select('-password');
  }

  async getLeaderboard(limit = 10) {
    return await User.aggregate([
      {
        $match: { isActive: true }
      },
      {
        $addFields: {
          completionRate: {
            $cond: {
              if: { $eq: ['$stats.tasksCreated', 0] },
              then: 0,
              else: {
                $multiply: [
                  { $divide: ['$stats.tasksCompleted', '$stats.tasksCreated'] },
                  100
                ]
              }
            }
          }
        }
      },
      {
        $sort: {
          'stats.tasksCompleted': -1,
          completionRate: -1,
          'stats.tasksCreated': -1
        }
      },
      {
        $limit: limit
      },
      {
        $project: {
          password: 0
        }
      }
    ]);
  }
}

export default new UserRepository();