import Notification from '../models/Notification.js';

export class NotificationRepository {
  async create(notificationData) {
    const notification = new Notification(notificationData);
    return await notification.save();
  }

  async findById(id) {
    return await Notification.findById(id)
      .populate('sender', 'username profile')
      .populate('recipient', 'username profile')
      .populate('relatedTask', 'title status');
  }

  async findByUser(userId, options = {}) {
    const { page = 1, limit = 20, unreadOnly = false } = options;
    const skip = (page - 1) * limit;

    const query = { recipient: userId };
    if (unreadOnly) {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .populate('sender', 'username profile')
      .populate('relatedTask', 'title status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Notification.countDocuments(query);

    return {
      notifications,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    };
  }

  async markAsRead(id, userId) {
    return await Notification.findOneAndUpdate(
      { _id: id, recipient: userId },
      { isRead: true, readAt: new Date() },
      { new: true }
    );
  }

  async markAllAsRead(userId) {
    return await Notification.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );
  }

  async getUnreadCount(userId) {
    return await Notification.countDocuments({
      recipient: userId,
      isRead: false
    });
  }

  async delete(id, userId) {
    return await Notification.findOneAndDelete({
      _id: id,
      recipient: userId
    });
  }
}

export default new NotificationRepository();