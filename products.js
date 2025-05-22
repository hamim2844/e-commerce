// Products Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize products with all items
    displayProducts('all');
    
    // Set up sorting functionality
    setupSortingFunctionality();
    
    // Set up price range filter
    setupPriceRangeFilter();
});

// Display products based on filter and sort options
function displayProducts(filter = 'all', sortOption = 'default') {
    const productsContainer = document.querySelector('.products-container');
    productsContainer.innerHTML = '';
    
    // Get filtered products (reusing data from script.js)
    let filteredProducts = products;
    
    if (filter !== 'all') {
        filteredProducts = products.filter(product => product.tag === filter);
    }
    
    // Apply sorting
    sortProducts(filteredProducts, sortOption);
    
    // Create product elements and add to container
    filteredProducts.forEach(product => {
        const productElement = createProductElement(product);
        productsContainer.appendChild(productElement);
    });
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-filter') === filter) {
            btn.classList.add('active');
        }
    });
}

// Sort products based on selected option
function sortProducts(productsArray, sortOption) {
    switch(sortOption) {
        case 'price-low':
            productsArray.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            productsArray.sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            productsArray.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            productsArray.sort((a, b) => b.name.localeCompare(a.name));
            break;
        default:
            // Default sorting - no change or by ID
            productsArray.sort((a, b) => a.id - b.id);
    }
}

// Set up sorting functionality
function setupSortingFunctionality() {
    const sortSelect = document.getElementById('sort-select');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            // Get current filter
            const currentFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';
            
            // Display products with new sort option
            displayProducts(currentFilter, this.value);
        });
    }
    
    // Set up filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            const sortOption = document.getElementById('sort-select').value;
            displayProducts(filter, sortOption);
        });
    });
}

// Set up price range filter
function setupPriceRangeFilter() {
    const priceRange = document.getElementById('price-range');
    const minPrice = document.getElementById('min-price');
    const maxPrice = document.getElementById('max-price');
    const filterBtn = document.querySelector('.price-range .btn');
    
    if (priceRange && minPrice && maxPrice) {
        // Update displayed max price when slider changes
        priceRange.addEventListener('input', function() {
            maxPrice.textContent = `$${this.value}`;
        });
        
        // Apply price filter when button is clicked
        if (filterBtn) {
            filterBtn.addEventListener('click', function() {
                const maxPriceValue = parseInt(priceRange.value);
                
                // Get current filter and sort
                const currentFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';
                const sortOption = document.getElementById('sort-select').value;
                
                // Apply price filter to products
                const productsContainer = document.querySelector('.products-container');
                productsContainer.innerHTML = '';
                
                // Get filtered products first by category
                let filteredProducts = products;
                
                if (currentFilter !== 'all') {
                    filteredProducts = products.filter(product => product.tag === currentFilter);
                }
                
                // Then filter by price
                filteredProducts = filteredProducts.filter(product => product.price <= maxPriceValue);
                
                // Apply sorting
                sortProducts(filteredProducts, sortOption);
                
                // Display filtered products
                if (filteredProducts.length === 0) {
                    productsContainer.innerHTML = `
                        <div class="no-products">
                            <p>No products found matching your criteria.</p>
                            <button class="btn reset-filter">Reset Filters</button>
                        </div>
                    `;
                    
                    // Add reset button functionality
                    document.querySelector('.reset-filter').addEventListener('click', function() {
                        priceRange.value = 1000;
                        maxPrice.textContent = '$1000';
                        displayProducts(currentFilter, sortOption);
                    });
                } else {
                    filteredProducts.forEach(product => {
                        const productElement = createProductElement(product);
                        productsContainer.appendChild(productElement);
                    });
                }
                
                // Show notification
                showNotification(`Showing products under $${maxPriceValue}`);
            });
        }
    }
}

// Create product element (modified version from script.js)
function createProductElement(product) {
    const productDiv = document.createElement('div');
    productDiv.className = 'product';
    
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
    
    productDiv.innerHTML = `
        <div class="product-image">
            ${tagHTML}
            <img src="${product.image}" alt="${product.name}">
            <div class="product-icons">
                <a href="#" class="product-icon" title="Quick View"><i class="fas fa-eye"></i></a>
                <a href="#" class="product-icon" title="Add to Wishlist"><i class="fas fa-heart"></i></a>
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
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
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
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart count
        updateCartCount();
        
        // Create fly to cart animation
        createAddToCartAnimation(product);
        
        // Show notification
        showNotification(`${product.name} added to cart!`);
    });
    
    return productDiv;
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

// Update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
        element.textContent = totalQuantity;
    });
}

// Show notification
function showNotification(message) {
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
    notification.className = 'notification';
    notification.innerHTML = `
        <p>${message}</p>
        <button class="close-notification"><i class="fas fa-times"></i></button>
    `;
    
    // Add notification styles if they don't already exist
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
            }
            .notification {
                background-color: var(--primary-color);
                color: white;
                padding: 15px 20px;
                margin-bottom: 10px;
                border-radius: 4px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                display: flex;
                justify-content: space-between;
                align-items: center;
                min-width: 300px;
                animation: slideIn 0.3s ease forwards;
            }
            .notification.fade-out {
                animation: slideOut 0.3s ease forwards;
            }
            .close-notification {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                font-size: 16px;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
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