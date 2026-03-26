// Kamal Apparel - Admin Authentication System
// Handles login, session management, and route guards

// Admin credentials (in production, this would be server-side)
const ADMIN_CREDENTIALS = {
  username: 'kamal_admin',
  password: btoa('KamalApparel@2025') // Simple encoding
};

// Session management
class AuthManager {
  constructor() {
    this.sessionKey = 'kf_admin_session';
    this.rememberKey = 'kf_admin_remember';
  }

  // Hash function for password
  hashPassword(password) {
    return btoa(password);
  }

  // Login function
  login(username, password, remember = false) {
    const hashedPassword = this.hashPassword(password);
    
    if (username === ADMIN_CREDENTIALS.username && hashedPassword === ADMIN_CREDENTIALS.password) {
      const session = {
        username: username,
        timestamp: Date.now(),
        token: this.generateToken()
      };
      
      // Store session
      if (remember) {
        localStorage.setItem(this.rememberKey, JSON.stringify(session));
      }
      sessionStorage.setItem(this.sessionKey, JSON.stringify(session));
      
      return { success: true, message: 'Login successful' };
    }
    
    return { success: false, message: 'Invalid username or password' };
  }

  // Generate session token
  generateToken() {
    return btoa(Date.now() + Math.random().toString(36));
  }

  // Check if user is authenticated
  isAuthenticated() {
    const session = sessionStorage.getItem(this.sessionKey);
    const remembered = localStorage.getItem(this.rememberKey);
    
    if (session) {
      return true;
    }
    
    if (remembered) {
      // Restore session from remember me
      const rememberedSession = JSON.parse(remembered);
      const daysSinceLogin = (Date.now() - rememberedSession.timestamp) / (1000 * 60 * 60 * 24);
      
      if (daysSinceLogin < 7) {
        sessionStorage.setItem(this.sessionKey, remembered);
        return true;
      } else {
        localStorage.removeItem(this.rememberKey);
      }
    }
    
    return false;
  }

  // Get current session
  getSession() {
    const session = sessionStorage.getItem(this.sessionKey);
    return session ? JSON.parse(session) : null;
  }

  // Logout function
  logout() {
    sessionStorage.removeItem(this.sessionKey);
    localStorage.removeItem(this.rememberKey);
  }

  // Route guard - redirect to login if not authenticated
  requireAuth() {
    if (!this.isAuthenticated()) {
      window.location.href = '../admin/login.html';
      return false;
    }
    return true;
  }
}

// Create global auth manager instance
const authManager = new AuthManager();

// Login page functionality
if (window.location.pathname.includes('login.html')) {
  document.addEventListener('DOMContentLoaded', () => {
    // Redirect if already logged in
    if (authManager.isAuthenticated()) {
      window.location.href = 'dashboard.html';
      return;
    }

    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');
    const togglePassword = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('password');

    // Toggle password visibility
    if (togglePassword) {
      togglePassword.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        togglePassword.innerHTML = type === 'password' 
          ? '<i class="fas fa-eye"></i>' 
          : '<i class="fas fa-eye-slash"></i>';
      });
    }

    // Handle login form submission
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;

        const result = authManager.login(username, password, remember);

        if (result.success) {
          window.location.href = 'dashboard.html';
        } else {
          if (errorMessage) {
            errorMessage.textContent = result.message;
            errorMessage.style.display = 'block';
            
            // Shake animation
            loginForm.classList.add('shake');
            setTimeout(() => loginForm.classList.remove('shake'), 500);
          }
        }
      });
    }
  });
}

// Dashboard pages - require authentication
if (window.location.pathname.includes('dashboard.html')) {
  // Check authentication on page load
  if (!authManager.requireAuth()) {
    // Will redirect to login
  } else {
    // User is authenticated, load dashboard
    document.addEventListener('DOMContentLoaded', () => {
      const session = authManager.getSession();
      
      // Update admin name in UI
      const adminNameElements = document.querySelectorAll('.admin-name');
      adminNameElements.forEach(el => {
        el.textContent = session.username;
      });

      // Logout button
      const logoutBtn = document.getElementById('logout-btn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
          e.preventDefault();
          authManager.logout();
          window.location.href = 'login.html';
        });
      }
    });
  }
}