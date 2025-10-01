// Customers Routes
const express = require('express');
const { Customer } = require('../database-setup');
const { verifyToken, requireRole } = require('./auth');

const router = express.Router();

// Get all customers for a shop
router.get('/', verifyToken, async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            search, 
            customerType, 
            sortBy = 'createdAt', 
            sortOrder = 'desc' 
        } = req.query;
        
        // Build filter object
        const filter = { shopId: req.user.shopId };
        
        if (customerType && customerType !== 'all') {
            filter.customerType = customerType;
        }
        
        if (search) {
            filter.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } }
            ];
        }

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const customers = await Customer.find(filter)
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();

        const total = await Customer.countDocuments(filter);

        res.json({
            customers,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error('Get customers error:', error);
        res.status(500).json({ message: 'Error fetching customers' });
    }
});

// Get customer by ID
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const customer = await Customer.findOne({ 
            _id: req.params.id, 
            shopId: req.user.shopId 
        });

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.json({ customer });
    } catch (error) {
        console.error('Get customer error:', error);
        res.status(500).json({ message: 'Error fetching customer' });
    }
});

// Create new customer
router.post('/', verifyToken, requireRole(['shop_admin', 'shop_user']), async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            street,
            city,
            state,
            zipCode,
            country,
            dateOfBirth,
            gender,
            customerType,
            preferences,
            notes
        } = req.body;

        // Check if customer with email or phone already exists
        const existingCustomer = await Customer.findOne({
            $or: [
                { email, shopId: req.user.shopId },
                { phone, shopId: req.user.shopId }
            ]
        });

        if (existingCustomer) {
            return res.status(400).json({ 
                message: 'Customer with this email or phone number already exists' 
            });
        }

        const customer = new Customer({
            customerId: `CUST${Date.now()}`,
            firstName,
            lastName,
            email,
            phone,
            address: {
                street: street || '',
                city: city || '',
                state: state || '',
                zipCode: zipCode || '',
                country: country || 'USA'
            },
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
            gender,
            customerType: customerType || 'Regular',
            preferences: preferences || {
                preferredCategories: [],
                sizePreference: '',
                colorPreference: ''
            },
            notes: notes || '',
            shopId: req.user.shopId
        });

        await customer.save();

        res.status(201).json({
            message: 'Customer created successfully',
            customer
        });
    } catch (error) {
        console.error('Create customer error:', error);
        res.status(500).json({ message: 'Error creating customer' });
    }
});

// Update customer
router.put('/:id', verifyToken, requireRole(['shop_admin', 'shop_user']), async (req, res) => {
    try {
        const customer = await Customer.findOne({ 
            _id: req.params.id, 
            shopId: req.user.shopId 
        });

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const {
            firstName,
            lastName,
            email,
            phone,
            street,
            city,
            state,
            zipCode,
            country,
            dateOfBirth,
            gender,
            customerType,
            preferences,
            notes,
            isActive
        } = req.body;

        // Check if email or phone is being changed and already exists
        if (email && email !== customer.email) {
            const existingCustomer = await Customer.findOne({
                email,
                shopId: req.user.shopId,
                _id: { $ne: customer._id }
            });
            if (existingCustomer) {
                return res.status(400).json({ message: 'Customer with this email already exists' });
            }
        }

        if (phone && phone !== customer.phone) {
            const existingCustomer = await Customer.findOne({
                phone,
                shopId: req.user.shopId,
                _id: { $ne: customer._id }
            });
            if (existingCustomer) {
                return res.status(400).json({ message: 'Customer with this phone number already exists' });
            }
        }

        // Update basic fields
        if (firstName) customer.firstName = firstName;
        if (lastName) customer.lastName = lastName;
        if (email) customer.email = email;
        if (phone) customer.phone = phone;
        if (dateOfBirth) customer.dateOfBirth = new Date(dateOfBirth);
        if (gender) customer.gender = gender;
        if (customerType) customer.customerType = customerType;
        if (notes !== undefined) customer.notes = notes;
        if (isActive !== undefined) customer.isActive = isActive;

        // Update address
        if (street !== undefined) customer.address.street = street;
        if (city !== undefined) customer.address.city = city;
        if (state !== undefined) customer.address.state = state;
        if (zipCode !== undefined) customer.address.zipCode = zipCode;
        if (country !== undefined) customer.address.country = country;

        // Update preferences
        if (preferences) {
            customer.preferences = {
                ...customer.preferences,
                ...preferences
            };
        }

        customer.updatedAt = new Date();
        await customer.save();

        res.json({
            message: 'Customer updated successfully',
            customer
        });
    } catch (error) {
        console.error('Update customer error:', error);
        res.status(500).json({ message: 'Error updating customer' });
    }
});

// Delete customer
router.delete('/:id', verifyToken, requireRole(['shop_admin']), async (req, res) => {
    try {
        const customer = await Customer.findOne({ 
            _id: req.params.id, 
            shopId: req.user.shopId 
        });

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Check if customer has transactions
        const { Transaction } = require('../database-setup');
        const transactionCount = await Transaction.countDocuments({ 
            customerId: customer._id 
        });

        if (transactionCount > 0) {
            // Soft delete - just mark as inactive
            customer.isActive = false;
            customer.updatedAt = new Date();
            await customer.save();
            
            return res.json({ 
                message: 'Customer deactivated successfully (has transaction history)' 
            });
        } else {
            // Hard delete if no transactions
            await Customer.findByIdAndDelete(customer._id);
            return res.json({ message: 'Customer deleted successfully' });
        }
    } catch (error) {
        console.error('Delete customer error:', error);
        res.status(500).json({ message: 'Error deleting customer' });
    }
});

// Get customer statistics
router.get('/:id/stats', verifyToken, async (req, res) => {
    try {
        const customer = await Customer.findOne({ 
            _id: req.params.id, 
            shopId: req.user.shopId 
        });

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const { Transaction } = require('../database-setup');
        
        // Get customer's transactions
        const transactions = await Transaction.find({ 
            customerId: customer._id,
            shopId: req.user.shopId 
        }).sort({ transactionDate: -1 });

        // Calculate statistics
        const totalSpent = transactions.reduce((sum, t) => sum + t.totals.finalTotal, 0);
        const totalTransactions = transactions.length;
        const averageOrderValue = totalTransactions > 0 ? totalSpent / totalTransactions : 0;
        
        // Get last purchase date
        const lastPurchaseDate = transactions.length > 0 ? transactions[0].transactionDate : null;

        // Calculate days since last purchase
        const daysSinceLastPurchase = lastPurchaseDate 
            ? Math.floor((new Date() - new Date(lastPurchaseDate)) / (1000 * 60 * 60 * 24))
            : null;

        // Get monthly spending for last 12 months
        const monthlySpending = [];
        const currentDate = new Date();
        
        for (let i = 11; i >= 0; i--) {
            const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 0);
            
            const monthTransactions = transactions.filter(t => {
                const transactionDate = new Date(t.transactionDate);
                return transactionDate >= monthStart && transactionDate <= monthEnd;
            });
            
            const monthTotal = monthTransactions.reduce((sum, t) => sum + t.totals.finalTotal, 0);
            
            monthlySpending.push({
                month: monthStart.toISOString().substring(0, 7),
                total: monthTotal,
                transactions: monthTransactions.length
            });
        }

        res.json({
            customer: {
                _id: customer._id,
                customerId: customer.customerId,
                firstName: customer.firstName,
                lastName: customer.lastName,
                email: customer.email,
                phone: customer.phone,
                customerType: customer.customerType
            },
            stats: {
                totalSpent,
                totalTransactions,
                averageOrderValue,
                lastPurchaseDate,
                daysSinceLastPurchase,
                monthlySpending
            },
            recentTransactions: transactions.slice(0, 5)
        });
    } catch (error) {
        console.error('Get customer stats error:', error);
        res.status(500).json({ message: 'Error fetching customer statistics' });
    }
});

// Search customers by phone or email
router.get('/search/:query', verifyToken, async (req, res) => {
    try {
        const { query } = req.params;
        
        const customers = await Customer.find({
            shopId: req.user.shopId,
            isActive: true,
            $or: [
                { phone: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } },
                { firstName: { $regex: query, $options: 'i' } },
                { lastName: { $regex: query, $options: 'i' } }
            ]
        }).limit(10).select('firstName lastName email phone customerType totalSpent');

        res.json({ customers });
    } catch (error) {
        console.error('Search customers error:', error);
        res.status(500).json({ message: 'Error searching customers' });
    }
});

// Get customer types
router.get('/types/list', verifyToken, async (req, res) => {
    try {
        const customerTypes = await Customer.distinct('customerType', { 
            shopId: req.user.shopId, 
            isActive: true 
        });

        res.json({ customerTypes });
    } catch (error) {
        console.error('Get customer types error:', error);
        res.status(500).json({ message: 'Error fetching customer types' });
    }
});

// Update customer total spent (called after transactions)
router.patch('/:id/update-totals', verifyToken, async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const { Transaction } = require('../database-setup');
        const transactions = await Transaction.find({ 
            customerId: customer._id,
            shopId: req.user.shopId 
        });

        const totalSpent = transactions.reduce((sum, t) => sum + t.totals.finalTotal, 0);
        const totalOrders = transactions.length;
        const lastPurchaseDate = transactions.length > 0 
            ? transactions.sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate))[0].transactionDate
            : null;

        customer.totalSpent = totalSpent;
        customer.totalOrders = totalOrders;
        customer.lastPurchaseDate = lastPurchaseDate;
        customer.updatedAt = new Date();

        await customer.save();

        res.json({
            message: 'Customer totals updated successfully',
            customer: {
                _id: customer._id,
                totalSpent: customer.totalSpent,
                totalOrders: customer.totalOrders,
                lastPurchaseDate: customer.lastPurchaseDate
            }
        });
    } catch (error) {
        console.error('Update customer totals error:', error);
        res.status(500).json({ message: 'Error updating customer totals' });
    }
});

module.exports = router;
