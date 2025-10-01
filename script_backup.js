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
    { id: 1, name: 'John Smith', email: 'john@email.com', phone: '+1-555-0123', totalSpent: 2450 },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@email.com', phone: '+1-555-0456', totalSpent: 1890 },
    { id: 3, name: 'Mike Wilson', email: 'mike@email.com', phone: '+1-555-0789', totalSpent: 3200 },
    { id: 4, name: 'Emma Davis', email: 'emma@email.com', phone: '+1-555-0321', totalSpent: 1560 }
];

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
                    <option value="low">Low Stock (≤5)</option>
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
        <div class="customer-grid">
            <div class="customer-list">
                <div class="table-header">
                    <h3>Customer List</h3>
                    <button class="btn-primary" onclick="openAddCustomerModal()">
                        <i class="fas fa-plus"></i>
                        Add Customer
                    </button>
                </div>
                <div class="table-content">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Total Spent</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${customers.map(customer => `
                                <tr>
                                    <td>${customer.name}</td>
                                    <td>${customer.email}</td>
                                    <td>${customer.phone}</td>
                                    <td>$${customer.totalSpent}</td>
                                    <td>
                                        <button class="btn-secondary" onclick="editCustomer(${customer.id})">Edit</button>
                                        <button class="btn-primary" onclick="viewCustomerDetails(${customer.id})">View</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div class="customer-details">
                <h3>Customer Details</h3>
                <div class="customer-info">
                    <p>Select a customer to view details</p>
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
                    <i class="fas fa-dollar-sign"></i>
                </div>
                <div class="stat-info">
                    <h3>Total Revenue</h3>
                    <p class="stat-value">$45,250</p>
                    <span class="stat-change positive">+12.5%</span>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-shopping-bag"></i>
                </div>
                <div class="stat-info">
                    <h3>Total Sales</h3>
                    <p class="stat-value">${completedSales.length}</p>
                    <span class="stat-change positive">+8.2%</span>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-coins"></i>
                </div>
                <div class="stat-info">
                    <h3>Old Gold Purchased</h3>
                    <p class="stat-value">${oldGoldPurchases.reduce((sum, p) => sum + p.weight, 0).toFixed(1)}g</p>
                    <span class="stat-change">${oldGoldPurchases.length} purchases</span>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-users"></i>
                </div>
                <div class="stat-info">
                    <h3>Active Customers</h3>
                    <p class="stat-value">${customers.length}</p>
                    <span class="stat-change positive">+5.1%</span>
                </div>
            </div>
        </div>
        
        <div class="reports-grid">
            <div class="chart-container">
                <h3>Sales Revenue Trend</h3>
                <canvas id="salesChart" width="400" height="200"></canvas>
            </div>
            
            <div class="chart-container">
                <h3>Product Categories (Pie Chart)</h3>
                <canvas id="categoryChart" width="400" height="200"></canvas>
            </div>
            
            <div class="chart-container">
                <h3>Old Gold Purchases Trend</h3>
                <canvas id="oldGoldChart" width="400" height="200"></canvas>
            </div>
            
            <div class="chart-container">
                <h3>Top Selling Products</h3>
                <canvas id="productsChart" width="400" height="200"></canvas>
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
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
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

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>No items in cart</p>
            </div>
        `;
        cartTotal.textContent = '0.00';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="item-info">
                    <span class="item-name">${item.name}</span>
                    <span class="item-price">$${item.price}</span>
                </div>
                <div class="item-controls">
                    <button onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    <button onclick="removeFromCart(${item.id})" class="remove-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = total.toFixed(2);
    }
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

function processSale() {
    if (cart.length === 0) {
        alert('Cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const confirmation = confirm(`Process sale for $${total.toFixed(2)}?`);
    
    if (confirmation) {
        // Update product stock
        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (product) {
                product.stock -= item.quantity;
            }
        });
        
        alert('Sale processed successfully!');
        clearCart();
        loadPage('dashboard'); // Return to dashboard
    }
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
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
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
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
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
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
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
        initializeSalesChart();
        initializeCategoryChart();
        initializeOldGoldChart();
        initializeProductsChart();
    }, 100);
}

function initializeSalesChart() {
    const ctx = document.getElementById('salesChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Revenue',
                data: [12000, 15000, 18000, 22000, 25000, 28000],
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function initializeCategoryChart() {
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Watches'],
            datasets: [{
                data: [35, 25, 20, 12, 8],
                backgroundColor: [
                    '#667eea',
                    '#764ba2',
                    '#f093fb',
                    '#f5576c',
                    '#4facfe'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function initializeOldGoldChart() {
    const ctx = document.getElementById('oldGoldChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Gold Purchased (grams)',
                data: [45, 52, 38, 61, 47, 55],
                backgroundColor: '#fbbf24'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function initializeProductsChart() {
    const ctx = document.getElementById('productsChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: products.map(p => p.name),
            datasets: [{
                label: 'Sales',
                data: [12, 8, 15, 6, 4],
                backgroundColor: '#10b981'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Initialize page-specific functionality
function initializePage(pageName) {
    switch(pageName) {
        case 'sales':
            initializeSalesPage();
            break;
        case 'inventory':
            initializeInventoryPage();
            break;
        case 'customers':
            initializeCustomersPage();
            break;
        case 'history':
            initializeHistoryPage();
            break;
        case 'reports':
            initializeReportsPage();
            break;
        case 'settings':
            initializeSettingsPage();
            break;
    }
}

function initializeHistoryPage() {
    // Initialize history page
}

function initializeCustomersPage() {
    // Initialize customers page
}

function initializeSettingsPage() {
    // Initialize settings page
}

function openAddCustomerModal() {
    alert('Add Customer Modal - To be implemented with database integration');
}

function editCustomer(id) {
    alert(`Edit Customer ${id} - To be implemented with database integration`);
}

function viewCustomerDetails(id) {
    const customer = customers.find(c => c.id === id);
    if (customer) {
        const customerInfo = document.querySelector('.customer-info');
        customerInfo.innerHTML = `
            <div class="customer-detail">
                <h4>${customer.name}</h4>
                <p><strong>Email:</strong> ${customer.email}</p>
                <p><strong>Phone:</strong> ${customer.phone}</p>
                <p><strong>Total Spent:</strong> $${customer.totalSpent}</p>
                <div style="margin-top: 1rem;">
                    <button class="btn-primary">View Purchase History</button>
                    <button class="btn-secondary">Edit Customer</button>
                </div>
            </div>
        `;
    }
}

function initializeCustomersPage() {
    // Initialize customers page
}

function initializeReportsPage() {
    // Initialize reports page
}

function initializeSettingsPage() {
    // Initialize settings page
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
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
/ /   D a s h b o a r d   C h a r t   F u n c t i o n s 
 
 f u n c t i o n   i n i t i a l i z e D a s h b o a r d P a g e ( )   { 
 
         s e t T i m e o u t ( ( )   = >   { 
 
                 i n i t i a l i z e D a s h b o a r d C h a r t s ( ) ; 
 
         } ,   1 0 0 ) ; 
 
 } 
 
 
 
 f u n c t i o n   i n i t i a l i z e D a s h b o a r d C h a r t s ( )   { 
 
         i n i t i a l i z e S a l e s C h a r t ( ) ; 
 
         i n i t i a l i z e C a t e g o r y C h a r t ( ) ; 
 
         i n i t i a l i z e P a y m e n t C h a r t ( ) ; 
 
         i n i t i a l i z e T o p P r o d u c t s C h a r t ( ) ; 
 
 } 
 
 
 
 f u n c t i o n   i n i t i a l i z e S a l e s C h a r t ( )   { 
 
         c o n s t   c t x   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' s a l e s C h a r t ' ) ; 
 
         i f   ( ! c t x )   r e t u r n ; 
 
 
 
         c o n s t   s a l e s D a t a   =   g e n e r a t e S a l e s D a t a ( ) ; 
 
         
 
         n e w   C h a r t ( c t x ,   { 
 
                 t y p e :   ' l i n e ' , 
 
                 d a t a :   { 
 
                         l a b e l s :   s a l e s D a t a . l a b e l s , 
 
                         d a t a s e t s :   [ { 
 
                                 l a b e l :   ' S a l e s   R e v e n u e ' , 
 
                                 d a t a :   s a l e s D a t a . v a l u e s , 
 
                                 b o r d e r C o l o r :   ' # e c a 4 1 3 ' , 
 
                                 b a c k g r o u n d C o l o r :   ' r g b a ( 2 3 6 ,   1 6 4 ,   1 9 ,   0 . 1 ) ' , 
 
                                 b o r d e r W i d t h :   3 , 
 
                                 f i l l :   t r u e , 
 
                                 t e n s i o n :   0 . 4 
 
                         } ] 
 
                 } , 
 
                 o p t i o n s :   { 
 
                         r e s p o n s i v e :   t r u e , 
 
                         m a i n t a i n A s p e c t R a t i o :   f a l s e , 
 
                         p l u g i n s :   { 
 
                                 l e g e n d :   { 
 
                                         d i s p l a y :   f a l s e 
 
                                 } 
 
                         } , 
 
                         s c a l e s :   { 
 
                                 y :   { 
 
                                         b e g i n A t Z e r o :   t r u e , 
 
                                         g r i d :   { 
 
                                                 c o l o r :   ' # e 7 e 5 e 4 ' 
 
                                         } 
 
                                 } , 
 
                                 x :   { 
 
                                         g r i d :   { 
 
                                                 d i s p l a y :   f a l s e 
 
                                         } 
 
                                 } 
 
                         } 
 
                 } 
 
         } ) ; 
 
 } 
 
 
 
 f u n c t i o n   i n i t i a l i z e C a t e g o r y C h a r t ( )   { 
 
         c o n s t   c t x   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' c a t e g o r y C h a r t ' ) ; 
 
         i f   ( ! c t x )   r e t u r n ; 
 
 
 
         c o n s t   c a t e g o r y D a t a   =   g e t C a t e g o r y D a t a ( ) ; 
 
         
 
         n e w   C h a r t ( c t x ,   { 
 
                 t y p e :   ' d o u g h n u t ' , 
 
                 d a t a :   { 
 
                         l a b e l s :   c a t e g o r y D a t a . l a b e l s , 
 
                         d a t a s e t s :   [ { 
 
                                 d a t a :   c a t e g o r y D a t a . v a l u e s , 
 
                                 b a c k g r o u n d C o l o r :   [ 
 
                                         ' # e c a 4 1 3 ' , 
 
                                         ' # f 5 9 e 0 b ' , 
 
                                         ' # d 9 7 7 0 6 ' , 
 
                                         ' # b 4 5 3 0 9 ' , 
 
                                         ' # 9 2 4 0 0 e ' 
 
                                 ] , 
 
                                 b o r d e r W i d t h :   0 
 
                         } ] 
 
                 } , 
 
                 o p t i o n s :   { 
 
                         r e s p o n s i v e :   t r u e , 
 
                         m a i n t a i n A s p e c t R a t i o :   f a l s e , 
 
                         p l u g i n s :   { 
 
                                 l e g e n d :   { 
 
                                         p o s i t i o n :   ' b o t t o m ' , 
 
                                         l a b e l s :   { 
 
                                                 p a d d i n g :   2 0 , 
 
                                                 u s e P o i n t S t y l e :   t r u e 
 
                                         } 
 
                                 } 
 
                         } 
 
                 } 
 
         } ) ; 
 
 } 
 
 
 
 f u n c t i o n   i n i t i a l i z e P a y m e n t C h a r t ( )   { 
 
         c o n s t   c t x   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' p a y m e n t C h a r t ' ) ; 
 
         i f   ( ! c t x )   r e t u r n ; 
 
 
 
         c o n s t   p a y m e n t D a t a   =   g e t P a y m e n t D a t a ( ) ; 
 
         
 
         n e w   C h a r t ( c t x ,   { 
 
                 t y p e :   ' p i e ' , 
 
                 d a t a :   { 
 
                         l a b e l s :   p a y m e n t D a t a . l a b e l s , 
 
                         d a t a s e t s :   [ { 
 
                                 d a t a :   p a y m e n t D a t a . v a l u e s , 
 
                                 b a c k g r o u n d C o l o r :   [ 
 
                                         ' # e c a 4 1 3 ' , 
 
                                         ' # 1 0 b 9 8 1 ' , 
 
                                         ' # 3 b 8 2 f 6 ' 
 
                                 ] , 
 
                                 b o r d e r W i d t h :   0 
 
                         } ] 
 
                 } , 
 
                 o p t i o n s :   { 
 
                         r e s p o n s i v e :   t r u e , 
 
                         m a i n t a i n A s p e c t R a t i o :   f a l s e , 
 
                         p l u g i n s :   { 
 
                                 l e g e n d :   { 
 
                                         p o s i t i o n :   ' b o t t o m ' , 
 
                                         l a b e l s :   { 
 
                                                 p a d d i n g :   2 0 , 
 
                                                 u s e P o i n t S t y l e :   t r u e 
 
                                         } 
 
                                 } 
 
                         } 
 
                 } 
 
         } ) ; 
 
 } 
 
 
 
 f u n c t i o n   i n i t i a l i z e T o p P r o d u c t s C h a r t ( )   { 
 
         c o n s t   c t x   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' t o p P r o d u c t s C h a r t ' ) ; 
 
         i f   ( ! c t x )   r e t u r n ; 
 
 
 
         c o n s t   t o p P r o d u c t s D a t a   =   g e t T o p P r o d u c t s D a t a ( ) ; 
 
         
 
         n e w   C h a r t ( c t x ,   { 
 
                 t y p e :   ' b a r ' , 
 
                 d a t a :   { 
 
                         l a b e l s :   t o p P r o d u c t s D a t a . l a b e l s , 
 
                         d a t a s e t s :   [ { 
 
                                 l a b e l :   ' S a l e s   C o u n t ' , 
 
                                 d a t a :   t o p P r o d u c t s D a t a . v a l u e s , 
 
                                 b a c k g r o u n d C o l o r :   ' # e c a 4 1 3 ' , 
 
                                 b o r d e r R a d i u s :   8 , 
 
                                 b o r d e r S k i p p e d :   f a l s e 
 
                         } ] 
 
                 } , 
 
                 o p t i o n s :   { 
 
                         r e s p o n s i v e :   t r u e , 
 
                         m a i n t a i n A s p e c t R a t i o :   f a l s e , 
 
                         p l u g i n s :   { 
 
                                 l e g e n d :   { 
 
                                         d i s p l a y :   f a l s e 
 
                                 } 
 
                         } , 
 
                         s c a l e s :   { 
 
                                 y :   { 
 
                                         b e g i n A t Z e r o :   t r u e , 
 
                                         g r i d :   { 
 
                                                 c o l o r :   ' # e 7 e 5 e 4 ' 
 
                                         } 
 
                                 } , 
 
                                 x :   { 
 
                                         g r i d :   { 
 
                                                 d i s p l a y :   f a l s e 
 
                                         } 
 
                                 } 
 
                         } 
 
                 } 
 
         } ) ; 
 
 } 
 
 
 
 f u n c t i o n   g e n e r a t e S a l e s D a t a ( )   { 
 
         c o n s t   d a y s   =   7 ; 
 
         c o n s t   l a b e l s   =   [ ] ; 
 
         c o n s t   v a l u e s   =   [ ] ; 
 
         
 
         f o r   ( l e t   i   =   d a y s   -   1 ;   i   > =   0 ;   i - - )   { 
 
                 c o n s t   d a t e   =   n e w   D a t e ( ) ; 
 
                 d a t e . s e t D a t e ( d a t e . g e t D a t e ( )   -   i ) ; 
 
                 l a b e l s . p u s h ( d a t e . t o L o c a l e D a t e S t r i n g ( ' e n - U S ' ,   {   w e e k d a y :   ' s h o r t '   } ) ) ; 
 
                 v a l u e s . p u s h ( M a t h . f l o o r ( M a t h . r a n d o m ( )   *   5 0 0 0 )   +   1 0 0 0 ) ; 
 
         } 
 
         
 
         r e t u r n   {   l a b e l s ,   v a l u e s   } ; 
 
 } 
 
 
 
 f u n c t i o n   g e t C a t e g o r y D a t a ( )   { 
 
         c o n s t   c a t e g o r i e s   =   { } ; 
 
         p r o d u c t s . f o r E a c h ( p r o d u c t   = >   { 
 
                 c a t e g o r i e s [ p r o d u c t . c a t e g o r y ]   =   ( c a t e g o r i e s [ p r o d u c t . c a t e g o r y ]   | |   0 )   +   1 ; 
 
         } ) ; 
 
         
 
         r e t u r n   { 
 
                 l a b e l s :   O b j e c t . k e y s ( c a t e g o r i e s ) , 
 
                 v a l u e s :   O b j e c t . v a l u e s ( c a t e g o r i e s ) 
 
         } ; 
 
 } 
 
 
 
 f u n c t i o n   g e t P a y m e n t D a t a ( )   { 
 
         c o n s t   p a y m e n t s   =   {   ' C a s h ' :   0 ,   ' C a r d ' :   0 ,   ' O n l i n e ' :   0   } ; 
 
         c o m p l e t e d S a l e s . f o r E a c h ( s a l e   = >   { 
 
                 p a y m e n t s [ s a l e . p a y m e n t M e t h o d ]   =   ( p a y m e n t s [ s a l e . p a y m e n t M e t h o d ]   | |   0 )   +   1 ; 
 
         } ) ; 
 
         
 
         r e t u r n   { 
 
                 l a b e l s :   O b j e c t . k e y s ( p a y m e n t s ) , 
 
                 v a l u e s :   O b j e c t . v a l u e s ( p a y m e n t s ) 
 
         } ; 
 
 } 
 
 
 
 f u n c t i o n   g e t T o p P r o d u c t s D a t a ( )   { 
 
         c o n s t   p r o d u c t S a l e s   =   { } ; 
 
         c o m p l e t e d S a l e s . f o r E a c h ( s a l e   = >   { 
 
                 s a l e . i t e m s ? . f o r E a c h ( i t e m   = >   { 
 
                         p r o d u c t S a l e s [ i t e m . n a m e ]   =   ( p r o d u c t S a l e s [ i t e m . n a m e ]   | |   0 )   +   i t e m . q u a n t i t y ; 
 
                 } ) ; 
 
         } ) ; 
 
         
 
         c o n s t   s o r t e d   =   O b j e c t . e n t r i e s ( p r o d u c t S a l e s ) 
 
                 . s o r t ( ( [ , a ] ,   [ , b ] )   = >   b   -   a ) 
 
                 . s l i c e ( 0 ,   5 ) ; 
 
         
 
         r e t u r n   { 
 
                 l a b e l s :   s o r t e d . m a p ( ( [ n a m e ] )   = >   n a m e . l e n g t h   >   1 5   ?   n a m e . s u b s t r i n g ( 0 ,   1 5 )   +   ' . . . '   :   n a m e ) , 
 
                 v a l u e s :   s o r t e d . m a p ( ( [ , c o u n t ] )   = >   c o u n t ) 
 
         } ; 
 
 } 
 
 
 
 f u n c t i o n   u p d a t e D a s h b o a r d C h a r t s ( )   { 
 
         C h a r t . h e l p e r s . e a c h ( C h a r t . i n s t a n c e s ,   f u n c t i o n ( i n s t a n c e )   { 
 
                 i n s t a n c e . d e s t r o y ( ) ; 
 
         } ) ; 
 
         
 
         s e t T i m e o u t ( ( )   = >   { 
 
                 i n i t i a l i z e D a s h b o a r d C h a r t s ( ) ; 
 
         } ,   1 0 0 ) ; 
 
 } 
 
 