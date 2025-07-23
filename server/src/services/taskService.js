import taskRepository from '../repository/taskRepository.js';
import userRepository from '../repository/userRepository.js';
import notificationService from './notificationService.js';
import { AppError } from '../utils/appError.js';

export class TaskService {
  async createTask(taskData, userId) {
    const taskToCreate = {
      ...taskData,
      createdBy: userId
    };

    const task = await taskRepository.create(taskToCreate);
    
    // Update user stats
    await userRepository.updateStats(userId, { 'stats.tasksCreated': 1 });

    // If task is assigned to someone else, send notification
    if (taskData.assignedTo && taskData.assignedTo !== userId.toString()) {
      await notificationService.createNotification({
        recipient: taskData.assignedTo,
        sender: userId,
        type: 'task_assigned',
        title: 'New Task Assigned',
        message: `You have been assigned a new task: "${task.title}"`,
        relatedTask: task._id
      });
    }

    return await taskRepository.findById(task._id);
  }

  async getTasks(filters, options, userId, userRole) {
    let query = {};

    // If not admin, only show tasks user created or is assigned to
    if (userRole !== 'admin') {
      query.$or = [
        { createdBy: userId },
        { assignedTo: userId }
      ];
    }

    // Apply filters
    const filterQuery = await taskRepository.buildQuery(filters);
    query = { ...query, ...filterQuery };

    return await taskRepository.findAll(query, options);
  }

  async getTaskById(taskId, userId, userRole) {
    const task = await taskRepository.findById(taskId);
    
    if (!task) {
      throw new AppError('Task not found', 404);
    }

    // Check permissions
    if (userRole !== 'admin' && 
        task.createdBy._id.toString() !== userId.toString() && 
        (!task.assignedTo || task.assignedTo._id.toString() !== userId.toString())) {
      throw new AppError('Access denied', 403);
    }

    return task;
  }

  async updateTask(taskId, updateData, userId, userRole) {
    const task = await taskRepository.findById(taskId);
    
    if (!task) {
      throw new AppError('Task not found', 404);
    }

    // Check permissions
    if (userRole !== 'admin' && 
        task.createdBy._id.toString() !== userId.toString() && 
        (!task.assignedTo || task.assignedTo._id.toString() !== userId.toString())) {
      throw new AppError('Access denied', 403);
    }

    const oldStatus = task.status;
    const oldAssignedTo = task.assignedTo?._id?.toString();

    const updatedTask = await taskRepository.update(taskId, updateData);

    // Handle status change notifications and stats
    if (oldStatus !== updateData.status) {
      if (updateData.status === 'completed') {
        // Update stats for task creator
        await userRepository.updateStats(task.createdBy._id, { 'stats.tasksCompleted': 1 });
        
        // Send notification to creator if someone else completed it
        if (userId.toString() !== task.createdBy._id.toString()) {
          await notificationService.createNotification({
            recipient: task.createdBy._id,
            sender: userId,
            type: 'task_completed',
            title: 'Task Completed',
            message: `Task "${task.title}" has been marked as completed`,
            relatedTask: taskId
          });
        }
      }

      // Notify assigned user about status change
      if (task.assignedTo && userId.toString() !== task.assignedTo._id.toString()) {
        await notificationService.createNotification({
          recipient: task.assignedTo._id,
          sender: userId,
          type: 'task_updated',
          title: 'Task Status Updated',
          message: `Task "${task.title}" status changed to ${updateData.status}`,
          relatedTask: taskId
        });
      }
    }

    // Handle assignment change
    if (updateData.assignedTo && updateData.assignedTo !== oldAssignedTo) {
      await notificationService.createNotification({
        recipient: updateData.assignedTo,
        sender: userId,
        type: 'task_assigned',
        title: 'Task Assigned',
        message: `You have been assigned to task: "${task.title}"`,
        relatedTask: taskId
      });
    }

    return updatedTask;
  }

  async deleteTask(taskId, userId, userRole) {
    const task = await taskRepository.findById(taskId);
    
    if (!task) {
      throw new AppError('Task not found', 404);
    }

    // Check permissions (only creator or admin can delete)
    if (userRole !== 'admin' && task.createdBy._id.toString() !== userId.toString()) {
      throw new AppError('Access denied', 403);
    }

    await taskRepository.delete(taskId);
    
    // Update creator stats
    const statsUpdate = { 'stats.tasksCreated': -1 };
    if (task.status === 'completed') {
      statsUpdate['stats.tasksCompleted'] = -1;
    }
    await userRepository.updateStats(task.createdBy._id, statsUpdate);

    return { message: 'Task deleted successfully' };
  }

  async getTaskStats(userId, userRole) {
    if (userRole === 'admin') {
      return await taskRepository.getTaskStats();
    }
    return await taskRepository.getTaskStats(userId);
  }

  async assignTask(taskId, assignedToId, userId, userRole) {
    const task = await taskRepository.findById(taskId);
    
    if (!task) {
      throw new AppError('Task not found', 404);
    }

    // Check permissions
    if (userRole !== 'admin' && task.createdBy._id.toString() !== userId.toString()) {
      throw new AppError('Access denied', 403);
    }

    // Check if assignee exists
    const assignee = await userRepository.findById(assignedToId);
    if (!assignee) {
      throw new AppError('User to assign not found', 404);
    }

    const updatedTask = await taskRepository.update(taskId, { assignedTo: assignedToId });

    // Send notification
    await notificationService.createNotification({
      recipient: assignedToId,
      sender: userId,
      type: 'task_assigned',
      title: 'Task Assigned',
      message: `You have been assigned to task: "${task.title}"`,
      relatedTask: taskId
    });

    return updatedTask;
  }
}

export default new TaskService();