// JewelryShop POS System - Main JavaScript File

// Global variables
let currentPage = 'dashboard';
let cart = [];
let oldGoldCart = [];
let completedSales = [];
let oldGoldPurchases = [];

// Authentication check
function checkAuthentication() {
    if (sessionStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Notification system
let notifications = [];
let unreadNotifications = 0;

function loadNotifications() {
    // Load system alerts from localStorage
    const storedAlerts = localStorage.getItem('systemAlerts');
    if (storedAlerts) {
        const systemAlerts = JSON.parse(storedAlerts);
        notifications = systemAlerts.filter(alert => alert.isActive);
        unreadNotifications = notifications.length;
        updateNotificationBadge();
        displayNotifications();
    }
}

function updateNotificationBadge() {
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        if (unreadNotifications > 0) {
            badge.textContent = unreadNotifications;
            badge.style.display = 'block';
        } else {
            badge.style.display = 'none';
        }
    }
}

function displayNotifications() {
    const notificationDropdown = document.getElementById('notification-dropdown');
    if (notificationDropdown && notifications.length > 0) {
        notificationDropdown.innerHTML = `
            <div class="notification-header">
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white">System Notifications</h3>
                <button onclick="markAllAsRead()" class="text-xs text-primary hover:text-primary/80">Mark all read</button>
            </div>
            <div class="notification-list">
                ${notifications.map(notification => `
                    <div class="notification-item ${getNotificationClass(notification.type)}" onclick="markAsRead(${notification.id})">
                        <div class="notification-icon">
                            ${getNotificationIcon(notification.type)}
                        </div>
                        <div class="notification-content">
                            <h4 class="notification-title">${notification.title}</h4>
                            <p class="notification-message">${notification.message}</p>
                            <span class="notification-time">${formatNotificationDate(notification.createdDate)}</span>
                        </div>
                        <div class="notification-close" onclick="event.stopPropagation(); dismissNotification(${notification.id})">
                            <span class="material-symbols-outlined">close</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    } else if (notificationDropdown) {
        notificationDropdown.innerHTML = `
            <div class="notification-empty">
                <span class="material-symbols-outlined">notifications_off</span>
                <p>No notifications</p>
            </div>
        `;
    }
}

function getNotificationClass(type) {
    switch(type) {
        case 'maintenance': return 'notification-maintenance';
        case 'update': return 'notification-update';
        case 'warning': return 'notification-warning';
        case 'info': return 'notification-info';
        case 'urgent': return 'notification-urgent';
        default: return 'notification-default';
    }
}

function getNotificationIcon(type) {
    switch(type) {
        case 'maintenance': return '<span class="material-symbols-outlined">build</span>';
        case 'update': return '<span class="material-symbols-outlined">system_update</span>';
        case 'warning': return '<span class="material-symbols-outlined">warning</span>';
        case 'info': return '<span class="material-symbols-outlined">info</span>';
        case 'urgent': return '<span class="material-symbols-outlined">priority_high</span>';
        default: return '<span class="material-symbols-outlined">notifications</span>';
    }
}

function formatNotificationDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
}

function markAsRead(notificationId) {
    // In a real system, this would mark the notification as read in the database
    // For demo purposes, we'll just remove it from the display
    notifications = notifications.filter(n => n.id !== notificationId);
    unreadNotifications = Math.max(0, unreadNotifications - 1);
    updateNotificationBadge();
    displayNotifications();
}

function markAllAsRead() {
    notifications = [];
    unreadNotifications = 0;
    updateNotificationBadge();
    displayNotifications();
}

function dismissNotification(notificationId) {
    // Remove notification from localStorage
    const storedAlerts = localStorage.getItem('systemAlerts');
    if (storedAlerts) {
        const systemAlerts = JSON.parse(storedAlerts);
        const alert = systemAlerts.find(a => a.id === notificationId);
        if (alert) {
            alert.isActive = false;
            localStorage.setItem('systemAlerts', JSON.stringify(systemAlerts));
        }
    }
    
    // Remove from display
    notifications = notifications.filter(n => n.id !== notificationId);
    unreadNotifications = Math.max(0, unreadNotifications - 1);
    updateNotificationBadge();
    displayNotifications();
}

function toggleNotifications() {
    const dropdown = document.getElementById('notification-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

// Logout function
function logout() {
    sessionStorage.clear();
    window.location.href = 'login.html';
}

// Theme Toggle Function
function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}
let products = [
    { 
        id: 1, 
        sku: 'GR-001-18K', 
        name: 'Gold Ring - Size 8', 
        price: 450, 
        category: 'Rings', 
        stock: 15, 
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMTgiIHN0cm9rZT0iI0ZGQjcyNCIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSIjRkZGQkYwIi8+CjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEyIiBzdHJva2U9IiNGRkI3MjQiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIvPgo8L3N2Zz4K',
        labourCost: 80,
        materialCost: 320,
        totalCost: 400,
        purity: '18K',
        weight: '3.2g'
    },
    { 
        id: 2, 
        sku: 'SN-002-925', 
        name: 'Silver Necklace', 
        price: 320, 
        category: 'Necklaces', 
        stock: 8, 
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTUgMjBMMTAgMTVMMjAgMTBMMzAgMTVMMzUgMjAiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+CjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjMiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+Cg==',
        labourCost: 45,
        materialCost: 220,
        totalCost: 265,
        purity: '925 Silver',
        weight: '15.5g'
    },
    { 
        id: 3, 
        sku: 'DE-003-14K', 
        name: 'Diamond Earrings', 
        price: 850, 
        category: 'Earrings', 
        stock: 5, 
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBvbHlnb24gcG9pbnRzPSIyMCw1IDI1LDEwIDM1LDEwIDI3LjUsMTggMzAsMzAgMjAsMjUgMTAsMzAgMTIuNSwxOCA1LDEwIDE1LDEwIiBzdHJva2U9IiNCN0U0RjciIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0iI0U1RjdGQiIvPgo8L3N2Zz4K',
        labourCost: 120,
        materialCost: 580,
        totalCost: 700,
        purity: '14K Gold',
        weight: '2.8g'
    },
    { 
        id: 4, 
        sku: 'PB-004-NAT', 
        name: 'Pearl Bracelet', 
        price: 280, 
        category: 'Bracelets', 
        stock: 12, 
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMTUiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSIzIiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9IjE1IiBjeT0iMTUiIHI9IjMiIGZpbGw9IiNGRkZGRkYiLz4KPGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMyIgZmlsbD0iI0ZGRkZGRiIvPgo8Y2lyY2xlIGN4PSIyMCIgY3k9IjMwIiByPSIyLjUiIGZpbGw9IiNGRkZGRkYiLz4KPC9zdmc+Cg==',
        labourCost: 35,
        materialCost: 180,
        totalCost: 215,
        purity: 'Natural Pearl',
        weight: '12.3g'
    },
    { 
        id: 5, 
        sku: 'PW-005-PT', 
        name: 'Platinum Watch', 
        price: 1200, 
        category: 'Watches', 
        stock: 3, 
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMTUiIHN0cm9rZT0iI0U1RjdGQiIgc3Ryb2tlLXdpZHRoPSIzIiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEyIiBzdHJva2U9IiM2QjcyODAiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIvPgo8bGluZSB4MT0iMjAiIHkxPSIyMCIgeDI9IjIwIiB5Mj0iMTIiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxsaW5lIHgxPSIyMCIgeTE9IjIwIiB4Mj0iMjgiIHkyPSIyMCIgc3Ryb2tlPSIjNkI3MjgwIiBzdHJva2Utd2lkdGg9IjEuNSIvPgo8L3N2Zz4K',
        labourCost: 200,
        materialCost: 850,
        totalCost: 1050,
        purity: '950 Platinum',
        weight: '45.2g'
    }
];

let customers = [
    { id: 1, name: 'John Smith', email: 'john@email.com', phone: '+1-555-0123', address: '123 Main Street, New York, NY 10001', totalSpent: 2450 },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@email.com', phone: '+1-555-0456', address: '456 Oak Avenue, Los Angeles, CA 90210', totalSpent: 1890 },
    { id: 3, name: 'Mike Wilson', email: 'mike@email.com', phone: '+1-555-0789', address: '789 Pine Road, Chicago, IL 60601', totalSpent: 3200 },
    { id: 4, name: 'Emma Davis', email: 'emma@email.com', phone: '+1-555-0321', address: '321 Elm Street, Miami, FL 33101', totalSpent: 1560 }
];

// Add sample sales data for charts
const sampleSales = [
    {
        id: 'SALE-001',
        items: [
            { name: 'Gold Ring - Size 8', price: 450, quantity: 1 },
            { name: 'Silver Necklace', price: 180, quantity: 1 }
        ],
        customer: 'John Smith',
        paymentMethod: 'Card',
        total: 630,
        dateTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'SALE-002',
        items: [
            { name: 'Pearl Bracelet', price: 280, quantity: 2 },
            { name: 'Gold Earrings', price: 320, quantity: 1 }
        ],
        customer: 'Sarah Johnson',
        paymentMethod: 'Cash',
        total: 880,
        dateTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'SALE-003',
        items: [
            { name: 'Gold Ring - Size 8', price: 450, quantity: 1 }
        ],
        customer: 'Mike Wilson',
        paymentMethod: 'Online',
        total: 450,
        dateTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'SALE-004',
        items: [
            { name: 'Silver Necklace', price: 180, quantity: 1 },
            { name: 'Pearl Bracelet', price: 280, quantity: 1 }
        ],
        customer: 'Emma Davis',
        paymentMethod: 'Card',
        total: 460,
        dateTime: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'SALE-005',
        items: [
            { name: 'Gold Earrings', price: 320, quantity: 2 }
        ],
        customer: 'John Smith',
        paymentMethod: 'Cash',
        total: 640,
        dateTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    }
];

// Add sample sales to completed sales
completedSales.push(...sampleSales);

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
    }
    
    if (checkAuthentication()) {
        initializeApp();
        updateUserInfo();
        // Load notifications
        loadNotifications();
    }
});

function updateUserInfo() {
    const userName = sessionStorage.getItem('userName') || 'Admin User';
    document.getElementById('userName').textContent = userName;
}

function initializeApp() {
    setupNavigation();
    setupSidebarToggle();
    loadPage('dashboard');
}

// Navigation System
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            loadPage(page);
        });
    });
}

function loadPage(pageName) {
    // Update navigation
    updateNavigation(pageName);
    
    // Load page content
    const pageContent = document.getElementById('page-content');
    pageContent.innerHTML = getPageContent(pageName);
    
    // Update page title
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) {
        pageTitle.textContent = getPageTitle(pageName);
    }
    
    currentPage = pageName;
    
    // Initialize page-specific functionality
    initializePage(pageName);
}

function initializePage(pageName) {
    switch(pageName) {
        case 'dashboard':
            initializeDashboardPage();
            break;
        case 'sales':
            initializeSalesPage();
            break;
        case 'inventory':
            initializeInventoryPage();
            break;
        case 'customers':
            initializeCustomersPage();
            break;
        case 'reports':
            initializeReportsPage();
            break;
        case 'settings':
            initializeSettingsPage();
            break;
    }
}

function updateNavigation(pageName) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-page') === pageName) {
            item.classList.add('active');
        }
    });
}

function getPageTitle(pageName) {
    const titles = {
        'dashboard': 'Dashboard',
        'sales': 'Sales & POS',
        'inventory': 'Inventory Management',
        'customers': 'Customer Management',
        'history': 'Transaction History',
        'reports': 'Reports & Analytics',
        'settings': 'Settings'
    };
    return titles[pageName] || 'Dashboard';
}

// Page Content Generation
function getPageContent(pageName) {
    switch(pageName) {
        case 'dashboard':
            return getDashboardContent();
        case 'sales':
            return getSalesContent();
        case 'inventory':
            return getInventoryContent();
        case 'customers':
            return getCustomersContent();
        case 'history':
            return getHistoryContent();
        case 'reports':
            return getReportsContent();
        case 'settings':
            return getSettingsContent();
        default:
            return getDashboardContent();
    }
}

function getDashboardContent() {
    const todaySales = completedSales.filter(sale => {
        const saleDate = new Date(sale.dateTime);
        const today = new Date();
        return saleDate.toDateString() === today.toDateString();
    }).reduce((sum, sale) => sum + parseFloat(sale.total || 0), 0);

    const totalProducts = products.length;
    const lowStockProducts = products.filter(p => p.stock < 10).length;
    const totalCustomers = customers.length;
    const totalOldGoldPurchases = oldGoldPurchases.length;
    const oldGoldTotal = oldGoldPurchases.reduce((sum, purchase) => sum + parseFloat(purchase.amount || 0), 0);

    return `
        <div class="dashboard-container">
            <!-- Stats Cards -->
            <div class="dashboard-stats">
                <div class="stat-card">
                    <div class="stat-icon">
                        <span class="material-symbols-outlined">trending_up</span>
                    </div>
                    <div class="stat-info">
                        <h3>Today's Sales</h3>
                        <p class="stat-value">$${todaySales.toFixed(2)}</p>
                        <span class="stat-change positive">+12.5%</span>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">
                        <span class="material-symbols-outlined">receipt_long</span>
                    </div>
                    <div class="stat-info">
                        <h3>Total Orders</h3>
                        <p class="stat-value">${completedSales.length}</p>
                        <span class="stat-change positive">+8.2%</span>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">
                        <span class="material-symbols-outlined">inventory_2</span>
                    </div>
                    <div class="stat-info">
                        <h3>Products</h3>
                        <p class="stat-value">${totalProducts}</p>
                        <span class="stat-change">+23</span>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">
                        <span class="material-symbols-outlined">group</span>
                    </div>
                    <div class="stat-info">
                        <h3>Customers</h3>
                        <p class="stat-value">${totalCustomers}</p>
                        <span class="stat-change positive">+5.1%</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon">
                        <span class="material-symbols-outlined">monetization_on</span>
                    </div>
                    <div class="stat-info">
                        <h3>Old Gold Purchased</h3>
                        <p class="stat-value">$${oldGoldTotal.toFixed(2)}</p>
                        <span class="stat-change">${totalOldGoldPurchases} items</span>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">
                        <span class="material-symbols-outlined">trending_up</span>
                    </div>
                    <div class="stat-info">
                        <h3>Total Profit</h3>
                        <p class="stat-value">$${calculateTotalProfit().toFixed(2)}</p>
                        <span class="stat-change">${calculateProfitMargin().toFixed(1)}% margin</span>
                    </div>
                </div>
            </div>

            <!-- Charts Section -->
            <div class="dashboard-charts">
                <div class="chart-widget">
                    <div class="widget-header">
                        <h3>Sales Revenue</h3>
                        <div class="chart-controls">
                            <select id="salesPeriod" onchange="updateDashboardCharts()">
                                <option value="7">Last 7 Days</option>
                                <option value="30">Last 30 Days</option>
                                <option value="90">Last 90 Days</option>
                            </select>
                        </div>
                    </div>
                    <div class="chart-container">
                        <canvas id="salesChart"></canvas>
                    </div>
                </div>

                <div class="chart-widget">
                    <div class="widget-header">
                        <h3>Product Categories</h3>
                    </div>
                    <div class="chart-container">
                        <canvas id="categoryChart"></canvas>
                    </div>
                </div>

                <div class="chart-widget">
                    <div class="widget-header">
                        <h3>Payment Methods</h3>
                    </div>
                    <div class="chart-container">
                        <canvas id="paymentChart"></canvas>
                    </div>
                </div>

                <div class="chart-widget">
                    <div class="widget-header">
                        <h3>Top Selling Products</h3>
                    </div>
                    <div class="chart-container">
                        <canvas id="topProductsChart"></canvas>
                    </div>
                </div>
            </div>

            <!-- Data Tables -->
            <div class="dashboard-tables">
                <div class="table-widget">
                    <div class="widget-header">
                        <h3>Recent Sales</h3>
                        <button class="btn-secondary" onclick="loadPage('history')">View All</button>
                    </div>
                    <div class="table-content">
                        <div class="recent-sales">
                            ${completedSales.length > 0 ? completedSales.slice(-5).reverse().map(sale => `
                                <div class="sale-item">
                                    <div class="sale-info">
                                        <span class="sale-id">${sale.invoiceNo || 'N/A'}</span>
                                        <span class="sale-customer">${sale.customer || 'Walk-in'}</span>
                                        <span class="sale-date">${sale.dateTime || 'N/A'}</span>
                                    </div>
                                    <div class="sale-amount">
                                        <span class="amount">$${sale.total || '0.00'}</span>
                                        <span class="payment-method">${sale.paymentMethod || 'Cash'}</span>
                                    </div>
                                </div>
                            `).join('') : '<div class="no-data">No sales yet</div>'}
                        </div>
                    </div>
                </div>

                <div class="table-widget">
                    <div class="widget-header">
                        <h3>Low Stock Alert</h3>
                        <button class="btn-secondary" onclick="loadPage('inventory')">Manage</button>
                    </div>
                    <div class="table-content">
                        <div class="low-stock-items">
                            ${products.filter(p => p.stock < 10).slice(0, 5).map(product => `
                                <div class="stock-item">
                                    <div class="item-info">
                                        <span class="item-name">${product.name}</span>
                                        <span class="item-sku">SKU: ${product.sku}</span>
                                    </div>
                                    <div class="stock-info">
                                        <span class="stock-count ${product.stock < 5 ? 'critical' : 'low'}">${product.stock} left</span>
                                        <span class="stock-status ${product.stock < 5 ? 'critical' : 'low'}">${product.stock < 5 ? 'Critical' : 'Low'}</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getSalesContent() {
    return `
        <div class="sales-system">
            <div class="sales-main">
                <div class="products-section">
                    <div class="search-section">
                        <div class="search-input-group">
                            <span class="material-symbols-outlined search-icon">search</span>
                            <input type="text" id="product-search" placeholder="Search for products" onkeyup="searchProducts()">
                        </div>
                        <div class="qr-input-group">
                            <span class="material-symbols-outlined qr-icon">qr_code_scanner</span>
                            <input type="text" placeholder="Scan QR code">
                        </div>
                    </div>
                    
                    <div class="products-grid">
                        ${products.map(product => `
                            <div class="product-card" onclick="addToCart(${product.id})">
                                <div class="product-image">
                                    <img src="${product.image}" alt="${product.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xNSAxNUwyNSAyNU0yNSAxNUwxNSAyNSIgc3Ryb2tlPSIjOUNBM0FGIiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+Cg=='">
                                </div>
                                <div class="product-info">
                                    <h4 class="product-name">${product.name}</h4>
                                    <p class="product-sku">SKU: ${product.sku}</p>
                                    <p class="product-price">$${product.price}</p>
                                    <p class="product-stock">Stock: ${product.stock}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="cart-items-section">
                        <h3 class="section-title">Cart Items</h3>
                        <div class="cart-items" id="cart-items">
                            <div class="empty-cart">
                                <span class="material-symbols-outlined">shopping_cart</span>
                                <p>No items in cart</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="checkout-section">
                    <div class="customer-section">
                        <h3 class="section-title">Customer</h3>
                        <select class="customer-select" id="customer-select">
                            <option>Select Customer</option>
                            <option>Walk-in Customer</option>
                            ${customers.map(customer => `<option value="${customer.id}">${customer.name}</option>`).join('')}
                        </select>
                    </div>
                    
                    <div class="options-section">
                        <h3 class="section-title">Options</h3>
                        <div class="options-grid">
                            <div class="option-item">
                                <span>Old Gold Exchange</span>
                                <button class="btn-add-old-gold" onclick="openOldGoldModal()">
                                    <span class="material-symbols-outlined">add</span>
                                    Add Old Gold
                                </button>
                            </div>
                            <div class="option-item">
                                <span>Discounts</span>
                                <button class="btn-discount" onclick="openDiscountModal()">
                                    <span class="material-symbols-outlined">percent</span>
                                    Apply
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="payment-section">
                        <h3 class="section-title">Payment</h3>
                        <div class="payment-options">
                            <label class="payment-option">
                                <input type="radio" name="payment" value="cash" checked>
                                <div class="payment-card active">Cash</div>
                            </label>
                            <label class="payment-option">
                                <input type="radio" name="payment" value="card">
                                <div class="payment-card">Card</div>
                            </label>
                            <label class="payment-option">
                                <input type="radio" name="payment" value="online">
                                <div class="payment-card">Online</div>
                            </label>
                        </div>
                    </div>
                    
                    <div class="totals-section">
                        <div class="total-line">
                            <span>Subtotal</span>
                            <span id="subtotal">$0.00</span>
                        </div>
                        <div class="total-line" id="old-gold-line" style="display: none;">
                            <span>Old Gold Exchange</span>
                            <span id="old-gold-total">-$0.00</span>
                        </div>
                        <div class="total-line" id="discount-line" style="display: none;">
                            <span>Discount</span>
                            <span id="discount-total">-$0.00</span>
                        </div>
                        <div class="total-line final-total">
                            <span>Total</span>
                            <span id="final-total">$0.00</span>
                        </div>
                        <button class="checkout-btn" onclick="processSale()">
                            Checkout
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- Old Gold Modal -->
            <div id="oldGoldModal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Add Old Gold Exchange</h3>
                        <button class="modal-close" onclick="closeOldGoldModal()">
                            <span class="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label>Weight (grams)</label>
                            <input type="number" id="goldWeight" step="0.1" placeholder="0.0" onchange="calculateOldGoldValue()">
                        </div>
                        <div class="form-group">
                            <label>Purity</label>
                            <select id="goldPurity" onchange="calculateOldGoldValue()">
                                <option value="22">22K</option>
                                <option value="18">18K</option>
                                <option value="14">14K</option>
                                <option value="10">10K</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Rate per gram ($)</label>
                            <input type="number" id="goldRate" step="0.01" placeholder="0.00" onchange="calculateOldGoldValue()">
                        </div>
                        <div class="form-group">
                            <label>Total Value</label>
                            <input type="number" id="totalValue" readonly placeholder="0.00">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-secondary" onclick="closeOldGoldModal()">Cancel</button>
                        <button class="btn-primary" onclick="addOldGoldToCart()">Add to Cart</button>
                    </div>
                </div>
            </div>
            
            <!-- Discount Modal -->
            <div id="discountModal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Apply Discount</h3>
                        <button class="modal-close" onclick="closeDiscountModal()">
                            <span class="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label>Discount Type</label>
                            <select id="discountType" onchange="updateDiscountCalculation()">
                                <option value="percentage">Percentage (%)</option>
                                <option value="fixed">Fixed Amount ($)</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Discount Value</label>
                            <input type="number" id="discountValue" step="0.01" placeholder="0.00" onchange="updateDiscountCalculation()">
                        </div>
                        <div class="form-group">
                            <label>Discount Amount</label>
                            <input type="number" id="discountAmount" readonly placeholder="0.00">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-secondary" onclick="closeDiscountModal()">Cancel</button>
                        <button class="btn-primary" onclick="applyDiscount()">Apply Discount</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getInventoryContent() {
    return `
        <div class="inventory-header">
            <h2>Inventory Management</h2>
            <div class="inventory-actions">
                <button class="btn-secondary" onclick="exportInventory()">
                    <i class="fas fa-download"></i>
                    Export
                </button>
                <button class="btn-primary" onclick="openAddProductModal()">
                    <i class="fas fa-plus"></i>
                    Add Product
                </button>
            </div>
        </div>
        
        <div class="inventory-filters">
            <div class="filter-group">
                <input type="text" id="inventory-search" placeholder="Search by SKU, name, or category..." onkeyup="filterInventory()">
                <select id="category-filter" onchange="filterInventory()">
                    <option value="">All Categories</option>
                    <option value="Rings">Rings</option>
                    <option value="Necklaces">Necklaces</option>
                    <option value="Earrings">Earrings</option>
                    <option value="Bracelets">Bracelets</option>
                    <option value="Watches">Watches</option>
                    <option value="Pendants">Pendants</option>
                    <option value="Chains">Chains</option>
                </select>
                <select id="stock-filter" onchange="filterInventory()">
                    <option value="">All Stock Levels</option>
                    <option value="low">Low Stock (â‰¤5)</option>
                    <option value="out">Out of Stock</option>
                </select>
            </div>
        </div>
        
        <div class="inventory-table">
            <div class="table-header">
                <h3>Product Inventory</h3>
                <div class="table-actions">
                    <span class="total-items">${products.length} Products</span>
                </div>
            </div>
            <div class="table-content">
                <table id="inventory-table">
                    <thead>
                        <tr>
                            <th>SKU</th>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Purity</th>
                            <th>Weight</th>
                            <th>Material Cost</th>
                            <th>Labour Cost</th>
                            <th>Total Cost</th>
                            <th>Selling Price</th>
                            <th>Profit</th>
                            <th>Stock</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${products.map(product => {
                            const profit = product.price - product.totalCost;
                            const profitMargin = ((profit / product.price) * 100).toFixed(1);
                            return `
                                <tr data-category="${product.category}" data-stock="${product.stock}">
                                    <td><span class="sku">${product.sku}</span></td>
                                    <td>
                                        <div class="product-info">
                                            <div class="product-image">
                                                <img src="${product.image}" alt="${product.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xNSAxNUwyNSAyNU0yNSAxNUwxNSAyNSIgc3Ryb2tlPSIjOUNBM0FGIiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+Cg=='">
                                            </div>
                                            <div class="product-details">
                                                <span class="product-name">${product.name}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span class="category-badge">${product.category}</span></td>
                                    <td><span class="purity">${product.purity}</span></td>
                                    <td><span class="weight">${product.weight}</span></td>
                                    <td><span class="cost">$${product.materialCost}</span></td>
                                    <td><span class="cost">$${product.labourCost}</span></td>
                                    <td><span class="total-cost">$${product.totalCost}</span></td>
                                    <td><span class="price">$${product.price}</span></td>
                                    <td>
                                        <span class="profit ${profit > 0 ? 'positive' : 'negative'}">
                                            $${profit} (${profitMargin}%)
                                        </span>
                                    </td>
                                    <td><span class="stock-count">${product.stock}</span></td>
                                    <td>
                                        <span class="stock-status ${product.stock > 5 ? 'in-stock' : product.stock > 0 ? 'low-stock' : 'out-of-stock'}">
                                            ${product.stock > 5 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                                        </span>
                                    </td>
                                    <td>
                                        <div class="action-buttons">
                                            <button class="btn-edit" onclick="editProduct(${product.id})" title="Edit Product">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button class="btn-view" onclick="viewProduct(${product.id})" title="View Details">
                                                <i class="fas fa-eye"></i>
                                            </button>
                                            <button class="btn-delete" onclick="deleteProduct(${product.id})" title="Delete Product">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </div>
        
        <!-- Add/Edit Product Modal -->
        <div id="productModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 id="modalTitle">Add New Product</h3>
                    <button class="modal-close" onclick="closeProductModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <form id="productForm" onsubmit="saveProduct(event)">
                    <div class="modal-body">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="productSku">SKU *</label>
                                <input type="text" id="productSku" name="sku" required placeholder="e.g., GR-001-18K">
                            </div>
                            <div class="form-group">
                                <label for="productName">Product Name *</label>
                                <input type="text" id="productName" name="name" required placeholder="e.g., Gold Ring - Size 8">
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="productCategory">Category *</label>
                                <select id="productCategory" name="category" required>
                                    <option value="">Select Category</option>
                                    <option value="Rings">Rings</option>
                                    <option value="Necklaces">Necklaces</option>
                                    <option value="Earrings">Earrings</option>
                                    <option value="Bracelets">Bracelets</option>
                                    <option value="Watches">Watches</option>
                                    <option value="Pendants">Pendants</option>
                                    <option value="Chains">Chains</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="productPurity">Purity *</label>
                                <input type="text" id="productPurity" name="purity" required placeholder="e.g., 18K, 925 Silver">
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="productWeight">Weight *</label>
                                <input type="text" id="productWeight" name="weight" required placeholder="e.g., 3.2g">
                            </div>
                            <div class="form-group">
                                <label for="productStock">Initial Stock *</label>
                                <input type="number" id="productStock" name="stock" required min="0" placeholder="0">
                            </div>
                        </div>
                        
                        <div class="cost-section">
                            <h4>Cost Breakdown</h4>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="materialCost">Material Cost *</label>
                                    <input type="number" id="materialCost" name="materialCost" required min="0" step="0.01" placeholder="0.00" onchange="calculateTotalCost()">
                                </div>
                                <div class="form-group">
                                    <label for="labourCost">Labour Cost *</label>
                                    <input type="number" id="labourCost" name="labourCost" required min="0" step="0.01" placeholder="0.00" onchange="calculateTotalCost()">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="totalCost">Total Cost</label>
                                    <input type="number" id="totalCost" name="totalCost" readonly placeholder="0.00">
                                </div>
                                <div class="form-group">
                                    <label for="sellingPrice">Selling Price *</label>
                                    <input type="number" id="sellingPrice" name="sellingPrice" required min="0" step="0.01" placeholder="0.00" onchange="calculateProfit()">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="profitAmount">Profit Amount</label>
                                    <input type="number" id="profitAmount" readonly placeholder="0.00">
                                </div>
                                <div class="form-group">
                                    <label for="profitMargin">Profit Margin (%)</label>
                                    <input type="number" id="profitMargin" readonly placeholder="0.0">
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="productImage">Product Image</label>
                            <div class="image-upload-container">
                                <input type="file" id="productImage" name="image" accept="image/png,image/jpeg,image/jpg" onchange="handleImageUpload(event)" style="display: none;">
                                <div class="image-upload-area" onclick="document.getElementById('productImage').click()">
                                    <div id="imagePreview" class="image-preview">
                                        <i class="fas fa-cloud-upload-alt"></i>
                                        <p>Click to upload image</p>
                                        <span>PNG, JPG up to 2MB</span>
                                    </div>
                                </div>
                                <button type="button" class="btn-remove-image" id="removeImageBtn" onclick="removeImage()" style="display: none;">
                                    <i class="fas fa-trash"></i>
                                    Remove Image
                                </button>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="productDescription">Description</label>
                            <textarea id="productDescription" name="description" rows="3" placeholder="Product description..."></textarea>
                        </div>
                    </div>
                    
                    <div class="modal-footer">
                        <button type="button" class="btn-secondary" onclick="closeProductModal()">Cancel</button>
                        <button type="submit" class="btn-primary">
                            <i class="fas fa-save"></i>
                            Save Product
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

function getHistoryContent() {
    return `
        <div class="history-header">
            <h2>Transaction History</h2>
            <div class="history-filters">
                <input type="text" id="history-search" placeholder="Search by Invoice No, Customer Name, or Product..." onkeyup="filterHistory()">
                <select id="history-period" onchange="filterHistory()">
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                </select>
            </div>
        </div>
        
        <div class="history-table">
            <div class="table-header">
                <h3>Completed Sales</h3>
                <div class="table-actions">
                    <span class="total-items">${completedSales.length} Transactions</span>
                    <button class="btn-secondary" onclick="exportHistory()">
                        <i class="fas fa-download"></i>
                        Export
                    </button>
                </div>
            </div>
            <div class="table-content">
                <table id="history-table">
                    <thead>
                        <tr>
                            <th>Invoice No</th>
                            <th>Date & Time</th>
                            <th>Customer</th>
                            <th>Items</th>
                            <th>Type</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${completedSales.map(sale => `
                            <tr>
                                <td><span class="invoice-no">${sale.invoiceNo}</span></td>
                                <td><span class="date-time">${sale.dateTime}</span></td>
                                <td><span class="customer-name">${sale.customer}</span></td>
                                <td><span class="items">${sale.items}</span></td>
                                <td><span class="sale-type ${sale.type}">${sale.type}</span></td>
                                <td><span class="amount">$${sale.amount}</span></td>
                                <td><span class="status completed">Completed</span></td>
                                <td>
                                    <div class="action-buttons">
                                        <button class="btn-view" onclick="viewInvoice('${sale.invoiceNo}')" title="View Invoice">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        <button class="btn-edit" onclick="reprintInvoice('${sale.invoiceNo}')" title="Reprint Invoice">
                                            <i class="fas fa-print"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
        
        <div class="old-gold-history">
            <div class="table-header">
                <h3>Old Gold Purchases</h3>
                <div class="table-actions">
                    <span class="total-items">${oldGoldPurchases.length} Purchases</span>
                </div>
            </div>
            <div class="table-content">
                <table id="old-gold-table">
                    <thead>
                        <tr>
                            <th>Purchase No</th>
                            <th>Date & Time</th>
                            <th>Customer</th>
                            <th>Weight</th>
                            <th>Purity</th>
                            <th>Rate</th>
                            <th>Amount</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${oldGoldPurchases.map(purchase => `
                            <tr>
                                <td><span class="purchase-no">${purchase.purchaseNo}</span></td>
                                <td><span class="date-time">${purchase.dateTime}</span></td>
                                <td><span class="customer-name">${purchase.customer}</span></td>
                                <td><span class="weight">${purchase.weight}g</span></td>
                                <td><span class="purity">${purchase.purity}K</span></td>
                                <td><span class="rate">$${purchase.rate}/g</span></td>
                                <td><span class="amount">$${purchase.amount}</span></td>
                                <td>
                                    <div class="action-buttons">
                                        <button class="btn-view" onclick="viewOldGoldPurchase('${purchase.purchaseNo}')" title="View Details">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function getCustomersContent() {
    return `
        <div class="customers-container">
            <!-- Header Section -->
            <div class="customers-header">
                <div class="header-left">
                    <h2>Customer Management</h2>
                    <p>Manage your customer database and view customer details</p>
                </div>
                <div class="header-right">
                    <div class="search-section">
                        <div class="search-input-group">
                            <span class="material-symbols-outlined">search</span>
                            <input type="text" id="customer-search" placeholder="Search customers..." onkeyup="searchCustomers()">
                        </div>
                    </div>
                    <button class="btn-primary" onclick="openAddCustomerModal()">
                        <span class="material-symbols-outlined">add</span>
                        Add Customer
                    </button>
                </div>
            </div>

            <!-- Stats Cards -->
            <div class="customers-stats">
                <div class="stat-card">
                    <div class="stat-icon">
                        <span class="material-symbols-outlined">group</span>
                    </div>
                    <div class="stat-info">
                        <h3>Total Customers</h3>
                        <p class="stat-value">${customers.length}</p>
                        <span class="stat-change positive">+${Math.floor(customers.length * 0.15)} this month</span>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">
                        <span class="material-symbols-outlined">monetization_on</span>
                    </div>
                    <div class="stat-info">
                        <h3>Total Spent</h3>
                        <p class="stat-value">$${customers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}</p>
                        <span class="stat-change positive">+12.5%</span>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">
                        <span class="material-symbols-outlined">trending_up</span>
                    </div>
                    <div class="stat-info">
                        <h3>Avg. Spend</h3>
                        <p class="stat-value">$${Math.round(customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length)}</p>
                        <span class="stat-change positive">+8.2%</span>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">
                        <span class="material-symbols-outlined">star</span>
                    </div>
                    <div class="stat-info">
                        <h3>VIP Customers</h3>
                        <p class="stat-value">${customers.filter(c => c.totalSpent > 2000).length}</p>
                        <span class="stat-change">High value</span>
                    </div>
                </div>
            </div>

            <!-- Main Content -->
            <div class="customers-main">
                <!-- Customer List -->
                <div class="customers-list-section">
                    <div class="section-header">
                        <h3>Customer Database</h3>
                        <div class="filter-options">
                            <select id="customer-filter" onchange="filterCustomers()">
                                <option value="">All Customers</option>
                                <option value="vip">VIP (>$2000)</option>
                                <option value="regular">Regular (<$2000)</option>
                                <option value="new">New (This Month)</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="customers-table-container">
                        <table class="customers-table">
                            <thead>
                                <tr>
                                    <th>
                                        <span class="material-symbols-outlined">person</span>
                                        Customer
                                    </th>
                                    <th>
                                        <span class="material-symbols-outlined">contact_mail</span>
                                        Contact
                                    </th>
                                    <th>
                                        <span class="material-symbols-outlined">location_on</span>
                                        Address
                                    </th>
                                    <th>
                                        <span class="material-symbols-outlined">phone</span>
                                        Phone
                                    </th>
                                    <th>
                                        <span class="material-symbols-outlined">payments</span>
                                        Total Spent
                                    </th>
                                    <th>
                                        <span class="material-symbols-outlined">category</span>
                                        Status
                                    </th>
                                    <th>
                                        <span class="material-symbols-outlined">more_vert</span>
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                ${customers.map(customer => `
                                    <tr class="customer-row" onclick="viewCustomerDetails(${customer.id})">
                                        <td>
                                            <div class="customer-info">
                                                <div class="customer-avatar">
                                                    <span class="material-symbols-outlined">person</span>
                                                </div>
                                                <div class="customer-details">
                                                    <div class="customer-name">${customer.name}</div>
                                                    <div class="customer-id">ID: ${customer.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="contact-info">
                                                <div class="email">${customer.email}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="address-info">
                                                <div class="address">${customer.address}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="phone-info">
                                                <span class="material-symbols-outlined">phone</span>
                                                ${customer.phone}
                                            </div>
                                        </td>
                                        <td>
                                            <div class="spent-info">
                                                <div class="spent-amount">$${customer.totalSpent.toLocaleString()}</div>
                                                <div class="spent-label">Total spent</div>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="status-badge ${customer.totalSpent > 2000 ? 'vip' : 'regular'}">
                                                <span class="material-symbols-outlined">${customer.totalSpent > 2000 ? 'star' : 'person'}</span>
                                                ${customer.totalSpent > 2000 ? 'VIP' : 'Regular'}
                                            </div>
                                        </td>
                                        <td>
                                            <div class="action-buttons" onclick="event.stopPropagation()">
                                                <button class="btn-icon" onclick="viewCustomerDetails(${customer.id})" title="View Details">
                                                    <span class="material-symbols-outlined">visibility</span>
                                                </button>
                                                <button class="btn-icon" onclick="editCustomer(${customer.id})" title="Edit Customer">
                                                    <span class="material-symbols-outlined">edit</span>
                                                </button>
                                                <button class="btn-icon danger" onclick="deleteCustomer(${customer.id})" title="Delete Customer">
                                                    <span class="material-symbols-outlined">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <!-- Customer Details Panel -->
                <div class="customer-details-panel">
                    <div class="panel-header">
                        <h3>Customer Details</h3>
                        <button class="btn-close" onclick="closeCustomerDetails()">
                            <span class="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    <div class="panel-content">
                        <div class="no-selection">
                            <span class="material-symbols-outlined">person_search</span>
                            <h4>Select a customer</h4>
                            <p>Click on a customer from the list to view their detailed information, purchase history, and preferences.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getReportsContent() {
    return `
        <div class="reports-header">
            <h2>Reports & Analytics</h2>
            <div class="reports-filters">
                <select id="report-period" onchange="updateCharts()">
                    <option value="30">Last 30 Days</option>
                    <option value="60">Last 60 Days</option>
                    <option value="90">Last 90 Days</option>
                    <option value="365">Last Year</option>
                </select>
                <button class="btn-secondary" onclick="exportReports()">
                    <i class="fas fa-download"></i>
                    Export Reports
                </button>
            </div>
        </div>
        
        <div class="reports-stats">
            <div class="stat-card">
                <div class="stat-icon">
                    <span class="material-symbols-outlined">attach_money</span>
                </div>
                <div class="stat-info">
                    <h3>Total Revenue</h3>
                    <p class="stat-value">$${completedSales.reduce((sum, sale) => sum + parseFloat(sale.total || 0), 0).toLocaleString()}</p>
                    <span class="stat-change positive">+12.5%</span>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon">
                    <span class="material-symbols-outlined">shopping_bag</span>
                </div>
                <div class="stat-info">
                    <h3>Total Sales</h3>
                    <p class="stat-value">${completedSales.length}</p>
                    <span class="stat-change positive">+8.2%</span>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon">
                    <span class="material-symbols-outlined">trending_up</span>
                </div>
                <div class="stat-info">
                    <h3>Total Profit</h3>
                    <p class="stat-value">$${calculateTotalProfit().toLocaleString()}</p>
                    <span class="stat-change positive">${calculateProfitMargin().toFixed(1)}% margin</span>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon">
                    <span class="material-symbols-outlined">inventory</span>
                </div>
                <div class="stat-info">
                    <h3>Low Stock Items</h3>
                    <p class="stat-value">${products.filter(p => p.stock <= 10).length}</p>
                    <span class="stat-change negative">${products.filter(p => p.stock <= 5).length} critical</span>
                </div>
            </div>
        </div>
        
        <div class="reports-grid">
            <div class="chart-container">
                <h3>Sales Revenue & Profit Trend</h3>
                <canvas id="salesChart" width="400" height="200"></canvas>
            </div>
            
            <div class="chart-container">
                <h3>Revenue by Category</h3>
                <canvas id="categoryChart" width="400" height="200"></canvas>
            </div>
            
            <div class="chart-container">
                <h3>Payment Methods Distribution</h3>
                <canvas id="paymentChart" width="400" height="200"></canvas>
            </div>
            
            <div class="chart-container">
                <h3>Stock Status Overview</h3>
                <canvas id="stockChart" width="400" height="200"></canvas>
            </div>
            
            <div class="chart-container">
                <h3>Top Selling Products</h3>
                <canvas id="topProductsChart" width="400" height="200"></canvas>
            </div>
            
            <div class="chart-container">
                <h3>Old Gold Purchases</h3>
                <canvas id="oldGoldChart" width="400" height="200"></canvas>
            </div>
        </div>
    `;
}

function getSettingsContent() {
    return `
        <div class="settings-grid">
            <div class="settings-section">
                <h3>Store Information</h3>
                <div class="form-group">
                    <label>Store Name</label>
                    <input type="text" value="JewelryShop POS" placeholder="Enter store name">
                </div>
                <div class="form-group">
                    <label>Store Address</label>
                    <input type="text" value="123 Jewelry Street, Diamond City" placeholder="Enter store address">
                </div>
                <div class="form-group">
                    <label>Phone Number</label>
                    <input type="text" value="+1-555-JEWELS" placeholder="Enter phone number">
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" value="info@jewelryshop.com" placeholder="Enter email">
                </div>
            </div>
            
            <div class="settings-section">
                <h3>System Settings</h3>
                <div class="form-group">
                    <label>Currency</label>
                    <select>
                        <option value="USD" selected>USD ($)</option>
                        <option value="EUR">EUR (â‚¬)</option>
                        <option value="GBP">GBP (Â£)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Tax Rate (%)</label>
                    <input type="number" value="8.5" placeholder="Enter tax rate">
                </div>
                <div class="form-group">
                    <label>Low Stock Threshold</label>
                    <input type="number" value="5" placeholder="Enter threshold">
                </div>
                <div class="form-group">
                    <label>Receipt Printer</label>
                    <select>
                        <option value="thermal" selected>Thermal Printer</option>
                        <option value="laser">Laser Printer</option>
                        <option value="none">None</option>
                    </select>
                </div>
            </div>
            
            <div class="settings-section">
                <h3>User Management</h3>
                <div class="form-group">
                    <label>Current User</label>
                    <input type="text" value="Admin User" readonly>
                </div>
                <div class="form-group">
                    <label>Role</label>
                    <input type="text" value="Administrator" readonly>
                </div>
                <button class="btn-secondary">Change Password</button>
                <button class="btn-secondary">Add New User</button>
            </div>
            
            <div class="settings-section">
                <h3>Backup & Security</h3>
                <div class="form-group">
                    <label>Auto Backup</label>
                    <select>
                        <option value="daily" selected>Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="disabled">Disabled</option>
                    </select>
                </div>
                <button class="btn-secondary">Create Backup Now</button>
                <button class="btn-secondary">Restore from Backup</button>
                <button class="btn-primary">Export Data</button>
            </div>
        </div>
    `;
}

// Page Initialization

// Sales Page Functions
function initializeSalesPage() {
    updateCartDisplay();
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product && product.stock > 0) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCartDisplay();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
}

function updateCartQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(0, quantity);
        if (item.quantity === 0) {
            removeFromCart(productId);
        } else {
            updateCartDisplay();
        }
    }
}

function updateSellingPrice(productId, sellingPrice) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.sellingPrice = parseFloat(sellingPrice) || item.price;
        updateCartDisplay();
    }
}

function clearCart() {
    cart = [];
    currentDiscount = 0;
    currentOldGoldValue = 0;
    updateCartDisplay();
}

// Old Gold Modal Functions
function openOldGoldModal() {
    document.getElementById('oldGoldModal').style.display = 'block';
}

function closeOldGoldModal() {
    document.getElementById('oldGoldModal').style.display = 'none';
    // Clear form
    document.getElementById('goldWeight').value = '';
    document.getElementById('goldRate').value = '';
    document.getElementById('totalValue').value = '';
}

function calculateOldGoldValue() {
    const weight = parseFloat(document.getElementById('goldWeight').value) || 0;
    const rate = parseFloat(document.getElementById('goldRate').value) || 0;
    const totalValue = weight * rate;
    document.getElementById('totalValue').value = totalValue.toFixed(2);
}

function addOldGoldToCart() {
    const weight = parseFloat(document.getElementById('goldWeight').value);
    const purity = document.getElementById('goldPurity').value;
    const rate = parseFloat(document.getElementById('goldRate').value);
    
    if (!weight || !rate) {
        alert('Please fill in weight and rate.');
        return;
    }
    
    currentOldGoldValue = weight * rate;
    closeOldGoldModal();
    updateTotals();
}

// Discount Modal Functions
function openDiscountModal() {
    document.getElementById('discountModal').style.display = 'block';
}

function closeDiscountModal() {
    document.getElementById('discountModal').style.display = 'none';
    // Clear form
    document.getElementById('discountType').value = 'percentage';
    document.getElementById('discountValue').value = '';
    document.getElementById('discountAmount').value = '';
}

function updateDiscountCalculation() {
    const type = document.getElementById('discountType').value;
    const value = parseFloat(document.getElementById('discountValue').value) || 0;
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    let amount = 0;
    if (type === 'percentage') {
        amount = (subtotal * value) / 100;
    } else {
        amount = value;
    }
    
    document.getElementById('discountAmount').value = amount.toFixed(2);
}

function applyDiscount() {
    const amount = parseFloat(document.getElementById('discountAmount').value) || 0;
    currentDiscount = amount;
    closeDiscountModal();
    updateTotals();
}


function searchProducts() {
    const searchTerm = document.getElementById('product-search').value.toLowerCase();
    const productGrid = document.getElementById('product-grid');
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
    
    productGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" onclick="addToCart(${product.id})">
            <div class="product-image">
                <span style="font-size: 2rem;">${product.image}</span>
            </div>
            <div class="product-name">${product.name}</div>
            <div class="product-price">$${product.price}</div>
            <div class="product-stock">Stock: ${product.stock}</div>
        </div>
    `).join('');
}


// Utility Functions
function getLowStockItems() {
    return products.filter(product => product.stock <= 5);
}

function setupSidebarToggle() {
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('open');
        });
    }
}

// Inventory Management Functions
let editingProductId = null;

function openAddProductModal() {
    editingProductId = null;
    document.getElementById('modalTitle').textContent = 'Add New Product';
    document.getElementById('productForm').reset();
    resetImageUpload();
    setupDragAndDrop();
    document.getElementById('productModal').style.display = 'block';
}

function resetImageUpload() {
    const imagePreview = document.getElementById('imagePreview');
    const removeBtn = document.getElementById('removeImageBtn');
    
    imagePreview.innerHTML = `
        <i class="fas fa-cloud-upload-alt"></i>
        <p>Click to upload image</p>
        <span>PNG, JPG up to 2MB</span>
    `;
    imagePreview.removeAttribute('data-image-data');
    removeBtn.style.display = 'none';
}

function setupDragAndDrop() {
    const uploadArea = document.querySelector('.image-upload-area');
    
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const fileInput = document.getElementById('productImage');
            fileInput.files = files;
            handleImageUpload({ target: fileInput });
        }
    });
}

function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        editingProductId = id;
        document.getElementById('modalTitle').textContent = 'Edit Product';
        
        // Fill form with product data
        document.getElementById('productSku').value = product.sku;
        document.getElementById('productName').value = product.name;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productPurity').value = product.purity;
        document.getElementById('productWeight').value = product.weight;
        document.getElementById('productStock').value = product.stock;
        document.getElementById('materialCost').value = product.materialCost;
        document.getElementById('labourCost').value = product.labourCost;
        document.getElementById('totalCost').value = product.totalCost;
        document.getElementById('sellingPrice').value = product.price;
        
        // Handle existing image
        const imagePreview = document.getElementById('imagePreview');
        const removeBtn = document.getElementById('removeImageBtn');
        
        if (product.image && product.image !== '') {
            imagePreview.innerHTML = `<img src="${product.image}" alt="Product Preview" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">`;
            imagePreview.dataset.imageData = product.image;
            removeBtn.style.display = 'block';
        } else {
            imagePreview.innerHTML = `
                <i class="fas fa-cloud-upload-alt"></i>
                <p>Click to upload image</p>
                <span>PNG, JPG up to 2MB</span>
            `;
            imagePreview.removeAttribute('data-image-data');
            removeBtn.style.display = 'none';
        }
        
        // Calculate and display profit
        calculateProfit();
        
        document.getElementById('productModal').style.display = 'block';
    }
}

function viewProduct(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        const profit = product.price - product.totalCost;
        const profitMargin = ((profit / product.price) * 100).toFixed(1);
        
        alert(`Product Details:
        
SKU: ${product.sku}
Name: ${product.name}
Category: ${product.category}
Purity: ${product.purity}
Weight: ${product.weight}
Material Cost: $${product.materialCost}
Labour Cost: $${product.labourCost}
Total Cost: $${product.totalCost}
Selling Price: $${product.price}
Profit: $${profit} (${profitMargin}%)
Stock: ${product.stock}
Status: ${product.stock > 5 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}`);
    }
}

function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== id);
        loadPage('inventory');
    }
}

function closeProductModal() {
    document.getElementById('productModal').style.display = 'none';
    editingProductId = null;
}

function calculateTotalCost() {
    const materialCost = parseFloat(document.getElementById('materialCost').value) || 0;
    const labourCost = parseFloat(document.getElementById('labourCost').value) || 0;
    const totalCost = materialCost + labourCost;
    
    document.getElementById('totalCost').value = totalCost.toFixed(2);
    calculateProfit();
}

function calculateProfit() {
    const totalCost = parseFloat(document.getElementById('totalCost').value) || 0;
    const sellingPrice = parseFloat(document.getElementById('sellingPrice').value) || 0;
    
    const profitAmount = sellingPrice - totalCost;
    const profitMargin = sellingPrice > 0 ? (profitAmount / sellingPrice) * 100 : 0;
    
    document.getElementById('profitAmount').value = profitAmount.toFixed(2);
    document.getElementById('profitMargin').value = profitMargin.toFixed(1);
}

function saveProduct(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const productData = {
        sku: formData.get('sku'),
        name: formData.get('name'),
        category: formData.get('category'),
        purity: formData.get('purity'),
        weight: formData.get('weight'),
        stock: parseInt(formData.get('stock')),
        materialCost: parseFloat(formData.get('materialCost')),
        labourCost: parseFloat(formData.get('labourCost')),
        totalCost: parseFloat(formData.get('totalCost')),
        price: parseFloat(formData.get('sellingPrice')),
        image: document.getElementById('imagePreview').dataset.imageData || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xNSAxNUwyNSAyNU0yNSAxNUwxNSAyNSIgc3Ryb2tlPSIjOUNBM0FGIiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+Cg=='
    };
    
    // Check if SKU already exists (excluding current product if editing)
    const existingProduct = products.find(p => p.sku === productData.sku && p.id !== editingProductId);
    if (existingProduct) {
        alert('SKU already exists! Please use a different SKU.');
        return;
    }
    
    if (editingProductId) {
        // Update existing product
        const index = products.findIndex(p => p.id === editingProductId);
        if (index !== -1) {
            products[index] = { ...products[index], ...productData };
        }
    } else {
        // Add new product
        const newId = Math.max(...products.map(p => p.id), 0) + 1;
        products.push({ ...productData, id: newId });
    }
    
    closeProductModal();
    loadPage('inventory');
}

// Image Upload Functions
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.match('image/(png|jpeg|jpg)')) {
        alert('Please select a valid PNG or JPG image file.');
        return;
    }
    
    // Validate file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
        alert('Image size must be less than 2MB.');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const imagePreview = document.getElementById('imagePreview');
        const removeBtn = document.getElementById('removeImageBtn');
        
        imagePreview.innerHTML = `<img src="${e.target.result}" alt="Product Preview" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">`;
        imagePreview.dataset.imageData = e.target.result;
        removeBtn.style.display = 'block';
    };
    reader.readAsDataURL(file);
}

function removeImage() {
    const imagePreview = document.getElementById('imagePreview');
    const removeBtn = document.getElementById('removeImageBtn');
    const fileInput = document.getElementById('productImage');
    
    imagePreview.innerHTML = `
        <i class="fas fa-cloud-upload-alt"></i>
        <p>Click to upload image</p>
        <span>PNG, JPG up to 2MB</span>
    `;
    imagePreview.removeAttribute('data-image-data');
    removeBtn.style.display = 'none';
    fileInput.value = '';
}

function filterInventory() {
    const searchTerm = document.getElementById('inventory-search').value.toLowerCase();
    const categoryFilter = document.getElementById('category-filter').value;
    const stockFilter = document.getElementById('stock-filter').value;
    
    const table = document.getElementById('inventory-table');
    const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    
    for (let row of rows) {
        const category = row.getAttribute('data-category');
        const stock = parseInt(row.getAttribute('data-stock'));
        const text = row.textContent.toLowerCase();
        
        let showRow = true;
        
        // Search filter
        if (searchTerm && !text.includes(searchTerm)) {
            showRow = false;
        }
        
        // Category filter
        if (categoryFilter && category !== categoryFilter) {
            showRow = false;
        }
        
        // Stock filter
        if (stockFilter === 'low' && stock > 5) {
            showRow = false;
        } else if (stockFilter === 'out' && stock > 0) {
            showRow = false;
        }
        
        row.style.display = showRow ? '' : 'none';
    }
}

function exportInventory() {
    // Create CSV content
    const headers = ['SKU', 'Name', 'Category', 'Purity', 'Weight', 'Material Cost', 'Labour Cost', 'Total Cost', 'Selling Price', 'Profit', 'Stock', 'Status'];
    const csvContent = [
        headers.join(','),
        ...products.map(product => {
            const profit = product.price - product.totalCost;
            const status = product.stock > 5 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock';
            return [
                product.sku,
                `"${product.name}"`,
                product.category,
                product.purity,
                product.weight,
                product.materialCost,
                product.labourCost,
                product.totalCost,
                product.price,
                profit,
                product.stock,
                status
            ].join(',');
        })
    ].join('\n');
    
    // Download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory-export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
}

function initializeInventoryPage() {
    // Initialize inventory page
}

// Remove old sales tab functions as they're no longer needed

// Old Gold Functions - Updated for new modal system

// Transaction History Functions
function filterHistory() {
    const searchTerm = document.getElementById('history-search').value.toLowerCase();
    const period = document.getElementById('history-period').value;
    
    // Filter logic would go here
    // For now, just reload the page
    loadPage('history');
}

function exportHistory() {
    alert('Export functionality will be implemented with database integration');
}

function viewInvoice(invoiceNo) {
    const sale = completedSales.find(s => s.invoiceNo === invoiceNo);
    if (sale) {
        alert(`Invoice Details:
        
Invoice No: ${sale.invoiceNo}
Date: ${sale.dateTime}
Customer: ${sale.customer}
Items: ${sale.items}
Amount: $${sale.amount}
Type: ${sale.type}`);
    }
}

function reprintInvoice(invoiceNo) {
    alert(`Reprinting invoice ${invoiceNo}...`);
}

function viewOldGoldPurchase(purchaseNo) {
    const purchase = oldGoldPurchases.find(p => p.purchaseNo === purchaseNo);
    if (purchase) {
        alert(`Old Gold Purchase Details:
        
Purchase No: ${purchase.purchaseNo}
Date: ${purchase.dateTime}
Customer: ${purchase.customer}
Weight: ${purchase.weight}g
Purity: ${purchase.purity}K
Rate: $${purchase.rate}/g
Amount: $${purchase.amount}`);
    }
}

// Enhanced Sale Processing
function processSale() {
    if (cart.length === 0 && currentOldGoldValue === 0) {
        alert('No items to process!');
        return;
    }
    
    const subtotal = cart.reduce((sum, item) => sum + ((item.sellingPrice || item.price) * item.quantity), 0);
    const finalTotal = subtotal - currentOldGoldValue - currentDiscount;
    
    if (finalTotal < 0) {
        alert('Total cannot be negative. Please adjust your transaction.');
        return;
    }
    
    const customer = document.getElementById('customer-select').value || 'Walk-in Customer';
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    
    // Process the sale
    if (cart.length > 0) {
        const sale = {
            invoiceNo: `INV-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            dateTime: new Date().toLocaleString(),
            customer: customer,
            items: [...cart],
            subtotal: subtotal.toFixed(2),
            oldGoldExchange: currentOldGoldValue.toFixed(2),
            discount: currentDiscount.toFixed(2),
            total: finalTotal.toFixed(2),
            paymentMethod: paymentMethod,
            type: 'sale'
        };
        
        completedSales.push(sale);
    }
    
    // Process old gold exchange if applicable
    if (currentOldGoldValue > 0) {
        const oldGoldPurchase = {
            purchaseNo: `OG-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            dateTime: new Date().toLocaleString(),
            customer: customer,
            amount: currentOldGoldValue.toFixed(2),
            type: 'oldgold'
        };
        
        oldGoldPurchases.push(oldGoldPurchase);
    }
    
    // Generate and show invoice
    if (cart.length > 0) {
        const customerData = getCustomerData(customer);
        generateAndPrintInvoice(sale, customerData);
    }
    
    alert(`Transaction completed successfully!\nTotal: $${finalTotal.toFixed(2)}`);
    
    // Clear everything
    cart.length = 0;
    currentDiscount = 0;
    currentOldGoldValue = 0;
    updateCartDisplay();
    loadPage('dashboard');
}

// Global variables for cart calculations
let currentDiscount = 0;
let currentOldGoldValue = 0;

// Enhanced cart functions to handle both products and old gold
function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <span class="material-symbols-outlined">shopping_cart</span>
                <p>No items in cart</p>
            </div>
        `;
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xNSAxNUwyNSAyNU0yNSAxNUwxNSAyNSIgc3Ryb2tlPSIjOUNBM0FGIiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+Cg=='">
                </div>
                <div class="cart-item-info">
                    <p class="cart-item-name">${item.name}</p>
                    <p class="cart-item-sku">SKU: ${item.sku}</p>
                </div>
                <div class="cart-item-price">
                    <label>Selling Price:</label>
                    <input type="number" 
                           class="selling-price-input" 
                           value="${item.sellingPrice || item.price}" 
                           min="0" 
                           step="0.01"
                           onchange="updateSellingPrice(${item.id}, this.value)"
                           placeholder="0.00">
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
                <div class="cart-item-total">
                    $${((item.sellingPrice || item.price) * item.quantity).toFixed(2)}
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">
                    <span class="material-symbols-outlined">delete</span>
                </button>
            </div>
        `).join('');
    }
    
    updateTotals();
}

function updateTotals() {
    const subtotal = cart.reduce((sum, item) => sum + ((item.sellingPrice || item.price) * item.quantity), 0);
    const finalTotal = subtotal - currentOldGoldValue - currentDiscount;
    
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('final-total').textContent = `$${finalTotal.toFixed(2)}`;
    
    // Show/hide old gold line
    const oldGoldLine = document.getElementById('old-gold-line');
    if (currentOldGoldValue > 0) {
        oldGoldLine.style.display = 'flex';
        document.getElementById('old-gold-total').textContent = `-$${currentOldGoldValue.toFixed(2)}`;
    } else {
        oldGoldLine.style.display = 'none';
    }
    
    // Show/hide discount line
    const discountLine = document.getElementById('discount-line');
    if (currentDiscount > 0) {
        discountLine.style.display = 'flex';
        document.getElementById('discount-total').textContent = `-$${currentDiscount.toFixed(2)}`;
    } else {
        discountLine.style.display = 'none';
    }
}

function processProductSale() {
    if (cart.length === 0) {
        alert('Cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const confirmation = confirm(`Process sale for $${total.toFixed(2)}?`);
    
    if (confirmation) {
        // Create sale record
        const sale = {
            invoiceNo: `INV-${Date.now()}`,
            dateTime: new Date().toLocaleString(),
            customer: 'Walk-in Customer',
            items: cart.map(item => `${item.name} (${item.quantity})`).join(', '),
            type: 'Sale',
            amount: total.toFixed(2)
        };
        
        completedSales.push(sale);
        
        // Update product stock
        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (product) {
                product.stock -= item.quantity;
            }
        });
        
        alert('Sale processed successfully!');
        clearCart();
        loadPage('dashboard');
    }
}

// Old processOldGoldPurchase function removed - now handled in processSale()

// Reports Functions
function updateCharts() {
    // This would update charts based on selected period
    initializeReportsPage();
}

function exportReports() {
    alert('Export reports functionality will be implemented with database integration');
}

function initializeReportsPage() {
    // Initialize charts
    setTimeout(() => {
        initializeReportsSalesChart();
        initializeReportsCategoryChart();
        initializeReportsPaymentChart();
        initializeReportsStockChart();
        initializeReportsTopProductsChart();
        initializeReportsOldGoldChart();
    }, 100);
}

function initializeReportsSalesChart() {
    const ctx = document.getElementById('salesChart');
    if (!ctx) return;

    const salesData = generateSalesData();

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: salesData.labels,
            datasets: [{
                label: 'Revenue',
                data: salesData.revenueValues,
                borderColor: '#eca413',
                backgroundColor: 'rgba(236, 164, 19, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Profit',
                data: salesData.profitValues,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': $' + context.parsed.y.toLocaleString();
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

function initializeReportsCategoryChart() {
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;

    const categoryData = getCategoryData();

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: categoryData.labels,
            datasets: [{
                data: categoryData.revenueValues,
                backgroundColor: [
                    '#eca413',
                    '#f59e0b',
                    '#d97706',
                    '#b45309',
                    '#92400e'
                ],
                borderWidth: 2,
                borderColor: '#f8f7f6'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: $${value.toLocaleString()} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

function initializeReportsPaymentChart() {
    const ctx = document.getElementById('paymentChart');
    if (!ctx) return;

    const paymentData = getPaymentData();

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: paymentData.labels,
            datasets: [{
                data: paymentData.values,
                backgroundColor: [
                    '#eca413',
                    '#10b981',
                    '#3b82f6',
                    '#f59e0b'
                ],
                borderWidth: 2,
                borderColor: '#f8f7f6'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: $${value.toLocaleString()} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

function initializeReportsStockChart() {
    const ctx = document.getElementById('stockChart');
    if (!ctx) return;

    const stockData = getLowStockData();

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: stockData.labels,
            datasets: [{
                data: stockData.values,
                backgroundColor: [
                    '#ef4444',  // Low Stock - Red
                    '#f97316',  // Critical Stock - Orange
                    '#dc2626',  // Out of Stock - Dark Red
                    '#10b981'   // Good Stock - Green
                ],
                borderWidth: 2,
                borderColor: '#f8f7f6'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed;
                            return `${label}: ${value} items`;
                        }
                    }
                }
            }
        }
    });
}

function initializeReportsTopProductsChart() {
    const ctx = document.getElementById('topProductsChart');
    if (!ctx) return;

    const topProductsData = getTopProductsData();

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: topProductsData.labels,
            datasets: [{
                label: 'Revenue',
                data: topProductsData.revenueValues,
                backgroundColor: 'rgba(236, 164, 19, 0.8)',
                borderColor: '#eca413',
                borderWidth: 1
            }, {
                label: 'Profit',
                data: topProductsData.profitValues,
                backgroundColor: 'rgba(16, 185, 129, 0.8)',
                borderColor: '#10b981',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': $' + context.parsed.y.toLocaleString();
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

function initializeReportsOldGoldChart() {
    const ctx = document.getElementById('oldGoldChart');
    if (!ctx) return;

    // Generate old gold data for the last 7 days
    const labels = [];
    const weights = [];
    const values = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
        
        const dayPurchases = oldGoldPurchases.filter(purchase => {
            const purchaseDate = new Date(purchase.date);
            return purchaseDate.toDateString() === date.toDateString();
        });
        
        const dayWeight = dayPurchases.reduce((total, purchase) => total + purchase.weight, 0);
        const dayValue = dayPurchases.reduce((total, purchase) => total + purchase.price, 0);
        
        weights.push(dayWeight || 0);
        values.push(dayValue || 0);
    }

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Weight (g)',
                data: weights,
                borderColor: '#eca413',
                backgroundColor: 'rgba(236, 164, 19, 0.1)',
                tension: 0.4,
                fill: true,
                yAxisID: 'y'
            }, {
                label: 'Value ($)',
                data: values,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                fill: true,
                yAxisID: 'y1'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            if (context.datasetIndex === 0) {
                                return 'Weight: ' + context.parsed.y.toFixed(1) + 'g';
                            } else {
                                return 'Value: $' + context.parsed.y.toLocaleString();
                            }
                        }
                    }
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value.toFixed(1) + 'g';
                        }
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                }
            }
        }
    });
}









// Add CSS for cart items and other dynamic elements
const additionalStyles = `
<style>
.cart-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
    border-bottom: 1px solid #f1f5f9;
}

.cart-item:last-child {
    border-bottom: none;
}

.item-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.item-name {
    font-weight: 500;
    color: #1e293b;
}

.item-price {
    color: #64748b;
    font-size: 0.875rem;
}

.item-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.item-controls button {
    width: 30px;
    height: 30px;
    border: 1px solid #d1d5db;
    background: white;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.item-controls button:hover {
    background: #f3f4f6;
}

.remove-btn {
    color: #ef4444 !important;
    border-color: #fecaca !important;
}

.cart-footer {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid #e2e8f0;
}

.cart-total {
    font-size: 1.25rem;
    margin-bottom: 1rem;
    text-align: right;
}

.btn-primary {
    width: 100%;
    background: linear-gradient(135deg, #eca413 0%, #d4a017 100%);
    color: white;
    border: none;
    padding: 1rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s ease;
}

.btn-primary:hover {
    transform: translateY(-1px);
}

.btn-danger {
    background: #ef4444;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    margin-left: 0.5rem;
}

.btn-danger:hover {
    background: #dc2626;
}

.stock-status {
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
}

.stock-status.in-stock {
    background: #dcfce7;
    color: #166534;
}

.stock-status.low-stock {
    background: #fef2f2;
    color: #dc2626;
}

.pos-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.search-bar {
    position: relative;
    width: 300px;
}

.search-bar input {
    width: 100%;
    padding: 0.75rem 2.5rem 0.75rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 0.875rem;
}

.search-bar i {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #64748b;
}

.cart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.empty-cart {
    text-align: center;
    padding: 3rem 1rem;
    color: #64748b;
}

.empty-cart i {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
}

.product-stock {
    font-size: 0.75rem;
    color: #64748b;
    margin-top: 0.25rem;
}

@media (max-width: 768px) {
    .sales-grid {
        grid-template-columns: 1fr;
    }
    
    .cart-summary {
        order: -1;
    }
    
    .search-bar {
        width: 100%;
        margin-top: 1rem;
    }
    
    .pos-header {
        flex-direction: column;
        align-items: stretch;
    }
}
</style>
`;

// Add the additional styles to the document
document.head.insertAdjacentHTML('beforeend', additionalStyles);

// Dashboard Chart Functions
function initializeDashboardPage() {
    setTimeout(() => {
        initializeDashboardCharts();
    }, 100);
}

function initializeDashboardCharts() {
    initializeSalesChart();
    initializeCategoryChart();
    initializePaymentChart();
    initializeTopProductsChart();
}

function initializeSalesChart() {
    const ctx = document.getElementById('salesChart');
    if (!ctx) return;

    const salesData = generateSalesData();
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: salesData.labels,
            datasets: [{
                label: 'Sales Revenue',
                data: salesData.revenueValues,
                borderColor: '#eca413',
                backgroundColor: 'rgba(236, 164, 19, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                yAxisID: 'y'
            }, {
                label: 'Profit',
                data: salesData.profitValues,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderWidth: 3,
                fill: false,
                tension: 0.4,
                yAxisID: 'y'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    beginAtZero: true,
                    grid: {
                        color: '#e7e5e4'
                    },
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function initializeCategoryChart() {
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;

    const categoryData = getCategoryData();
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: categoryData.labels,
            datasets: [{
                label: 'Revenue by Category',
                data: categoryData.revenueValues,
                backgroundColor: [
                    '#eca413',
                    '#f59e0b',
                    '#d97706',
                    '#b45309',
                    '#92400e',
                    '#78350f'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        generateLabels: function(chart) {
                            const data = chart.data;
                            if (data.labels.length && data.datasets.length) {
                                return data.labels.map((label, i) => {
                                    const value = data.datasets[0].data[i];
                                    return {
                                        text: `${label}: $${value.toLocaleString()}`,
                                        fillStyle: data.datasets[0].backgroundColor[i],
                                        strokeStyle: data.datasets[0].backgroundColor[i],
                                        lineWidth: 0,
                                        pointStyle: 'circle',
                                        hidden: false,
                                        index: i
                                    };
                                });
                            }
                            return [];
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: $${value.toLocaleString()} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

function initializePaymentChart() {
    const ctx = document.getElementById('paymentChart');
    if (!ctx) return;

    const paymentData = getPaymentData();
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: paymentData.labels,
            datasets: [{
                label: 'Revenue by Payment Method',
                data: paymentData.values,
                backgroundColor: [
                    '#eca413',
                    '#10b981',
                    '#3b82f6'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        generateLabels: function(chart) {
                            const data = chart.data;
                            if (data.labels.length && data.datasets.length) {
                                return data.labels.map((label, i) => {
                                    const value = data.datasets[0].data[i];
                                    return {
                                        text: `${label}: $${value.toLocaleString()}`,
                                        fillStyle: data.datasets[0].backgroundColor[i],
                                        strokeStyle: data.datasets[0].backgroundColor[i],
                                        lineWidth: 0,
                                        pointStyle: 'circle',
                                        hidden: false,
                                        index: i
                                    };
                                });
                            }
                            return [];
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: $${value.toLocaleString()} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

function initializeTopProductsChart() {
    const ctx = document.getElementById('topProductsChart');
    if (!ctx) return;

    const topProductsData = getTopProductsData();
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: topProductsData.labels,
            datasets: [{
                label: 'Revenue',
                data: topProductsData.revenueValues,
                backgroundColor: '#eca413',
                borderRadius: 8,
                borderSkipped: false,
                yAxisID: 'y'
            }, {
                label: 'Profit',
                data: topProductsData.profitValues,
                backgroundColor: '#10b981',
                borderRadius: 8,
                borderSkipped: false,
                yAxisID: 'y'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    beginAtZero: true,
                    grid: {
                        color: '#e7e5e4'
                    },
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function generateSalesData() {
    const days = 7;
    const labels = [];
    const revenueValues = [];
    const profitValues = [];
    
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
        
        // Calculate actual sales for this day
        const daySales = completedSales.filter(sale => {
            const saleDate = new Date(sale.dateTime);
            return saleDate.toDateString() === date.toDateString();
        });
        
        const dayRevenue = daySales.reduce((total, sale) => total + sale.total, 0);
        const dayProfit = daySales.reduce((total, sale) => {
            const itemProfit = sale.items ? sale.items.reduce((itemTotal, item) => {
                const product = products.find(p => p.name === item.name);
                if (product) {
                    return itemTotal + (item.price - product.materialCost - product.laborCost) * item.quantity;
                }
                return itemTotal;
            }, 0) : 0;
            return total + itemProfit;
        }, 0);
        
        revenueValues.push(dayRevenue || 0);
        profitValues.push(dayProfit || 0);
    }
    
    return { labels, revenueValues, profitValues };
}

function getCategoryData() {
    const categoryRevenue = {};
    const categoryProfit = {};
    const categorySales = {};
    
    // Initialize categories
    products.forEach(product => {
        const category = product.category || 'Other';
        if (!categoryRevenue[category]) {
            categoryRevenue[category] = 0;
            categoryProfit[category] = 0;
            categorySales[category] = 0;
        }
    });
    
    // Calculate revenue and profit by category from sales
    completedSales.forEach(sale => {
        sale.items?.forEach(item => {
            const product = products.find(p => p.name === item.name);
            if (product) {
                const category = product.category || 'Other';
                categoryRevenue[category] += item.price * item.quantity;
                categoryProfit[category] += (item.price - product.materialCost - product.laborCost) * item.quantity;
                categorySales[category] += item.quantity;
            }
        });
    });
    
    // If no sales data, generate realistic sample data
    const totalRevenue = Object.values(categoryRevenue).reduce((sum, val) => sum + val, 0);
    if (totalRevenue === 0) {
        const categories = ['Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Watches'];
        categories.forEach(category => {
            categoryRevenue[category] = Math.floor(Math.random() * 50000) + 10000;
            categoryProfit[category] = categoryRevenue[category] * (0.15 + Math.random() * 0.1);
            categorySales[category] = Math.floor(Math.random() * 100) + 20;
        });
    }
    
    const labels = Object.keys(categoryRevenue).filter(label => categoryRevenue[label] > 0);
    
    return {
        labels: labels,
        revenueValues: labels.map(label => Math.round(categoryRevenue[label])),
        profitValues: labels.map(label => Math.round(categoryProfit[label])),
        salesValues: labels.map(label => categorySales[label])
    };
}

function getPaymentData() {
    const paymentRevenue = { 'Cash': 0, 'Card': 0, 'Online': 0, 'Bank Transfer': 0 };
    
    completedSales.forEach(sale => {
        const method = sale.paymentMethod || 'Cash';
        paymentRevenue[method] = (paymentRevenue[method] || 0) + parseFloat(sale.total);
    });
    
    // If no sales data, generate realistic sample data
    const totalRevenue = Object.values(paymentRevenue).reduce((sum, val) => sum + val, 0);
    if (totalRevenue === 0) {
        paymentRevenue['Cash'] = Math.floor(Math.random() * 30000) + 15000;
        paymentRevenue['Card'] = Math.floor(Math.random() * 25000) + 10000;
        paymentRevenue['Online'] = Math.floor(Math.random() * 20000) + 5000;
        paymentRevenue['Bank Transfer'] = Math.floor(Math.random() * 15000) + 3000;
    }
    
    const labels = Object.keys(paymentRevenue).filter(label => paymentRevenue[label] > 0);
    
    return {
        labels: labels,
        values: labels.map(label => Math.round(paymentRevenue[label]))
    };
}

function getTopProductsData() {
    const productRevenue = {};
    const productProfit = {};
    const productSales = {};
    
    completedSales.forEach(sale => {
        sale.items?.forEach(item => {
            if (!productRevenue[item.name]) {
                productRevenue[item.name] = 0;
                productProfit[item.name] = 0;
                productSales[item.name] = 0;
            }
            
            productRevenue[item.name] += item.price * item.quantity;
            productSales[item.name] += item.quantity;
            
            const product = products.find(p => p.name === item.name);
            if (product) {
                productProfit[item.name] += (item.price - product.materialCost - product.laborCost) * item.quantity;
            }
        });
    });
    
    // If no sales data, generate realistic sample data
    const totalRevenue = Object.values(productRevenue).reduce((sum, val) => sum + val, 0);
    if (totalRevenue === 0) {
        products.slice(0, 5).forEach(product => {
            productRevenue[product.name] = Math.floor(Math.random() * 25000) + 5000;
            productProfit[product.name] = productRevenue[product.name] * (0.15 + Math.random() * 0.1);
            productSales[product.name] = Math.floor(Math.random() * 50) + 10;
        });
    }
    
    const sorted = Object.entries(productRevenue)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5);
    
    return {
        labels: sorted.map(([name]) => name.length > 15 ? name.substring(0, 15) + '...' : name),
        revenueValues: sorted.map(([,revenue]) => Math.round(revenue)),
        profitValues: sorted.map(([name]) => Math.round(productProfit[name] || 0)),
        salesValues: sorted.map(([name]) => productSales[name] || 0)
    };
}

function calculateTotalProfit() {
    let totalProfit = 0;
    completedSales.forEach(sale => {
        sale.items?.forEach(item => {
            const product = products.find(p => p.name === item.name);
            if (product) {
                totalProfit += (item.price - product.materialCost - product.laborCost) * item.quantity;
            }
        });
    });
    return totalProfit;
}

function getLowStockData() {
    const lowStockProducts = products.filter(product => product.stock <= 10);
    const criticalStock = products.filter(product => product.stock <= 5);
    const outOfStock = products.filter(product => product.stock === 0);
    
    return {
        labels: ['Low Stock (≤10)', 'Critical Stock (≤5)', 'Out of Stock (0)', 'Good Stock (>10)'],
        values: [
            lowStockProducts.length,
            criticalStock.length,
            outOfStock.length,
            products.length - lowStockProducts.length
        ],
        products: {
            lowStock: lowStockProducts,
            critical: criticalStock,
            outOfStock: outOfStock
        }
    };
}

function calculateProfitMargin() {
    const totalRevenue = completedSales.reduce((total, sale) => total + sale.total, 0);
    const totalProfit = calculateTotalProfit();
    return totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
}

function updateDashboardCharts() {
    Chart.helpers.each(Chart.instances, function(instance) {
        instance.destroy();
    });
    
    setTimeout(() => {
        initializeDashboardCharts();
    }, 100);
}

// Customer Management Functions
function searchCustomers() {
    const searchTerm = document.getElementById('customer-search').value.toLowerCase();
    const rows = document.querySelectorAll('.customer-row');
    
    rows.forEach(row => {
        const customerName = row.querySelector('.customer-name').textContent.toLowerCase();
        const customerEmail = row.querySelector('.email').textContent.toLowerCase();
        
        if (customerName.includes(searchTerm) || customerEmail.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function filterCustomers() {
    const filter = document.getElementById('customer-filter').value;
    const rows = document.querySelectorAll('.customer-row');
    
    rows.forEach(row => {
        const statusBadge = row.querySelector('.status-badge');
        const spentAmount = parseFloat(row.querySelector('.spent-amount').textContent.replace(/[$,]/g, ''));
        
        let shouldShow = true;
        
        switch (filter) {
            case 'vip':
                shouldShow = spentAmount > 2000;
                break;
            case 'regular':
                shouldShow = spentAmount <= 2000;
                break;
            case 'new':
                // For demo purposes, show first 2 customers as "new"
                const customerId = parseInt(row.querySelector('.customer-id').textContent.split(': ')[1]);
                shouldShow = customerId <= 2;
                break;
        }
        
        row.style.display = shouldShow ? '' : 'none';
    });
}

function viewCustomerDetails(customerId) {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;
    
    const panelContent = document.querySelector('.panel-content');
    panelContent.innerHTML = `
        <div class="customer-detail-view">
            <div class="customer-header">
                <div class="customer-avatar-large">
                    <span class="material-symbols-outlined">person</span>
                </div>
                <div class="customer-info-large">
                    <h3>${customer.name}</h3>
                    <p class="customer-id">Customer ID: ${customer.id}</p>
                    <div class="status-badge ${customer.totalSpent > 2000 ? 'vip' : 'regular'}">
                        <span class="material-symbols-outlined">${customer.totalSpent > 2000 ? 'star' : 'person'}</span>
                        ${customer.totalSpent > 2000 ? 'VIP Customer' : 'Regular Customer'}
                    </div>
                </div>
            </div>
            
            <div class="customer-details-grid">
                <div class="detail-section">
                    <h4>
                        <span class="material-symbols-outlined">contact_mail</span>
                        Contact Information
                    </h4>
                    <div class="detail-item">
                        <span class="label">Email:</span>
                        <span class="value">${customer.email}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Phone:</span>
                        <span class="value">${customer.phone}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Address:</span>
                        <span class="value">${customer.address}</span>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4>
                        <span class="material-symbols-outlined">payments</span>
                        Purchase History
                    </h4>
                    <div class="detail-item">
                        <span class="label">Total Spent:</span>
                        <span class="value">$${customer.totalSpent.toLocaleString()}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Orders:</span>
                        <span class="value">${completedSales.filter(sale => sale.customer === customer.name).length}</span>
                    </div>
                </div>
            </div>
            
            <div class="customer-actions">
                <button class="btn-primary" onclick="editCustomer(${customer.id})">
                    <span class="material-symbols-outlined">edit</span>
                    Edit Customer
                </button>
                <button class="btn-secondary" onclick="viewCustomerOrders(${customer.id})">
                    <span class="material-symbols-outlined">receipt</span>
                    View Orders
                </button>
            </div>
        </div>
    `;
}

function closeCustomerDetails() {
    const panelContent = document.querySelector('.panel-content');
    panelContent.innerHTML = `
        <div class="no-selection">
            <span class="material-symbols-outlined">person_search</span>
            <h4>Select a customer</h4>
            <p>Click on a customer from the list to view their detailed information, purchase history, and preferences.</p>
        </div>
    `;
}

function editCustomer(customerId) {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;
    
    // For now, just show an alert. In a real app, this would open a modal
    alert(`Edit customer: ${customer.name}\nThis would open an edit modal in a real application.`);
}

function deleteCustomer(customerId) {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;
    
    if (confirm(`Are you sure you want to delete ${customer.name}?`)) {
        const index = customers.findIndex(c => c.id === customerId);
        customers.splice(index, 1);
        
        // Reload the page content
        loadPage('customers');
    }
}

function openAddCustomerModal() {
    // For now, just show an alert. In a real app, this would open a modal
    alert('Add Customer Modal\nThis would open an add customer modal in a real application.');
}

function viewCustomerOrders(customerId) {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;
    
    const customerOrders = completedSales.filter(sale => sale.customer === customer.name);
    
    let ordersHtml = '<div class="customer-orders"><h4>Customer Orders</h4>';
    
    if (customerOrders.length === 0) {
        ordersHtml += '<p>No orders found for this customer.</p>';
    } else {
        customerOrders.forEach(order => {
            ordersHtml += `
                <div class="order-item">
                    <div class="order-header">
                        <span class="order-id">${order.id}</span>
                        <span class="order-date">${new Date(order.dateTime).toLocaleDateString()}</span>
                    </div>
                    <div class="order-total">$${order.total.toLocaleString()}</div>
                </div>
            `;
        });
    }
    
    ordersHtml += '</div>';
    
    // Update panel content
    const panelContent = document.querySelector('.panel-content');
    panelContent.innerHTML = ordersHtml;
}

// Invoice Generation Functions
function getCustomerData(customerId) {
    if (customerId === 'Walk-in Customer' || customerId === 'Select Customer') {
        return {
            name: 'Walk-in Customer',
            address: 'N/A',
            phone: 'N/A',
            email: 'N/A'
        };
    }
    
    const customer = customers.find(c => c.id == customerId);
    if (customer) {
        return {
            name: customer.name,
            address: customer.address,
            phone: customer.phone,
            email: customer.email
        };
    }
    
    return {
        name: 'Unknown Customer',
        address: 'N/A',
        phone: 'N/A',
        email: 'N/A'
    };
}

function generateAndPrintInvoice(sale, customerData) {
    const invoiceHtml = generateInvoiceHTML(sale, customerData);
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    printWindow.document.write(invoiceHtml);
    printWindow.document.close();
    
    // Wait for content to load, then print
    printWindow.onload = function() {
        printWindow.print();
        printWindow.close();
    };
}

function generateInvoiceHTML(sale, customerData) {
    const currentDate = new Date();
    const dateStr = currentDate.toLocaleDateString();
    const timeStr = currentDate.toLocaleTimeString();
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>Jewellery POS System - Invoice</title>
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    <link href="https://fonts.googleapis.com" rel="preconnect"/>
    <link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&amp;display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet"/>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        "primary": "#eca413",
                        "background-light": "#f8f8f6",
                        "foreground-light": "#1b180d",
                        "subtle-light": "#9a864c",
                        "border-light": "#e7e1cf",
                    },
                    fontFamily: {
                        "display": ["Manrope"]
                    },
                    borderRadius: {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                },
            },
        }
    </script>
</head>
<body class="font-display bg-background-light text-foreground-light">
    <div class="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div class="bg-background-light shadow-lg rounded-lg overflow-hidden">
            <div class="p-6 md:p-8 relative">
                <div class="absolute top-0 right-0 p-8 opacity-5">
                    <svg class="w-32 h-32 text-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path clip-rule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM5.5 10a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z" fill-rule="evenodd"></path>
                    </svg>
                </div>
                <header class="flex justify-between items-start pb-6 border-b border-border-light">
                    <div>
                        <div class="flex items-center gap-3">
                            <span class="material-symbols-outlined text-primary text-4xl">
                                diamond
                            </span>
                            <h1 class="text-2xl md:text-3xl font-bold text-foreground-light">LT Innovations</h1>
                        </div>
                        <p class="text-subtle-light">Jewellery & Fine Goods</p>
                    </div>
                    <div class="text-right">
                        <h2 class="text-3xl md:text-4xl font-bold text-primary">Invoice</h2>
                        <p class="text-subtle-light mt-1">${sale.invoiceNo}</p>
                        <p class="text-sm text-subtle-light mt-1">Date: ${dateStr} | Time: ${timeStr}</p>
                    </div>
                </header>
                <section class="grid md:grid-cols-2 gap-8 mt-6">
                    <div>
                        <h3 class="font-semibold text-foreground-light mb-2">Billed To:</h3>
                        <p class="font-bold text-lg">${customerData.name}</p>
                        <p class="text-subtle-light">${customerData.address}</p>
                        <p class="text-subtle-light">${customerData.phone}</p>
                    </div>
                </section>
                <section class="mt-8">
                    <h3 class="text-lg font-bold mb-4 text-foreground-light">Sale Details</h3>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left">
                            <thead class="bg-primary/10">
                                <tr>
                                    <th class="p-3 font-semibold">Item</th>
                                    <th class="p-3 font-semibold text-center">Qty</th>
                                    <th class="p-3 font-semibold text-right">Unit Cost</th>
                                    <th class="p-3 font-semibold text-right">Line Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${sale.items.map((item, index) => `
                                    <tr class="border-b border-border-light ${index % 2 === 1 ? 'bg-primary/5' : ''}">
                                        <td class="p-3">
                                            <div class="flex items-center gap-3">
                                                <img alt="${item.name}" class="w-10 h-10 object-contain" src="${item.image}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xNSAxNUwyNSAyNU0yNSAxNUwxNSAyNSIgc3Ryb2tlPSIjOUNBM0FGIiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+Cg=='">
                                                <div>
                                                    <p class="font-bold text-foreground-light">${item.name}</p>
                                                    <p class="text-xs text-subtle-light">SKU: ${item.sku}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="p-3 text-center">${item.quantity}</td>
                                        <td class="p-3 text-right">$${parseFloat(item.price).toFixed(2)}</td>
                                        <td class="p-3 text-right">$${(item.price * item.quantity).toFixed(2)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </section>
                <section class="mt-8 flex justify-end">
                    <div class="w-full max-w-sm">
                        <div class="flex justify-between py-2 border-b border-border-light">
                            <span class="text-subtle-light">Subtotal</span>
                            <span class="font-semibold text-foreground-light">$${parseFloat(sale.subtotal).toFixed(2)}</span>
                        </div>
                        ${parseFloat(sale.oldGoldExchange) > 0 ? `
                        <div class="flex justify-between py-2 border-b border-border-light">
                            <span class="text-subtle-light">Old Gold Exchange</span>
                            <span class="font-semibold text-green-600">-$${parseFloat(sale.oldGoldExchange).toFixed(2)}</span>
                        </div>
                        ` : ''}
                        ${parseFloat(sale.discount) > 0 ? `
                        <div class="flex justify-between py-2 border-b border-border-light">
                            <span class="text-subtle-light">Discounts</span>
                            <span class="font-semibold text-green-600">-$${parseFloat(sale.discount).toFixed(2)}</span>
                        </div>
                        ` : ''}
                        <div class="flex justify-between py-2 font-bold text-lg bg-primary/10 px-3 rounded-lg mt-2">
                            <span class="text-primary">Final Total</span>
                            <span class="text-primary">$${parseFloat(sale.total).toFixed(2)}</span>
                        </div>
                        <div class="flex justify-between pt-4 mt-4 border-t-2 border-dashed border-primary/50">
                            <span class="text-subtle-light">Payment Method</span>
                            <span class="font-semibold text-foreground-light">${sale.paymentMethod}</span>
                        </div>
                    </div>
                </section>
                <footer class="text-center mt-12 pt-6 border-t border-border-light">
                    <p class="text-subtle-light">Thank you for your business!</p>
                    <p class="text-xs text-subtle-light/70 mt-1">© 2024 LT Innovations. All rights reserved.</p>
                </footer>
            </div>
        </div>
    </div>
</body>
</html>
    `;
}

// Missing initialization functions
function initializeCustomersPage() {
    // Initialize customers page functionality
    const searchInput = document.getElementById('customer-search');
    const filterSelect = document.getElementById('customer-filter');
    
    if (searchInput) {
        searchInput.addEventListener('input', searchCustomers);
    }
    
    if (filterSelect) {
        filterSelect.addEventListener('change', filterCustomers);
    }
}

function initializeSettingsPage() {
    // Initialize settings page functionality
}