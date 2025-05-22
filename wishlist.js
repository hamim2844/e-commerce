// Wishlist functionality for Hemels Style

// Initialize wishlist on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize localStorage if wishlist doesn't exist
    if (localStorage.getItem('wishlist') === null) {
        localStorage.setItem('wishlist', JSON.stringify([]));
    }
    
    // Setup wishlist functionality
    setupWishlistEventListeners();
    
    // Initialize wishlist UI if on wishlist page
    if (window.location.pathname.includes('wishlist.html')) {
        loadWishlistItems();
    }
    
    // Update wishlist icon count
    updateWishlistCount();
    
    // Initialize all product cards with wishlist status
    initializeProductWishlistStatus();
});

// Setup wishlist event listeners
function setupWishlistEventListeners() {
    // Add event listeners to "Add to Wishlist" buttons if they exist
    document.querySelectorAll('.add-to-wishlist').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const productId = this.getAttribute('data-id');
            toggleWishlistItem(productId, this);
        });
    });
    
    // Add event listeners for the wishlist icon in the header
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
    
    // Initialize wishlist button states
    document.querySelectorAll('.add-to-wishlist').forEach(button => {
        const productId = button.getAttribute('data-id');
        if (productId) {
            updateWishlistButtonUI(productId, button);
        }
    });
}

// Toggle wishlist item (add/remove)
function toggleWishlistItem(productId, button) {
    // Get wishlist from localStorage
    let wishlist = getWishlist();
    
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
    saveWishlist(wishlist);
    
    // Update wishlist count
    updateWishlistCount();
    
    // If on wishlist page, refresh the display
    if (window.location.pathname.includes('wishlist.html')) {
        loadWishlistItems();
    }
    
    // Log the current wishlist for debugging
    console.log('Current wishlist:', getWishlist());
}

// Get wishlist from localStorage
function getWishlist() {
    return JSON.parse(localStorage.getItem('wishlist') || '[]');
}

// Save wishlist to localStorage
function saveWishlist(wishlist) {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// Check if product is in wishlist
function isInWishlist(productId) {
    const wishlist = getWishlist();
    // Convert productId to string for consistent comparison
    return wishlist.some(item => item.toString() === productId.toString());
}

// Update wishlist count
function updateWishlistCount() {
    const wishlist = getWishlist();
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

// Update wishlist button UI
function updateWishlistButtonUI(productId, button) {
    if (isInWishlist(productId)) {
        button.querySelector('i').classList.remove('far');
        button.querySelector('i').classList.add('fas');
        button.classList.add('in-wishlist');
    } else {
        button.querySelector('i').classList.remove('fas');
        button.querySelector('i').classList.add('far');
        button.classList.remove('in-wishlist');
    }
}

// Load wishlist items on the wishlist page
function loadWishlistItems() {
    const wishlistContainer = document.querySelector('.wishlist-products');
    if (!wishlistContainer) return;
    
    // Get wishlist from localStorage
    const wishlist = getWishlist();
    
    // Show empty state if wishlist is empty
    if (wishlist.length === 0) {
        wishlistContainer.innerHTML = `
            <div class="empty-wishlist">
                <i class="far fa-heart"></i>
                <h2>Your wishlist is empty</h2>
                <p>Add items you like to your wishlist so you can easily find them later.</p>
                <a href="products.html" class="btn">Continue Shopping</a>
            </div>
        `;
        return;
    }
    
    // Show loading state
    wishlistContainer.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading your wishlist...</p>
        </div>
    `;
    
    try {
        // Use the sample products data from script.js instead of fetching from API
        const sampleProducts = window.products || [];
        
        if (sampleProducts.length === 0) {
            // Fallback to fetch from API if sample products not available
            fetchWishlistItemsFromAPI(wishlist, wishlistContainer);
            return;
        }
        
        // Filter products that are in the wishlist
        const wishlistProducts = sampleProducts.filter(product => 
            wishlist.some(id => id.toString() === product.id.toString())
        );
        
        // Clear loading state
        wishlistContainer.innerHTML = '';
        
        if (wishlistProducts.length === 0) {
            wishlistContainer.innerHTML = `
                <div class="empty-wishlist">
                    <i class="far fa-heart"></i>
                    <h2>Your wishlist is empty</h2>
                    <p>Add items you like to your wishlist so you can easily find them later.</p>
                    <a href="products.html" class="btn">Continue Shopping</a>
                </div>
            `;
            return;
        }
        
        // Create elements for each product
        wishlistProducts.forEach(product => {
            if (!product) return; // Skip if product not found
            
            const productElement = createWishlistProductElement(product);
            wishlistContainer.appendChild(productElement);
        });
    } catch (error) {
        console.error('Error loading wishlist items:', error);
        wishlistContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <h2>Oops! Something went wrong</h2>
                <p>We couldn't load your wishlist items. Please try again later.</p>
                <button class="btn" onclick="loadWishlistItems()">Try Again</button>
            </div>
        `;
    }
}

// Fallback function to fetch wishlist items from API
async function fetchWishlistItemsFromAPI(wishlist, container) {
    try {
        // Check if API client is available
        if (window.API && window.API.Product && window.API.Product.getProduct) {
            // Fetch each product in the wishlist
            const productPromises = wishlist.map(productId => 
                window.API.Product.getProduct(productId)
                    .catch(err => {
                        console.error(`Failed to fetch product ${productId}:`, err);
                        return null;
                    })
            );
            
            // Wait for all products to be fetched
            const products = await Promise.all(productPromises);
            const validProducts = products.filter(p => p !== null);
            
            // Clear loading state
            container.innerHTML = '';
            
            if (validProducts.length === 0) {
                container.innerHTML = `
                    <div class="empty-wishlist">
                        <i class="far fa-heart"></i>
                        <h2>Your wishlist is empty</h2>
                        <p>Add items you like to your wishlist so you can easily find them later.</p>
                        <a href="products.html" class="btn">Continue Shopping</a>
                    </div>
                `;
                return;
            }
            
            // Create elements for each product
            validProducts.forEach(product => {
                if (!product) return; // Skip if product not found
                
                const productElement = createWishlistProductElement(product);
                container.appendChild(productElement);
            });
        } else {
            throw new Error('API client not available');
        }
    } catch (error) {
        console.error('Error fetching from API:', error);
        container.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <h2>Oops! Something went wrong</h2>
                <p>We couldn't load your wishlist items. Please try again later.</p>
                <button class="btn" onclick="loadWishlistItems()">Try Again</button>
            </div>
        `;
    }
}

// Create product element for wishlist page
function createWishlistProductElement(product) {
    const productDiv = document.createElement('div');
    productDiv.className = 'wishlist-item';
    productDiv.setAttribute('data-id', product.id);
    
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
    
    // Adjust for different API response formats
    const productName = product.name;
    const productCategory = product.category?.name || product.category || 'Unknown';
    const productPrice = product.price;
    const productOldPrice = product.oldPrice;
    const productImage = product.images?.[0] || product.image;
    const productId = product.id || product._id;
    const reviewCount = product.reviews || product.reviewCount || 0;
    
    productDiv.innerHTML = `
        <div class="wishlist-item-image">
            <img src="${productImage}" alt="${productName}">
        </div>
        <div class="wishlist-item-info">
            <h3>${productName}</h3>
            <div class="product-category">${productCategory}</div>
            <div class="product-rating">
                <div class="rating-stars">${stars}</div>
                <span>(${reviewCount})</span>
            </div>
            <div class="product-price">
                <span class="current-price">$${productPrice.toFixed(2)}</span>
                ${productOldPrice ? `<span class="old-price">$${productOldPrice.toFixed(2)}</span>` : ''}
            </div>
        </div>
        <div class="wishlist-item-actions">
            <button class="btn add-to-cart" data-id="${productId}">Add to Cart</button>
            <button class="btn remove-from-wishlist" data-id="${productId}">
                <i class="fas fa-trash"></i> Remove
            </button>
        </div>
    `;
    
    // Add event listeners
    productDiv.querySelector('.add-to-cart').addEventListener('click', function() {
        // If integration.js has addToCart function, use it
        if (typeof window.addToCart === 'function') {
            window.addToCart(product);
        } else {
            // Fallback implementation
            console.log('Adding to cart:', productName);
            showNotification(`${productName} added to cart!`, 'success');
        }
    });
    
    productDiv.querySelector('.remove-from-wishlist').addEventListener('click', function() {
        const productId = this.getAttribute('data-id');
        toggleWishlistItem(productId);
        
        // Remove the item from the UI with animation
        productDiv.classList.add('removing');
        setTimeout(() => {
            productDiv.remove();
            
            // Check if wishlist is now empty and show empty state if needed
            const wishlistContainer = document.querySelector('.wishlist-products');
            if (wishlistContainer && wishlistContainer.children.length === 0) {
                wishlistContainer.innerHTML = `
                    <div class="empty-wishlist">
                        <i class="far fa-heart"></i>
                        <h2>Your wishlist is empty</h2>
                        <p>Add items you like to your wishlist so you can easily find them later.</p>
                        <a href="products.html" class="btn">Continue Shopping</a>
                    </div>
                `;
            }
        }, 300);
    });
    
    return productDiv;
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
            
            // Remove pulse class from wishlist icon
            setTimeout(() => {
                wishlistIcon.classList.remove('wishlist-icon-pulse');
            }, 500);
        }, 800);
    }, 100);
}

// Function to show notification - use the global one from script.js
function showNotification(message, type = 'success') {
    // Use the global showNotification if available
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
    } else {
        // Fallback implementation
        console.log(`${type}: ${message}`);
    }
}

// Export functions globally for use in other files
window.toggleWishlistItem = toggleWishlistItem;
window.getWishlist = getWishlist;
window.updateWishlistCount = updateWishlistCount;
window.isInWishlist = isInWishlist;

// Initialize wishlist status for all product cards
function initializeProductWishlistStatus() {
    // Find all wishlist buttons
    document.querySelectorAll('.add-to-wishlist').forEach(button => {
        const productId = button.getAttribute('data-id');
        if (productId) {
            updateWishlistButtonUI(productId, button);
        }
    });
} 