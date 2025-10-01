// Super Admin System JavaScript

// Check authentication
function checkAuthentication() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const userType = sessionStorage.getItem('userType');
    
    if (!isLoggedIn || userType !== 'superadmin') {
        window.location.href = 'super-admin-login.html';
        return false;
    }
    return true;
}

// Logout function
function logout() {
    sessionStorage.clear();
    window.location.href = 'super-admin-login.html';
}

// System alerts storage
let systemAlerts = [
    {
        id: 1,
        title: 'System Maintenance Notice',
        message: 'Scheduled maintenance on Dec 20th, 2024 from 2:00 AM to 4:00 AM EST. System will be temporarily unavailable.',
        type: 'maintenance',
        createdDate: new Date().toISOString(),
        isActive: true,
        targetShops: 'all' // 'all' or array of shop IDs
    },
    {
        id: 2,
        title: 'New Feature Update',
        message: 'Enhanced reporting features now available. Check the Reports section for new analytics.',
        type: 'update',
        createdDate: new Date().toISOString(),
        isActive: true,
        targetShops: 'all'
    }
];

// Sample shop data
let shops = [
    {
        id: 1,
        name: 'Sparkle Gems',
        email: 'sparklegems@example.com',
        phone: '+1-555-123-4567',
        status: 'active',
        createdDate: '2024-01-15',
        lastLogin: '2024-12-15 14:30',
        totalSales: 125000,
        owner: 'John Smith'
    },
    {
        id: 2,
        name: 'Golden Treasures',
        email: 'goldentreasures@example.com',
        phone: '+1-555-987-6543',
        status: 'active',
        createdDate: '2024-02-20',
        lastLogin: '2024-12-15 12:15',
        totalSales: 89000,
        owner: 'Sarah Johnson'
    },
    {
        id: 3,
        name: 'Diamond Dreams',
        email: 'diamonddreams@example.com',
        phone: '+1-555-246-8013',
        status: 'active',
        createdDate: '2024-03-25',
        lastLogin: '2024-12-15 10:45',
        totalSales: 156000,
        owner: 'Mike Wilson'
    },
    {
        id: 4,
        name: 'Silver Linings',
        email: 'silverlinings@example.com',
        phone: '+1-555-369-1470',
        status: 'blocked',
        createdDate: '2024-04-30',
        lastLogin: '2024-12-10 16:20',
        totalSales: 45000,
        owner: 'Emma Davis',
        blockReason: 'Policy Violation',
        blockedDate: '2024-12-10'
    },
    {
        id: 5,
        name: 'Gemstone Gallery',
        email: 'gemstonegallery@example.com',
        phone: '+1-555-789-0123',
        status: 'active',
        createdDate: '2024-05-05',
        lastLogin: '2024-12-15 09:30',
        totalSales: 78000,
        owner: 'David Brown'
    },
    {
        id: 6,
        name: 'Radiant Jewels',
        email: 'radiantjewels@example.com',
        phone: '+1-555-456-7890',
        status: 'blocked',
        createdDate: '2024-06-15',
        lastLogin: '2024-12-08 11:15',
        totalSales: 32000,
        owner: 'Lisa Garcia',
        blockReason: 'Payment Issues',
        blockedDate: '2024-12-08'
    }
];

// Load page content
function loadPage(pageName) {
    const mainContent = document.getElementById('main-content');
    
    // Update navigation
    updateNavigation(pageName);
    
    switch(pageName) {
        case 'dashboard':
            mainContent.innerHTML = getDashboardContent();
            break;
        case 'shops':
            mainContent.innerHTML = getShopManagementContent();
            break;
        case 'active-shops':
            mainContent.innerHTML = getActiveShopsContent();
            break;
        case 'blocked-shops':
            mainContent.innerHTML = getBlockedShopsContent();
            break;
        case 'messaging':
            mainContent.innerHTML = getMessagingContent();
            break;
    }
}

// Update navigation
function updateNavigation(pageName) {
    const navItems = document.querySelectorAll('aside nav a');
    navItems.forEach(item => {
        item.classList.remove('bg-primary/10', 'text-primary', 'font-bold');
        item.classList.add('text-[#181611]/80', 'dark:text-white/80');
    });
    
    // Highlight active page
    const activeItem = document.querySelector(`a[onclick="loadPage('${pageName}')"]`);
    if (activeItem) {
        activeItem.classList.remove('text-[#181611]/80', 'dark:text-white/80');
        activeItem.classList.add('bg-primary/10', 'text-primary', 'font-bold');
    }
}

// Dashboard content
function getDashboardContent() {
    const activeShops = shops.filter(shop => shop.status === 'active').length;
    const blockedShops = shops.filter(shop => shop.status === 'blocked').length;
    const totalShops = shops.length;
    
    return `
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="bg-gradient-to-br from-primary/80 to-primary p-6 rounded-xl shadow-lg text-white">
                <h3 class="text-base font-medium">Total Shops</h3>
                <p class="text-3xl font-bold">${totalShops}</p>
            </div>
            <div class="bg-white dark:bg-[#181611]/50 p-6 rounded-xl shadow-sm border border-primary/20 dark:border-primary/30">
                <h3 class="text-base font-medium text-[#181611] dark:text-white">Active Shops</h3>
                <p class="text-3xl font-bold text-primary">${activeShops}</p>
            </div>
            <div class="bg-white dark:bg-[#181611]/50 p-6 rounded-xl shadow-sm border border-primary/20 dark:border-primary/30">
                <h3 class="text-base font-medium text-[#181611] dark:text-white">Blocked Shops</h3>
                <p class="text-3xl font-bold text-primary">${blockedShops}</p>
            </div>
            <div class="bg-white dark:bg-[#181611]/50 p-6 rounded-xl shadow-sm border border-primary/20 dark:border-primary/30">
                <h3 class="text-base font-medium text-[#181611] dark:text-white">Total Revenue</h3>
                <p class="text-xl font-bold text-primary">$${shops.reduce((sum, shop) => sum + shop.totalSales, 0).toLocaleString()}</p>
            </div>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div class="lg:col-span-2 bg-white dark:bg-[#181611]/50 p-6 rounded-xl shadow-sm border border-primary/20 dark:border-primary/30">
                <h3 class="text-xl font-bold mb-4 text-[#181611] dark:text-white">Recent Activity</h3>
                <div class="space-y-4">
                    ${shops.slice(0, 5).map(shop => `
                        <div class="flex items-center gap-4">
                            <div class="bg-primary/10 rounded-full p-3">
                                <svg class="text-primary" fill="currentColor" height="24" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M232,96a7.89,7.89,0,0,0-.3-2.2L217.35,43.6A16.07,16.07,0,0,0,202,32H54A16.07,16.07,0,0,0,38.65,43.6L24.31,93.8A7.89,7.89,0,0,0,24,96v16a40,40,0,0,0,16,32v64a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V144a40,40,0,0,0,16-32ZM54,48H202l11.42,40H42.61Zm50,56h48v8a24,24,0,0,1-48,0Zm-16,0v8a24,24,0,0,1-48,0v-8ZM200,208H56V151.2a40.57,40.57,0,0,0,8,.8,40,40,0,0,0,32-16,40,40,0,0,0,64,0,40,40,0,0,0,32,16,40.57,40.57,0,0,0,8-.8Zm-8-72a24,24,0,0,1-24-24v-8h48v8A24,24,0,0,1,192,136Z"></path>
                                </svg>
                            </div>
                            <div>
                                <p class="font-medium text-[#181611] dark:text-white">${shop.name}</p>
                                <p class="text-sm text-[#181611]/70 dark:text-white/70">Last Login: ${shop.lastLogin}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="bg-white dark:bg-[#181611]/50 p-6 rounded-xl shadow-sm border border-primary/20 dark:border-primary/30">
                <h3 class="text-xl font-bold mb-4 text-[#181611] dark:text-white">Quick Shortcuts</h3>
                <div class="space-y-3">
                    <button class="w-full text-left py-3 px-4 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors" onclick="loadPage('shops')">Shop Management</button>
                    <button class="w-full text-left py-3 px-4 bg-primary/10 text-primary dark:text-primary rounded-lg font-bold hover:bg-primary/20 transition-colors" onclick="loadPage('active-shops')">Active Shops</button>
                    <button class="w-full text-left py-3 px-4 bg-primary/10 text-primary dark:text-primary rounded-lg font-bold hover:bg-primary/20 transition-colors" onclick="loadPage('blocked-shops')">Blocked Shops</button>
                </div>
            </div>
        </div>
    `;
}

// Shop Management content
function getShopManagementContent() {
    return `
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Shop Management</h1>
            <button class="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:opacity-90 transition-opacity" onclick="openAddShopModal()">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"></path>
                </svg>
                <span>Add New Shop</span>
            </button>
        </div>
        <div class="overflow-x-auto bg-white dark:bg-background-dark rounded-lg shadow-md">
            <table class="w-full text-left text-sm text-gray-600 dark:text-gray-400">
                <thead class="bg-gray-50 dark:bg-gray-900/50 text-xs text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    <tr>
                        <th class="px-6 py-3" scope="col">Name</th>
                        <th class="px-6 py-3" scope="col">Email</th>
                        <th class="px-6 py-3" scope="col">Phone</th>
                        <th class="px-6 py-3" scope="col">Status</th>
                        <th class="px-6 py-3" scope="col">Created Date</th>
                        <th class="px-6 py-3 text-right" scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${shops.map(shop => `
                        <tr class="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">${shop.name}</td>
                            <td class="px-6 py-4">${shop.email}</td>
                            <td class="px-6 py-4">${shop.phone}</td>
                            <td class="px-6 py-4">
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${shop.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}">${shop.status}</span>
                            </td>
                            <td class="px-6 py-4">${shop.createdDate}</td>
                            <td class="px-6 py-4 text-right space-x-2">
                                <button class="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-primary/20" onclick="viewShopDetails(${shop.id})" title="View Details">
                                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                                        <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path>
                                    </svg>
                                </button>
                                <button class="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-primary/20" onclick="editShop(${shop.id})" title="Edit Shop">
                                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                                    </svg>
                                </button>
                                ${shop.status === 'active' ? 
                                    `<button class="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-primary/20" onclick="blockShop(${shop.id})" title="Block Shop">
                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clip-rule="evenodd"></path>
                                        </svg>
                                    </button>` :
                                    `<button class="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-primary/20" onclick="unblockShop(${shop.id})" title="Unblock Shop">
                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                                        </svg>
                                    </button>`
                                }
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Active Shops content
function getActiveShopsContent() {
    const activeShops = shops.filter(shop => shop.status === 'active');
    
    return `
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Active Shops</h1>
            <div class="flex items-center gap-2">
                <span class="text-sm text-gray-600 dark:text-gray-400">${activeShops.length} Active Shops</span>
            </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${activeShops.map(shop => `
                <div class="bg-white dark:bg-background-dark rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">${shop.name}</h3>
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Active</span>
                    </div>
                    <div class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <p><strong>Owner:</strong> ${shop.owner}</p>
                        <p><strong>Email:</strong> ${shop.email}</p>
                        <p><strong>Phone:</strong> ${shop.phone}</p>
                        <p><strong>Total Sales:</strong> $${shop.totalSales.toLocaleString()}</p>
                        <p><strong>Last Login:</strong> ${shop.lastLogin}</p>
                    </div>
                    <div class="mt-4 flex gap-2">
                        <button class="flex-1 bg-primary text-white px-3 py-2 rounded text-sm font-medium hover:bg-primary/90 transition-colors" onclick="viewShopDetails(${shop.id})">View Details</button>
                        <button class="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" onclick="blockShop(${shop.id})">Block</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Blocked Shops content
function getBlockedShopsContent() {
    const blockedShops = shops.filter(shop => shop.status === 'blocked');
    
    return `
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Blocked Shops</h1>
            <div class="flex items-center gap-2">
                <span class="text-sm text-gray-600 dark:text-gray-400">${blockedShops.length} Blocked Shops</span>
            </div>
        </div>
        <div class="overflow-x-auto bg-white dark:bg-background-dark rounded-lg shadow-md">
            <table class="w-full text-left text-sm text-gray-600 dark:text-gray-400">
                <thead class="bg-gray-50 dark:bg-gray-900/50 text-xs text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    <tr>
                        <th class="px-6 py-3" scope="col">Shop Name</th>
                        <th class="px-6 py-3" scope="col">Owner</th>
                        <th class="px-6 py-3" scope="col">Blocked Date</th>
                        <th class="px-6 py-3" scope="col">Block Reason</th>
                        <th class="px-6 py-3 text-right" scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${blockedShops.map(shop => `
                        <tr class="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">${shop.name}</td>
                            <td class="px-6 py-4">${shop.owner}</td>
                            <td class="px-6 py-4">${shop.blockedDate}</td>
                            <td class="px-6 py-4">${shop.blockReason}</td>
                            <td class="px-6 py-4 text-right">
                                <button class="bg-primary text-white px-4 py-2 rounded text-sm font-medium hover:bg-primary/90 transition-colors" onclick="unblockShop(${shop.id})">Unblock</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Messaging content
function getMessagingContent() {
    const activeAlerts = systemAlerts.filter(alert => alert.isActive);
    
    return `
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Messaging Center</h1>
            <div class="flex gap-2">
                <button class="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:opacity-90 transition-opacity" onclick="openSendAlertModal()">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                    </svg>
                    <span>Send System Alert</span>
                </button>
                <button class="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:opacity-90 transition-opacity" onclick="openBroadcastModal()">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                    </svg>
                    <span>Broadcast Message</span>
                </button>
            </div>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-white dark:bg-background-dark rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Active System Alerts (${activeAlerts.length})</h3>
                <div class="space-y-4">
                    ${activeAlerts.map(alert => `
                        <div class="border-l-4 ${getAlertBorderColor(alert.type)} pl-4">
                            <div class="flex justify-between items-start">
                                <div class="flex-1">
                                    <p class="font-medium text-gray-900 dark:text-white">${alert.title}</p>
                                    <p class="text-sm text-gray-600 dark:text-gray-400">${alert.message}</p>
                                    <p class="text-xs text-gray-500 dark:text-gray-500">${formatDate(alert.createdDate)}</p>
                                </div>
                                <button class="ml-2 text-red-500 hover:text-red-700" onclick="deactivateAlert(${alert.id})" title="Deactivate Alert">
                                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                    ${activeAlerts.length === 0 ? '<p class="text-gray-500 dark:text-gray-400">No active alerts</p>' : ''}
                </div>
            </div>
            <div class="bg-white dark:bg-background-dark rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                <div class="space-y-3">
                    <button class="w-full text-left py-3 px-4 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors" onclick="openSendAlertModal()">
                        <div class="flex items-center gap-2">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                            </svg>
                            <span>Send System Alert</span>
                        </div>
                    </button>
                    <button class="w-full text-left py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors" onclick="openBroadcastModal()">
                        <div class="flex items-center gap-2">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                            </svg>
                            <span>Broadcast Message</span>
                        </div>
                    </button>
                    <button class="w-full text-left py-3 px-4 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors" onclick="viewAlertHistory()">
                        <div class="flex items-center gap-2">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
                            </svg>
                            <span>View Alert History</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
        
        <!-- Send Alert Modal -->
        <div id="alertModal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Send System Alert</h3>
                <form onsubmit="sendSystemAlert(event)">
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Alert Type</label>
                        <select id="alertType" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" required>
                            <option value="maintenance">Maintenance Notice</option>
                            <option value="update">Feature Update</option>
                            <option value="warning">Warning</option>
                            <option value="info">Information</option>
                            <option value="urgent">Urgent</option>
                        </select>
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Alert Title</label>
                        <input type="text" id="alertTitle" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Enter alert title" required>
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Alert Message</label>
                        <textarea id="alertMessage" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" rows="4" placeholder="Enter alert message" required></textarea>
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Target</label>
                        <select id="alertTarget" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                            <option value="all">All Shops</option>
                            ${shops.map(shop => `<option value="${shop.id}">${shop.name}</option>`).join('')}
                        </select>
                    </div>
                    <div class="flex gap-3">
                        <button type="submit" class="flex-1 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">Send Alert</button>
                        <button type="button" onclick="closeAlertModal()" class="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

// Shop management functions
function viewShopDetails(shopId) {
    const shop = shops.find(s => s.id === shopId);
    if (shop) {
        alert(`Shop Details:\n\nName: ${shop.name}\nOwner: ${shop.owner}\nEmail: ${shop.email}\nPhone: ${shop.phone}\nStatus: ${shop.status}\nTotal Sales: $${shop.totalSales.toLocaleString()}\nLast Login: ${shop.lastLogin}`);
    }
}

function editShop(shopId) {
    const shop = shops.find(s => s.id === shopId);
    if (shop) {
        const newName = prompt('Enter new shop name:', shop.name);
        if (newName && newName.trim()) {
            shop.name = newName.trim();
            loadPage('shops');
            alert('Shop updated successfully!');
        }
    }
}

function blockShop(shopId) {
    const shop = shops.find(s => s.id === shopId);
    if (shop) {
        const reason = prompt('Enter reason for blocking:', 'Policy Violation');
        if (reason && reason.trim()) {
            shop.status = 'blocked';
            shop.blockReason = reason.trim();
            shop.blockedDate = new Date().toISOString().split('T')[0];
            loadPage('shops');
            alert('Shop blocked successfully!');
        }
    }
}

function unblockShop(shopId) {
    const shop = shops.find(s => s.id === shopId);
    if (shop) {
        if (confirm('Are you sure you want to unblock this shop?')) {
            shop.status = 'active';
            delete shop.blockReason;
            delete shop.blockedDate;
            loadPage('shops');
            alert('Shop unblocked successfully!');
        }
    }
}

function openAddShopModal() {
    alert('Add New Shop functionality would be implemented here with a modal form.');
}

// Alert management functions
function getAlertBorderColor(type) {
    switch(type) {
        case 'maintenance': return 'border-orange-500';
        case 'update': return 'border-green-500';
        case 'warning': return 'border-yellow-500';
        case 'info': return 'border-blue-500';
        case 'urgent': return 'border-red-500';
        default: return 'border-gray-500';
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

function openSendAlertModal() {
    document.getElementById('alertModal').classList.remove('hidden');
    document.getElementById('alertModal').classList.add('flex');
}

function closeAlertModal() {
    document.getElementById('alertModal').classList.add('hidden');
    document.getElementById('alertModal').classList.remove('flex');
    // Reset form
    document.getElementById('alertTitle').value = '';
    document.getElementById('alertMessage').value = '';
    document.getElementById('alertType').value = 'maintenance';
    document.getElementById('alertTarget').value = 'all';
}

function sendSystemAlert(event) {
    event.preventDefault();
    
    const type = document.getElementById('alertType').value;
    const title = document.getElementById('alertTitle').value;
    const message = document.getElementById('alertMessage').value;
    const target = document.getElementById('alertTarget').value;
    
    const newAlert = {
        id: systemAlerts.length + 1,
        title: title,
        message: message,
        type: type,
        createdDate: new Date().toISOString(),
        isActive: true,
        targetShops: target
    };
    
    systemAlerts.push(newAlert);
    
    // Store alerts in localStorage for persistence
    localStorage.setItem('systemAlerts', JSON.stringify(systemAlerts));
    
    closeAlertModal();
    loadPage('messaging');
    
    alert('System alert sent successfully!');
}

function deactivateAlert(alertId) {
    const alert = systemAlerts.find(a => a.id === alertId);
    if (alert && confirm('Are you sure you want to deactivate this alert?')) {
        alert.isActive = false;
        localStorage.setItem('systemAlerts', JSON.stringify(systemAlerts));
        loadPage('messaging');
        alert('Alert deactivated successfully!');
    }
}

function openBroadcastModal() {
    alert('Broadcast message functionality would be implemented here.');
}

function viewAlertHistory() {
    const allAlerts = systemAlerts;
    const alertHistory = allAlerts.map(alert => 
        `${alert.title} (${alert.type}) - ${formatDate(alert.createdDate)} - ${alert.isActive ? 'Active' : 'Inactive'}`
    ).join('\n');
    
    alert('Alert History:\n\n' + alertHistory);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    if (checkAuthentication()) {
        // Load alerts from localStorage if available
        const storedAlerts = localStorage.getItem('systemAlerts');
        if (storedAlerts) {
            systemAlerts = JSON.parse(storedAlerts);
        }
        loadPage('dashboard');
    }
});
