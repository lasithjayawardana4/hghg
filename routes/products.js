// Products Routes
const express = require('express');
const { Product } = require('../database-setup');
const { verifyToken, requireRole } = require('./auth');

const router = express.Router();

// Get all products for a shop
router.get('/', verifyToken, async (req, res) => {
    try {
        const { page = 1, limit = 10, category, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
        
        // Build filter object
        const filter = { shopId: req.user.shopId };
        
        if (category && category !== 'all') {
            filter.category = category;
        }
        
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { sku: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const products = await Product.find(filter)
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();

        const total = await Product.countDocuments(filter);

        res.json({
            products,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ message: 'Error fetching products' });
    }
});

// Get product by ID
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const product = await Product.findOne({ 
            _id: req.params.id, 
            shopId: req.user.shopId 
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ product });
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({ message: 'Error fetching product' });
    }
});

// Create new product
router.post('/', verifyToken, requireRole(['shop_admin', 'shop_user']), async (req, res) => {
    try {
        const {
            sku,
            name,
            description,
            category,
            price,
            materialCost,
            laborCost,
            purity,
            weight,
            size,
            color,
            stoneType,
            stoneCount,
            quantity,
            lowStockThreshold,
            reorderPoint,
            tags
        } = req.body;

        // Check if SKU already exists
        const existingProduct = await Product.findOne({ sku, shopId: req.user.shopId });
        if (existingProduct) {
            return res.status(400).json({ message: 'Product with this SKU already exists' });
        }

        const totalCost = (materialCost || 0) + (laborCost || 0);

        const product = new Product({
            productId: `PROD${Date.now()}`,
            sku,
            name,
            description,
            category,
            price,
            cost: {
                materialCost: materialCost || 0,
                laborCost: laborCost || 0,
                totalCost
            },
            specifications: {
                purity,
                weight,
                size,
                color,
                stoneType,
                stoneCount
            },
            stock: {
                quantity: quantity || 0,
                lowStockThreshold: lowStockThreshold || 10,
                reorderPoint: reorderPoint || 5
            },
            images: [], // Will be handled by separate image upload endpoint
            shopId: req.user.shopId,
            tags: tags || []
        });

        await product.save();

        res.status(201).json({
            message: 'Product created successfully',
            product
        });
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({ message: 'Error creating product' });
    }
});

// Update product
router.put('/:id', verifyToken, requireRole(['shop_admin', 'shop_user']), async (req, res) => {
    try {
        const product = await Product.findOne({ 
            _id: req.params.id, 
            shopId: req.user.shopId 
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const {
            sku,
            name,
            description,
            category,
            price,
            materialCost,
            laborCost,
            purity,
            weight,
            size,
            color,
            stoneType,
            stoneCount,
            quantity,
            lowStockThreshold,
            reorderPoint,
            tags,
            isActive
        } = req.body;

        // Check if SKU is being changed and already exists
        if (sku && sku !== product.sku) {
            const existingProduct = await Product.findOne({ 
                sku, 
                shopId: req.user.shopId, 
                _id: { $ne: product._id } 
            });
            if (existingProduct) {
                return res.status(400).json({ message: 'Product with this SKU already exists' });
            }
            product.sku = sku;
        }

        // Update basic fields
        if (name) product.name = name;
        if (description !== undefined) product.description = description;
        if (category) product.category = category;
        if (price !== undefined) product.price = price;
        if (isActive !== undefined) product.isActive = isActive;

        // Update cost fields
        if (materialCost !== undefined) product.cost.materialCost = materialCost;
        if (laborCost !== undefined) product.cost.laborCost = laborCost;
        if (materialCost !== undefined || laborCost !== undefined) {
            product.cost.totalCost = (product.cost.materialCost || 0) + (product.cost.laborCost || 0);
        }

        // Update specifications
        if (purity !== undefined) product.specifications.purity = purity;
        if (weight !== undefined) product.specifications.weight = weight;
        if (size !== undefined) product.specifications.size = size;
        if (color !== undefined) product.specifications.color = color;
        if (stoneType !== undefined) product.specifications.stoneType = stoneType;
        if (stoneCount !== undefined) product.specifications.stoneCount = stoneCount;

        // Update stock
        if (quantity !== undefined) product.stock.quantity = quantity;
        if (lowStockThreshold !== undefined) product.stock.lowStockThreshold = lowStockThreshold;
        if (reorderPoint !== undefined) product.stock.reorderPoint = reorderPoint;

        // Update tags
        if (tags) product.tags = tags;

        product.updatedAt = new Date();
        await product.save();

        res.json({
            message: 'Product updated successfully',
            product
        });
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ message: 'Error updating product' });
    }
});

// Delete product
router.delete('/:id', verifyToken, requireRole(['shop_admin']), async (req, res) => {
    try {
        const product = await Product.findOne({ 
            _id: req.params.id, 
            shopId: req.user.shopId 
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await Product.findByIdAndDelete(product._id);

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ message: 'Error deleting product' });
    }
});

// Update product stock
router.patch('/:id/stock', verifyToken, requireRole(['shop_admin', 'shop_user']), async (req, res) => {
    try {
        const { quantity, operation = 'set' } = req.body; // operation: 'set', 'add', 'subtract'

        const product = await Product.findOne({ 
            _id: req.params.id, 
            shopId: req.user.shopId 
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let newQuantity = product.stock.quantity;

        switch (operation) {
            case 'set':
                newQuantity = quantity;
                break;
            case 'add':
                newQuantity += quantity;
                break;
            case 'subtract':
                newQuantity -= quantity;
                break;
            default:
                return res.status(400).json({ message: 'Invalid operation' });
        }

        if (newQuantity < 0) {
            return res.status(400).json({ message: 'Stock cannot be negative' });
        }

        product.stock.quantity = newQuantity;
        product.updatedAt = new Date();
        await product.save();

        res.json({
            message: 'Stock updated successfully',
            product: {
                _id: product._id,
                name: product.name,
                sku: product.sku,
                stock: product.stock
            }
        });
    } catch (error) {
        console.error('Update stock error:', error);
        res.status(500).json({ message: 'Error updating stock' });
    }
});

// Get low stock products
router.get('/low-stock', verifyToken, async (req, res) => {
    try {
        const products = await Product.find({
            shopId: req.user.shopId,
            isActive: true,
            $expr: {
                $lte: ['$stock.quantity', '$stock.lowStockThreshold']
            }
        }).sort({ 'stock.quantity': 1 });

        res.json({ products });
    } catch (error) {
        console.error('Get low stock products error:', error);
        res.status(500).json({ message: 'Error fetching low stock products' });
    }
});

// Get product categories
router.get('/categories/list', verifyToken, async (req, res) => {
    try {
        const categories = await Product.distinct('category', { 
            shopId: req.user.shopId, 
            isActive: true 
        });

        res.json({ categories });
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({ message: 'Error fetching categories' });
    }
});

// Bulk update products
router.patch('/bulk-update', verifyToken, requireRole(['shop_admin']), async (req, res) => {
    try {
        const { productIds, updates } = req.body;

        if (!Array.isArray(productIds) || productIds.length === 0) {
            return res.status(400).json({ message: 'Product IDs array is required' });
        }

        const result = await Product.updateMany(
            { 
                _id: { $in: productIds }, 
                shopId: req.user.shopId 
            },
            { 
                ...updates, 
                updatedAt: new Date() 
            }
        );

        res.json({
            message: 'Products updated successfully',
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        console.error('Bulk update products error:', error);
        res.status(500).json({ message: 'Error updating products' });
    }
});

module.exports = router;
