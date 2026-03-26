// Kamal Apparel - Main Application JavaScript
// Handles all interactive features, cart, wishlist, and UI components

// ============================================
// STATE MANAGEMENT
// ============================================
let cart = JSON.parse(localStorage.getItem('kf_cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('kf_wishlist')) || [];
let currentProducts = [];
let displayedProducts = 8;
let currentFilter = 'all';
let currentSort = 'featured';

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initNavbar();
  initHeroSlideshow();
  initScrollReveal();
  initProducts();
  initCart();
  initWishlist();
  initModals();
  initForms();
  initBackToTop();
  initMarquee();
  updateCartBadge();
  updateWishlistBadge();
  
  // Listen for storage changes (admin sync)
  window.addEventListener('storage', handleStorageChange);
});

// ============================================
// PRELOADER
// ============================================
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;
  
  const loadingBar = preloader.querySelector('.loading-bar-fill');
  let progress = 0;
  
  const interval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.transform = 'translateY(-100%)';
        setTimeout(() => {
          preloader.style.display = 'none';
          document.body.style.overflow = 'auto';
        }, 600);
      }, 300);
    }
    if (loadingBar) {
      loadingBar.style.width = progress + '%';
    }
  }, 100);
}

// ============================================
// NAVBAR
// ============================================
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileMenuClose = document.querySelector('.mobile-menu-close');
  
  // Scroll effect
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  });
  
  // Mobile menu toggle
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }
  
  if (mobileMenuClose && mobileMenu) {
    mobileMenuClose.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      document.body.style.overflow = 'auto';
    });
  }
  
  // Close mobile menu on link click
  const mobileLinks = document.querySelectorAll('.mobile-menu a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenu) {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
  });
}

// ============================================
// HERO SLIDESHOW
// ============================================
function initHeroSlideshow() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slide-dot');
  const prevBtn = document.querySelector('.slide-prev');
  const nextBtn = document.querySelector('.slide-next');
  
  if (!slides.length) return;
  
  let currentSlide = 0;
  let slideInterval;
  
  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.remove('active');
      if (dots[i]) dots[i].classList.remove('active');
    });
    
    slides[index].classList.add('active');
    if (dots[index]) dots[index].classList.add('active');
  }
  
  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }
  
  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
  }
  
  function startAutoplay() {
    slideInterval = setInterval(nextSlide, 5000);
  }
  
  function stopAutoplay() {
    clearInterval(slideInterval);
  }
  
  // Event listeners
  if (prevBtn) prevBtn.addEventListener('click', () => {
    stopAutoplay();
    prevSlide();
    startAutoplay();
  });
  
  if (nextBtn) nextBtn.addEventListener('click', () => {
    stopAutoplay();
    nextSlide();
    startAutoplay();
  });
  
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      stopAutoplay();
      currentSlide = index;
      showSlide(currentSlide);
      startAutoplay();
    });
  });
  
  // Touch support for mobile
  let touchStartX = 0;
  let touchEndX = 0;
  
  const heroSection = document.querySelector('.hero-slideshow');
  if (heroSection) {
    heroSection.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });
    
    heroSection.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });
  }
  
  function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
      stopAutoplay();
      nextSlide();
      startAutoplay();
    }
    if (touchEndX > touchStartX + 50) {
      stopAutoplay();
      prevSlide();
      startAutoplay();
    }
  }
  
  startAutoplay();
}

// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================
function initScrollReveal() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe all sections with reveal animations
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');
  revealElements.forEach(el => observer.observe(el));
}

// ============================================
// PRODUCTS SYSTEM
// ============================================
function initProducts() {
  loadProducts();
  initFilters();
  initSort();
  initLoadMore();
}

function loadProducts() {
  const productsData = JSON.parse(localStorage.getItem('kf_products')) || PRODUCTS;
  currentProducts = [...productsData];
  filterAndSortProducts();
}

function filterAndSortProducts() {
  let filtered = [...currentProducts];
  
  // Apply filter
  if (currentFilter !== 'all') {
    filtered = filtered.filter(product => {
      if (currentFilter === 'men') return product.gender === 'Men';
      if (currentFilter === 'women') return product.gender === 'Women';
      if (currentFilter === 'sale') return product.sale === true;
      return product.category.toLowerCase() === currentFilter.toLowerCase();
    });
  }
  
  // Apply sort
  switch (currentSort) {
    case 'price-low':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      filtered.sort((a, b) => b.isNew - a.isNew);
      break;
    default:
      // Featured - keep original order
      break;
  }
  
  renderProducts(filtered);
}

function renderProducts(products) {
  const container = document.getElementById('products-grid');
  if (!container) return;
  
  const productsToShow = products.slice(0, displayedProducts);
  
  container.innerHTML = productsToShow.map((product, index) => `
    <div class="product-card reveal-scale" style="animation-delay: ${index * 0.1}s">
      <div class="product-image-wrapper">
        <img src="${product.image}" alt="${product.name}" class="product-image primary" loading="lazy">
        <img src="${product.hoverImage}" alt="${product.name}" class="product-image hover" loading="lazy">
        ${product.badge ? `<span class="product-badge badge-${product.badge.toLowerCase()}">${product.badge}</span>` : ''}
        <button class="wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}" onclick="toggleWishlist('${product.id}')" aria-label="Add to wishlist">
          <i class="fas fa-heart"></i>
        </button>
        <div class="product-actions">
          <button class="btn-icon" onclick="openQuickView('${product.id}')" aria-label="Quick view">
            <i class="fas fa-eye"></i>
          </button>
          <button class="btn-icon" onclick="addToCart('${product.id}')" aria-label="Add to cart">
            <i class="fas fa-shopping-cart"></i>
          </button>
        </div>
      </div>
      <div class="product-info">
        <h3 class="product-title">${product.name}</h3>
        <div class="product-rating">
          ${renderStars(product.rating)}
          <span class="rating-count">(${product.reviews})</span>
        </div>
        <div class="product-price">
          <span class="price">PKR ${product.price.toLocaleString()}</span>
          ${product.oldPrice ? `<span class="old-price">PKR ${product.oldPrice.toLocaleString()}</span>` : ''}
        </div>
        <div class="product-colors">
          ${product.colors.slice(0, 4).map(color => `
            <span class="color-swatch" style="background-color: ${getColorCode(color)}" title="${color}"></span>
          `).join('')}
          ${product.colors.length > 4 ? `<span class="color-more">+${product.colors.length - 4}</span>` : ''}
        </div>
        <div class="product-sizes">
          ${product.sizes.slice(0, 5).map(size => `<span class="size-chip">${size}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');
  
  // Update load more button
  const loadMoreBtn = document.getElementById('load-more-btn');
  if (loadMoreBtn) {
    if (displayedProducts >= products.length) {
      loadMoreBtn.style.display = 'none';
    } else {
      loadMoreBtn.style.display = 'inline-block';
      loadMoreBtn.textContent = `Load More (${products.length - displayedProducts} remaining)`;
    }
  }
  
  // Re-observe new elements
  const newCards = container.querySelectorAll('.product-card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.1 });
  
  newCards.forEach(card => observer.observe(card));
}

function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  let stars = '';
  
  for (let i = 0; i < fullStars; i++) {
    stars += '<i class="fas fa-star"></i>';
  }
  if (hasHalfStar) {
    stars += '<i class="fas fa-star-half-alt"></i>';
  }
  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars += '<i class="far fa-star"></i>';
  }
  
  return stars;
}

function getColorCode(colorName) {
  const colorMap = {
    'Navy': '#1A2744',
    'Black': '#000000',
    'White': '#FFFFFF',
    'Cream': '#FAF6EF',
    'Beige': '#D4C5B9',
    'Gray': '#808080',
    'Charcoal': '#36454F',
    'Khaki': '#C3B091',
    'Olive': '#556B2F',
    'Maroon': '#800000',
    'Burgundy': '#800020',
    'Crimson': '#A61C2A',
    'Gold': '#C8963E',
    'Pink': '#FFC0CB',
    'Peach': '#FFE5B4',
    'Lavender': '#E6E6FA',
    'Mint': '#98FF98',
    'Teal': '#008080',
    'Emerald': '#50C878',
    'Sky Blue': '#87CEEB',
    'Light Blue': '#ADD8E6',
    'Dark Blue': '#00008B',
    'Brown': '#A52A2A',
    'Light Gray': '#D3D3D3',
    'Red': '#FF0000',
    'Yellow': '#FFFF00',
    'Green': '#008000',
    'Blue': '#0000FF'
  };
  return colorMap[colorName] || '#CCCCCC';
}

function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      displayedProducts = 8;
      filterAndSortProducts();
    });
  });
}

function initSort() {
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      filterAndSortProducts();
    });
  }
}

function initLoadMore() {
  const loadMoreBtn = document.getElementById('load-more-btn');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      displayedProducts += 4;
      filterAndSortProducts();
      
      // Smooth scroll to new products
      setTimeout(() => {
        const cards = document.querySelectorAll('.product-card');
        if (cards[displayedProducts - 4]) {
          cards[displayedProducts - 4].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    });
  }
}

// ============================================
// CART SYSTEM
// ============================================
function initCart() {
  const cartBtn = document.querySelector('.cart-btn');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartClose = document.querySelector('.cart-close');
  const cartOverlay = document.querySelector('.cart-overlay');
  
  if (cartBtn && cartDrawer) {
    cartBtn.addEventListener('click', () => {
      cartDrawer.classList.add('active');
      cartOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      renderCart();
    });
  }
  
  if (cartClose && cartDrawer) {
    cartClose.addEventListener('click', closeCart);
  }
  
  if (cartOverlay) {
    cartOverlay.addEventListener('click', closeCart);
  }
}

function closeCart() {
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.querySelector('.cart-overlay');
  
  if (cartDrawer) cartDrawer.classList.remove('active');
  if (cartOverlay) cartOverlay.classList.remove('active');
  document.body.style.overflow = 'auto';
}

function addToCart(productId, size = null, quantity = 1) {
  const productsData = JSON.parse(localStorage.getItem('kf_products')) || PRODUCTS;
  const product = productsData.find(p => p.id === productId);
  
  if (!product) return;
  
  // If no size specified, use first available size
  const selectedSize = size || product.sizes[0];
  
  const cartItem = {
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    size: selectedSize,
    quantity: quantity
  };
  
  // Check if item already exists
  const existingIndex = cart.findIndex(item => item.id === productId && item.size === selectedSize);
  
  if (existingIndex > -1) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push(cartItem);
  }
  
  localStorage.setItem('kf_cart', JSON.stringify(cart));
  updateCartBadge();
  showToast('Added to cart!', 'success');
  
  // Close quick view if open
  const quickViewModal = document.getElementById('quick-view-modal');
  if (quickViewModal && quickViewModal.classList.contains('active')) {
    closeQuickView();
  }
}

function removeFromCart(productId, size) {
  cart = cart.filter(item => !(item.id === productId && item.size === size));
  localStorage.setItem('kf_cart', JSON.stringify(cart));
  updateCartBadge();
  renderCart();
  showToast('Removed from cart', 'info');
}

function updateCartQuantity(productId, size, change) {
  const item = cart.find(item => item.id === productId && item.size === size);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(productId, size);
    } else {
      localStorage.setItem('kf_cart', JSON.stringify(cart));
      renderCart();
      updateCartBadge();
    }
  }
}

function renderCart() {
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const cartEmpty = document.querySelector('.cart-empty');
  const cartContent = document.querySelector('.cart-content');
  
  if (!cartItems) return;
  
  if (cart.length === 0) {
    if (cartEmpty) cartEmpty.style.display = 'block';
    if (cartContent) cartContent.style.display = 'none';
    return;
  }
  
  if (cartEmpty) cartEmpty.style.display = 'none';
  if (cartContent) cartContent.style.display = 'block';
  
  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-image">
      <div class="cart-item-details">
        <h4 class="cart-item-name">${item.name}</h4>
        <p class="cart-item-size">Size: ${item.size}</p>
        <p class="cart-item-price">PKR ${item.price.toLocaleString()}</p>
      </div>
      <div class="cart-item-actions">
        <div class="quantity-controls">
          <button onclick="updateCartQuantity('${item.id}', '${item.size}', -1)" aria-label="Decrease quantity">-</button>
          <span>${item.quantity}</span>
          <button onclick="updateCartQuantity('${item.id}', '${item.size}', 1)" aria-label="Increase quantity">+</button>
        </div>
        <button class="remove-btn" onclick="removeFromCart('${item.id}', '${item.size}')" aria-label="Remove item">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  `).join('');
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  if (cartTotal) {
    cartTotal.textContent = `PKR ${total.toLocaleString()}`;
  }
}

function updateCartBadge() {
  const badge = document.querySelector('.cart-badge');
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

// ============================================
// WISHLIST SYSTEM
// ============================================
function initWishlist() {
  updateWishlistBadge();
}

function toggleWishlist(productId) {
  const index = wishlist.indexOf(productId);
  
  if (index > -1) {
    wishlist.splice(index, 1);
    showToast('Removed from wishlist', 'info');
  } else {
    wishlist.push(productId);
    showToast('Added to wishlist!', 'success');
  }
  
  localStorage.setItem('kf_wishlist', JSON.stringify(wishlist));
  updateWishlistBadge();
  
  // Update button state
  const btn = document.querySelector(`button[onclick="toggleWishlist('${productId}')"]`);
  if (btn) {
    btn.classList.toggle('active');
  }
}

function isInWishlist(productId) {
  return wishlist.includes(productId);
}

function updateWishlistBadge() {
  const badge = document.querySelector('.wishlist-badge');
  if (badge) {
    badge.textContent = wishlist.length;
    badge.style.display = wishlist.length > 0 ? 'flex' : 'none';
  }
}

// ============================================
// QUICK VIEW MODAL
// ============================================
function initModals() {
  const quickViewModal = document.getElementById('quick-view-modal');
  const modalClose = document.querySelector('.modal-close');
  const modalOverlay = document.querySelector('.modal-overlay');
  
  if (modalClose) {
    modalClose.addEventListener('click', closeQuickView);
  }
  
  if (modalOverlay) {
    modalOverlay.addEventListener('click', closeQuickView);
  }
  
  // Close on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeQuickView();
    }
  });
}

function openQuickView(productId) {
  const productsData = JSON.parse(localStorage.getItem('kf_products')) || PRODUCTS;
  const product = productsData.find(p => p.id === productId);
  
  if (!product) return;
  
  const modal = document.getElementById('quick-view-modal');
  const overlay = document.querySelector('.modal-overlay');
  
  if (!modal) return;
  
  const modalContent = modal.querySelector('.modal-body');
  
  modalContent.innerHTML = `
    <div class="quick-view-content">
      <div class="quick-view-image">
        <img src="${product.image}" alt="${product.name}" id="quick-view-main-image">
        ${product.badge ? `<span class="product-badge badge-${product.badge.toLowerCase()}">${product.badge}</span>` : ''}
      </div>
      <div class="quick-view-details">
        <h2 class="quick-view-title">${product.name}</h2>
        <div class="product-rating">
          ${renderStars(product.rating)}
          <span class="rating-count">(${product.reviews} reviews)</span>
        </div>
        <div class="quick-view-price">
          <span class="price">PKR ${product.price.toLocaleString()}</span>
          ${product.oldPrice ? `<span class="old-price">PKR ${product.oldPrice.toLocaleString()}</span>` : ''}
          ${product.sale ? `<span class="save-badge">Save ${Math.round((1 - product.price / product.oldPrice) * 100)}%</span>` : ''}
        </div>
        <p class="quick-view-description">${product.description}</p>
        
        <div class="quick-view-options">
          <div class="option-group">
            <label>Select Size:</label>
            <div class="size-options" id="quick-view-sizes">
              ${product.sizes.map(size => `
                <button class="size-option" data-size="${size}">${size}</button>
              `).join('')}
            </div>
          </div>
          
          <div class="option-group">
            <label>Available Colors:</label>
            <div class="color-options">
              ${product.colors.map(color => `
                <span class="color-option" style="background-color: ${getColorCode(color)}" title="${color}"></span>
              `).join('')}
            </div>
          </div>
        </div>
        
        <div class="quick-view-actions">
          <button class="btn btn-primary" onclick="addToCartFromQuickView('${product.id}')">
            <i class="fas fa-shopping-cart"></i> Add to Cart
          </button>
          <button class="btn btn-outline ${isInWishlist(product.id) ? 'active' : ''}" onclick="toggleWishlist('${product.id}')">
            <i class="fas fa-heart"></i> ${isInWishlist(product.id) ? 'In Wishlist' : 'Add to Wishlist'}
          </button>
        </div>
        
        <div class="quick-view-meta">
          <p><strong>Category:</strong> ${product.category}</p>
          <p><strong>SKU:</strong> ${product.sku}</p>
          <p><strong>Stock:</strong> <span class="stock-status ${product.stock > 10 ? 'in-stock' : 'low-stock'}">${product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span></p>
        </div>
      </div>
    </div>
  `;
  
  // Initialize size selection
  setTimeout(() => {
    const sizeButtons = modal.querySelectorAll('.size-option');
    sizeButtons.forEach((btn, index) => {
      if (index === 0) btn.classList.add('active');
      btn.addEventListener('click', () => {
        sizeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  }, 100);
  
  modal.classList.add('active');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeQuickView() {
  const modal = document.getElementById('quick-view-modal');
  const overlay = document.querySelector('.modal-overlay');
  
  if (modal) modal.classList.remove('active');
  if (overlay) overlay.classList.remove('active');
  document.body.style.overflow = 'auto';
}

function addToCartFromQuickView(productId) {
  const selectedSizeBtn = document.querySelector('.size-option.active');
  const size = selectedSizeBtn ? selectedSizeBtn.dataset.size : null;
  addToCart(productId, size);
}

// ============================================
// FORMS
// ============================================
function initForms() {
  // Contact form
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Thank you! We will get back to you soon.', 'success');
      contactForm.reset();
    });
  }
  
  // Newsletter form
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterForm.querySelector('input[type="email"]').value;
      if (email) {
        showToast('Thank you for subscribing! 🎉', 'success');
        newsletterForm.reset();
      }
    });
  }
  
  // Promo code copy
  const copyPromoBtn = document.getElementById('copy-promo');
  if (copyPromoBtn) {
    copyPromoBtn.addEventListener('click', () => {
      const promoCode = 'EID2025';
      navigator.clipboard.writeText(promoCode).then(() => {
        showToast('Promo code copied!', 'success');
      });
    });
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
  
  document.body.appendChild(toast);
  
  setTimeout(() => toast.classList.add('show'), 100);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ============================================
// BACK TO TOP
// ============================================
function initBackToTop() {
  const backToTop = document.getElementById('back-to-top');
  
  if (!backToTop) return;
  
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });
  
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ============================================
// MARQUEE
// ============================================
function initMarquee() {
  const marquee = document.querySelector('.marquee-content');
  if (!marquee) return;
  
  // Clone content for seamless loop
  const clone = marquee.cloneNode(true);
  marquee.parentElement.appendChild(clone);
}

// ============================================
// STORAGE SYNC (Admin Integration)
// ============================================
function handleStorageChange(e) {
  if (e.key === 'kf_products') {
    loadProducts();
  } else if (e.key === 'kf_cart') {
    cart = JSON.parse(e.newValue) || [];
    updateCartBadge();
    renderCart();
  } else if (e.key === 'kf_wishlist') {
    wishlist = JSON.parse(e.newValue) || [];
    updateWishlistBadge();
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function formatPrice(price) {
  return `PKR ${price.toLocaleString()}`;
}

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