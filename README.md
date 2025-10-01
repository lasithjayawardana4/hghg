# LT Innovations POS System

A comprehensive Point of Sale (POS) system designed specifically for jewelry stores, built with React frontend and Node.js/Express backend with MongoDB database.

## 🚀 Features

### Core Features
- **Multi-Shop Management**: Super admin can manage multiple jewelry stores
- **Inventory Management**: Complete product catalog with SKU, pricing, and stock tracking
- **Sales & POS**: Modern point-of-sale interface with cart management
- **Customer Management**: Customer database with purchase history
- **Reports & Analytics**: Comprehensive reporting with charts and insights
- **Old Gold Purchasing**: Integrated old gold buying system
- **Invoice Generation**: Professional invoice printing
- **Real-time Notifications**: System alerts and notifications

### Technical Features
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Theme**: User-selectable theme switching
- **Role-based Access**: Super admin, shop admin, and shop user roles
- **Secure Authentication**: JWT-based authentication system
- **RESTful API**: Well-structured API endpoints
- **Real-time Updates**: Live data updates and notifications

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Chart.js** - Data visualization
- **Lucide React** - Modern icon library
- **CSS3** - Custom styling with CSS variables

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn** package manager

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd lt-innovations-pos
```

### 2. Install Backend Dependencies
```bash
npm install
```

### 3. Install Frontend Dependencies
```bash
cd react-app
npm install
cd ..
```

### 4. Environment Setup
Create a `.env` file in the root directory:
```bash
cp env.example .env
```

Edit the `.env` file with your configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/lt_innovations_pos
JWT_SECRET=your-super-secret-jwt-key-change-in-production-please
FRONTEND_URL=http://localhost:3000
```

### 5. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# On Windows
net start MongoDB

# On macOS (with Homebrew)
brew services start mongodb/brew/mongodb-community

# On Linux
sudo systemctl start mongod
```

### 6. Setup Database
Initialize the database with sample data:
```bash
npm run setup-db
```

### 7. Start the Backend Server
```bash
npm start
```
The backend will be available at `http://localhost:5000`

### 8. Start the Frontend Development Server
```bash
cd react-app
npm start
```
The frontend will be available at `http://localhost:3000`

## 👤 Demo Accounts

After running the database setup, you can use these demo accounts:

### Super Admin
- **Email**: admin@ltinnovations.com
- **Password**: admin123
- **Access**: Full system management

### Shop Admin (Gold Palace)
- **Email**: admin@goldpalace.com
- **Password**: admin123
- **Access**: Shop management and POS operations

### Shop Admin (Diamond Store)
- **Email**: admin@diamondstore.com
- **Password**: admin123
- **Access**: Shop management and POS operations

## 📁 Project Structure

```
lt-innovations-pos/
├── react-app/                 # React frontend
│   ├── public/               # Static files
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── contexts/         # React contexts
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   └── index.js         # App entry point
│   └── package.json
├── routes/                   # Express routes
│   ├── auth.js              # Authentication routes
│   ├── products.js          # Product management
│   ├── customers.js         # Customer management
│   ├── transactions.js      # Sales transactions
│   ├── shops.js             # Shop management
│   ├── notifications.js     # Notification system
│   └── dashboard.js         # Dashboard data
├── database-setup.js        # Database schema and setup
├── setup-database.js        # Database initialization script
├── server.js                # Express server
└── package.json
```

## 🗄️ Database Schema

### Collections
- **Users**: Shop users and super admin accounts
- **Shops**: Multi-shop management
- **Products**: Inventory items with specifications
- **Customers**: Customer database
- **Transactions**: Sales and purchase records
- **Notifications**: System alerts and messages

### Key Relationships
- Users belong to Shops (except super admin)
- Products belong to Shops
- Customers belong to Shops
- Transactions link Customers, Products, and Users

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Products
- `GET /api/products` - Get products list
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `PATCH /api/products/:id/stock` - Update stock

### Customers
- `GET /api/customers` - Get customers list
- `POST /api/customers` - Create new customer
- `PUT /api/customers/:id` - Update customer
- `GET /api/customers/:id/stats` - Customer statistics

### Transactions
- `GET /api/transactions` - Get transactions
- `POST /api/transactions` - Create new transaction
- `GET /api/transactions/stats/summary` - Transaction statistics

### Dashboard
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/dashboard/charts/sales` - Sales chart data
- `GET /api/dashboard/charts/categories` - Category chart data

## 🎨 UI/UX Features

### Design System
- **Golden Theme**: Professional jewelry store aesthetic
- **Responsive Layout**: Mobile-first design approach
- **Dark Mode**: User-selectable dark/light themes
- **Modern Icons**: Lucide React icon library
- **Smooth Animations**: CSS transitions and transforms

### Components
- **Navigation**: Sidebar navigation with active states
- **Forms**: Consistent form styling and validation
- **Tables**: Data tables with sorting and filtering
- **Modals**: Popup dialogs for forms and confirmations
- **Charts**: Data visualization with Chart.js
- **Notifications**: Toast notifications and alerts

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **Role-based Access**: Different permission levels
- **Input Validation**: Server-side validation with Joi
- **Rate Limiting**: API rate limiting protection
- **CORS Configuration**: Cross-origin request security

## 📊 Reporting Features

- **Sales Analytics**: Revenue and profit tracking
- **Inventory Reports**: Stock levels and low stock alerts
- **Customer Analytics**: Customer behavior and spending
- **Payment Methods**: Payment method distribution
- **Category Analysis**: Product category performance
- **Time-based Reports**: Daily, weekly, monthly reports

## 🚀 Deployment

### Backend Deployment
1. Set up a MongoDB Atlas cluster or server
2. Update environment variables for production
3. Deploy to platforms like Heroku, AWS, or DigitalOcean
4. Ensure JWT_SECRET is properly secured

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy to platforms like Netlify, Vercel, or AWS S3
3. Update API URLs for production environment

### Environment Variables
```env
NODE_ENV=production
MONGODB_URI=mongodb://your-production-db
JWT_SECRET=your-production-jwt-secret
FRONTEND_URL=https://your-frontend-domain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Updates

### Version 1.0.0
- Initial release with core POS functionality
- Multi-shop management system
- Complete inventory management
- Customer database
- Sales and transaction processing
- Reporting and analytics
- Notification system
- Responsive design with dark mode

---

**LT Innovations POS System** - Professional jewelry store management solution.
