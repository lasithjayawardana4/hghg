// Dashboard Routes
const express = require('express');
const { Product, Customer, Transaction, Shop, User } = require('../database-setup');
const { verifyToken, requireRole } = require('./auth');

const router = express.Router();

// Get dashboard statistics
router.get('/stats', verifyToken, async (req, res) => {
    try {
        const { period = '30' } = req.query; // days
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - parseInt(period));

        let filter = { shopId: req.user.shopId };

        // For super admin, get all shops data
        if (req.user.role === 'superadmin') {
            delete filter.shopId;
        }

        // Sales statistics
        const salesFilter = {
            ...filter,
            transactionDate: { $gte: startDate, $lte: endDate },
            status: 'completed'
        };

        const transactions = await Transaction.find(salesFilter);
        
        const todaySales = await Transaction.find({
            ...filter,
            transactionDate: {
                $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                $lt: new Date(new Date().setHours(23, 59, 59, 999))
            },
            status: 'completed'
        });

        // Product statistics
        const productFilter = { ...filter, isActive: true };
        const totalProducts = await Product.countDocuments(productFilter);
        const lowStockProducts = await Product.countDocuments({
            ...productFilter,
            $expr: { $lte: ['$stock.quantity', '$stock.lowStockThreshold'] }
        });

        // Customer statistics
        const customerFilter = { ...filter, isActive: true };
        const totalCustomers = await Customer.countDocuments(customerFilter);

        // Calculate statistics
        const totalRevenue = transactions.reduce((sum, t) => sum + t.totals.finalTotal, 0);
        const totalTransactions = transactions.length;
        const todayRevenue = todaySales.reduce((sum, t) => sum + t.totals.finalTotal, 0);
        const todayTransactions = todaySales.length;

        // Old gold purchases
        const oldGoldPurchases = transactions.reduce((sum, t) => sum + t.totals.oldGoldExchange, 0);

        // Calculate profit (simplified)
        let totalProfit = 0;
        transactions.forEach(t => {
            t.items.forEach(item => {
                // This is a simplified profit calculation
                // In a real system, you'd want to store cost data properly
                const estimatedCost = item.unitPrice * 0.6; // Assume 60% cost
                totalProfit += (item.sellingPrice - estimatedCost) * item.quantity;
            });
        });

        const stats = {
            period: `${period} days`,
            revenue: {
                total: totalRevenue,
                today: todayRevenue,
                change: 0 // You can calculate this based on previous period
            },
            transactions: {
                total: totalTransactions,
                today: todayTransactions,
                change: 0
            },
            products: {
                total: totalProducts,
                lowStock: lowStockProducts
            },
            customers: {
                total: totalCustomers
            },
            oldGold: {
                purchased: oldGoldPurchases
            },
            profit: {
                total: totalProfit,
                margin: totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0
            }
        };

        res.json({ stats });
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({ message: 'Error fetching dashboard statistics' });
    }
});

// Get sales chart data
router.get('/charts/sales', verifyToken, async (req, res) => {
    try {
        const { period = '7' } = req.query; // days
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - parseInt(period));

        let filter = { shopId: req.user.shopId };

        // For super admin, get all shops data
        if (req.user.role === 'superadmin') {
            delete filter.shopId;
        }

        const transactions = await Transaction.find({
            ...filter,
            transactionDate: { $gte: startDate, $lte: endDate },
            status: 'completed'
        });

        // Group by day
        const dailySales = {};
        for (let i = parseInt(period) - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            dailySales[dateStr] = {
                date: dateStr,
                revenue: 0,
                profit: 0,
                transactions: 0
            };
        }

        // Calculate daily totals
        transactions.forEach(t => {
            const dateStr = t.transactionDate.toISOString().split('T')[0];
            if (dailySales[dateStr]) {
                dailySales[dateStr].revenue += t.totals.finalTotal;
                dailySales[dateStr].transactions += 1;
                
                // Calculate profit for this transaction
                let profit = 0;
                t.items.forEach(item => {
                    const estimatedCost = item.unitPrice * 0.6;
                    profit += (item.sellingPrice - estimatedCost) * item.quantity;
                });
                dailySales[dateStr].profit += profit;
            }
        });

        const chartData = Object.values(dailySales).sort((a, b) => a.date.localeCompare(b.date));

        res.json({
            period: `${period} days`,
            data: chartData
        });
    } catch (error) {
        console.error('Get sales chart error:', error);
        res.status(500).json({ message: 'Error fetching sales chart data' });
    }
});

// Get category chart data
router.get('/charts/categories', verifyToken, async (req, res) => {
    try {
        const { period = '30' } = req.query;
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - parseInt(period));

        let filter = { shopId: req.user.shopId };

        if (req.user.role === 'superadmin') {
            delete filter.shopId;
        }

        const transactions = await Transaction.find({
            ...filter,
            transactionDate: { $gte: startDate, $lte: endDate },
            status: 'completed'
        }).populate('items.productId', 'category');

        // Group by category
        const categoryData = {};
        
        transactions.forEach(t => {
            t.items.forEach(item => {
                if (item.productId && item.productId.category) {
                    const category = item.productId.category;
                    if (!categoryData[category]) {
                        categoryData[category] = {
                            category,
                            revenue: 0,
                            profit: 0,
                            quantity: 0
                        };
                    }
                    
                    categoryData[category].revenue += item.totalPrice;
                    categoryData[category].quantity += item.quantity;
                    
                    // Calculate profit
                    const estimatedCost = item.unitPrice * 0.6;
                    const profit = (item.sellingPrice - estimatedCost) * item.quantity;
                    categoryData[category].profit += profit;
                }
            });
        });

        const chartData = Object.values(categoryData);

        res.json({
            period: `${period} days`,
            data: chartData
        });
    } catch (error) {
        console.error('Get category chart error:', error);
        res.status(500).json({ message: 'Error fetching category chart data' });
    }
});

// Get payment methods chart data
router.get('/charts/payment-methods', verifyToken, async (req, res) => {
    try {
        const { period = '30' } = req.query;
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - parseInt(period));

        let filter = { shopId: req.user.shopId };

        if (req.user.role === 'superadmin') {
            delete filter.shopId;
        }

        const transactions = await Transaction.find({
            ...filter,
            transactionDate: { $gte: startDate, $lte: endDate },
            status: 'completed'
        });

        // Group by payment method
        const paymentData = {};
        
        transactions.forEach(t => {
            const method = t.payment.method;
            if (!paymentData[method]) {
                paymentData[method] = {
                    method,
                    revenue: 0,
                    transactions: 0
                };
            }
            
            paymentData[method].revenue += t.totals.finalTotal;
            paymentData[method].transactions += 1;
        });

        const chartData = Object.values(paymentData);

        res.json({
            period: `${period} days`,
            data: chartData
        });
    } catch (error) {
        console.error('Get payment methods chart error:', error);
        res.status(500).json({ message: 'Error fetching payment methods chart data' });
    }
});

// Get top products chart data
router.get('/charts/top-products', verifyToken, async (req, res) => {
    try {
        const { period = '30', limit = 10 } = req.query;
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - parseInt(period));

        let filter = { shopId: req.user.shopId };

        if (req.user.role === 'superadmin') {
            delete filter.shopId;
        }

        const transactions = await Transaction.find({
            ...filter,
            transactionDate: { $gte: startDate, $lte: endDate },
            status: 'completed'
        });

        // Group by product
        const productData = {};
        
        transactions.forEach(t => {
            t.items.forEach(item => {
                const key = `${item.productName}-${item.sku}`;
                if (!productData[key]) {
                    productData[key] = {
                        productName: item.productName,
                        sku: item.sku,
                        revenue: 0,
                        profit: 0,
                        quantity: 0
                    };
                }
                
                productData[key].revenue += item.totalPrice;
                productData[key].quantity += item.quantity;
                
                // Calculate profit
                const estimatedCost = item.unitPrice * 0.6;
                const profit = (item.sellingPrice - estimatedCost) * item.quantity;
                productData[key].profit += profit;
            });
        });

        // Sort by revenue and limit
        const chartData = Object.values(productData)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, parseInt(limit));

        res.json({
            period: `${period} days`,
            data: chartData
        });
    } catch (error) {
        console.error('Get top products chart error:', error);
        res.status(500).json({ message: 'Error fetching top products chart data' });
    }
});

// Get recent transactions
router.get('/recent-transactions', verifyToken, async (req, res) => {
    try {
        const { limit = 10 } = req.query;

        let filter = { shopId: req.user.shopId };

        if (req.user.role === 'superadmin') {
            delete filter.shopId;
        }

        const transactions = await Transaction.find(filter)
            .populate('customerId', 'firstName lastName')
            .populate('cashierId', 'firstName lastName')
            .sort({ transactionDate: -1 })
            .limit(parseInt(limit))
            .lean();

        res.json({ transactions });
    } catch (error) {
        console.error('Get recent transactions error:', error);
        res.status(500).json({ message: 'Error fetching recent transactions' });
    }
});

// Get low stock alerts
router.get('/low-stock', verifyToken, async (req, res) => {
    try {
        let filter = { shopId: req.user.shopId, isActive: true };

        if (req.user.role === 'superadmin') {
            delete filter.shopId;
        }

        const lowStockProducts = await Product.find({
            ...filter,
            $expr: {
                $lte: ['$stock.quantity', '$stock.lowStockThreshold']
            }
        }).sort({ 'stock.quantity': 1 });

        res.json({ products: lowStockProducts });
    } catch (error) {
        console.error('Get low stock products error:', error);
        res.status(500).json({ message: 'Error fetching low stock products' });
    }
});

// Get old gold purchases chart data
router.get('/charts/old-gold', verifyToken, async (req, res) => {
    try {
        const { period = '30' } = req.query;
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - parseInt(period));

        let filter = { shopId: req.user.shopId };

        if (req.user.role === 'superadmin') {
            delete filter.shopId;
        }

        const transactions = await Transaction.find({
            ...filter,
            transactionDate: { $gte: startDate, $lte: endDate },
            status: 'completed',
            'totals.oldGoldExchange': { $gt: 0 }
        });

        // Group by day
        const dailyOldGold = {};
        for (let i = parseInt(period) - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            dailyOldGold[dateStr] = {
                date: dateStr,
                weight: 0,
                value: 0,
                transactions: 0
            };
        }

        // Calculate daily totals
        transactions.forEach(t => {
            const dateStr = t.transactionDate.toISOString().split('T')[0];
            if (dailyOldGold[dateStr]) {
                dailyOldGold[dateStr].value += t.totals.oldGoldExchange;
                dailyOldGold[dateStr].transactions += 1;
                
                // Calculate total weight
                t.oldGoldPurchases.forEach(oldGold => {
                    dailyOldGold[dateStr].weight += oldGold.weight || 0;
                });
            }
        });

        const chartData = Object.values(dailyOldGold).sort((a, b) => a.date.localeCompare(b.date));

        res.json({
            period: `${period} days`,
            data: chartData
        });
    } catch (error) {
        console.error('Get old gold chart error:', error);
        res.status(500).json({ message: 'Error fetching old gold chart data' });
    }
});

module.exports = router;
