// Database Setup Script
// Run this script to initialize the database with sample data

const { connectDB, insertSampleData } = require('./database-setup');

const setupDatabase = async () => {
    try {
        console.log('🚀 Starting database setup...');
        
        // Connect to MongoDB
        await connectDB();
        
        // Insert sample data
        console.log('📊 Inserting sample data...');
        await insertSampleData();
        
        console.log('✅ Database setup completed successfully!');
        console.log('');
        console.log('📋 Sample Accounts Created:');
        console.log('Super Admin:');
        console.log('  Email: admin@ltinnovations.com');
        console.log('  Username: superadmin');
        console.log('  Password: admin123');
        console.log('');
        console.log('Shop Admin (Gold Palace):');
        console.log('  Email: admin@goldpalace.com');
        console.log('  Username: admin@goldpalace.com');
        console.log('  Password: admin123');
        console.log('');
        console.log('Shop Admin (Diamond Store):');
        console.log('  Email: admin@diamondstore.com');
        console.log('  Username: admin@diamondstore.com');
        console.log('  Password: admin123');
        console.log('');
        console.log('🎯 You can now start the server with: npm start');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Database setup failed:', error);
        process.exit(1);
    }
};

// Run the setup
setupDatabase();
