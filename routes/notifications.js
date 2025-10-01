// Notifications Routes
const express = require('express');
const { Notification, UserNotification, User, Shop } = require('../database-setup');
const { verifyToken, requireRole } = require('./auth');

const router = express.Router();

// Get notifications for current user
router.get('/', verifyToken, async (req, res) => {
    try {
        const { page = 1, limit = 10, unreadOnly = false } = req.query;

        let filter = { userId: req.user.userId };
        
        if (unreadOnly === 'true') {
            filter.isRead = false;
        }

        const userNotifications = await UserNotification.find(filter)
            .populate('notificationId')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();

        const total = await UserNotification.countDocuments(filter);

        // Format notifications
        const notifications = userNotifications.map(un => ({
            _id: un._id,
            notification: un.notificationId,
            isRead: un.isRead,
            readAt: un.readAt,
            createdAt: un.createdAt
        }));

        res.json({
            notifications,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({ message: 'Error fetching notifications' });
    }
});

// Mark notification as read
router.patch('/:id/read', verifyToken, async (req, res) => {
    try {
        const userNotification = await UserNotification.findOne({
            _id: req.params.id,
            userId: req.user.userId
        });

        if (!userNotification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        userNotification.isRead = true;
        userNotification.readAt = new Date();
        await userNotification.save();

        res.json({ message: 'Notification marked as read' });
    } catch (error) {
        console.error('Mark notification read error:', error);
        res.status(500).json({ message: 'Error updating notification' });
    }
});

// Mark all notifications as read
router.patch('/mark-all-read', verifyToken, async (req, res) => {
    try {
        await UserNotification.updateMany(
            { userId: req.user.userId, isRead: false },
            { isRead: true, readAt: new Date() }
        );

        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        console.error('Mark all notifications read error:', error);
        res.status(500).json({ message: 'Error updating notifications' });
    }
});

// Delete notification
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const userNotification = await UserNotification.findOne({
            _id: req.params.id,
            userId: req.user.userId
        });

        if (!userNotification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        await UserNotification.findByIdAndDelete(userNotification._id);

        res.json({ message: 'Notification deleted' });
    } catch (error) {
        console.error('Delete notification error:', error);
        res.status(500).json({ message: 'Error deleting notification' });
    }
});

// Get unread notification count
router.get('/unread-count', verifyToken, async (req, res) => {
    try {
        const count = await UserNotification.countDocuments({
            userId: req.user.userId,
            isRead: false
        });

        res.json({ unreadCount: count });
    } catch (error) {
        console.error('Get unread count error:', error);
        res.status(500).json({ message: 'Error fetching unread count' });
    }
});

// ========== SUPER ADMIN ROUTES ==========

// Get all system notifications (Super Admin only)
router.get('/system/all', verifyToken, requireRole(['superadmin']), async (req, res) => {
    try {
        const { page = 1, limit = 10, type, isActive } = req.query;

        let filter = {};

        if (type && type !== 'all') {
            filter.type = type;
        }

        if (isActive !== undefined) {
            filter.isActive = isActive === 'true';
        }

        const notifications = await Notification.find(filter)
            .populate('createdBy', 'firstName lastName email')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();

        const total = await Notification.countDocuments(filter);

        res.json({
            notifications,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error('Get system notifications error:', error);
        res.status(500).json({ message: 'Error fetching system notifications' });
    }
});

// Create system notification (Super Admin only)
router.post('/system', verifyToken, requireRole(['superadmin']), async (req, res) => {
    try {
        const {
            title,
            message,
            type,
            targetShops,
            priority,
            expiresAt
        } = req.body;

        // Validate required fields
        if (!title || !message || !type) {
            return res.status(400).json({ 
                message: 'Title, message, and type are required' 
            });
        }

        // Create notification
        const notification = new Notification({
            notificationId: `NOTIF${Date.now()}`,
            title,
            message,
            type,
            targetShops: targetShops || [], // Empty array means all shops
            priority: priority || 'medium',
            expiresAt: expiresAt ? new Date(expiresAt) : null,
            createdBy: req.user.userId,
            isActive: true
        });

        await notification.save();

        // Create user notifications for target shops
        let targetUsers = [];
        
        if (targetShops && targetShops.length > 0) {
            // Specific shops
            targetUsers = await User.find({ 
                shopId: { $in: targetShops },
                isActive: true 
            });
        } else {
            // All shops
            targetUsers = await User.find({ 
                role: { $in: ['shop_admin', 'shop_user'] },
                isActive: true 
            });
        }

        // Create user notification entries
        const userNotifications = targetUsers.map(user => ({
            userId: user._id,
            notificationId: notification._id,
            isRead: false
        }));

        if (userNotifications.length > 0) {
            await UserNotification.insertMany(userNotifications);
        }

        // Populate notification for response
        const populatedNotification = await Notification.findById(notification._id)
            .populate('createdBy', 'firstName lastName email');

        res.status(201).json({
            message: 'System notification created successfully',
            notification: populatedNotification,
            sentTo: userNotifications.length
        });
    } catch (error) {
        console.error('Create system notification error:', error);
        res.status(500).json({ message: 'Error creating system notification' });
    }
});

// Update system notification (Super Admin only)
router.put('/system/:id', verifyToken, requireRole(['superadmin']), async (req, res) => {
    try {
        const {
            title,
            message,
            type,
            targetShops,
            priority,
            isActive,
            expiresAt
        } = req.body;

        const notification = await Notification.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        // Update fields
        if (title) notification.title = title;
        if (message) notification.message = message;
        if (type) notification.type = type;
        if (targetShops) notification.targetShops = targetShops;
        if (priority) notification.priority = priority;
        if (isActive !== undefined) notification.isActive = isActive;
        if (expiresAt) notification.expiresAt = new Date(expiresAt);

        notification.updatedAt = new Date();
        await notification.save();

        res.json({
            message: 'System notification updated successfully',
            notification
        });
    } catch (error) {
        console.error('Update system notification error:', error);
        res.status(500).json({ message: 'Error updating system notification' });
    }
});

// Deactivate system notification (Super Admin only)
router.patch('/system/:id/deactivate', verifyToken, requireRole(['superadmin']), async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        notification.isActive = false;
        notification.updatedAt = new Date();
        await notification.save();

        res.json({ message: 'System notification deactivated successfully' });
    } catch (error) {
        console.error('Deactivate system notification error:', error);
        res.status(500).json({ message: 'Error deactivating system notification' });
    }
});

// Delete system notification (Super Admin only)
router.delete('/system/:id', verifyToken, requireRole(['superadmin']), async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        // Delete associated user notifications
        await UserNotification.deleteMany({ notificationId: notification._id });

        // Delete the notification
        await Notification.findByIdAndDelete(notification._id);

        res.json({ message: 'System notification deleted successfully' });
    } catch (error) {
        console.error('Delete system notification error:', error);
        res.status(500).json({ message: 'Error deleting system notification' });
    }
});

// Get notification types
router.get('/types/list', verifyToken, requireRole(['superadmin']), async (req, res) => {
    try {
        const types = ['maintenance', 'update', 'warning', 'info', 'urgent'];
        const priorities = ['low', 'medium', 'high', 'urgent'];

        res.json({ types, priorities });
    } catch (error) {
        console.error('Get notification types error:', error);
        res.status(500).json({ message: 'Error fetching notification types' });
    }
});

module.exports = router;
