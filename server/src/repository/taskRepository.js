import Task from '../models/Task.js';
import mongoose from 'mongoose';

export class TaskRepository {
  async create(taskData) {
    const task = new Task(taskData);
    return await task.save();
  }

  async findById(id) {
    return await Task.findById(id)
      .populate('createdBy', 'username email profile')
      .populate('assignedTo', 'username email profile');
  }

  async findAll(query = {}, options = {}) {
    const { 
      page = 1, 
      limit = 10, 
      sort = { createdAt: -1 },
      populate = true 
    } = options;
    const skip = (page - 1) * limit;

    let tasksQuery = Task.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    if (populate) {
      tasksQuery = tasksQuery
        .populate('createdBy', 'username email profile')
        .populate('assignedTo', 'username email profile');
    }

    const tasks = await tasksQuery;
    const total = await Task.countDocuments(query);

    return {
      tasks,
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
    return await Task.findByIdAndUpdate(id, updateData, { 
      new: true, 
      runValidators: true 
    })
    .populate('createdBy', 'username email profile')
    .populate('assignedTo', 'username email profile');
  }

  async delete(id) {
    return await Task.findByIdAndDelete(id);
  }

  async findByUser(userId, query = {}, options = {}) {
    const userQuery = {
      $or: [
        { createdBy: userId },
        { assignedTo: userId }
      ],
      ...query
    };
    
    return await this.findAll(userQuery, options);
  }

  async getTaskStats(userId = null) {
    const matchStage = userId ? 
      { $match: { $or: [{ createdBy: new mongoose.Types.ObjectId(userId) }, { assignedTo: new mongoose.Types.ObjectId(userId) }] } } :
      { $match: {} };

    const stats = await Task.aggregate([
      matchStage,
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          todo: {
            $sum: { $cond: [{ $eq: ['$status', 'todo'] }, 1, 0] }
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] }
          },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          high: {
            $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] }
          },
          medium: {
            $sum: { $cond: [{ $eq: ['$priority', 'medium'] }, 1, 0] }
          },
          low: {
            $sum: { $cond: [{ $eq: ['$priority', 'low'] }, 1, 0] }
          },
          overdue: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $lt: ['$dueDate', new Date()] },
                    { $ne: ['$status', 'completed'] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    return stats[0] || {
      total: 0,
      todo: 0,
      inProgress: 0,
      completed: 0,
      high: 0,
      medium: 0,
      low: 0,
      overdue: 0
    };
  }

  async buildQuery(filters) {
    const query = {};
    
    if (filters.status) {
      query.status = filters.status;
    }
    
    if (filters.priority) {
      query.priority = filters.priority;
    }
    
    if (filters.assignedTo) {
      query.assignedTo = filters.assignedTo;
    }
    
    if (filters.createdBy) {
      query.createdBy = filters.createdBy;
    }
    
    if (filters.dueDate) {
      if (filters.dueDate.from || filters.dueDate.to) {
        query.dueDate = {};
        if (filters.dueDate.from) {
          query.dueDate.$gte = new Date(filters.dueDate.from);
        }
        if (filters.dueDate.to) {
          query.dueDate.$lte = new Date(filters.dueDate.to);
        }
      }
    }
    
    if (filters.overdue) {
      query.dueDate = { $lt: new Date() };
      query.status = { $ne: 'completed' };
    }
    
    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } }
      ];
    }
    
    return query;
  }
}

export default new TaskRepository();