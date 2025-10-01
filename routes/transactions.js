// Transactions Routes
const express = require('express');
const { Transaction, Product, Customer } = require('../database-setup');
const { verifyToken, requireRole } = require('./auth');

const router = express.Router();

// Get all transactions for a shop
router.get('/', verifyToken, async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            startDate, 
            endDate, 
            status, 
            paymentMethod,
            sortBy = 'transactionDate', 
            sortOrder = 'desc' 
        } = req.query;
        
        // Build filter object
        const filter = { shopId: req.user.shopId };
        
        if (status && status !== 'all') {
            filter.status = status;
        }
        
        if (paymentMethod && paymentMethod !== 'all') {
            filter['payment.method'] = paymentMethod;
        }

        // Date range filter
        if (startDate || endDate) {
            filter.transactionDate = {};
            if (startDate) filter.transactionDate.$gte = new Date(startDate);
            if (endDate) filter.transactionDate.$lte = new Date(endDate);
        }

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const transactions = await Transaction.find(filter)
            .populate('customerId', 'firstName lastName email phone')
            .populate('cashierId', 'firstName lastName')
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();

        const total = await Transaction.countDocuments(filter);

        res.json({
            transactions,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error('Get transactions error:', error);
        res.status(500).json({ message: 'Error fetching transactions' });
    }
});

// Get transaction by ID
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const transaction = await Transaction.findOne({ 
            _id: req.params.id, 
            shopId: req.user.shopId 
        })
        .populate('customerId', 'firstName lastName email phone address')
        .populate('cashierId', 'firstName lastName email')
        .populate('items.productId', 'name sku specifications images');

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        res.json({ transaction });
    } catch (error) {
        console.error('Get transaction error:', error);
        res.status(500).json({ message: 'Error fetching transaction' });
    }
});

// Create new transaction
router.post('/', verifyToken, requireRole(['shop_admin', 'shop_user']), async (req, res) => {
    try {
        const {
            customerId,
            customerName,
            items,
            discounts,
            oldGoldPurchases,
            paymentMethod,
            amountPaid,
            notes
        } = req.body;

        // Validate items
        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'Transaction must have at least one item' });
        }

        // Calculate totals
        let subtotal = 0;
        let taxAmount = 0;
        let discountAmount = 0;
        let oldGoldExchange = 0;

        // Process items and update stock
        const processedItems = [];
        for (const item of items) {
            const product = await Product.findOne({ 
                _id: item.productId, 
                shopId: req.user.shopId 
            });

            if (!product) {
                return res.status(400).json({ 
                    message: `Product not found: ${item.productId}` 
                });
            }

            if (product.stock.quantity < item.quantity) {
                return res.status(400).json({ 
                    message: `Insufficient stock for ${product.name}. Available: ${product.stock.quantity}` 
                });
            }

            const itemTotal = item.sellingPrice * item.quantity;
            subtotal += itemTotal;

            processedItems.push({
                productId: product._id,
                productName: product.name,
                sku: product.sku,
                quantity: item.quantity,
                unitPrice: product.price,
                sellingPrice: item.sellingPrice,
                totalPrice: itemTotal
            });

            // Update product stock
            product.stock.quantity -= item.quantity;
            await product.save();
        }

        // Process discounts
        if (discounts && discounts.length > 0) {
            for (const discount of discounts) {
                if (discount.type === 'percentage') {
                    discountAmount += (subtotal * discount.value) / 100;
                } else if (discount.type === 'fixed') {
                    discountAmount += discount.value;
                }
            }
        }

        // Process old gold purchases
        if (oldGoldPurchases && oldGoldPurchases.length > 0) {
            for (const oldGold of oldGoldPurchases) {
                oldGoldExchange += oldGold.amount || 0;
            }
        }

        // Calculate final total
        const finalTotal = Math.max(0, subtotal - discountAmount - oldGoldExchange);

        // Validate payment
        if (amountPaid < finalTotal) {
            return res.status(400).json({ 
                message: 'Amount paid is less than the final total' 
            });
        }

        const changeGiven = amountPaid - finalTotal;

        // Generate invoice number
        const today = new Date();
        const dateString = today.toISOString().slice(0, 10).replace(/-/g, '');
        const invoiceNumber = `INV-${dateString}-${Date.now().toString().slice(-6)}`;

        // Create transaction
        const transaction = new Transaction({
            transactionId: `TXN${Date.now()}`,
            invoiceNumber,
            customerId: customerId || null,
            customerName: customerName || 'Walk-in Customer',
            items: processedItems,
            totals: {
                subtotal,
                taxAmount,
                discountAmount,
                oldGoldExchange,
                finalTotal
            },
            payment: {
                method: paymentMethod,
                amountPaid,
                changeGiven,
                transactionReference: `TXN-${Date.now()}`
            },
            discounts: discounts || [],
            oldGoldPurchases: oldGoldPurchases || [],
            cashierId: req.user.userId,
            shopId: req.user.shopId,
            notes: notes || '',
            status: 'completed'
        });

        await transaction.save();

        // Update customer totals if customer exists
        if (customerId) {
            const customer = await Customer.findById(customerId);
            if (customer) {
                customer.totalSpent += finalTotal;
                customer.totalOrders += 1;
                customer.lastPurchaseDate = transaction.transactionDate;
                customer.updatedAt = new Date();
                await customer.save();
            }
        }

        // Populate transaction for response
        const populatedTransaction = await Transaction.findById(transaction._id)
            .populate('customerId', 'firstName lastName email phone')
            .populate('cashierId', 'firstName lastName');

        res.status(201).json({
            message: 'Transaction completed successfully',
            transaction: populatedTransaction
        });
    } catch (error) {
        console.error('Create transaction error:', error);
        res.status(500).json({ message: 'Error creating transaction' });
    }
});

// Process refund
router.post('/:id/refund', verifyToken, requireRole(['shop_admin']), async (req, res) => {
    try {
        const { refundItems, refundReason } = req.body;

        const transaction = await Transaction.findOne({ 
            _id: req.params.id, 
            shopId: req.user.shopId 
        });

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        if (transaction.status !== 'completed') {
            return res.status(400).json({ message: 'Only completed transactions can be refunded' });
        }

        // Process refund items and restore stock
        for (const refundItem of refundItems) {
            const product = await Product.findById(refundItem.productId);
            if (product) {
                product.stock.quantity += refundItem.quantity;
                await product.save();
            }
        }

        // Create refund transaction
        const refundTransaction = new Transaction({
            transactionId: `REF${Date.now()}`,
            invoiceNumber: `REF-${transaction.invoiceNumber}`,
            customerId: transaction.customerId,
            customerName: transaction.customerName,
            items: refundItems.map(item => ({
                ...item,
                sellingPrice: -item.sellingPrice, // Negative for refund
                totalPrice: -item.totalPrice
            })),
            totals: {
                subtotal: -refundItems.reduce((sum, item) => sum + item.totalPrice, 0),
                taxAmount: 0,
                discountAmount: 0,
                oldGoldExchange: 0,
                finalTotal: -refundItems.reduce((sum, item) => sum + item.totalPrice, 0)
            },
            payment: {
                method: 'Refund',
                amountPaid: 0,
                changeGiven: 0,
                transactionReference: `REF-${transaction.payment.transactionReference}`
            },
            discounts: [],
            oldGoldPurchases: [],
            cashierId: req.user.userId,
            shopId: req.user.shopId,
            notes: `Refund for transaction ${transaction.invoiceNumber}. Reason: ${refundReason}`,
            status: 'refunded'
        });

        await refundTransaction.save();

        // Update original transaction status
        transaction.status = 'refunded';
        transaction.notes = transaction.notes ? 
            `${transaction.notes}\nRefunded on ${new Date().toISOString()}. Reason: ${refundReason}` :
            `Refunded on ${new Date().toISOString()}. Reason: ${refundReason}`;
        await transaction.save();

        // Update customer totals if customer exists
        if (transaction.customerId) {
            const customer = await Customer.findById(transaction.customerId);
            if (customer) {
                const refundAmount = refundItems.reduce((sum, item) => sum + item.totalPrice, 0);
                customer.totalSpent = Math.max(0, customer.totalSpent - refundAmount);
                customer.totalOrders = Math.max(0, customer.totalOrders - 1);
                customer.updatedAt = new Date();
                await customer.save();
            }
        }

        res.json({
            message: 'Refund processed successfully',
            refundTransaction
        });
    } catch (error) {
        console.error('Process refund error:', error);
        res.status(500).json({ message: 'Error processing refund' });
    }
});

// Get transaction statistics
router.get('/stats/summary', verifyToken, async (req, res) => {
    try {
        const { period = '30' } = req.query; // days
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - parseInt(period));

        // Build filter
        const filter = {
            shopId: req.user.shopId,
            transactionDate: { $gte: startDate, $lte: endDate },
            status: 'completed'
        };

        // Get transaction statistics
        const transactions = await Transaction.find(filter);
        
        const totalRevenue = transactions.reduce((sum, t) => sum + t.totals.finalTotal, 0);
        const totalTransactions = transactions.length;
        const averageOrderValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

        // Payment method breakdown
        const paymentMethods = {};
        transactions.forEach(t => {
            const method = t.payment.method;
            paymentMethods[method] = (paymentMethods[method] || 0) + t.totals.finalTotal;
        });

        // Daily sales for the period
        const dailySales = {};
        transactions.forEach(t => {
            const date = t.transactionDate.toISOString().split('T')[0];
            dailySales[date] = (dailySales[date] || 0) + t.totals.finalTotal;
        });

        // Top selling products
        const productSales = {};
        transactions.forEach(t => {
            t.items.forEach(item => {
                const key = `${item.productName}-${item.sku}`;
                productSales[key] = (productSales[key] || 0) + item.quantity;
            });
        });

        const topProducts = Object.entries(productSales)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .map(([product, quantity]) => ({ product, quantity }));

        res.json({
            period: `${period} days`,
            summary: {
                totalRevenue,
                totalTransactions,
                averageOrderValue
            },
            paymentMethods,
            dailySales,
            topProducts
        });
    } catch (error) {
        console.error('Get transaction stats error:', error);
        res.status(500).json({ message: 'Error fetching transaction statistics' });
    }
});

// Get sales by date range
router.get('/reports/sales', verifyToken, async (req, res) => {
    try {
        const { startDate, endDate, groupBy = 'day' } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'Start date and end date are required' });
        }

        const filter = {
            shopId: req.user.shopId,
            transactionDate: { 
                $gte: new Date(startDate), 
                $lte: new Date(endDate) 
            },
            status: 'completed'
        };

        const transactions = await Transaction.find(filter);

        // Group by specified period
        const groupedSales = {};
        transactions.forEach(t => {
            let key;
            const date = new Date(t.transactionDate);
            
            switch (groupBy) {
                case 'day':
                    key = date.toISOString().split('T')[0];
                    break;
                case 'week':
                    const weekStart = new Date(date);
                    weekStart.setDate(date.getDate() - date.getDay());
                    key = weekStart.toISOString().split('T')[0];
                    break;
                case 'month':
                    key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                    break;
                default:
                    key = date.toISOString().split('T')[0];
            }

            if (!groupedSales[key]) {
                groupedSales[key] = {
                    date: key,
                    revenue: 0,
                    transactions: 0,
                    items: 0
                };
            }

            groupedSales[key].revenue += t.totals.finalTotal;
            groupedSales[key].transactions += 1;
            groupedSales[key].items += t.items.reduce((sum, item) => sum + item.quantity, 0);
        });

        const salesData = Object.values(groupedSales).sort((a, b) => a.date.localeCompare(b.date));

        res.json({
            period: { startDate, endDate, groupBy },
            salesData
        });
    } catch (error) {
        console.error('Get sales report error:', error);
        res.status(500).json({ message: 'Error fetching sales report' });
    }
});

// Search transactions
router.get('/search/:query', verifyToken, async (req, res) => {
    try {
        const { query } = req.params;
        
        const transactions = await Transaction.find({
            shopId: req.user.shopId,
            $or: [
                { invoiceNumber: { $regex: query, $options: 'i' } },
                { customerName: { $regex: query, $options: 'i' } },
                { 'payment.transactionReference': { $regex: query, $options: 'i' } }
            ]
        })
        .populate('customerId', 'firstName lastName')
        .sort({ transactionDate: -1 })
        .limit(10);

        res.json({ transactions });
    } catch (error) {
        console.error('Search transactions error:', error);
        res.status(500).json({ message: 'Error searching transactions' });
    }
});

module.exports = router;
