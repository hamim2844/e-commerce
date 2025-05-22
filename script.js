// Sample product data
window.products = [
    {
        id: 1,
        name: "Premium Wireless Headphones",
        category: "Electronics",
        price: 129.99,
        oldPrice: 179.99,
        rating: 4.8,
        reviews: 124,
        image: "images/product-1.jpg",
        tag: "new",
        description: "Experience premium sound quality with these wireless headphones. Perfect for music lovers and professionals."
    },
    {
        id: 2,
        name: "Casual Summer T-Shirt",
        category: "Fashion",
        price: 24.99,
        oldPrice: 34.99,
        rating: 4.5,
        reviews: 89,
        image: "images/product-2.jpg",
        tag: "best",
        description: "Stay cool and stylish this summer with our breathable casual t-shirt. Available in multiple colors."
    },
    {
        id: 3,
        name: "Smart Fitness Tracker",
        category: "Electronics",
        price: 79.99,
        oldPrice: 99.99,
        rating: 4.7,
        reviews: 162,
        image: "images/product-3.jpg",
        tag: "featured",
        description: "Track your fitness goals with our advanced smart fitness tracker. Includes heart rate monitor and sleep tracking."
    },
    {
        id: 4,
        name: "Designer Leather Wallet",
        category: "Accessories",
        price: 49.99,
        oldPrice: 69.99,
        rating: 4.6,
        reviews: 78,
        image: "images/product-4.jpg",
        tag: "featured",
        description: "Elegant designer leather wallet with multiple card slots and coin pocket. Perfect gift for any occasion."
    },
    {
        id: 5,
        name: "Portable Bluetooth Speaker",
        category: "Electronics",
        price: 59.99,
        oldPrice: 79.99,
        rating: 4.4,
        reviews: 105,
        image: "images/product-5.jpg",
        tag: "best",
        description: "Take your music anywhere with this portable Bluetooth speaker. Waterproof and long battery life."
    },
    {
        id: 6,
        name: "Natural Skin Care Set",
        category: "Beauty",
        price: 89.99,
        oldPrice: 119.99,
        rating: 4.9,
        reviews: 93,
        image: "images/product-6.jpg",
        tag: "new",
        description: "Rejuvenate your skin with our all-natural skin care set. Includes cleanser, toner, and moisturizer."
    },
    {
        id: 7,
        name: "Professional Chef Knife",
        category: "Home",
        price: 69.99,
        oldPrice: 89.99,
        rating: 4.7,
        reviews: 87,
        image: "images/product-7.jpg",
        tag: "featured",
        description: "Prepare meals like a professional chef with our high-quality stainless steel knife. Sharp and durable."
    },
    {
        id: 8,
        name: "Wireless Gaming Mouse",
        category: "Electronics",
        price: 45.99,
        oldPrice: 59.99,
        rating: 4.5,
        reviews: 114,
        image: "images/product-8.jpg",
        tag: "best",
        description: "Gain a competitive edge with our ergonomic wireless gaming mouse. Customizable buttons and RGB lighting."
    }
];

// Sample testimonial data
const testimonials = [
    {
        id: 1,
        name: "Sarah Johnson",
        position: "Regular Customer",
        image: "images/testimonial-1.jpg",
        rating: 5,
        text: "I've been shopping with ShopEase for over a year now, and I'm consistently impressed by their quality products and exceptional customer service. The website is so easy to use, and delivery is always prompt!"
    },
    {
        id: 2,
        name: "Michael Chen",
        position: "Tech Enthusiast",
        image: "images/testimonial-2.jpg",
        rating: 4,
        text: "As someone who loves gadgets, I appreciate the detailed product descriptions and honest reviews on ShopEase. Their electronics selection is top-notch, and the prices are very competitive."
    },
    {
        id: 3,
        name: "Emily Rodriguez",
        position: "Fashion Blogger",
        image: "images/testimonial-3.jpg",
        rating: 5,
        text: "ShopEase has become my go-to destination for trendy fashion items. The website is beautifully designed and makes shopping a pleasure. I also love how they showcase styling tips with each product!"
    }
];

let cart = [];

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Load cart from localStorage
    loadCart();
    
    // Create sample user for demo purposes if not exists
    createSampleUserIfNotExists();
    
    // Check login status and update UI
    checkLoginStatus();
    
    // Initialize products
    displayProducts('all');
    
    // Initialize testimonials
    if (document.getElementById('testimonials-container')) {
        displayTestimonials();
    }
    
    // Initialize countdown timer
    if (document.getElementById('countdown')) {
        initCountdown();
    }
    
    // Event listeners
    setupEventListeners();
    
    // Initialize dark mode
    setupDarkMode();
    
    // Setup scroll animations
    setupScrollAnimations();
    
    // Add close button to mobile menu
    setupMobileMenu();
    
    // Initialize cart count
    updateCartCount();
    
    // Initialize wishlist functionality if available
    if (typeof window.updateWishlistCount === 'function') {
        window.updateWishlistCount();
    }
});

// Create sample user data for demo
function createSampleUserIfNotExists() {
    if (!localStorage.getItem('user')) {
        const sampleUser = {
            name: 'Demo User',
            email: 'demo@example.com',
            password: 'password123',
            isLoggedIn: false
        };
        localStorage.setItem('user', JSON.stringify(sampleUser));
    }
}

// Toggle mobile menu
function toggleMenu() {
    const nav = document.querySelector('nav');
    nav.classList.toggle('active');
}

// Initialize dark mode
function setupDarkMode() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark-mode');
    }
    
    // Add dark mode toggle to the header
    const icons = document.querySelector('.icons');
    if (icons) {
        // Check if the dark mode toggle already exists
        let darkModeToggle = document.querySelector('.dark-mode-toggle');
        
        // If it doesn't exist, create it
        if (!darkModeToggle) {
            darkModeToggle = document.createElement('div');
            darkModeToggle.className = 'dark-mode-toggle';
            darkModeToggle.innerHTML = document.body.classList.contains('dark-mode') 
                ? '<i class="fas fa-sun"></i>' 
                : '<i class="fas fa-moon"></i>';
            
            darkModeToggle.addEventListener('click', toggleDarkMode);
            icons.appendChild(darkModeToggle);
        } else {
            // Update the icon to match current state
            darkModeToggle.innerHTML = document.body.classList.contains('dark-mode') 
                ? '<i class="fas fa-sun"></i>' 
                : '<i class="fas fa-moon"></i>';
        }
    }
}

// Dark mode toggle function
function toggleDarkMode() {
    const body = document.body;
    const toggle = document.querySelector('.dark-mode-toggle');
    
    body.classList.toggle('dark-mode');
    
    // Update icon
    if (toggle) {
        toggle.innerHTML = body.classList.contains('dark-mode') 
            ? '<i class="fas fa-sun"></i>' 
            : '<i class="fas fa-moon"></i>';
    }
    
    // Save preference
    localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
    
    // Display notification
    const message = body.classList.contains('dark-mode') 
        ? 'Dark mode enabled' 
        : 'Light mode enabled';
    
    showNotification(message);
}

// Filter products
function displayProducts(filter = 'all') {
    const productsContainer = document.querySelector('.products-container');
    if (!productsContainer) return;
    
    productsContainer.innerHTML = '';
    
    let filteredProducts = products;
    
    if (filter !== 'all') {
        if (['new', 'best', 'featured', 'sale'].includes(filter)) {
            // Filter by tag
            filteredProducts = products.filter(product => product.tag === filter);
        } else {
            // Filter by category
            filteredProducts = products.filter(product => 
                product.category.toLowerCase() === filter.toLowerCase()
            );
        }
    }
    
    if (filteredProducts.length === 0) {
        productsContainer.innerHTML = `
            <div class="empty-products">
                <i class="fas fa-search"></i>
                <h3>No products found</h3>
                <p>We couldn't find any products matching your criteria.</p>
                <button class="btn reset-filter">Show All Products</button>
            </div>
        `;
        
        // Add event listener to the reset button
        const resetButton = productsContainer.querySelector('.reset-filter');
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                displayProducts('all');
                
                // Update active filter button
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.classList.remove('active');
                    if (btn.getAttribute('data-filter') === 'all') {
                        btn.classList.add('active');
                    }
                });
            });
        }
    } else {
        filteredProducts.forEach((product, index) => {
            const productElement = createProductElement(product);
            productElement.style.opacity = "0";
            productElement.style.transform = "translateY(20px)";
            productElement.style.transition = "opacity 0.5s ease, transform 0.5s ease";
            productElement.style.transitionDelay = `${index * 0.1}s`;
            
            productsContainer.appendChild(productElement);
            
            // Trigger animation
            setTimeout(() => {
                productElement.style.opacity = "1";
                productElement.style.transform = "translateY(0)";
            }, 10);
        });
    }
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-filter') === filter) {
            btn.classList.add('active');
        }
    });
    
    // Show filter notification
    if (filter !== 'all') {
        const filterName = filter.charAt(0).toUpperCase() + filter.slice(1);
        showNotification(`Showing ${filterName} products`);
    }
}

// Create product element
function createProductElement(product) {
    const productDiv = document.createElement('div');
    productDiv.className = 'product';
    productDiv.setAttribute('data-category', product.category.toLowerCase());
    productDiv.setAttribute('data-tag', product.tag || '');
    
    // Generate rating stars
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(product.rating)) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i - 0.5 <= product.rating) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    
    // Create product tag
    let tagHTML = '';
    if (product.tag) {
        const tagClass = product.tag === 'new' ? 'tag-new' : (product.tag === 'sale' ? 'tag-sale' : '');
        const tagText = product.tag.charAt(0).toUpperCase() + product.tag.slice(1);
        tagHTML = `<span class="product-tag ${tagClass}">${tagText}</span>`;
    }
    
    // Check if product is in wishlist
    const isInWishlist = typeof window.isInWishlist === 'function' ? 
        window.isInWishlist(product.id) : false;
    
    const wishlistIconClass = isInWishlist ? 'fas fa-heart' : 'far fa-heart';
    const wishlistClass = isInWishlist ? 'in-wishlist' : '';
    const wishlistTitle = isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist';
    
    productDiv.innerHTML = `
        <div class="product-image">
            ${tagHTML}
            <img src="${product.image}" alt="${product.name}">
            <div class="product-icons">
                <a href="#" class="product-icon" title="Quick View"><i class="fas fa-eye"></i></a>
                <a href="#" class="product-icon add-to-wishlist ${wishlistClass}" title="${wishlistTitle}" data-id="${product.id}"><i class="${wishlistIconClass}"></i></a>
                <a href="#" class="product-icon" title="Compare"><i class="fas fa-exchange-alt"></i></a>
            </div>
        </div>
        <div class="product-details">
            <div class="product-category">${product.category}</div>
            <h3 class="product-title">${product.name}</h3>
            <div class="product-price">
                <span class="current-price">$${product.price.toFixed(2)}</span>
                ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
            </div>
            <div class="product-rating">
                <div class="rating-stars">${stars}</div>
                <div class="rating-count">(${product.reviews})</div>
            </div>
            <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
        </div>
    `;
    
    // Add event listener to the add to cart button
    productDiv.querySelector('.add-to-cart').addEventListener('click', function() {
        addToCart(product);
    });
    
    // Add event listener to the wishlist button
    const wishlistButton = productDiv.querySelector('.add-to-wishlist');
    if (wishlistButton) {
        wishlistButton.addEventListener('click', function(e) {
            e.preventDefault();
            if (typeof window.toggleWishlistItem === 'function') {
                window.toggleWishlistItem(product.id, this);
            } else {
                console.error('Wishlist functionality not available');
            }
        });
    }
    
    return productDiv;
}

// Check login status and update UI
function checkLoginStatus() {
    const userIcon = document.querySelector('.user-icon');
    if (!userIcon) return;
    
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
        const user = JSON.parse(storedUser);
        
        if (user.isLoggedIn) {
            // Update user icon to show logged in state
            userIcon.innerHTML = `<i class="fas fa-user-check"></i>`;
            userIcon.setAttribute('title', `Hello, ${user.name}`);
        } else {
            // Reset to default if not logged in
            userIcon.innerHTML = `<i class="fas fa-user"></i>`;
            userIcon.setAttribute('title', 'Login or Register');
        }
        
        // Set up click handler for user icon
        userIcon.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (user.isLoggedIn) {
                // Toggle user dropdown when logged in
                toggleUserDropdown(user);
            } else {
                // Redirect to login page when not logged in
                window.location.href = 'login.html';
            }
        });
    }
}

// Toggle user dropdown menu
function toggleUserDropdown(user) {
    // Remove any existing dropdown
    const existingDropdown = document.querySelector('.user-dropdown');
    if (existingDropdown) {
        existingDropdown.remove();
        return;
    }
    
    const userIcon = document.querySelector('.user-icon');
    if (!userIcon) return;
    
    // Create dropdown menu
    const dropdownMenu = document.createElement('div');
    dropdownMenu.className = 'user-dropdown';
    
    // Apply dark mode to dropdown if needed
    if (document.body.classList.contains('dark-mode')) {
        dropdownMenu.classList.add('dark-dropdown');
    }
    
    dropdownMenu.innerHTML = `
        <ul>
            <li><a href="#" id="my-account">My Account</a></li>
            <li><a href="#" id="my-orders">My Orders</a></li>
            <li><a href="#" id="my-wishlist">My Wishlist</a></li>
            <li><a href="#" id="logout-btn">Logout</a></li>
        </ul>
    `;
    
    document.body.appendChild(dropdownMenu);
    
    // Position the dropdown
    const iconRect = userIcon.getBoundingClientRect();
    dropdownMenu.style.position = 'absolute';
    dropdownMenu.style.top = (iconRect.bottom + window.scrollY) + 'px';
    dropdownMenu.style.right = (window.innerWidth - iconRect.right) + 'px';
    dropdownMenu.style.zIndex = '1001';
    
    // Apply styles based on dark mode
    if (document.body.classList.contains('dark-mode')) {
        dropdownMenu.style.background = 'var(--dark-bg)';
        dropdownMenu.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
    } else {
        dropdownMenu.style.background = '#fff';
        dropdownMenu.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
    }
    
    dropdownMenu.style.borderRadius = '5px';
    
    // Style dropdown items
    const dropdownStyles = `
        .user-dropdown ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .user-dropdown ul li {
            padding: 0;
            margin: 0;
        }
        .user-dropdown ul li a {
            display: block;
            padding: 12px 20px;
            color: ${document.body.classList.contains('dark-mode') ? '#fff' : '#333'};
            transition: all 0.3s ease;
            white-space: nowrap;
        }
        .user-dropdown ul li a:hover {
            background-color: ${document.body.classList.contains('dark-mode') ? '#2a2a2a' : '#f5f5f5'};
            color: var(--primary-color);
        }
        .dark-dropdown ul li a {
            color: #fff !important;
        }
        .dark-dropdown ul li a:hover {
            background-color: #2a2a2a !important;
        }
    `;
    
    // Add styles only once
    if (!document.getElementById('dropdown-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'dropdown-styles';
        styleElement.textContent = dropdownStyles;
        document.head.appendChild(styleElement);
    }
    
    // Add dropdown menu item event listeners
    document.getElementById('logout-btn').addEventListener('click', function(e) {
        e.preventDefault();
        
        // Set user as logged out
        const user = JSON.parse(localStorage.getItem('user'));
        user.isLoggedIn = false;
        localStorage.setItem('user', JSON.stringify(user));
        
        // Remove dropdown
        dropdownMenu.remove();
        
        // Show notification
        showNotification('You have been logged out');
        
        // Update UI
        checkLoginStatus();
    });
    
    // Handle profile menu options
    document.getElementById('my-account').addEventListener('click', function(e) {
        e.preventDefault();
        showNotification('Account section is under development');
        dropdownMenu.remove();
    });
    
    document.getElementById('my-orders').addEventListener('click', function(e) {
        e.preventDefault();
        showNotification('Orders section is under development');
        dropdownMenu.remove();
    });
    
    document.getElementById('my-wishlist').addEventListener('click', function(e) {
        e.preventDefault();
        showNotification('Wishlist section is under development');
        dropdownMenu.remove();
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function closeDropdown(e) {
        if (!userIcon.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownMenu.remove();
            document.removeEventListener('click', closeDropdown);
        }
    });
}

// Modified setupEventListeners function
function setupEventListeners() {
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            displayProducts(filter);
            
            // Add animation to button when clicked
            this.classList.add('button-clicked');
            setTimeout(() => {
                this.classList.remove('button-clicked');
            }, 300);
        });
    });
    
    // Add animation style for button click
    if (!document.getElementById('button-click-style')) {
        const style = document.createElement('style');
        style.id = 'button-click-style';
        style.textContent = `
            .button-clicked {
                animation: buttonPulse 0.3s ease;
            }
            @keyframes buttonPulse {
                0% { transform: scale(1); }
                50% { transform: scale(0.95); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Category filter buttons (if they exist)
    document.querySelectorAll('.category-filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            displayProducts(category);
        });
    });
    
    // Wishlist icon
    const wishlistIcon = document.querySelector('.wishlist-icon');
    if (wishlistIcon) {
        wishlistIcon.addEventListener('click', function(e) {
            // Only prevent default if not on wishlist page
            if (!window.location.pathname.includes('wishlist.html')) {
                e.preventDefault();
                window.location.href = 'wishlist.html';
            }
        });
    }
    
    // Testimonial navigation
    const prevButton = document.getElementById('prev-testimonial');
    const nextButton = document.getElementById('next-testimonial');
    
    if (prevButton) {
        prevButton.addEventListener('click', function() {
            navigateTestimonials('prev');
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            navigateTestimonials('next');
        });
    }
    
    // Cart sidebar
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            openCartSidebar();
        });
    }
    
    const closeCartButton = document.querySelector('.close-cart');
    if (closeCartButton) {
        closeCartButton.addEventListener('click', function() {
            closeCartSidebar();
        });
    }
    
    const overlay = document.querySelector('.overlay');
    if (overlay) {
        overlay.addEventListener('click', function() {
            closeCartSidebar();
        });
    }
    
    // Checkout button
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                showNotification('Your cart is empty!');
            } else {
                window.location.href = 'checkout.html';
            }
        });
    }
    
    // View cart button
    const viewCartBtn = document.querySelector('.view-cart-btn');
    if (viewCartBtn) {
        viewCartBtn.addEventListener('click', function() {
            closeCartSidebar();
        });
    }
    
    // Load more products button
    const loadMoreBtn = document.getElementById('load-more');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // Implementation for loading more products
            showNotification('More products loaded!');
        });
    }
    
    // Newsletter form
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            if (emailInput.value) {
                showNotification('Thank you for subscribing to our newsletter!');
                emailInput.value = '';
            }
        });
    }
    
    // Back to top button
    const backToTopButton = document.querySelector('.back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
        
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Display testimonials
function displayTestimonials() {
    const testimonialsContainer = document.getElementById('testimonials-container');
    
    testimonials.forEach(testimonial => {
        // Generate rating stars
        let stars = '';
        for (let i = 0; i < testimonial.rating; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        
        const testimonialDiv = document.createElement('div');
        testimonialDiv.className = 'testimonial';
        testimonialDiv.innerHTML = `
            <div class="testimonial-info">
                <div class="testimonial-avatar">
                    <img src="${testimonial.image}" alt="${testimonial.name}">
                </div>
                <div class="testimonial-author">
                    <h4>${testimonial.name}</h4>
                    <span>${testimonial.position}</span>
                </div>
            </div>
            <div class="testimonial-text">
                <p>${testimonial.text}</p>
            </div>
            <div class="testimonial-rating">
                ${stars}
            </div>
        `;
        
        testimonialsContainer.appendChild(testimonialDiv);
    });
}

// Initialize countdown timer
function initCountdown() {
    // Set the countdown date (7 days from now)
    const countdownDate = new Date();
    countdownDate.setDate(countdownDate.getDate() + 7);
    
    // Update the countdown every second
    const countdownTimer = setInterval(function() {
        const now = new Date().getTime();
        const distance = countdownDate - now;
        
        // Calculate days, hours, minutes, seconds
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Display the countdown
        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
        
        // If the countdown is over, clear the interval
        if (distance < 0) {
            clearInterval(countdownTimer);
            document.getElementById('countdown').innerHTML = 'EXPIRED';
        }
    }, 1000);
}

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(product) {
    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    // Save cart to localStorage
    saveCart();
    
    // Update cart count
    updateCartCount();
    
    // Update cart sidebar
    updateCartSidebar();
    
    // Create fly to cart animation
    createAddToCartAnimation(product);
    
    // Show notification
    showNotification(`${product.name} added to cart!`);
    
    // Open cart sidebar
    openCartSidebar();
}

// Create add to cart animation
function createAddToCartAnimation(product) {
    // Get the product image source
    const productImage = document.querySelector(`img[alt="${product.name}"]`);
    
    if (!productImage) return;
    
    // Get cart icon position
    const cartIcon = document.querySelector('.cart-icon');
    if (!cartIcon) return;
    
    const cartIconRect = cartIcon.getBoundingClientRect();
    const productRect = productImage.getBoundingClientRect();
    
    // Create a new element for the animation
    const animatedProduct = document.createElement('div');
    animatedProduct.className = 'animated-product';
    animatedProduct.innerHTML = `<img src="${product.image}" alt="Product">`;
    document.body.appendChild(animatedProduct);
    
    // Style the animated product
    const style = document.createElement('style');
    style.textContent = `
        .animated-product {
            position: fixed;
            z-index: 9999;
            transition: all 0.8s cubic-bezier(0.25, 0.5, 0.5, 0.9);
            pointer-events: none;
        }
        .animated-product img {
            width: 80px;
            height: 80px;
            object-fit: cover;
            border-radius: 50%;
            box-shadow: 0 5px 10px rgba(0,0,0,0.2);
        }
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        .cart-icon-pulse {
            animation: pulse 0.5s ease-in-out;
        }
    `;
    document.head.appendChild(style);
    
    // Set initial position and size
    animatedProduct.style.top = `${productRect.top + window.scrollY}px`;
    animatedProduct.style.left = `${productRect.left + window.scrollX}px`;
    animatedProduct.style.width = `${productRect.width}px`;
    animatedProduct.style.height = `${productRect.height}px`;
    animatedProduct.style.opacity = '1';
    
    // Trigger animation
    setTimeout(() => {
        animatedProduct.style.top = `${cartIconRect.top + window.scrollY}px`;
        animatedProduct.style.left = `${cartIconRect.left + window.scrollX}px`;
        animatedProduct.style.width = '20px';
        animatedProduct.style.height = '20px';
        animatedProduct.style.opacity = '0.5';
        
        // Add pulse animation to cart icon
        cartIcon.classList.add('cart-icon-pulse');
        
        // Remove elements after animation completes
        setTimeout(() => {
            animatedProduct.remove();
            style.remove();
            
            // Remove pulse class from cart icon
            setTimeout(() => {
                cartIcon.classList.remove('cart-icon-pulse');
            }, 500);
        }, 800);
    }, 100);
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
        element.textContent = totalQuantity;
        
        // Add pulse animation if cart count changed
        if (totalQuantity > 0) {
            const cartIcon = element.closest('.cart-icon');
            if (cartIcon) {
                cartIcon.classList.add('cart-icon-pulse');
                setTimeout(() => {
                    cartIcon.classList.remove('cart-icon-pulse');
                }, 500);
            }
        }
    });
}

function updateCartSidebar() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    
    // Clear current items
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        // Show empty cart message
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
                <a href="#products" class="btn">Start Shopping</a>
            </div>
        `;
        cartTotalPrice.textContent = '$0.00';
    } else {
        // Add each item to the cart sidebar
        cart.forEach(item => {
            const itemSubtotal = (item.price * item.quantity).toFixed(2);
            const cartItemDiv = document.createElement('div');
            cartItemDiv.className = 'cart-item';
            cartItemDiv.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <div class="cart-item-price">$${item.price.toFixed(2)} × ${item.quantity} = $${itemSubtotal}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                </div>
                <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></button>
            `;
            
            cartItemsContainer.appendChild(cartItemDiv);
        });
        
        // Add event listeners for quantity buttons and remove buttons
        cartItemsContainer.querySelectorAll('.quantity-btn.minus').forEach(btn => {
            btn.addEventListener('click', function() {
                updateItemQuantity(parseInt(btn.getAttribute('data-id')), -1);
            });
        });
        
        cartItemsContainer.querySelectorAll('.quantity-btn.plus').forEach(btn => {
            btn.addEventListener('click', function() {
                updateItemQuantity(parseInt(btn.getAttribute('data-id')), 1);
            });
        });
        
        cartItemsContainer.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', function() {
                const id = parseInt(input.getAttribute('data-id'));
                const newQuantity = parseInt(input.value);
                
                if (newQuantity > 0) {
                    setItemQuantity(id, newQuantity);
                } else {
                    input.value = 1;
                    setItemQuantity(id, 1);
                }
            });
        });
        
        cartItemsContainer.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                removeFromCart(parseInt(btn.getAttribute('data-id')));
            });
        });
        
        // Calculate and update total price
        const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        cartTotalPrice.textContent = `$${totalPrice.toFixed(2)}`;
    }
}

function updateItemQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    
    if (item) {
        // Ensure we only add/remove one item at a time
        item.quantity = change > 0 ? item.quantity + 1 : item.quantity - 1;
        
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            // Save cart to localStorage
            saveCart();
            updateCartCount();
            updateCartSidebar();
        }
    }
}

function setItemQuantity(id, quantity) {
    const item = cart.find(item => item.id === id);
    
    if (item) {
        item.quantity = quantity;
        // Save cart to localStorage
        saveCart();
        updateCartCount();
        updateCartSidebar();
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    // Save cart to localStorage
    saveCart();
    updateCartCount();
    updateCartSidebar();
}

function openCartSidebar() {
    document.querySelector('.cart-sidebar').classList.add('open');
    document.querySelector('.overlay').classList.add('show');
}

function closeCartSidebar() {
    document.querySelector('.cart-sidebar').classList.remove('open');
    document.querySelector('.overlay').classList.remove('show');
}

// Notification functionality
function showNotification(message, type = 'success') {
    // Check if notification container exists
    let notificationContainer = document.querySelector('.notification-container');
    
    // If it doesn't exist, create it
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Set icon based on notification type
    let icon = '';
    switch(type) {
        case 'success':
            icon = '<i class="fas fa-check-circle"></i>';
            break;
        case 'error':
            icon = '<i class="fas fa-exclamation-circle"></i>';
            break;
        case 'warning':
            icon = '<i class="fas fa-exclamation-triangle"></i>';
            break;
        case 'info':
            icon = '<i class="fas fa-info-circle"></i>';
            break;
        default:
            icon = '<i class="fas fa-bell"></i>';
    }
    
    notification.innerHTML = `
        ${icon}
        <p>${message}</p>
        <button class="close-notification"><i class="fas fa-times"></i></button>
    `;
    
    // Add to container
    notificationContainer.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
    
    // Close button functionality
    notification.querySelector('.close-notification').addEventListener('click', () => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
}

// Testimonial navigation
let currentTestimonial = 0;

function navigateTestimonials(direction) {
    const testimonialElements = document.querySelectorAll('.testimonial');
    
    if (testimonialElements.length === 0) return;
    
    // Hide all testimonials
    testimonialElements.forEach(el => {
        el.style.transform = 'translateX(100%)';
        el.style.opacity = '0';
    });
    
    // Update current testimonial index
    if (direction === 'next') {
        currentTestimonial = (currentTestimonial + 1) % testimonialElements.length;
    } else {
        currentTestimonial = (currentTestimonial - 1 + testimonialElements.length) % testimonialElements.length;
    }
    
    // Show current testimonial
    testimonialElements[currentTestimonial].style.transform = 'translateX(0)';
    testimonialElements[currentTestimonial].style.opacity = '1';
}

// Setup intersection observer for scroll animations
function setupScrollAnimations() {
    const sections = document.querySelectorAll('section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Animate products on scroll with smoother animation
    const productsObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered animation to products with improved timing
                setTimeout(() => {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";
                }, index * 150); // Increased delay between items
                
                productsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    // Set initial styles for product cards with smoother transitions
    document.querySelectorAll('.product').forEach((product, index) => {
        product.style.opacity = "0";
        product.style.transform = "translateY(20px)";
        product.style.transition = "opacity 0.8s ease, transform 0.8s ease"; // Slower transition
        product.style.transitionDelay = `${index * 0.15}s`; // Increased delay
        
        productsObserver.observe(product);
    });
    
    // Same for category cards and hero images
    document.querySelectorAll('.category-card, .collection, .hero-image img').forEach((card, index) => {
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        card.style.transition = "opacity 1s ease, transform 1s ease"; // Slower transition for hero images
        card.style.transitionDelay = `${index * 0.2}s`; // Increased delay
        
        productsObserver.observe(card);
    });
}

// Mobile menu setup
function setupMobileMenu() {
    const menuIcon = document.querySelector('.menu-icon');
    const nav = document.querySelector('nav');
    
    if (menuIcon && nav) {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        document.body.appendChild(overlay);
        
        // Create close button
        const closeButton = document.createElement('div');
        closeButton.className = 'close-menu';
        closeButton.innerHTML = '<i class="fas fa-times"></i>';
        nav.prepend(closeButton);
        
        // Open menu function
        menuIcon.addEventListener('click', function() {
            nav.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        // Close menu function
        function closeMenu() {
            nav.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        closeButton.addEventListener('click', closeMenu);
        overlay.addEventListener('click', closeMenu);
    }
}

// Export functions globally
window.showNotification = showNotification;
window.addToCart = addToCart; 