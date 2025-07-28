# Habibi Biriyani - Cloud Kitchen Web Application

A beautiful, mobile-friendly web application for a pre-order cloud kitchen business specializing in authentic South Indian biriyani.

## 🌟 Features

### Customer Features
- **Beautiful Homepage** with rotating slideshow of biriyani images
- **Traditional Menu Display** with prices and descriptions
- **Pre-Order System** with quantity selection and delivery date picker
- **Order Confirmation** with unique order ID
- **Responsive Design** optimized for mobile devices

### Admin Features
- **Admin Login System** (Email: admin@habibibiriyani.com, Password: admin123)
- **Order Management** - View, filter, and update order status
- **Sales Reports** - Generate daily, weekly, and monthly reports
- **Menu Management** - Add, edit, and delete menu items
- **CSV Export** - Download order data and reports

### Design Features
- **South Indian Aesthetic** with traditional colors and patterns
- **Mobile-First Responsive Design**
- **Smooth Animations** and hover effects
- **Traditional Typography** using Playfair Display, Cinzel, and Poppins fonts

## 🎨 Design Elements

### Color Scheme
- **Primary Brown**: #8B4513 (Deep brown for main elements)
- **Secondary Gold**: #DAA520 (Gold accents and highlights)
- **Accent Maroon**: #800020 (Maroon for buttons and important elements)
- **Accent Green**: #228B22 (Green for success states)
- **Background**: Warm cream tones (#FFF8DC, #F5F5DC)

### Typography
- **Headings**: Cinzel (elegant serif)
- **Subheadings**: Playfair Display (classic serif)
- **Body Text**: Poppins (modern sans-serif)

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No server setup required - runs entirely in the browser

### Installation
1. Download or clone the project files
2. Open `index.html` in your web browser
3. The application will load immediately

### File Structure
```
habibi-biriyani/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and responsive design
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## 📱 How to Use

### For Customers

1. **Browse the Menu**
   - View the beautiful slideshow on the homepage
   - Check out the menu section with prices and descriptions

2. **Place an Order**
   - Click "Pre-Order Now" or navigate to the Order section
   - Fill in your details (name, phone, address)
   - Select delivery date (minimum tomorrow)
   - Choose items and quantities
   - Add special instructions if needed
   - Submit your order

3. **Order Confirmation**
   - Receive a unique order ID
   - Order is saved locally for admin review

### For Admins

1. **Login**
   - Click "Login" in the navigation
   - Select "Admin" tab
   - Use credentials: admin@habibibiriyani.com / admin123

2. **Manage Orders**
   - View all orders in the Orders tab
   - Filter by date and status
   - Update order status (Pending → Preparing → Delivered)
   - Delete orders if needed
   - Export orders to CSV

3. **Generate Reports**
   - Select report type (daily/weekly/monthly)
   - Choose date range
   - View sales summary and item breakdown
   - Export reports

4. **Manage Menu**
   - Add new menu items
   - Edit existing items and prices
   - Delete items

## 🛠 Technical Features

### Frontend Technologies
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Grid and Flexbox
- **Vanilla JavaScript** - No frameworks required
- **Local Storage** - Data persistence in browser

### Responsive Design
- **Mobile-First** approach
- **Breakpoints**: 480px, 768px, 1200px
- **Touch-Friendly** interface
- **Optimized Images** with proper aspect ratios

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📊 Data Management

### Local Storage
- Orders are stored in browser's localStorage
- Menu items are configurable through admin panel
- User sessions are maintained locally

### Data Export
- Orders can be exported as CSV files
- Reports can be generated and exported
- All data is stored locally for privacy

## 🎯 Key Features Explained

### Pre-Order System
- Customers can place orders for future delivery dates
- Minimum delivery date is set to tomorrow
- Real-time total calculation
- Order validation and confirmation

### Admin Panel
- Secure admin login (hardcoded for demo)
- Comprehensive order management
- Sales analytics and reporting
- Menu item management

### Mobile Optimization
- Hamburger menu for mobile navigation
- Touch-friendly buttons and inputs
- Optimized layouts for small screens
- Fast loading and smooth interactions

## 🔧 Customization

### Adding New Menu Items
1. Login as admin
2. Go to Menu Management tab
3. Click "Add New Item"
4. Enter name and price
5. Item will be available for ordering

### Changing Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary-brown: #8B4513;
    --secondary-gold: #DAA520;
    --accent-maroon: #800020;
    --accent-green: #228B22;
}
```

### Modifying Content
- Update text content in `index.html`
- Change images by replacing URLs in the HTML
- Modify prices in `script.js` menuItems object

## 🚀 Deployment

### Local Development
- Simply open `index.html` in a browser
- All features work offline

### Web Hosting
- Upload all files to any web hosting service
- No server-side code required
- Works with static hosting (GitHub Pages, Netlify, etc.)

### Production Considerations
- Replace placeholder images with actual food photos
- Update contact information in footer
- Configure proper admin credentials
- Add analytics tracking if needed

## 📞 Support & Contact

For technical support or customization requests:
- Email: info@habibibiriyani.com
- Phone: +91 98765 43210

## 📄 License

This project is created for demonstration purposes. Feel free to use and modify for your own cloud kitchen business.

## 🎉 Credits

- **Design**: Traditional South Indian aesthetic
- **Icons**: Font Awesome
- **Fonts**: Google Fonts (Playfair Display, Cinzel, Poppins)
- **Images**: Unsplash (placeholder images)

---

**Habibi Biriyani** - A Taste of Tradition in Every Bucket 