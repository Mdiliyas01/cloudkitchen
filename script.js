// Global variables
let currentSlide = 0;
let orders = JSON.parse(localStorage.getItem('orders')) || [];
let currentUser = null;

// Menu items with prices
const menuItems = {
    chicken: { name: 'Chicken Biriyani Bucket', price: 850 },
    mutton: { name: 'Mutton Biriyani Bucket', price: 1800 },
    veg: { name: 'Veg Biriyani', price: 650 },
    ghee: { name: 'Ghee Rice', price: 120 }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeSlideshow();
    initializeMobileMenu();
    initializeOrderForm();
    setMinDeliveryDate();
    checkAdminAccess();
});

// Slideshow functionality
function initializeSlideshow() {
    const slides = document.querySelectorAll('.slide');
    if (slides.length === 0) return;

    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    // Change slide every 4 seconds
    setInterval(nextSlide, 4000);
}

// Mobile menu functionality
function initializeMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Set minimum delivery date to tomorrow
function setMinDeliveryDate() {
    const deliveryDateInput = document.getElementById('deliveryDate');
    if (deliveryDateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowString = tomorrow.toISOString().split('T')[0];
        deliveryDateInput.min = tomorrowString;
    }
}

// Order form functionality
function initializeOrderForm() {
    const orderForm = document.getElementById('orderForm');
    if (!orderForm) return;

    // Add event listeners for quantity changes
    const quantityInputs = document.querySelectorAll('.qty-input');
    quantityInputs.forEach(input => {
        input.addEventListener('change', calculateTotal);
        input.addEventListener('input', calculateTotal);
    });

    // Add event listeners for checkbox changes
    const checkboxes = document.querySelectorAll('input[name="items"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const itemType = this.value;
            const qtyInput = document.querySelector(`input[name="${itemType}_qty"]`);
            if (qtyInput) {
                qtyInput.disabled = !this.checked;
                if (!this.checked) {
                    qtyInput.value = 0;
                }
                calculateTotal();
            }
        });
    });

    // Form submission
    orderForm.addEventListener('submit', handleOrderSubmission);
}

// Calculate total order amount
function calculateTotal() {
    let total = 0;
    
    Object.keys(menuItems).forEach(itemType => {
        const checkbox = document.querySelector(`input[value="${itemType}"]`);
        const qtyInput = document.querySelector(`input[name="${itemType}_qty"]`);
        
        if (checkbox && checkbox.checked && qtyInput) {
            const quantity = parseInt(qtyInput.value) || 0;
            total += menuItems[itemType].price * quantity;
        }
    });

    const totalElement = document.getElementById('totalAmount');
    if (totalElement) {
        totalElement.textContent = `₹${total}`;
    }
}

// Handle order submission
function handleOrderSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const orderData = {
        id: generateOrderId(),
        customerName: formData.get('name'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        deliveryDate: formData.get('deliveryDate'),
        notes: formData.get('notes'),
        items: [],
        total: 0,
        status: 'Pending',
        orderDate: new Date().toISOString(),
        timestamp: Date.now()
    };

    // Collect selected items
    let total = 0;
    Object.keys(menuItems).forEach(itemType => {
        const checkbox = document.querySelector(`input[value="${itemType}"]`);
        const qtyInput = document.querySelector(`input[name="${itemType}_qty"]`);
        
        if (checkbox && checkbox.checked && qtyInput) {
            const quantity = parseInt(qtyInput.value) || 0;
            if (quantity > 0) {
                orderData.items.push({
                    name: menuItems[itemType].name,
                    price: menuItems[itemType].price,
                    quantity: quantity,
                    subtotal: menuItems[itemType].price * quantity
                });
                total += menuItems[itemType].price * quantity;
            }
        }
    });

    orderData.total = total;

    // Validate order
    if (orderData.items.length === 0) {
        alert('Please select at least one item.');
        return;
    }

    if (total === 0) {
        alert('Please select quantities for your items.');
        return;
    }

    // Save order
    orders.push(orderData);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Show confirmation
    showOrderConfirmation(orderData.id);

    // Reset form
    e.target.reset();
    calculateTotal();
}

// Generate unique order ID
function generateOrderId() {
    return 'HB' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
}

// Show order confirmation modal
function showOrderConfirmation(orderId) {
    const modal = document.getElementById('orderModal');
    const orderIdSpan = document.getElementById('orderId');
    
    if (modal && orderIdSpan) {
        orderIdSpan.textContent = orderId;
        modal.style.display = 'block';
    }
}

// Close order confirmation modal
function closeOrderModal() {
    const modal = document.getElementById('orderModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Navigate to order page
function scrollToOrder() {
    window.location.href = 'order.html';
}

// Login modal functionality
function showLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Switch between customer and admin login tabs
function switchTab(tab) {
    const customerForm = document.getElementById('customerLoginForm');
    const adminForm = document.getElementById('adminLoginForm');
    const tabBtns = document.querySelectorAll('.tab-btn');

    if (tab === 'customer') {
        customerForm.style.display = 'block';
        adminForm.style.display = 'none';
        tabBtns[0].classList.add('active');
        tabBtns[1].classList.remove('active');
    } else {
        customerForm.style.display = 'none';
        adminForm.style.display = 'block';
        tabBtns[0].classList.remove('active');
        tabBtns[1].classList.add('active');
    }
}

// Handle customer login
document.addEventListener('DOMContentLoaded', function() {
    const customerLoginForm = document.getElementById('customerLoginForm');
    if (customerLoginForm) {
        customerLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('customerEmail').value;
            const password = document.getElementById('customerPassword').value;
            
            // Simple validation (in real app, this would connect to a backend)
            if (email && password) {
                currentUser = { email, role: 'customer' };
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                closeLoginModal();
                alert('Welcome back! You are now logged in.');
                updateLoginButton();
            } else {
                alert('Please enter valid credentials.');
            }
        });
    }

    // Handle admin login
    const adminLoginForm = document.getElementById('adminLoginForm');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('adminEmail').value;
            const password = document.getElementById('adminPassword').value;
            
            // Simple admin validation (in real app, this would be more secure)
            if (email === 'admin@habibibiriyani.com' && password === 'admin123') {
                currentUser = { email, role: 'admin' };
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                closeLoginModal();
                showAdminPanel();
            } else {
                alert('Invalid admin credentials.');
            }
        });
    }
});

// Update login button based on user status
function updateLoginButton() {
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn && currentUser) {
        loginBtn.textContent = currentUser.role === 'admin' ? 'Admin Panel' : 'My Account';
        loginBtn.onclick = currentUser.role === 'admin' ? showAdminPanel : showCustomerAccount;
    }
}

// Check for existing user session
function checkAdminAccess() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateLoginButton();
    }
}

// Show admin panel
function showAdminPanel() {
    if (!currentUser || currentUser.role !== 'admin') {
        alert('Access denied. Admin privileges required.');
        return;
    }

    // Create admin panel HTML
    const adminHTML = `
        <div class="admin-panel">
            <div class="admin-header">
                <h2>Admin Panel - Habibi Biriyani</h2>
                <button onclick="closeAdminPanel()" class="close-btn">Close</button>
            </div>
            
            <div class="admin-tabs">
                <button class="admin-tab active" onclick="switchAdminTab('orders')">Orders</button>
                <button class="admin-tab" onclick="switchAdminTab('reports')">Reports</button>
                <button class="admin-tab" onclick="switchAdminTab('menu')">Menu Management</button>
            </div>
            
            <div id="orders-tab" class="admin-content active">
                <div class="admin-controls">
                    <input type="date" id="filterDate" onchange="filterOrders()">
                    <select id="statusFilter" onchange="filterOrders()">
                        <option value="">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Delivered">Delivered</option>
                    </select>
                    <button onclick="exportOrders()" class="export-btn">Export CSV</button>
                </div>
                <div id="ordersList" class="orders-list"></div>
            </div>
            
            <div id="reports-tab" class="admin-content">
                <div class="reports-section">
                    <h3>Sales Reports</h3>
                    <div class="report-controls">
                        <select id="reportType">
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                        </select>
                        <input type="date" id="reportDate">
                        <button onclick="generateReport()" class="generate-btn">Generate Report</button>
                    </div>
                    <div id="reportResults"></div>
                </div>
            </div>
            
            <div id="menu-tab" class="admin-content">
                <div class="menu-management">
                    <h3>Menu Management</h3>
                    <div id="menuItemsList"></div>
                    <button onclick="addMenuItem()" class="add-item-btn">Add New Item</button>
                </div>
            </div>
        </div>
    `;

    // Create modal for admin panel
    const modal = document.createElement('div');
    modal.className = 'modal admin-modal';
    modal.innerHTML = `
        <div class="modal-content admin-modal-content">
            ${adminHTML}
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
    
    // Load initial data
    loadOrders();
    loadMenuItems();
}

// Close admin panel
function closeAdminPanel() {
    const modal = document.querySelector('.admin-modal');
    if (modal) {
        modal.remove();
    }
}

// Switch admin tabs
function switchAdminTab(tab) {
    const tabs = document.querySelectorAll('.admin-tab');
    const contents = document.querySelectorAll('.admin-content');
    
    tabs.forEach(t => t.classList.remove('active'));
    contents.forEach(c => c.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(tab + '-tab').classList.add('active');
}

// Load and display orders
function loadOrders() {
    const ordersList = document.getElementById('ordersList');
    if (!ordersList) return;

    const filteredOrders = filterOrdersData();
    
    if (filteredOrders.length === 0) {
        ordersList.innerHTML = '<p class="no-orders">No orders found.</p>';
        return;
    }

    ordersList.innerHTML = filteredOrders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <h4>Order #${order.id}</h4>
                <span class="order-status ${order.status.toLowerCase()}">${order.status}</span>
            </div>
            <div class="order-details">
                <p><strong>Customer:</strong> ${order.customerName}</p>
                <p><strong>Phone:</strong> ${order.phone}</p>
                <p><strong>Delivery Date:</strong> ${new Date(order.deliveryDate).toLocaleDateString()}</p>
                <p><strong>Total:</strong> ₹${order.total}</p>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <span>${item.name} x${item.quantity}</span>
                        <span>₹${item.subtotal}</span>
                    </div>
                `).join('')}
            </div>
            <div class="order-actions">
                <select onchange="updateOrderStatus('${order.id}', this.value)">
                    <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="Preparing" ${order.status === 'Preparing' ? 'selected' : ''}>Preparing</option>
                    <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                </select>
                <button onclick="deleteOrder('${order.id}')" class="delete-btn">Delete</button>
            </div>
        </div>
    `).join('');
}

// Filter orders data
function filterOrdersData() {
    const dateFilter = document.getElementById('filterDate')?.value;
    const statusFilter = document.getElementById('statusFilter')?.value;
    
    let filtered = orders;
    
    if (dateFilter) {
        filtered = filtered.filter(order => order.deliveryDate === dateFilter);
    }
    
    if (statusFilter) {
        filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    return filtered.sort((a, b) => b.timestamp - a.timestamp);
}

// Filter orders
function filterOrders() {
    loadOrders();
}

// Update order status
function updateOrderStatus(orderId, newStatus) {
    const orderIndex = orders.findIndex(order => order.id === orderId);
    if (orderIndex !== -1) {
        orders[orderIndex].status = newStatus;
        localStorage.setItem('orders', JSON.stringify(orders));
        loadOrders();
    }
}

// Delete order
function deleteOrder(orderId) {
    if (confirm('Are you sure you want to delete this order?')) {
        orders = orders.filter(order => order.id !== orderId);
        localStorage.setItem('orders', JSON.stringify(orders));
        loadOrders();
    }
}

// Export orders to CSV
function exportOrders() {
    const filteredOrders = filterOrdersData();
    if (filteredOrders.length === 0) {
        alert('No orders to export.');
        return;
    }

    let csv = 'Order ID,Customer Name,Phone,Delivery Date,Items,Total,Status\n';
    
    filteredOrders.forEach(order => {
        const items = order.items.map(item => `${item.name} x${item.quantity}`).join('; ');
        csv += `${order.id},${order.customerName},${order.phone},${order.deliveryDate},"${items}",${order.total},${order.status}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `habibi_biriyani_orders_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}

// Generate sales report
function generateReport() {
    const reportType = document.getElementById('reportType').value;
    const reportDate = document.getElementById('reportDate').value;
    const reportResults = document.getElementById('reportResults');
    
    if (!reportDate) {
        alert('Please select a date for the report.');
        return;
    }

    const selectedDate = new Date(reportDate);
    let filteredOrders = [];
    
    switch (reportType) {
        case 'daily':
            filteredOrders = orders.filter(order => 
                order.deliveryDate === reportDate
            );
            break;
        case 'weekly':
            const weekStart = new Date(selectedDate);
            weekStart.setDate(selectedDate.getDate() - selectedDate.getDay());
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            
            filteredOrders = orders.filter(order => {
                const orderDate = new Date(order.deliveryDate);
                return orderDate >= weekStart && orderDate <= weekEnd;
            });
            break;
        case 'monthly':
            filteredOrders = orders.filter(order => {
                const orderDate = new Date(order.deliveryDate);
                return orderDate.getMonth() === selectedDate.getMonth() && 
                       orderDate.getFullYear() === selectedDate.getFullYear();
            });
            break;
    }

    const totalSales = filteredOrders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = filteredOrders.length;
    
    const itemSales = {};
    filteredOrders.forEach(order => {
        order.items.forEach(item => {
            itemSales[item.name] = (itemSales[item.name] || 0) + item.quantity;
        });
    });

    reportResults.innerHTML = `
        <div class="report-summary">
            <h4>Sales Summary</h4>
            <p><strong>Total Orders:</strong> ${totalOrders}</p>
            <p><strong>Total Sales:</strong> ₹${totalSales}</p>
            <p><strong>Average Order Value:</strong> ₹${totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0}</p>
        </div>
        <div class="item-breakdown">
            <h4>Item Breakdown</h4>
            ${Object.entries(itemSales).map(([item, qty]) => 
                `<p><strong>${item}:</strong> ${qty} units</p>`
            ).join('')}
        </div>
        <button onclick="exportReport('${reportType}', '${reportDate}')" class="export-btn">Export Report</button>
    `;
}

// Export report
function exportReport(reportType, reportDate) {
    // Implementation similar to exportOrders but for reports
    alert('Report export functionality would be implemented here.');
}

// Load menu items for management
function loadMenuItems() {
    const menuItemsList = document.getElementById('menuItemsList');
    if (!menuItemsList) return;

    menuItemsList.innerHTML = Object.entries(menuItems).map(([key, item]) => `
        <div class="menu-item-admin">
            <div class="menu-item-info">
                <h4>${item.name}</h4>
                <p>₹${item.price}</p>
            </div>
            <div class="menu-item-actions">
                <button onclick="editMenuItem('${key}')" class="edit-btn">Edit</button>
                <button onclick="deleteMenuItem('${key}')" class="delete-btn">Delete</button>
            </div>
        </div>
    `).join('');
}

// Add new menu item
function addMenuItem() {
    const name = prompt('Enter item name:');
    const price = prompt('Enter item price:');
    
    if (name && price && !isNaN(price)) {
        const key = name.toLowerCase().replace(/\s+/g, '_');
        menuItems[key] = { name, price: parseInt(price) };
        localStorage.setItem('menuItems', JSON.stringify(menuItems));
        loadMenuItems();
    }
}

// Edit menu item
function editMenuItem(key) {
    const item = menuItems[key];
    const newName = prompt('Enter new name:', item.name);
    const newPrice = prompt('Enter new price:', item.price);
    
    if (newName && newPrice && !isNaN(newPrice)) {
        menuItems[key] = { name: newName, price: parseInt(newPrice) };
        localStorage.setItem('menuItems', JSON.stringify(menuItems));
        loadMenuItems();
    }
}

// Delete menu item
function deleteMenuItem(key) {
    if (confirm('Are you sure you want to delete this menu item?')) {
        delete menuItems[key];
        localStorage.setItem('menuItems', JSON.stringify(menuItems));
        loadMenuItems();
    }
}

// Show customer account (placeholder)
function showCustomerAccount() {
    alert('Customer account features would be implemented here.');
}

// Close modals when clicking outside
window.addEventListener('click', function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Add CSS for admin panel
const adminStyles = `
<style>
.admin-modal-content {
    max-width: 90% !important;
    width: 1200px !important;
    max-height: 90vh;
    overflow-y: auto;
}

.admin-panel {
    padding: 1rem;
}

.admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid var(--secondary-gold);
}

.admin-tabs {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
}

.admin-tab {
    padding: 0.8rem 1.5rem;
    border: 2px solid var(--secondary-gold);
    background: transparent;
    color: var(--primary-brown);
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.admin-tab.active {
    background: var(--secondary-gold);
    color: white;
}

.admin-content {
    display: none;
}

.admin-content.active {
    display: block;
}

.admin-controls {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
}

.admin-controls input,
.admin-controls select {
    padding: 0.5rem;
    border: 1px solid var(--primary-brown);
    border-radius: 5px;
}

.export-btn,
.generate-btn {
    background: var(--accent-green);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    cursor: pointer;
}

.orders-list {
    display: grid;
    gap: 1rem;
}

.order-card {
    background: white;
    border: 1px solid rgba(139, 69, 19, 0.2);
    border-radius: 10px;
    padding: 1rem;
    box-shadow: var(--shadow);
}

.order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.order-status {
    padding: 0.3rem 0.8rem;
    border-radius: 15px;
    font-size: 0.8rem;
    font-weight: 600;
}

.order-status.pending {
    background: #fff3cd;
    color: #856404;
}

.order-status.preparing {
    background: #d1ecf1;
    color: #0c5460;
}

.order-status.delivered {
    background: #d4edda;
    color: #155724;
}

.order-details p {
    margin-bottom: 0.5rem;
}

.order-items {
    margin: 1rem 0;
    padding: 1rem;
    background: rgba(218, 165, 32, 0.05);
    border-radius: 5px;
}

.order-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
}

.order-actions {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
}

.order-actions select {
    padding: 0.5rem;
    border: 1px solid var(--primary-brown);
    border-radius: 5px;
}

.delete-btn {
    background: #dc3545;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    cursor: pointer;
}

.reports-section {
    padding: 1rem;
}

.report-controls {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
}

.report-summary,
.item-breakdown {
    background: white;
    padding: 1rem;
    border-radius: 10px;
    margin-bottom: 1rem;
    box-shadow: var(--shadow);
}

.menu-management {
    padding: 1rem;
}

.menu-item-admin {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: white;
    padding: 1rem;
    border-radius: 10px;
    margin-bottom: 1rem;
    box-shadow: var(--shadow);
}

.menu-item-actions {
    display: flex;
    gap: 0.5rem;
}

.edit-btn {
    background: var(--secondary-gold);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    cursor: pointer;
}

.add-item-btn {
    background: var(--accent-green);
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 10px;
    cursor: pointer;
    margin-top: 1rem;
}

.no-orders {
    text-align: center;
    color: var(--text-dark);
    opacity: 0.7;
    padding: 2rem;
}

@media (max-width: 768px) {
    .admin-modal-content {
        width: 95% !important;
        margin: 5% auto;
    }
    
    .admin-tabs {
        flex-direction: column;
    }
    
    .admin-controls,
    .report-controls {
        flex-direction: column;
    }
    
    .order-actions {
        flex-direction: column;
    }
    
    .menu-item-admin {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
    }
}
</style>
`;

// Inject admin styles
document.head.insertAdjacentHTML('beforeend', adminStyles); 