# Kamal Apparel - Premium E-Commerce Website

A fully functional, modern, premium e-commerce website for Kamal Apparel, a Lahore-based luxury fashion brand specializing in men's and women's clothing, unstitched fabrics, and traditional wear.

## 🌟 Features

### Main Website (Storefront)
- **Premium Design**: Glassmorphism navbar, Ken Burns hero slideshow, scroll-reveal animations
- **40+ Products**: Comprehensive catalog with men's, women's, casual, formal, traditional, and unstitched collections
- **Advanced Filtering**: Filter by category, gender, price, and more
- **Shopping Cart**: Persistent cart with localStorage, quantity management
- **Wishlist System**: Save favorite products
- **Quick View Modal**: Preview products without leaving the page
- **Responsive Design**: Mobile-first approach, works on all devices
- **Interactive Features**: Promo code copy, newsletter subscription, contact form
- **Social Media Integration**: All major platforms linked

### Admin Dashboard
- **Secure Authentication**: Login system with session management and "Remember Me"
- **Dashboard Overview**: KPI cards, sales analytics, recent orders
- **Product Management**: Add, edit, delete products with full CRUD operations
- **Inventory Management**: Real-time stock tracking, low stock alerts
- **Data Export**: Export products, inventory, and sales data to CSV/JSON
- **Settings**: Store configuration, data backup and restore
- **Real-time Sync**: Changes in admin instantly reflect on storefront

## 🚀 Quick Start

### Option 1: Direct Deployment to Vercel

1. **Download the zip file** (`kamal-apparel-website.zip`)
2. **Extract the contents**
3. **Go to [Vercel](https://vercel.com)**
4. **Sign in** with GitHub, GitLab, or Bitbucket
5. **Click "Add New Project"**
6. **Import the extracted folder**
7. **Deploy!** (No configuration needed)

Your website will be live at: `https://your-project-name.vercel.app`

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to the project folder
cd kamal-apparel

# Deploy
vercel

# Follow the prompts
```

### Option 3: Local Development

```bash
# Extract the zip file
unzip kamal-apparel-website.zip

# Navigate to the folder
cd kamal-apparel

# Open with a local server (Python)
python3 -m http.server 8080

# Or use Node.js
npx http-server -p 8080

# Open browser to http://localhost:8080
```

## 📁 Project Structure

```
kamal-apparel/
├── index.html              # Main storefront page
├── css/
│   ├── style.css          # Main website styles
│   └── admin.css          # Admin dashboard styles
├── js/
│   ├── app.js             # Main website functionality
│   ├── products.js        # Product database (40+ products)
│   ├── admin-auth.js      # Admin authentication
│   └── admin-dashboard.js # Admin dashboard functionality
├── admin/
│   ├── login.html         # Admin login page
│   └── dashboard.html     # Admin dashboard
└── assets/                # Optional assets folder
```

## 🔐 Admin Access

**Login URL**: `https://your-domain.com/admin/login.html`

**Default Credentials**:
- Username: `kamal_admin`
- Password: `KamalApparel@2025`

**⚠️ IMPORTANT**: Change these credentials in production by modifying `js/admin-auth.js`

## 🎨 Design System

### Color Palette
- **Navy**: #1A2744 (Primary)
- **Gold**: #C8963E (Accent)
- **Crimson**: #A61C2A (CTA/Sale)
- **Cream**: #FAF6EF (Background)

### Typography
- **Headings**: Cormorant Garamond (italic, elegant)
- **Body**: Jost (clean modern sans-serif)

### Key Features
- Glassmorphism effects
- Smooth scroll-reveal animations
- Ken Burns effect on hero images
- Responsive breakpoints: 1100px, 880px, 540px

## 🛠️ Technology Stack

- **HTML5**: Semantic markup
- **CSS3**: Modern features (Grid, Flexbox, Custom Properties)
- **Vanilla JavaScript (ES6+)**: No frameworks required
- **localStorage**: Data persistence
- **Google Fonts**: Cormorant Garamond, Jost
- **Font Awesome 6**: Icons

## 📱 Responsive Design

The website is fully responsive with breakpoints at:
- **Desktop**: 1400px+ (Full experience)
- **Tablet Landscape**: 1100px (Hamburger menu)
- **Tablet Portrait**: 880px (Adjusted layouts)
- **Mobile**: 540px (Single column, touch-optimized)

## 🔄 Data Management

### Products
- Stored in `localStorage` as `kf_products`
- Initially loaded from `js/products.js`
- Editable via admin dashboard
- Real-time sync between admin and storefront

### Cart & Wishlist
- Persistent across sessions
- Stored in `localStorage`
- Automatic badge updates

### Admin Session
- Secure session management
- Optional "Remember Me" (7 days)
- Route guards on admin pages

## 🎯 Key Functionalities

### Storefront
1. **Hero Slideshow**: 5 slides with auto-advance and manual controls
2. **Product Filtering**: 8 filter options (All, Men, Women, Casual, Formal, Traditional, Unstitched, Sale)
3. **Product Sorting**: Featured, Price (Low-High), Price (High-Low), Newest
4. **Load More**: Progressive loading (8 initial, +4 per click)
5. **Quick View**: Modal with size selection, color options, add to cart
6. **Cart Drawer**: Slide-in cart with quantity controls
7. **Wishlist**: Toggle favorite products
8. **Promo Code**: Copy to clipboard functionality
9. **Forms**: Contact form, newsletter subscription

### Admin Dashboard
1. **Dashboard**: KPI cards, quick actions, recent orders
2. **Products**: Full CRUD operations, search, filter, pagination
3. **Inventory**: Stock management, inline editing, status tracking
4. **Orders**: Order management (ready for integration)
5. **Customers**: Customer data management
6. **Settings**: Store configuration, data export/import

## 🚀 Deployment Options

### Vercel (Recommended)
- Zero configuration
- Automatic HTTPS
- Global CDN
- Free tier available

### Netlify
1. Drag and drop the folder to [Netlify Drop](https://app.netlify.com/drop)
2. Or use Netlify CLI: `netlify deploy --prod`

### GitHub Pages
1. Create a GitHub repository
2. Upload the files
3. Enable GitHub Pages in settings
4. Access at `https://username.github.io/repo-name`

### Traditional Hosting
Upload all files to your web hosting via FTP/SFTP. Ensure the server supports static file hosting.

## 🔧 Customization

### Change Colors
Edit CSS variables in `css/style.css` and `css/admin.css`:
```css
:root {
  --navy: #1A2744;
  --gold: #C8963E;
  --crimson: #A61C2A;
  --cream: #FAF6EF;
}
```

### Add Products
1. **Via Admin Dashboard**: Login → Products → Add Product
2. **Via Code**: Edit `js/products.js` and add to the `PRODUCTS` array

### Modify Admin Credentials
Edit `js/admin-auth.js`:
```javascript
const ADMIN_CREDENTIALS = {
  username: 'your_username',
  password: btoa('your_password')
};
```

### Change Store Information
1. **Via Admin**: Login → Settings
2. **Via Code**: Edit contact information in `index.html`

## 📊 Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari 12+, Chrome Android

## 🐛 Troubleshooting

### Products not loading
- Check browser console for errors
- Verify `js/products.js` is loaded
- Clear localStorage and refresh

### Admin login not working
- Verify credentials: `kamal_admin` / `KamalApparel@2025`
- Check browser console for errors
- Clear browser cache

### Images not displaying
- Verify internet connection (images use Unsplash CDN)
- Check browser console for CORS errors
- Replace with local images if needed

## 📝 License

This project is created for Kamal Apparel. All rights reserved.

## 🤝 Support

For support or customization requests, contact the development team.

## 🎉 Credits

- **Design & Development**: Built with modern web technologies
- **Images**: Unsplash (for demo purposes)
- **Icons**: Font Awesome 6
- **Fonts**: Google Fonts (Cormorant Garamond, Jost)

---

**Built with ❤️ for Kamal Apparel - Premium Luxury Fashion**