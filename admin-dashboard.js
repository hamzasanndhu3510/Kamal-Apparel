// Kamal Apparel - Admin Dashboard JavaScript
// Handles all admin dashboard functionality

// ============================================
// STATE MANAGEMENT
// ============================================
let currentPage = 'dashboard';
let products = [];
let currentProductPage = 1;
const productsPerPage = 10;

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  initNavigation();
  initDashboard();
  initProductsPage();
  initInventoryPage();
  initSettings();
  
  // Listen for storage changes (sync with storefront)
  window.addEventListener('storage', handleStorageChange);
});

// ============================================
// NAVIGATION
// ============================================
function initNavigation() {
  const menuItems = document.querySelectorAll('.menu-item');
  
  menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const page = item.dataset.page;
      showPage(page);
      
      // Update active state
      menuItems.forEach(mi => mi.classList.remove('active'));
      item.classList.add('active');
    });
  });
}

function showPage(pageName) {
  // Hide all pages
  document.querySelectorAll('.page-content').forEach(page => {
    page.classList.remove('active');
    page.style.display = 'none';
  });
  
  // Show selected page
  const page = document.getElementById(`page-${pageName}`);
  if (page) {
    page.style.display = 'block';
    page.classList.add('active');
    currentPage = pageName;
    
    // Load page-specific data
    switch(pageName) {
      case 'dashboard':
        loadDashboardData();
        break;
      case 'products':
        loadProductsTable();
        break;
      case 'inventory':
        loadInventoryData();
        break;
    }
  }
}

// ============================================
// DASHBOARD PAGE
// ============================================
function initDashboard() {
  loadDashboardData();
}

function loadDashboardData() {
  // Load products
  products = JSON.parse(localStorage.getItem('kf_products')) || [];
  
  // Calculate KPIs
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const lowStockCount = products.filter(p => (p.stock || 0) < 10).length;
  
  // Mock sales data (in real app, this would come from orders)
  const totalSales = 125000;
  const ordersToday = 5;
  
  // Update KPI cards
  document.getElementById('total-products').textContent = totalProducts;
  document.getElementById('total-sales').textContent = `PKR ${totalSales.toLocaleString()}`;
  document.getElementById('orders-today').textContent = ordersToday;
  document.getElementById('low-stock-count').textContent = lowStockCount;
  
  // Update notification badge
  document.getElementById('notification-count').textContent = lowStockCount;
}

// ============================================
// PRODUCTS PAGE
// ============================================
function initProductsPage() {
  // Search functionality
  const searchInput = document.getElementById('product-search');
  if (searchInput) {
    searchInput.addEventListener('input', debounce(() => {
      loadProductsTable();
    }, 300));
  }
  
  // Filter functionality
  const categoryFilter = document.getElementById('product-filter-category');
  const genderFilter = document.getElementById('product-filter-gender');
  
  if (categoryFilter) {
    categoryFilter.addEventListener('change', () => loadProductsTable());
  }
  
  if (genderFilter) {
    genderFilter.addEventListener('change', () => loadProductsTable());
  }
}

function loadProducts() {
  products = JSON.parse(localStorage.getItem('kf_products')) || [];
}

function loadProductsTable() {
  loadProducts();
  
  // Get filters
  const searchTerm = document.getElementById('product-search')?.value.toLowerCase() || '';
  const categoryFilter = document.getElementById('product-filter-category')?.value || '';
  const genderFilter = document.getElementById('product-filter-gender')?.value || '';
  
  // Filter products
  let filtered = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm) || 
                         product.sku.toLowerCase().includes(searchTerm);
    const matchesCategory = !categoryFilter || product.category === categoryFilter;
    const matchesGender = !genderFilter || product.gender === genderFilter;
    
    return matchesSearch && matchesCategory && matchesGender;
  });
  
  // Pagination
  const totalPages = Math.ceil(filtered.length / productsPerPage);
  const startIndex = (currentProductPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const paginatedProducts = filtered.slice(startIndex, endIndex);
  
  // Render table
  const tbody = document.getElementById('products-table');
  if (!tbody) return;
  
  if (paginatedProducts.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; padding: 2rem; color: var(--gray-medium);">
          No products found. ${searchTerm || categoryFilter || genderFilter ? 'Try adjusting your filters.' : 'Add your first product to get started.'}
        </td>
      </tr>
    `;
    return;
  }
  
  tbody.innerHTML = paginatedProducts.map(product => `
    <tr>
      <td>
        <img src="${product.image}" alt="${product.name}" style="width: 60px; height: 80px; object-fit: cover; border-radius: 4px;">
      </td>
      <td>${product.name}</td>
      <td>${product.category}</td>
      <td>${product.gender}</td>
      <td>PKR ${product.price.toLocaleString()}</td>
      <td>${product.stock || 0}</td>
      <td>
        <span class="status-badge ${getStockStatus(product.stock)}">
          ${getStockStatusText(product.stock)}
        </span>
      </td>
      <td>
        <button class="action-btn" onclick="editProduct('${product.id}')" title="Edit">
          <i class="fas fa-edit"></i>
        </button>
        <button class="action-btn delete" onclick="deleteProduct('${product.id}')" title="Delete">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    </tr>
  `).join('');
  
  // Render pagination
  renderPagination(totalPages);
}

function renderPagination(totalPages) {
  const pagination = document.getElementById('products-pagination');
  if (!pagination) return;
  
  let html = '';
  
  // Previous button
  html += `<button ${currentProductPage === 1 ? 'disabled' : ''} onclick="changePage(${currentProductPage - 1})">
    <i class="fas fa-chevron-left"></i>
  </button>`;
  
  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentProductPage - 1 && i <= currentProductPage + 1)) {
      html += `<button class="${i === currentProductPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
    } else if (i === currentProductPage - 2 || i === currentProductPage + 2) {
      html += '<span>...</span>';
    }
  }
  
  // Next button
  html += `<button ${currentProductPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentProductPage + 1})">
    <i class="fas fa-chevron-right"></i>
  </button>`;
  
  pagination.innerHTML = html;
}

function changePage(page) {
  currentProductPage = page;
  loadProductsTable();
}

function getStockStatus(stock) {
  if (stock === 0) return 'inactive';
  if (stock < 10) return 'pending';
  return 'active';
}

function getStockStatusText(stock) {
  if (stock === 0) return 'Out of Stock';
  if (stock < 10) return 'Low Stock';
  return 'In Stock';
}

// ============================================
// PRODUCT MODAL
// ============================================
function showAddProductForm() {
  document.getElementById('product-modal-title').textContent = 'Add New Product';
  document.getElementById('product-form').reset();
  document.getElementById('product-id').value = '';
  
  // Generate SKU
  const sku = 'KF-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  document.getElementById('product-sku').value = sku;
  
  openProductModal();
}

function editProduct(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  
  document.getElementById('product-modal-title').textContent = 'Edit Product';
  document.getElementById('product-id').value = product.id;
  document.getElementById('product-name').value = product.name;
  document.getElementById('product-sku').value = product.sku;
  document.getElementById('product-category').value = product.category;
  document.getElementById('product-gender').value = product.gender;
  document.getElementById('product-price').value = product.price;
  document.getElementById('product-old-price').value = product.oldPrice || '';
  document.getElementById('product-stock').value = product.stock;
  document.getElementById('product-badge').value = product.badge || '';
  document.getElementById('product-description').value = product.description;
  document.getElementById('product-image').value = product.image;
  document.getElementById('product-hover-image').value = product.hoverImage || '';
  
  openProductModal();
}

function openProductModal() {
  document.getElementById('product-modal-overlay').classList.add('active');
  document.getElementById('product-modal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  document.getElementById('product-modal-overlay').classList.remove('active');
  document.getElementById('product-modal').classList.remove('active');
  document.body.style.overflow = 'auto';
}

// Product form submission
document.addEventListener('DOMContentLoaded', () => {
  const productForm = document.getElementById('product-form');
  if (productForm) {
    productForm.addEventListener('submit', (e) => {
      e.preventDefault();
      saveProduct();
    });
  }
});

function saveProduct() {
  const productId = document.getElementById('product-id').value;
  const isEdit = !!productId;
  
  const productData = {
    id: productId || 'p' + Date.now(),
    name: document.getElementById('product-name').value,
    sku: document.getElementById('product-sku').value,
    category: document.getElementById('product-category').value,
    gender: document.getElementById('product-gender').value,
    price: parseInt(document.getElementById('product-price').value),
    oldPrice: parseInt(document.getElementById('product-old-price').value) || null,
    stock: parseInt(document.getElementById('product-stock').value),
    badge: document.getElementById('product-badge').value || null,
    description: document.getElementById('product-description').value,
    image: document.getElementById('product-image').value,
    hoverImage: document.getElementById('product-hover-image').value || document.getElementById('product-image').value,
    sale: false,
    isNew: document.getElementById('product-badge').value === 'New',
    colors: ['Black', 'Navy', 'Gray'],
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 4.5,
    reviews: 0
  };
  
  if (isEdit) {
    // Update existing product
    const index = products.findIndex(p => p.id === productId);
    if (index > -1) {
      products[index] = { ...products[index], ...productData };
    }
  } else {
    // Add new product
    products.push(productData);
  }
  
  // Save to localStorage
  localStorage.setItem('kf_products', JSON.stringify(products));
  
  // Close modal and reload table
  closeProductModal();
  loadProductsTable();
  loadDashboardData();
  
  showToast(isEdit ? 'Product updated successfully!' : 'Product added successfully!', 'success');
}

function deleteProduct(productId) {
  if (!confirm('Are you sure you want to delete this product?')) return;
  
  products = products.filter(p => p.id !== productId);
  localStorage.setItem('kf_products', JSON.stringify(products));
  
  loadProductsTable();
  loadDashboardData();
  showToast('Product deleted successfully', 'success');
}

// ============================================
// INVENTORY PAGE
// ============================================
function initInventoryPage() {
  loadInventoryData();
}

function loadInventoryData() {
  loadProducts();
  
  // Calculate inventory stats
  const totalSKUs = products.length;
  const inStock = products.filter(p => p.stock > 10).length;
  const lowStock = products.filter(p => p.stock > 0 && p.stock <= 10).length;
  const outOfStock = products.filter(p => p.stock === 0).length;
  
  // Update stats
  const totalSKUsEl = document.getElementById('total-skus');
  const inStockEl = document.getElementById('in-stock-items');
  const lowStockEl = document.getElementById('low-stock-items');
  const outStockEl = document.getElementById('out-stock-items');
  
  if (totalSKUsEl) totalSKUsEl.textContent = totalSKUs;
  if (inStockEl) inStockEl.textContent = inStock;
  if (lowStockEl) lowStockEl.textContent = lowStock;
  if (outStockEl) outStockEl.textContent = outOfStock;
  
  // Load inventory table
  const tbody = document.getElementById('inventory-table');
  if (!tbody) return;
  
  tbody.innerHTML = products.map(product => `
    <tr>
      <td>${product.name}</td>
      <td>${product.sku}</td>
      <td>${product.category}</td>
      <td>
        <input type="number" value="${product.stock}" min="0" 
               onchange="updateStock('${product.id}', this.value)"
               style="width: 80px; padding: 0.5rem; border: 2px solid var(--gray-light); border-radius: 4px;">
      </td>
      <td>
        <span class="status-badge ${getStockStatus(product.stock)}">
          ${getStockStatusText(product.stock)}
        </span>
      </td>
      <td>
        <button class="action-btn" onclick="editProduct('${product.id}')" title="Edit">
          <i class="fas fa-edit"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

function updateStock(productId, newStock) {
  const product = products.find(p => p.id === productId);
  if (product) {
    product.stock = parseInt(newStock);
    localStorage.setItem('kf_products', JSON.stringify(products));
    loadInventoryData();
    loadDashboardData();
    showToast('Stock updated successfully', 'success');
  }
}

// ============================================
// SETTINGS
// ============================================
function initSettings() {
  const settingsForm = document.getElementById('settings-form');
  if (settingsForm) {
    settingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      saveSettings();
    });
  }
}

function saveSettings() {
  const settings = {
    storeName: document.getElementById('store-name').value,
    email: document.getElementById('store-email').value,
    phone: document.getElementById('store-phone').value,
    currency: document.getElementById('store-currency').value,
    address: document.getElementById('store-address').value
  };
  
  localStorage.setItem('kf_settings', JSON.stringify(settings));
  showToast('Settings saved successfully!', 'success');
}

// ============================================
// DATA EXPORT
// ============================================
function exportData(type) {
  let data, filename;
  
  switch(type) {
    case 'products':
      data = products;
      filename = 'kamal-apparel-products.json';
      break;
    case 'inventory':
      data = products.map(p => ({
        SKU: p.sku,
        Name: p.name,
        Category: p.category,
        Stock: p.stock,
        Price: p.price
      }));
      filename = 'kamal-apparel-inventory.csv';
      break;
    case 'sales':
      data = [{ message: 'No sales data available yet' }];
      filename = 'kamal-apparel-sales.json';
      break;
  }
  
  if (filename.endsWith('.csv')) {
    exportToCSV(data, filename);
  } else {
    exportToJSON(data, filename);
  }
}

function exportToJSON(data, filename) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  downloadFile(blob, filename);
}

function exportToCSV(data, filename) {
  if (data.length === 0) {
    showToast('No data to export', 'info');
    return;
  }
  
  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map(row => headers.map(header => row[header]).join(','))
  ].join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  downloadFile(blob, filename);
}

function downloadFile(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  showToast('Export completed!', 'success');
}

function exportBackup() {
  const backup = {
    products: JSON.parse(localStorage.getItem('kf_products')) || [],
    settings: JSON.parse(localStorage.getItem('kf_settings')) || {},
    cart: JSON.parse(localStorage.getItem('kf_cart')) || [],
    wishlist: JSON.parse(localStorage.getItem('kf_wishlist')) || [],
    timestamp: new Date().toISOString()
  };
  
  exportToJSON(backup, `kamal-apparel-backup-${Date.now()}.json`);
}

function resetDemoData() {
  if (!confirm('This will reset all data to demo products. Are you sure?')) return;
  
  // Reload original products from products.js
  localStorage.setItem('kf_products', JSON.stringify(PRODUCTS));
  localStorage.removeItem('kf_cart');
  localStorage.removeItem('kf_wishlist');
  
  loadProducts();
  loadDashboardData();
  loadProductsTable();
  loadInventoryData();
  
  showToast('Demo data restored successfully!', 'success');
}

// ============================================
// STORAGE SYNC
// ============================================
function handleStorageChange(e) {
  if (e.key === 'kf_products') {
    loadProducts();
    loadDashboardData();
    if (currentPage === 'products') loadProductsTable();
    if (currentPage === 'inventory') loadInventoryData();
  }
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
    <span>${message}</span>
  `;
  
  toast.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    background-color: ${type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--danger)' : 'var(--navy)'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    box-shadow: var(--shadow-lg);
    z-index: 10000;
    animation: slideInRight 0.3s ease;
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
  
  .page-content {
    display: none;
  }
  
  .page-content.active {
    display: block;
    animation: fadeIn 0.3s ease;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .modal {
    display: none;
  }
  
  .modal.active {
    display: block;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border-radius: 12px;
    box-shadow: var(--shadow-lg);
    z-index: 10001;
    max-height: 90vh;
    overflow-y: auto;
  }
  
  .modal-overlay {
    display: none;
  }
  
  .modal-overlay.active {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 10000;
  }
  
  .modal-header {
    padding: 1.5rem;
    border-bottom: 1px solid var(--gray-light);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: var(--gray-medium);
    cursor: pointer;
    transition: var(--transition-fast);
  }
  
  .modal-close:hover {
    color: var(--navy);
  }
  
  .modal-body {
    padding: 1.5rem;
  }
  
  .btn-outline {
    background: transparent;
    border: 2px solid var(--navy);
    color: var(--navy);
  }
  
  .btn-outline:hover {
    background: var(--navy);
    color: white;
  }
`;
document.head.appendChild(style);