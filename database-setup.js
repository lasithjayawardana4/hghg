// MongoDB Database Setup for LT Innovations POS System
// This file contains the database schema, collections, and sample data

const mongoose = require('mongoose');

// Database connection
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/lt_innovations_pos', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected Successfully');
    } catch (error) {
        console.error('MongoDB Connection Error:', error);
        process.exit(1);
    }
};

// User Schema (for shop users and super admin)
const userSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['superadmin', 'shop_admin', 'shop_user'], 
        default: 'shop_user' 
    },
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: false },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Shop Schema (for multi-shop management)
const shopSchema = new mongoose.Schema({
    shopId: { type: String, required: true, unique: true },
    shopName: { type: String, required: true },
    shopCode: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        country: { type: String, required: true }
    },
    ownerName: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['active', 'blocked', 'suspended'], 
        default: 'active' 
    },
    subscriptionPlan: { 
        type: String, 
        enum: ['basic', 'premium', 'enterprise'], 
        default: 'basic' 
    },
    subscriptionExpiry: { type: Date },
    settings: {
        currency: { type: String, default: 'USD' },
        timezone: { type: String, default: 'UTC' },
        theme: { type: String, default: 'light' }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Product Schema (Jewelry inventory)
const productSchema = new mongoose.Schema({
    productId: { type: String, required: true, unique: true },
    sku: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    category: { 
        type: String, 
        enum: ['Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Watches', 'Other'], 
        required: true 
    },
    price: { type: Number, required: true, min: 0 },
    cost: { 
        materialCost: { type: Number, required: true, min: 0 },
        laborCost: { type: Number, required: true, min: 0 },
        totalCost: { type: Number, required: true, min: 0 }
    },
    specifications: {
        purity: { type: String }, // e.g., "18K", "14K", "925 Silver"
        weight: { type: Number }, // in grams
        size: { type: String },
        color: { type: String },
        stoneType: { type: String },
        stoneCount: { type: Number }
    },
    stock: {
        quantity: { type: Number, required: true, min: 0 },
        lowStockThreshold: { type: Number, default: 10 },
        reorderPoint: { type: Number, default: 5 }
    },
    images: [{
        url: { type: String, required: true },
        alt: { type: String },
        isPrimary: { type: Boolean, default: false }
    }],
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
    isActive: { type: Boolean, default: true },
    tags: [String],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Customer Schema
const customerSchema = new mongoose.Schema({
    customerId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        zipCode: { type: String },
        country: { type: String, default: 'USA' }
    },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    customerType: { 
        type: String, 
        enum: ['Regular', 'VIP', 'Premium'], 
        default: 'Regular' 
    },
    totalSpent: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    lastPurchaseDate: { type: Date },
    preferences: {
        preferredCategories: [String],
        sizePreference: { type: String },
        colorPreference: { type: String }
    },
    notes: { type: String },
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Transaction/Sale Schema
const transactionSchema = new mongoose.Schema({
    transactionId: { type: String, required: true, unique: true },
    invoiceNumber: { type: String, required: true, unique: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    customerName: { type: String }, // For walk-in customers
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        productName: { type: String, required: true },
        sku: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        unitPrice: { type: Number, required: true, min: 0 },
        sellingPrice: { type: Number, required: true, min: 0 },
        totalPrice: { type: Number, required: true, min: 0 }
    }],
    totals: {
        subtotal: { type: Number, required: true, min: 0 },
        taxAmount: { type: Number, default: 0 },
        discountAmount: { type: Number, default: 0 },
        oldGoldExchange: { type: Number, default: 0 },
        finalTotal: { type: Number, required: true, min: 0 }
    },
    payment: {
        method: { 
            type: String, 
            enum: ['Cash', 'Card', 'Online', 'Bank Transfer'], 
            required: true 
        },
        amountPaid: { type: Number, required: true },
        changeGiven: { type: Number, default: 0 },
        transactionReference: { type: String }
    },
    discounts: [{
        type: { type: String, enum: ['percentage', 'fixed'] },
        value: { type: Number },
        description: { type: String }
    }],
    oldGoldPurchases: [{
        weight: { type: Number }, // in grams
        purity: { type: String },
        rate: { type: Number },
        amount: { type: Number }
    }],
    cashierId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
    transactionDate: { type: Date, default: Date.now },
    status: { 
        type: String, 
        enum: ['completed', 'refunded', 'cancelled'], 
        default: 'completed' 
    },
    notes: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Notification Schema (for system alerts)
const notificationSchema = new mongoose.Schema({
    notificationId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { 
        type: String, 
        enum: ['maintenance', 'update', 'warning', 'info', 'urgent'], 
        required: true 
    },
    targetShops: { 
        type: [mongoose.Schema.Types.ObjectId], 
        ref: 'Shop',
        default: [] // Empty array means all shops
    },
    isActive: { type: Boolean, default: true },
    priority: { 
        type: String, 
        enum: ['low', 'medium', 'high', 'urgent'], 
        default: 'medium' 
    },
    expiresAt: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// User Notification Read Status
const userNotificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    notificationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Notification', required: true },
    isRead: { type: Boolean, default: false },
    readAt: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

// Create indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ shopId: 1 });
userSchema.index({ role: 1 });

productSchema.index({ sku: 1 });
productSchema.index({ shopId: 1 });
productSchema.index({ category: 1 });
productSchema.index({ 'stock.quantity': 1 });

customerSchema.index({ email: 1 });
customerSchema.index({ phone: 1 });
customerSchema.index({ shopId: 1 });
customerSchema.index({ customerType: 1 });

transactionSchema.index({ invoiceNumber: 1 });
transactionSchema.index({ shopId: 1 });
transactionSchema.index({ transactionDate: -1 });
transactionSchema.index({ customerId: 1 });
transactionSchema.index({ cashierId: 1 });

notificationSchema.index({ isActive: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ createdAt: -1 });

userNotificationSchema.index({ userId: 1, notificationId: 1 }, { unique: true });

// Create models
const User = mongoose.model('User', userSchema);
const Shop = mongoose.model('Shop', shopSchema);
const Product = mongoose.model('Product', productSchema);
const Customer = mongoose.model('Customer', customerSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);
const Notification = mongoose.model('Notification', notificationSchema);
const UserNotification = mongoose.model('UserNotification', userNotificationSchema);

// Sample data insertion function
const insertSampleData = async () => {
    try {
        // Clear existing data
        await User.deleteMany({});
        await Shop.deleteMany({});
        await Product.deleteMany({});
        await Customer.deleteMany({});
        await Transaction.deleteMany({});
        await Notification.deleteMany({});
        await UserNotification.deleteMany({});

        // Create sample shops
        const shop1 = new Shop({
            shopId: 'SHOP001',
            shopName: 'Gold Palace Jewelry',
            shopCode: 'GPJ001',
            email: 'info@goldpalace.com',
            phone: '+1-555-0123',
            address: {
                street: '123 Main Street',
                city: 'New York',
                state: 'NY',
                zipCode: '10001',
                country: 'USA'
            },
            ownerName: 'John Smith',
            status: 'active',
            subscriptionPlan: 'premium'
        });
        await shop1.save();

        const shop2 = new Shop({
            shopId: 'SHOP002',
            shopName: 'Diamond Store',
            shopCode: 'DS002',
            email: 'contact@diamondstore.com',
            phone: '+1-555-0456',
            address: {
                street: '456 Oak Avenue',
                city: 'Los Angeles',
                state: 'CA',
                zipCode: '90210',
                country: 'USA'
            },
            ownerName: 'Sarah Johnson',
            status: 'active',
            subscriptionPlan: 'basic'
        });
        await shop2.save();

        // Create super admin user
        const superAdmin = new User({
            userId: 'SUPER001',
            username: 'superadmin',
            email: 'admin@ltinnovations.com',
            password: '$2b$10$rQZ8K9L2mN3oP4qR5sT6uV7wX8yZ9aB0cD1eF2gH3iJ4kL5mN6oP7q', // hashed password for 'admin123'
            firstName: 'Super',
            lastName: 'Admin',
            role: 'superadmin'
        });
        await superAdmin.save();

        // Create shop admin users
        const shopAdmin1 = new User({
            userId: 'ADMIN001',
            username: 'admin@goldpalace.com',
            email: 'admin@goldpalace.com',
            password: '$2b$10$rQZ8K9L2mN3oP4qR5sT6uV7wX8yZ9aB0cD1eF2gH3iJ4kL5mN6oP7q', // hashed password for 'admin123'
            firstName: 'John',
            lastName: 'Smith',
            role: 'shop_admin',
            shopId: shop1._id
        });
        await shopAdmin1.save();

        const shopAdmin2 = new User({
            userId: 'ADMIN002',
            username: 'admin@diamondstore.com',
            email: 'admin@diamondstore.com',
            password: '$2b$10$rQZ8K9L2mN3oP4qR5sT6uV7wX8yZ9aB0cD1eF2gH3iJ4kL5mN6oP7q', // hashed password for 'admin123'
            firstName: 'Sarah',
            lastName: 'Johnson',
            role: 'shop_admin',
            shopId: shop2._id
        });
        await shopAdmin2.save();

        // Create sample products
        const products = [
            {
                productId: 'PROD001',
                sku: 'GR-001-18K',
                name: 'Gold Ring 18K',
                description: 'Beautiful 18K gold ring with diamond accent',
                category: 'Rings',
                price: 450,
                cost: {
                    materialCost: 200,
                    laborCost: 50,
                    totalCost: 250
                },
                specifications: {
                    purity: '18K',
                    weight: 5.2,
                    size: '7',
                    color: 'Yellow Gold',
                    stoneType: 'Diamond',
                    stoneCount: 1
                },
                stock: {
                    quantity: 15,
                    lowStockThreshold: 10,
                    reorderPoint: 5
                },
                images: [{
                    url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRkZEMTAwIi8+CjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjE1IiBzdHJva2U9IiNGRkYzRTMiIHN0cm9rZS13aWR0aD0iMyIvPgo8L3N2Zz4K',
                    alt: 'Gold Ring 18K',
                    isPrimary: true
                }],
                shopId: shop1._id,
                tags: ['gold', 'ring', 'diamond']
            },
            {
                productId: 'PROD002',
                sku: 'DN-002-14K',
                name: 'Diamond Necklace',
                description: 'Elegant 14K gold necklace with diamond pendant',
                category: 'Necklaces',
                price: 1200,
                cost: {
                    materialCost: 600,
                    laborCost: 100,
                    totalCost: 700
                },
                specifications: {
                    purity: '14K',
                    weight: 12.5,
                    size: '18 inches',
                    color: 'White Gold',
                    stoneType: 'Diamond',
                    stoneCount: 5
                },
                stock: {
                    quantity: 8,
                    lowStockThreshold: 5,
                    reorderPoint: 3
                },
                images: [{
                    url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRkZEMTAwIi8+CjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjE1IiBzdHJva2U9IiNGRkYzRTMiIHN0cm9rZS13aWR0aD0iMyIvPgo8L3N2Zz4K',
                    alt: 'Diamond Necklace',
                    isPrimary: true
                }],
                shopId: shop1._id,
                tags: ['necklace', 'diamond', 'white gold']
            },
            {
                productId: 'PROD003',
                sku: 'SE-003-925',
                name: 'Silver Earrings',
                description: 'Classic 925 silver earrings with pearl accents',
                category: 'Earrings',
                price: 180,
                cost: {
                    materialCost: 80,
                    laborCost: 20,
                    totalCost: 100
                },
                specifications: {
                    purity: '925 Silver',
                    weight: 8.5,
                    size: 'Medium',
                    color: 'Silver',
                    stoneType: 'Pearl',
                    stoneCount: 2
                },
                stock: {
                    quantity: 25,
                    lowStockThreshold: 15,
                    reorderPoint: 10
                },
                images: [{
                    url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjQ0NDQ0NDIi8+CjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjE1IiBzdHJva2U9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMyIvPgo8L3N2Zz4K',
                    alt: 'Silver Earrings',
                    isPrimary: true
                }],
                shopId: shop1._id,
                tags: ['earrings', 'silver', 'pearl']
            }
        ];

        for (const productData of products) {
            const product = new Product(productData);
            await product.save();
        }

        // Create sample customers
        const customers = [
            {
                customerId: 'CUST001',
                firstName: 'Emma',
                lastName: 'Davis',
                email: 'emma.davis@email.com',
                phone: '+1-555-0789',
                address: {
                    street: '789 Pine Road',
                    city: 'Chicago',
                    state: 'IL',
                    zipCode: '60601',
                    country: 'USA'
                },
                customerType: 'VIP',
                totalSpent: 2450,
                totalOrders: 8,
                shopId: shop1._id,
                preferences: {
                    preferredCategories: ['Rings', 'Necklaces'],
                    sizePreference: 'Medium',
                    colorPreference: 'Gold'
                }
            },
            {
                customerId: 'CUST002',
                firstName: 'Michael',
                lastName: 'Wilson',
                email: 'michael.wilson@email.com',
                phone: '+1-555-0321',
                address: {
                    street: '321 Elm Street',
                    city: 'Miami',
                    state: 'FL',
                    zipCode: '33101',
                    country: 'USA'
                },
                customerType: 'Regular',
                totalSpent: 1890,
                totalOrders: 5,
                shopId: shop1._id,
                preferences: {
                    preferredCategories: ['Watches'],
                    sizePreference: 'Large',
                    colorPreference: 'Silver'
                }
            }
        ];

        for (const customerData of customers) {
            const customer = new Customer(customerData);
            await customer.save();
        }

        // Create sample notifications
        const notifications = [
            {
                notificationId: 'NOTIF001',
                title: 'System Maintenance Notice',
                message: 'Scheduled maintenance on Dec 20th, 2024 from 2:00 AM to 4:00 AM EST. System will be temporarily unavailable.',
                type: 'maintenance',
                isActive: true,
                priority: 'high',
                createdBy: superAdmin._id
            },
            {
                notificationId: 'NOTIF002',
                title: 'New Feature Update',
                message: 'Enhanced reporting features now available. Check the Reports section for new analytics.',
                type: 'update',
                isActive: true,
                priority: 'medium',
                createdBy: superAdmin._id
            }
        ];

        for (const notificationData of notifications) {
            const notification = new Notification(notificationData);
            await notification.save();
        }

        console.log('Sample data inserted successfully!');
    } catch (error) {
        console.error('Error inserting sample data:', error);
    }
};

module.exports = {
    connectDB,
    User,
    Shop,
    Product,
    Customer,
    Transaction,
    Notification,
    UserNotification,
    insertSampleData
};
