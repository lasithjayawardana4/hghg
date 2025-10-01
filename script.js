// UI-Only POS System - Simplified for Design Demo
// This file contains only the essential UI functionality

// Global variables
let cart = [];
let products = [
    { id: 1, name: 'Gold Ring 18K', sku: 'GR-001-18K', category: 'Rings', price: 450, stock: 15, image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRkZEMTAwIi8+CjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjE1IiBzdHJva2U9IiNGRkYzRTMiIHN0cm9rZS13aWR0aD0iMyIvPgo8L3N2Zz4K' },
    { id: 2, name: 'Diamond Necklace', sku: 'DN-002-14K', category: 'Necklaces', price: 1200, stock: 8, image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRkZEMTAwIi8+CjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjE1IiBzdHJva2U9IiNGRkYzRTMiIHN0cm9rZS13aWR0aD0iMyIvPgo8L3N2Zz4K' },
    { id: 3, name: 'Silver Earrings', sku: 'SE-003-925', category: 'Earrings', price: 180, stock: 25, image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjQ0NDQ0NDIi8+CjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjE1IiBzdHJva2U9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMyIvPgo8L3N2Zz4K' }
];

// Authentication check
function checkAuthentication() {
    if (sessionStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Navigation functions
function loadPage(pageName) {
    if (!checkAuthentication()) return;
    
    const pageTitle = document.getElementById('page-title');
    const pageContent = document.getElementById('page-content');
    
    if (pageTitle) {
        pageTitle.textContent = getPageTitle(pageName);
    }
    
    if (pageContent) {
        pageContent.innerHTML = getPageContent(pageName);
    }
    
    initializePage(pageName);
}

function getPageTitle(pageName) {
    const titles = {
        'dashboard': 'Dashboard',
        'sales': 'Sales & POS',
        'inventory': 'Inventory Management',
        'customers': 'Customer Management',
        'reports': 'Reports & Analytics',
        'settings': 'Settings'
    };
    return titles[pageName] || 'Dashboard';
}

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
        case 'reports':
            return getReportsContent();
        case 'settings':
            return getSettingsContent();
        default:
            return getDashboardContent();
    }
}

// Page content functions
function getDashboardContent() {
    return `
        <div class="dashboard-container">
            <div class="dashboard-stats">
                <div class="stat-card">
                    <div class="stat-icon">
                        <span class="material-symbols-outlined">attach_money</span>
                    </div>
                    <div class="stat-info">
                        <h3>Today's Sales</h3>
                        <p class="stat-value">$2,450</p>
                        <span class="stat-change positive">+12.5%</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">
                        <span class="material-symbols-outlined">shopping_bag</span>
                    </div>
                    <div class="stat-info">
                        <h3>Total Orders</h3>
                        <p class="stat-value">24</p>
                        <span class="stat-change positive">+8.2%</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">
                        <span class="material-symbols-outlined">inventory_2</span>
                    </div>
                    <div class="stat-info">
                        <h3>Products</h3>
                        <p class="stat-value">156</p>
                        <span class="stat-change">+5</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">
                        <span class="material-symbols-outlined">people</span>
                    </div>
                    <div class="stat-info">
                        <h3>Customers</h3>
                        <p class="stat-value">89</p>
                        <span class="stat-change positive">+3.1%</span>
                    </div>
                </div>
            </div>
            
            <div class="dashboard-charts">
                <div class="chart-widget">
                    <div class="widget-header">
                        <h3>Sales Revenue</h3>
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
                            <span class="material-symbols-outlined">search</span>
                            <input type="text" placeholder="Search products..." id="product-search">
                        </div>
                    </div>
                    <div class="products-grid">
                        ${products.map(product => `
                            <div class="product-card" onclick="addToCart(${product.id})">
                                <div class="product-image">
                                    <img src="${product.image}" alt="${product.name}">
                                </div>
                                <div class="product-info">
                                    <h4>${product.name}</h4>
                                    <p class="product-sku">${product.sku}</p>
                                    <p class="product-price">$${product.price}</p>
                                    <p class="product-stock">Stock: ${product.stock}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="cart-section">
                    <div class="cart-items-section">
                        <h3>Cart Items</h3>
                        <div id="cart-items" class="cart-items">
                            <div class="empty-cart">
                                <span class="material-symbols-outlined">shopping_cart</span>
                                <p>No items in cart</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="checkout-section">
                        <div class="totals-section">
                            <div class="total-line">
                                <span>Subtotal:</span>
                                <span id="subtotal">$0.00</span>
                            </div>
                            <div class="final-total">
                                <span>Total:</span>
                                <span id="final-total">$0.00</span>
                            </div>
                        </div>
                        <button class="checkout-btn" onclick="processSale()">
                            <span class="material-symbols-outlined">payment</span>
                            Process Sale
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getInventoryContent() {
    return `
        <div class="inventory-container">
            <div class="inventory-header">
                <h2>Inventory Management</h2>
                <div class="inventory-actions">
                    <button class="btn-primary" onclick="openAddProductModal()">
                        <span class="material-symbols-outlined">add</span>
                        Add Product
                    </button>
                </div>
            </div>
            
            <div class="inventory-table">
                <table>
                    <thead>
                        <tr>
                            <th>SKU</th>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${products.map(product => `
                            <tr>
                                <td>${product.sku}</td>
                                <td>
                                    <div class="product-info">
                                        <img src="${product.image}" alt="${product.name}" class="product-thumb">
                                        <span>${product.name}</span>
                                    </div>
                                </td>
                                <td>${product.category}</td>
                                <td>$${product.price}</td>
                                <td>${product.stock}</td>
                                <td>
                                    <button class="btn-edit" onclick="editProduct(${product.id})">Edit</button>
                                    <button class="btn-delete" onclick="deleteProduct(${product.id})">Delete</button>
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
            <div class="customers-header">
                <h2>Customer Management</h2>
                <div class="customers-actions">
                    <button class="btn-primary" onclick="openAddCustomerModal()">
                        <span class="material-symbols-outlined">add</span>
                        Add Customer
                    </button>
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
                                <span class="material-symbols-outlined">phone</span>
                                Phone
                            </th>
                            <th>
                                <span class="material-symbols-outlined">payments</span>
                                Total Spent
                            </th>
                            <th>
                                <span class="material-symbols-outlined">more_vert</span>
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <div class="customer-info">
                                    <div class="customer-avatar">JS</div>
                                    <div class="customer-details">
                                        <div class="customer-name">John Smith</div>
                                        <div class="customer-id">ID: 1</div>
                                    </div>
                                </div>
                            </td>
                            <td>john@email.com</td>
                            <td>+1-555-0123</td>
                            <td>$2,450</td>
                            <td>
                                <div class="action-buttons">
                                    <button class="btn-view">View</button>
                                    <button class="btn-edit">Edit</button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function getReportsContent() {
    return `
        <div class="reports-container">
            <div class="reports-header">
                <h2>Reports & Analytics</h2>
                <div class="reports-actions">
                    <button class="btn-secondary">Export Reports</button>
                </div>
            </div>
            
            <div class="reports-stats">
                <div class="stat-card">
                    <div class="stat-icon">
                        <span class="material-symbols-outlined">attach_money</span>
                    </div>
                    <div class="stat-info">
                        <h3>Total Revenue</h3>
                        <p class="stat-value">$45,250</p>
                        <span class="stat-change positive">+12.5%</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">
                        <span class="material-symbols-outlined">shopping_bag</span>
                    </div>
                    <div class="stat-info">
                        <h3>Total Sales</h3>
                        <p class="stat-value">156</p>
                        <span class="stat-change positive">+8.2%</span>
                    </div>
                </div>
            </div>
            
            <div class="reports-charts">
                <div class="chart-widget">
                    <h3>Sales Trend</h3>
                    <canvas id="reportsSalesChart"></canvas>
                </div>
                <div class="chart-widget">
                    <h3>Category Distribution</h3>
                    <canvas id="reportsCategoryChart"></canvas>
                </div>
            </div>
        </div>
    `;
}

function getSettingsContent() {
    return `
        <div class="settings-container">
            <h2>Settings</h2>
            <div class="settings-sections">
                <div class="setting-group">
                    <h3>Theme</h3>
                    <button class="btn-secondary" onclick="toggleTheme()">
                        <span class="material-symbols-outlined">dark_mode</span>
                        Toggle Dark Mode
                    </button>
                </div>
                <div class="setting-group">
                    <h3>Notifications</h3>
                    <label>
                        <input type="checkbox" checked> Enable notifications
                    </label>
                </div>
            </div>
        </div>
    `;
}

// Cart functions
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
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-info">
                    <p class="cart-item-name">${item.name}</p>
                    <p class="cart-item-sku">SKU: ${item.sku}</p>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">
                    <span class="material-symbols-outlined">delete</span>
                </button>
            </div>
        `).join('');
    }
    
    updateTotals();
}

function updateQuantity(productId, quantity) {
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

function updateTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('final-total');
    
    if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${subtotal.toFixed(2)}`;
}

function processSale() {
    if (cart.length === 0) {
        alert('Cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Sale processed successfully! Total: $${total.toFixed(2)}`);
    
    cart = [];
    updateCartDisplay();
}

// Theme toggle
function toggleTheme() {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Modal functions
function openAddProductModal() {
    alert('Add Product modal would open here');
}

function openAddCustomerModal() {
    alert('Add Customer modal would open here');
}

function editProduct(id) {
    alert(`Edit product ${id} modal would open here`);
}

function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== id);
        loadPage('inventory');
    }
}

// Logout function
function logout() {
    sessionStorage.clear();
    window.location.href = 'login.html';
}

// Navigation setup
function setupNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('href').substring(1);
            loadPage(page);
            
            // Update active state
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Initialize page-specific functionality
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

function initializeDashboardPage() {
    // Initialize dashboard charts if Chart.js is available
    if (typeof Chart !== 'undefined') {
        setTimeout(() => {
            initializeCharts();
        }, 100);
    }
}

function initializeSalesPage() {
    // Initialize sales page functionality
}

function initializeInventoryPage() {
    // Initialize inventory page functionality
}

function initializeCustomersPage() {
    // Initialize customers page functionality
}

function initializeReportsPage() {
    // Initialize reports page functionality
}

function initializeSettingsPage() {
    // Initialize settings page functionality
}

// Simple chart initialization (requires Chart.js)
function initializeCharts() {
    // Sales Chart
    const salesCtx = document.getElementById('salesChart');
    if (salesCtx) {
        new Chart(salesCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Sales',
                    data: [1200, 1900, 3000, 5000, 2000, 3000, 4500],
                    borderColor: '#eca413',
                    backgroundColor: 'rgba(236, 164, 19, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
    
    // Category Chart
    const categoryCtx = document.getElementById('categoryChart');
    if (categoryCtx) {
        new Chart(categoryCtx, {
            type: 'doughnut',
            data: {
                labels: ['Rings', 'Necklaces', 'Earrings', 'Bracelets'],
                datasets: [{
                    data: [30, 25, 20, 25],
                    backgroundColor: ['#eca413', '#f59e0b', '#d97706', '#b45309']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
}

// Update user info
function updateUserInfo() {
    const userName = sessionStorage.getItem('userName') || 'Admin User';
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        userNameElement.textContent = userName;
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
    }
    
    if (checkAuthentication()) {
        updateUserInfo();
        setupNavigation();
        loadPage('dashboard');
    }
});
