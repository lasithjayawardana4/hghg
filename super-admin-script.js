// Simplified Super Admin Script - UI Only
// This file contains only the essential super admin UI functionality

// Authentication check
function checkAuthentication() {
    if (sessionStorage.getItem('isLoggedIn') !== 'true' || sessionStorage.getItem('userType') !== 'superadmin') {
        window.location.href = 'super-admin-login.html';
        return false;
    }
    return true;
}

// Navigation functions
function loadPage(pageName) {
    if (!checkAuthentication()) return;
    
    const pageContent = document.getElementById('page-content');
    
    if (pageContent) {
        pageContent.innerHTML = getPageContent(pageName);
    }
    
    initializePage(pageName);
}

function getPageContent(pageName) {
    switch(pageName) {
        case 'dashboard':
            return getDashboardContent();
        case 'shop-management':
            return getShopManagementContent();
        case 'active-shops':
            return getActiveShopsContent();
        case 'blocked-shops':
            return getBlockedShopsContent();
        case 'messaging':
            return getMessagingContent();
        default:
            return getDashboardContent();
    }
}

// Page content functions
function getDashboardContent() {
    return `
        <div class="p-6">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Super Admin Dashboard</h1>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <div class="flex items-center">
                        <div class="p-3 bg-blue-500 text-white rounded-lg">
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path>
                            </svg>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Shops</p>
                            <p class="text-2xl font-semibold text-gray-900 dark:text-white">24</p>
                        </div>
                    </div>
                </div>
                
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <div class="flex items-center">
                        <div class="p-3 bg-green-500 text-white rounded-lg">
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                            </svg>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Active Shops</p>
                            <p class="text-2xl font-semibold text-gray-900 dark:text-white">22</p>
                        </div>
                    </div>
                </div>
                
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <div class="flex items-center">
                        <div class="p-3 bg-red-500 text-white rounded-lg">
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clip-rule="evenodd"></path>
                            </svg>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Blocked Shops</p>
                            <p class="text-2xl font-semibold text-gray-900 dark:text-white">2</p>
                        </div>
                    </div>
                </div>
                
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <div class="flex items-center">
                        <div class="p-3 bg-yellow-500 text-white rounded-lg">
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
                            </svg>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Login Activity</p>
                            <p class="text-2xl font-semibold text-gray-900 dark:text-white">156</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
                    <div class="space-y-4">
                        <div class="flex items-center">
                            <div class="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                            <div class="flex-1">
                                <p class="text-sm text-gray-900 dark:text-white">New shop "Gold Palace" registered</p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                            </div>
                        </div>
                        <div class="flex items-center">
                            <div class="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                            <div class="flex-1">
                                <p class="text-sm text-gray-900 dark:text-white">Shop "Diamond Store" updated profile</p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">4 hours ago</p>
                            </div>
                        </div>
                        <div class="flex items-center">
                            <div class="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                            <div class="flex-1">
                                <p class="text-sm text-gray-900 dark:text-white">Shop "Jewelry Plus" was blocked</p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">6 hours ago</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                    <div class="space-y-3">
                        <button class="w-full text-left py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors" onclick="loadPage('shop-management')">
                            <div class="flex items-center gap-2">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path>
                                </svg>
                                <span>Manage Shops</span>
                            </div>
                        </button>
                        <button class="w-full text-left py-3 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors" onclick="loadPage('messaging')">
                            <div class="flex items-center gap-2">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                                </svg>
                                <span>Send Messages</span>
                            </div>
                        </button>
                        <button class="w-full text-left py-3 px-4 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors" onclick="loadPage('active-shops')">
                            <div class="flex items-center gap-2">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
                                </svg>
                                <span>View Active Shops</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getShopManagementContent() {
    return `
        <div class="p-6">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Shop Management</h1>
                <button class="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors" onclick="openAddShopModal()">
                    <div class="flex items-center gap-2">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"></path>
                        </svg>
                        <span>Add New Shop</span>
                    </div>
                </button>
            </div>
            
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead class="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Shop</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Contact</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Last Active</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    <div class="h-10 w-10 flex-shrink-0">
                                        <div class="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">GS</div>
                                    </div>
                                    <div class="ml-4">
                                        <div class="text-sm font-medium text-gray-900 dark:text-white">Gold Store</div>
                                        <div class="text-sm text-gray-500 dark:text-gray-400">ID: 001</div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-900 dark:text-white">contact@goldstore.com</div>
                                <div class="text-sm text-gray-500 dark:text-gray-400">+1-555-0123</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">Active</span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">2 hours ago</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3" onclick="viewShopDetails(1)">View</button>
                                <button class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" onclick="blockShop(1)">Block</button>
                            </td>
                        </tr>
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    <div class="h-10 w-10 flex-shrink-0">
                                        <div class="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-medium">DS</div>
                                    </div>
                                    <div class="ml-4">
                                        <div class="text-sm font-medium text-gray-900 dark:text-white">Diamond Shop</div>
                                        <div class="text-sm text-gray-500 dark:text-gray-400">ID: 002</div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-900 dark:text-white">info@diamondshop.com</div>
                                <div class="text-sm text-gray-500 dark:text-gray-400">+1-555-0456</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">Active</span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">1 day ago</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3" onclick="viewShopDetails(2)">View</button>
                                <button class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" onclick="blockShop(2)">Block</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function getActiveShopsContent() {
    return `
        <div class="p-6">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Active Shops</h1>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <div class="flex items-center mb-4">
                        <div class="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium text-lg">GS</div>
                        <div class="ml-4">
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Gold Store</h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400">ID: 001</p>
                        </div>
                    </div>
                    <div class="space-y-2">
                        <div class="flex justify-between">
                            <span class="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                            <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">Active</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-sm text-gray-600 dark:text-gray-400">Last Active:</span>
                            <span class="text-sm text-gray-900 dark:text-white">2 hours ago</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-sm text-gray-600 dark:text-gray-400">Sales Today:</span>
                            <span class="text-sm text-gray-900 dark:text-white">$2,450</span>
                        </div>
                    </div>
                </div>
                
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <div class="flex items-center mb-4">
                        <div class="h-12 w-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-medium text-lg">DS</div>
                        <div class="ml-4">
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Diamond Shop</h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400">ID: 002</p>
                        </div>
                    </div>
                    <div class="space-y-2">
                        <div class="flex justify-between">
                            <span class="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                            <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">Active</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-sm text-gray-600 dark:text-gray-400">Last Active:</span>
                            <span class="text-sm text-gray-900 dark:text-white">1 day ago</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-sm text-gray-600 dark:text-gray-400">Sales Today:</span>
                            <span class="text-sm text-gray-900 dark:text-white">$1,890</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getBlockedShopsContent() {
    return `
        <div class="p-6">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Blocked Shops</h1>
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead class="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Shop</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Blocked Date</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Reason</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    <div class="h-10 w-10 flex-shrink-0">
                                        <div class="h-10 w-10 rounded-full bg-red-500 flex items-center justify-center text-white font-medium">JS</div>
                                    </div>
                                    <div class="ml-4">
                                        <div class="text-sm font-medium text-gray-900 dark:text-white">Jewelry Plus</div>
                                        <div class="text-sm text-gray-500 dark:text-gray-400">ID: 003</div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">6 hours ago</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">Payment overdue</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300" onclick="unblockShop(3)">Unblock</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function getMessagingContent() {
    return `
        <div class="p-6">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Messaging Center</h1>
                <div class="flex gap-2">
                    <button class="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                        <div class="flex items-center gap-2">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                            </svg>
                            <span>Send System Alert</span>
                        </div>
                    </button>
                </div>
            </div>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Active System Alerts (2)</h3>
                    <div class="space-y-4">
                        <div class="border-l-4 border-orange-500 pl-4">
                            <div class="flex justify-between items-start">
                                <div class="flex-1">
                                    <p class="font-medium text-gray-900 dark:text-white">System Maintenance Notice</p>
                                    <p class="text-sm text-gray-600 dark:text-gray-400">Scheduled maintenance on Dec 20th, 2024 from 2:00 AM to 4:00 AM EST</p>
                                    <p class="text-xs text-gray-500 dark:text-gray-500">2 hours ago</p>
                                </div>
                            </div>
                        </div>
                        <div class="border-l-4 border-green-500 pl-4">
                            <div class="flex justify-between items-start">
                                <div class="flex-1">
                                    <p class="font-medium text-gray-900 dark:text-white">New Feature Update</p>
                                    <p class="text-sm text-gray-600 dark:text-gray-400">Enhanced reporting features now available</p>
                                    <p class="text-xs text-gray-500 dark:text-gray-500">1 day ago</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                    <div class="space-y-3">
                        <button class="w-full text-left py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                            <div class="flex items-center gap-2">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                                </svg>
                                <span>Send System Alert</span>
                            </div>
                        </button>
                        <button class="w-full text-left py-3 px-4 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors">
                            <div class="flex items-center gap-2">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                                </svg>
                                <span>Broadcast Message</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Action functions
function viewShopDetails(shopId) {
    alert(`View shop details for shop ID: ${shopId}`);
}

function blockShop(shopId) {
    if (confirm('Are you sure you want to block this shop?')) {
        alert(`Shop ${shopId} has been blocked successfully!`);
    }
}

function unblockShop(shopId) {
    if (confirm('Are you sure you want to unblock this shop?')) {
        alert(`Shop ${shopId} has been unblocked successfully!`);
    }
}

function openAddShopModal() {
    alert('Add New Shop modal would open here');
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
    // Initialize page-specific functionality here
    console.log(`Initializing page: ${pageName}`);
}

// Logout function
function logout() {
    sessionStorage.clear();
    window.location.href = 'super-admin-login.html';
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    if (checkAuthentication()) {
        setupNavigation();
        loadPage('dashboard');
    }
});
