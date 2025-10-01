// Shops Routes (Super Admin only)
const express = require('express');
const { Shop, User } = require('../database-setup');
const { verifyToken, requireRole } = require('./auth');

const router = express.Router();

// Get all shops (Super Admin only)
router.get('/', verifyToken, requireRole(['superadmin']), async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            status, 
            search, 
            sortBy = 'createdAt', 
            sortOrder = 'desc' 
        } = req.query;
        
        // Build filter object
        const filter = {};
        
        if (status && status !== 'all') {
            filter.status = status;
        }
        
        if (search) {
            filter.$or = [
                { shopName: { $regex: search, $options: 'i' } },
                { shopCode: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { ownerName: { $regex: search, $options: 'i' } }
            ];
        }

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const shops = await Shop.find(filter)
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();

        // Get user counts for each shop
        const shopsWithStats = await Promise.all(
            shops.map(async (shop) => {
                const userCount = await User.countDocuments({ shopId: shop._id });
                return {
                    ...shop,
                    userCount
                };
            })
        );

        const total = await Shop.countDocuments(filter);

        res.json({
            shops: shopsWithStats,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error('Get shops error:', error);
        res.status(500).json({ message: 'Error fetching shops' });
    }
});

// Get shop by ID
router.get('/:id', verifyToken, requireRole(['superadmin']), async (req, res) => {
    try {
        const shop = await Shop.findById(req.params.id);

        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        // Get shop users
        const users = await User.find({ shopId: shop._id }).select('-password');

        res.json({ 
            shop,
            users 
        });
    } catch (error) {
        console.error('Get shop error:', error);
        res.status(500).json({ message: 'Error fetching shop' });
    }
});

// Create new shop
router.post('/', verifyToken, requireRole(['superadmin']), async (req, res) => {
    try {
        const {
            shopName,
            shopCode,
            email,
            phone,
            address,
            ownerName,
            subscriptionPlan
        } = req.body;

        // Check if shop code or email already exists
        const existingShop = await Shop.findOne({
            $or: [
                { shopCode },
                { email }
            ]
        });

        if (existingShop) {
            return res.status(400).json({ 
                message: 'Shop with this code or email already exists' 
            });
        }

        const shop = new Shop({
            shopId: `SHOP${Date.now()}`,
            shopName,
            shopCode,
            email,
            phone,
            address: {
                street: address.street || '',
                city: address.city || '',
                state: address.state || '',
                zipCode: address.zipCode || '',
                country: address.country || 'USA'
            },
            ownerName,
            subscriptionPlan: subscriptionPlan || 'basic',
            status: 'active'
        });

        await shop.save();

        res.status(201).json({
            message: 'Shop created successfully',
            shop
        });
    } catch (error) {
        console.error('Create shop error:', error);
        res.status(500).json({ message: 'Error creating shop' });
    }
});

// Update shop
router.put('/:id', verifyToken, requireRole(['superadmin']), async (req, res) => {
    try {
        const shop = await Shop.findById(req.params.id);

        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        const {
            shopName,
            shopCode,
            email,
            phone,
            address,
            ownerName,
            status,
            subscriptionPlan,
            subscriptionExpiry,
            settings
        } = req.body;

        // Check if shop code or email is being changed and already exists
        if (shopCode && shopCode !== shop.shopCode) {
            const existingShop = await Shop.findOne({
                shopCode,
                _id: { $ne: shop._id }
            });
            if (existingShop) {
                return res.status(400).json({ message: 'Shop with this code already exists' });
            }
            shop.shopCode = shopCode;
        }

        if (email && email !== shop.email) {
            const existingShop = await Shop.findOne({
                email,
                _id: { $ne: shop._id }
            });
            if (existingShop) {
                return res.status(400).json({ message: 'Shop with this email already exists' });
            }
            shop.email = email;
        }

        // Update fields
        if (shopName) shop.shopName = shopName;
        if (phone) shop.phone = phone;
        if (ownerName) shop.ownerName = ownerName;
        if (status) shop.status = status;
        if (subscriptionPlan) shop.subscriptionPlan = subscriptionPlan;
        if (subscriptionExpiry) shop.subscriptionExpiry = new Date(subscriptionExpiry);

        // Update address
        if (address) {
            shop.address = {
                ...shop.address,
                ...address
            };
        }

        // Update settings
        if (settings) {
            shop.settings = {
                ...shop.settings,
                ...settings
            };
        }

        shop.updatedAt = new Date();
        await shop.save();

        res.json({
            message: 'Shop updated successfully',
            shop
        });
    } catch (error) {
        console.error('Update shop error:', error);
        res.status(500).json({ message: 'Error updating shop' });
    }
});

// Block/Unblock shop
router.patch('/:id/status', verifyToken, requireRole(['superadmin']), async (req, res) => {
    try {
        const { status } = req.body;

        if (!['active', 'blocked', 'suspended'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const shop = await Shop.findById(req.params.id);
        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        shop.status = status;
        shop.updatedAt = new Date();
        await shop.save();

        // Update all users in this shop if blocking
        if (status === 'blocked' || status === 'suspended') {
            await User.updateMany(
                { shopId: shop._id },
                { isActive: false, updatedAt: new Date() }
            );
        } else if (status === 'active') {
            await User.updateMany(
                { shopId: shop._id },
                { isActive: true, updatedAt: new Date() }
            );
        }

        res.json({
            message: `Shop ${status} successfully`,
            shop
        });
    } catch (error) {
        console.error('Update shop status error:', error);
        res.status(500).json({ message: 'Error updating shop status' });
    }
});

// Delete shop
router.delete('/:id', verifyToken, requireRole(['superadmin']), async (req, res) => {
    try {
        const shop = await Shop.findById(req.params.id);

        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        // Check if shop has users
        const userCount = await User.countDocuments({ shopId: shop._id });
        if (userCount > 0) {
            return res.status(400).json({ 
                message: 'Cannot delete shop with existing users. Please remove users first.' 
            });
        }

        await Shop.findByIdAndDelete(shop._id);

        res.json({ message: 'Shop deleted successfully' });
    } catch (error) {
        console.error('Delete shop error:', error);
        res.status(500).json({ message: 'Error deleting shop' });
    }
});

// Get shop statistics
router.get('/:id/stats', verifyToken, requireRole(['superadmin']), async (req, res) => {
    try {
        const shop = await Shop.findById(req.params.id);
        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        // Get shop statistics
        const userCount = await User.countDocuments({ shopId: shop._id });
        const activeUsers = await User.countDocuments({ shopId: shop._id, isActive: true });

        // Get recent activity (you can expand this based on your needs)
        const recentUsers = await User.find({ shopId: shop._id })
            .sort({ lastLogin: -1 })
            .limit(5)
            .select('firstName lastName email lastLogin role');

        res.json({
            shop: {
                _id: shop._id,
                shopName: shop.shopName,
                shopCode: shop.shopCode,
                status: shop.status,
                subscriptionPlan: shop.subscriptionPlan,
                createdAt: shop.createdAt
            },
            stats: {
                totalUsers: userCount,
                activeUsers,
                inactiveUsers: userCount - activeUsers
            },
            recentUsers
        });
    } catch (error) {
        console.error('Get shop stats error:', error);
        res.status(500).json({ message: 'Error fetching shop statistics' });
    }
});

// Search shops
router.get('/search/:query', verifyToken, requireRole(['superadmin']), async (req, res) => {
    try {
        const { query } = req.params;
        
        const shops = await Shop.find({
            $or: [
                { shopName: { $regex: query, $options: 'i' } },
                { shopCode: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } },
                { ownerName: { $regex: query, $options: 'i' } }
            ]
        }).limit(10);

        res.json({ shops });
    } catch (error) {
        console.error('Search shops error:', error);
        res.status(500).json({ message: 'Error searching shops' });
    }
});

module.exports = router;
