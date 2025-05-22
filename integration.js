// Integration script to connect frontend with backend API

document.addEventListener('DOMContentLoaded', async function() {
    // Check if API client is loaded
    if (!window.API) {
        console.error('API client not loaded');
        return;
    }

    // Initialize auth state
    initAuthState();

    // Load products for homepage
    if (document.querySelector('.products-container')) {
        try {
            const productsData = await window.API.Product.getProducts({ limit: 8 });
            updateProductsUI(productsData.data);
        } catch (error) {
            console.error('Failed to load products:', error);
            showNotification('Failed to load products. Please try again later.', 'error');
        }
    }

    // Load categories
    if (document.querySelector('.categories-container')) {
        try {
            const categories = await window.API.Category.getCategories();
            updateCategoriesUI(categories);
        } catch (error) {
            console.error('Failed to load categories:', error);
        }
    }

    // Setup event listeners for filter buttons
    setupFilterButtons();

    // Setup login/register forms
    setupAuthForms();

    // Setup checkout process
    setupCheckoutProcess();
    
    // Update cart count
    updateCartCount();
});

// Initialize authentication state
function initAuthState() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    if (token && user) {
        // Update UI for logged in user
        updateAuthUI(user);

        // Validate token by fetching current user
        window.API.Auth.getCurrentUser(token)
            .then(userData => {
                // Token is valid, update user data
                localStorage.setItem('user', JSON.stringify(userData));
                updateAuthUI(userData);
            })
            .catch(error => {
                // Token is invalid or expired
                console.error('Auth validation error:', error);
                logout();
            });
    } else {
        // User is not logged in
        updateAuthUI(null);
    }
}

// Update UI based on authentication state
function updateAuthUI(user) {
    const userIcon = document.querySelector('.user-icon');
    if (!userIcon) return;

    if (user) {
        // User is logged in
        userIcon.innerHTML = `<i class="fas fa-user-check"></i>`;
        userIcon.setAttribute('title', `Hello, ${user.name}`);
        
        // Update any user-specific UI elements
        const userNameElements = document.querySelectorAll('.user-name');
        userNameElements.forEach(element => {
            element.textContent = user.name;
        });
    } else {
        // User is not logged in
        userIcon.innerHTML = `<i class="fas fa-user"></i>`;
        userIcon.setAttribute('title', 'Login or Register');
    }

    // Update user dropdown if it exists
    const userDropdown = document.querySelector('.user-dropdown');
    if (userDropdown) {
        if (user) {
            userDropdown.innerHTML = `
                <a href="profile.html">My Profile</a>
                <a href="orders.html">My Orders</a>
                <a href="wishlist.html">My Wishlist</a>
                <a href="#" id="logout-btn">Logout</a>
            `;
            
            // Add logout handler
            document.getElementById('logout-btn').addEventListener('click', function(e) {
                e.preventDefault();
                logout();
            });
        } else {
            userDropdown.innerHTML = `
                <a href="login.html">Login</a>
                <a href="register.html">Register</a>
            `;
        }
    }
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    updateAuthUI(null);
    showNotification('You have been logged out', 'success');
    
    // Redirect to home page if on a protected page
    const protectedPages = ['profile.html', 'orders.html', 'checkout.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage)) {
        window.location.href = 'index.html';
    }
}

// Update products UI with data from API
function updateProductsUI(products) {
    const productsContainer = document.querySelector('.products-container');
    if (!productsContainer) return;

    if (products.length === 0) {
        productsContainer.innerHTML = `
            <div class="empty-products">
                <i class="fas fa-search"></i>
                <h3>No products found</h3>
                <p>We couldn't find any products matching your criteria.</p>
                <button class="btn reset-filter">Show All Products</button>
            </div>
        `;
        return;
    }

    productsContainer.innerHTML = '';

    products.forEach((product, index) => {
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
        if (product.tags && product.tags.length > 0) {
            const tag = product.tags[0];
            const tagClass = tag === 'new' ? 'tag-new' : (tag === 'sale' ? 'tag-sale' : '');
            const tagText = tag.charAt(0).toUpperCase() + tag.slice(1);
            tagHTML = `<span class="product-tag ${tagClass}">${tagText}</span>`;
        }

        // Check if product is in wishlist
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        const isInWishlist = wishlist.includes(product._id);
        const wishlistIconClass = isInWishlist ? 'fas fa-heart' : 'far fa-heart';
        const wishlistClass = isInWishlist ? 'in-wishlist' : '';

        const productElement = document.createElement('div');
        productElement.className = 'product';
        productElement.setAttribute('data-category', product.category.slug);
        if (product.tags && product.tags.length > 0) {
            productElement.setAttribute('data-tag', product.tags[0]);
        }

        productElement.innerHTML = `
            <div class="product-image">
                ${tagHTML}
                <img src="${product.images[0]}" alt="${product.name}">
                <div class="product-icons">
                    <a href="product-details.html?id=${product._id}" class="product-icon" title="Quick View">
                        <i class="fas fa-eye"></i>
                    </a>
                    <a href="#" class="product-icon add-to-wishlist ${wishlistClass}" title="${isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}" data-id="${product._id}">
                        <i class="${wishlistIconClass}"></i>
                    </a>
                    <a href="#" class="product-icon" title="Compare">
                        <i class="fas fa-exchange-alt"></i>
                    </a>
                </div>
            </div>
            <div class="product-details">
                <div class="product-category">${product.category.name}</div>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">
                    <span class="current-price">$${product.price.toFixed(2)}</span>
                    ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
                </div>
                <div class="product-rating">
                    <div class="rating-stars">${stars}</div>
                    <div class="rating-count">(${product.reviewCount || 0})</div>
                </div>
                <button class="add-to-cart" data-id="${product._id}">Add to Cart</button>
            </div>
        `;

        // Add staggered animation
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

        // Add event listener to the add to cart button
        productElement.querySelector('.add-to-cart').addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            addToCart(product);
        });
        
        // Add event listener to the wishlist button
        productElement.querySelector('.add-to-wishlist').addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.getAttribute('data-id');
            
            // Use the global toggleWishlistItem function if available
            if (typeof window.toggleWishlistItem === 'function') {
                window.toggleWishlistItem(productId, this);
            } else {
                console.error('Wishlist functionality not available');
            }
        });
    });
}

// Update categories UI with data from API
function updateCategoriesUI(categories) {
    const categoriesContainer = document.querySelector('.categories-container');
    if (!categoriesContainer) return;

    categoriesContainer.innerHTML = '';

    categories.forEach(category => {
        const categoryElement = document.createElement('div');
        categoryElement.className = 'category';
        categoryElement.innerHTML = `
            <img src="${category.image}" alt="${category.name}">
            <div class="category-info">
                <h3>${category.name}</h3>
                <a href="products.html?category=${category.slug}" class="btn-small">Shop Now</a>
            </div>
        `;

        categoriesContainer.appendChild(categoryElement);
    });
}

// Setup filter buttons
function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', async function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active class
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            try {
                let products;
                
                if (filter === 'all') {
                    products = await window.API.Product.getProducts({ limit: 8 });
                } else {
                    products = await window.API.Product.getProducts({ 
                        tag: filter,
                        limit: 8
                    });
                }
                
                updateProductsUI(products.data);
                showNotification(`Showing ${filter === 'all' ? 'all' : filter} products`, 'success');
            } catch (error) {
                console.error('Failed to filter products:', error);
                showNotification('Failed to filter products. Please try again later.', 'error');
            }
        });
    });
}

// Setup authentication forms
function setupAuthForms() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            try {
                const result = await window.API.Auth.login(email, password);
                
                // Save auth token and user data
                localStorage.setItem('token', result.token);
                localStorage.setItem('user', JSON.stringify(result.data));
                
                showNotification('Login successful!', 'success');
                
                // Redirect to appropriate page
                setTimeout(() => {
                    const redirectUrl = new URLSearchParams(window.location.search).get('redirect');
                    window.location.href = redirectUrl || 'index.html';
                }, 1500);
            } catch (error) {
                showNotification(error.message || 'Login failed. Please check your credentials.', 'error');
            }
        });
    }
    
    // Register form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            // Validate passwords match
            if (password !== confirmPassword) {
                showNotification('Passwords do not match!', 'error');
                return;
            }
            
            try {
                const result = await window.API.Auth.register({
                    name,
                    email,
                    password
                });
                
                // Save auth token and user data
                localStorage.setItem('token', result.token);
                localStorage.setItem('user', JSON.stringify(result.data));
                
                showNotification('Registration successful!', 'success');
                
                // Redirect to home page
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } catch (error) {
                showNotification(error.message || 'Registration failed. Please try again.', 'error');
            }
        });
    }
}

// Add to cart function
function addToCart(product) {
    // Get cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === product._id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product._id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            quantity: 1
        });
    }
    
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Create add to cart animation
    const addToCartButton = document.querySelector(`.add-to-cart[data-id="${product._id}"]`);
    if (addToCartButton) {
        const productContainer = addToCartButton.closest('.product');
        if (productContainer) {
            const productImage = productContainer.querySelector('img');
            if (productImage) {
                createAddToCartAnimation(productImage);
            }
        }
    }
    
    // Show notification
    showNotification(`${product.name} added to cart!`, 'success');
}

// Update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
        
        // Show/hide count based on items
        if (totalItems > 0) {
            cartCountElement.style.display = 'flex';
        } else {
            cartCountElement.style.display = 'none';
        }
    }
}

// Create add to cart animation
function createAddToCartAnimation(productImage) {
    if (!productImage) return;
    
    // Get cart icon position
    const cartIcon = document.querySelector('.cart-icon');
    if (!cartIcon) return;
    
    const cartIconRect = cartIcon.getBoundingClientRect();
    const productRect = productImage.getBoundingClientRect();
    
    // Create a new element for the animation
    const animatedProduct = document.createElement('div');
    animatedProduct.className = 'animated-product';
    animatedProduct.innerHTML = `<img src="${productImage.src}" alt="Product">`;
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

// Toggle wishlist item (add/remove)
function toggleWishlistItem(productId, button) {
    // Use the global toggleWishlistItem function if available
    if (typeof window.toggleWishlistItem === 'function') {
        window.toggleWishlistItem(productId, button);
        return;
    }
    
    // Fallback implementation if global function is not available
    // Get wishlist from localStorage
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
    // Convert productId to string for consistent comparison
    productId = productId.toString();
    
    // Check if product is already in wishlist
    const index = wishlist.findIndex(item => item.toString() === productId);
    
    if (index !== -1) {
        // Product is in wishlist, remove it
        wishlist.splice(index, 1);
        
        // Update button UI
        if (button) {
            button.classList.remove('in-wishlist');
            button.querySelector('i').classList.remove('fas');
            button.querySelector('i').classList.add('far');
            button.setAttribute('title', 'Add to Wishlist');
        }
        
        showNotification('Product removed from your wishlist', 'info');
    } else {
        // Product is not in wishlist, add it
        wishlist.push(productId);
        
        // Update button UI
        if (button) {
            button.classList.add('in-wishlist');
            button.querySelector('i').classList.remove('far');
            button.querySelector('i').classList.add('fas');
            button.setAttribute('title', 'Remove from Wishlist');
            
            // Create heart animation
            createHeartAnimation(button);
        }
        
        showNotification('Product added to your wishlist', 'success');
    }
    
    // Save updated wishlist
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    
    // Update wishlist count
    updateWishlistCount();
}

// Update wishlist count
function updateWishlistCount() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const wishlistCountElement = document.querySelector('.wishlist-count');
    
    if (wishlistCountElement) {
        wishlistCountElement.textContent = wishlist.length;
        
        // Show/hide count based on items
        if (wishlist.length > 0) {
            wishlistCountElement.style.display = 'flex';
        } else {
            wishlistCountElement.style.display = 'none';
        }
    }
}

// Create heart animation when adding to wishlist
function createHeartAnimation(button) {
    if (!button) return;
    
    // Get the position of the button
    const buttonRect = button.getBoundingClientRect();
    
    // Get the position of the wishlist icon in the header
    const wishlistIcon = document.querySelector('.wishlist-icon');
    if (!wishlistIcon) return;
    
    const iconRect = wishlistIcon.getBoundingClientRect();
    
    // Create a new element for the animation
    const animatedHeart = document.createElement('div');
    animatedHeart.className = 'animated-heart';
    animatedHeart.innerHTML = '<i class="fas fa-heart"></i>';
    document.body.appendChild(animatedHeart);
    
    // Style the animated heart
    const style = document.createElement('style');
    style.textContent = `
        .animated-heart {
            position: fixed;
            z-index: 9999;
            transition: all 0.8s cubic-bezier(0.25, 0.5, 0.5, 0.9);
            color: #FF5722;
            font-size: 24px;
            pointer-events: none;
        }
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
        .wishlist-icon-pulse {
            animation: pulse 0.5s ease-in-out;
        }
    `;
    document.head.appendChild(style);
    
    // Set initial position
    animatedHeart.style.top = `${buttonRect.top + window.scrollY}px`;
    animatedHeart.style.left = `${buttonRect.left + window.scrollX}px`;
    animatedHeart.style.opacity = '1';
    
    // Trigger animation
    setTimeout(() => {
        animatedHeart.style.top = `${iconRect.top + window.scrollY}px`;
        animatedHeart.style.left = `${iconRect.left + window.scrollX}px`;
        animatedHeart.style.opacity = '0.5';
        
        // Add pulse animation to wishlist icon
        wishlistIcon.classList.add('wishlist-icon-pulse');
        
        // Remove elements after animation completes
        setTimeout(() => {
            animatedHeart.remove();
            style.remove();
            
            // Remove pulse class from wishlist icon
            setTimeout(() => {
                wishlistIcon.classList.remove('wishlist-icon-pulse');
            }, 500);
        }, 800);
    }, 100);
}

// Setup checkout process
function setupCheckoutProcess() {
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Check if user is logged in
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = `login.html?redirect=${encodeURIComponent(window.location.href)}`;
                return;
            }
            
            // Get cart items from localStorage
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            
            if (cart.length === 0) {
                showNotification('Your cart is empty!', 'error');
                return;
            }
            
            try {
                // Create order data
                const orderItems = cart.map(item => ({
                    product: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    image: item.image
                }));
                
                // Calculate prices
                const itemsPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
                const taxPrice = itemsPrice * 0.15; // 15% tax
                const shippingPrice = itemsPrice > 100 ? 0 : 10; // Free shipping for orders over $100
                const totalPrice = itemsPrice + taxPrice + shippingPrice;
                
                // Get shipping address from form
                const shippingAddress = {
                    street: document.getElementById('street').value,
                    city: document.getElementById('city').value,
                    state: document.getElementById('state').value,
                    zipCode: document.getElementById('zip-code').value,
                    country: document.getElementById('country').value
                };
                
                // Get payment method
                const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
                
                // Create order
                const order = await window.API.Order.createOrder({
                    orderItems,
                    shippingAddress,
                    paymentMethod,
                    itemsPrice,
                    taxPrice,
                    shippingPrice,
                    totalPrice
                }, token);
                
                // Clear cart
                localStorage.removeItem('cart');
                
                // Show success message
                showNotification('Order placed successfully!', 'success');
                
                // Redirect to order confirmation page
                setTimeout(() => {
                    window.location.href = `order-confirmation.html?id=${order._id}`;
                }, 1500);
            } catch (error) {
                showNotification(error.message || 'Failed to place order. Please try again.', 'error');
            }
        });
    }
}

// Show notification
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