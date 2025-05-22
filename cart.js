// Cart Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart display
    updateCartDisplay();
    
    // Set up event listeners
    setupEventListeners();
    
    // Display related products
    displayRelatedProducts();
});

// Update cart display
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartCount = document.querySelectorAll('.cart-count');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartShipping = document.getElementById('cart-shipping');
    const cartTax = document.getElementById('cart-tax');
    const cartTotal = document.getElementById('cart-total');
    
    // Get cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Clear current items
    cartItemsContainer.innerHTML = '';
    
    // Set cart count
    const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.forEach(el => {
        el.textContent = totalQuantity;
    });
    
    if (cart.length === 0) {
        // Show empty cart message
        cartItemsContainer.innerHTML = `
            <tr class="empty-cart-row">
                <td colspan="5">
                    <div class="empty-cart">
                        <i class="fas fa-shopping-cart"></i>
                        <p>Your cart is empty</p>
                        <a href="products.html" class="btn">Start Shopping</a>
                    </div>
                </td>
            </tr>
        `;
        
        // Zero out totals
        cartSubtotal.textContent = '$0.00';
        cartShipping.textContent = '$0.00';
        cartTax.textContent = '$0.00';
        cartTotal.textContent = '$0.00';
    } else {
        // Add each item to the cart
        cart.forEach(item => {
            const itemSubtotal = (item.price * item.quantity).toFixed(2);
            const cartItem = document.createElement('tr');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <td class="product-col">
                    <div class="product-info">
                        <img src="${item.image}" alt="${item.name}">
                        <div>
                            <h4>${item.name}</h4>
                            <p class="product-category">${item.category}</p>
                        </div>
                    </div>
                </td>
                <td class="price-col">$${item.price.toFixed(2)}</td>
                <td class="quantity-col">
                    <div class="quantity-controls">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                </td>
                <td class="subtotal-col">$${itemSubtotal}</td>
                <td class="remove-col">
                    <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                </td>
            `;
            
            cartItemsContainer.appendChild(cartItem);
        });
        
        // Calculate totals
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const shipping = subtotal > 0 ? (subtotal > 100 ? 0 : 10) : 0;
        const tax = subtotal * 0.07; // 7% tax rate
        const total = subtotal + shipping + tax;
        
        // Update totals display
        cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        cartShipping.textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
        cartTax.textContent = `$${tax.toFixed(2)}`;
        cartTotal.textContent = `$${total.toFixed(2)}`;
    }
}

// Set up event listeners for cart page
function setupEventListeners() {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const continueShoppingBtn = document.getElementById('continue-shopping');
    const updateCartBtn = document.getElementById('update-cart');
    const checkoutBtn = document.querySelector('.checkout-btn');
    
    // Continue shopping button
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', function() {
            window.location.href = 'products.html';
        });
    }
    
    // Update cart button
    if (updateCartBtn) {
        updateCartBtn.addEventListener('click', function() {
            updateCartFromInputs();
            showNotification('Cart updated!');
        });
    }
    
    // Checkout button
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                showNotification('Your cart is empty!');
            } else {
                window.location.href = 'checkout.html';
            }
        });
    }
    
    // Setup delegation for cart item controls
    document.addEventListener('click', function(e) {
        // Quantity decrease button
        if (e.target.classList.contains('minus')) {
            const id = parseInt(e.target.getAttribute('data-id'));
            updateItemQuantity(id, -1);
            updateCartDisplay();
        }
        
        // Quantity increase button
        if (e.target.classList.contains('plus')) {
            const id = parseInt(e.target.getAttribute('data-id'));
            updateItemQuantity(id, 1);
            updateCartDisplay();
        }
        
        // Remove item button
        if (e.target.classList.contains('remove-item') || 
            (e.target.parentElement && e.target.parentElement.classList.contains('remove-item'))) {
            const btn = e.target.classList.contains('remove-item') ? e.target : e.target.parentElement;
            const id = parseInt(btn.getAttribute('data-id'));
            removeFromCart(id);
            updateCartDisplay();
            showNotification('Item removed from cart!');
        }
    });
    
    // Setup input change events
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('quantity-input')) {
            const id = parseInt(e.target.getAttribute('data-id'));
            const quantity = parseInt(e.target.value);
            
            if (quantity > 0) {
                setItemQuantity(id, quantity);
                updateCartDisplay();
            } else {
                e.target.value = 1;
                setItemQuantity(id, 1);
                updateCartDisplay();
            }
        }
    });
}

// Update cart based on input values
function updateCartFromInputs() {
    const quantityInputs = document.querySelectorAll('.quantity-input');
    
    quantityInputs.forEach(input => {
        const id = parseInt(input.getAttribute('data-id'));
        const quantity = parseInt(input.value);
        
        if (quantity > 0) {
            setItemQuantity(id, quantity);
        } else {
            input.value = 1;
            setItemQuantity(id, 1);
        }
    });
    
    updateCartDisplay();
}

// Helper functions to modify cart
function updateItemQuantity(id, change) {
    // Get cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(item => item.id === id);
    
    if (item) {
        // Ensure we only add/remove one item at a time
        item.quantity = change > 0 ? item.quantity + 1 : item.quantity - 1;
        
        if (item.quantity <= 0) {
            // Remove item if quantity is zero or negative
            removeFromCart(id);
        } else {
            // Save updated cart
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }
}

function setItemQuantity(id, quantity) {
    // Get cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(item => item.id === id);
    
    if (item) {
        item.quantity = quantity;
        // Save updated cart
        localStorage.setItem('cart', JSON.stringify(cart));
    }
}

function removeFromCart(id) {
    // Get cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    // Filter out the item to remove
    cart = cart.filter(item => item.id !== id);
    // Save updated cart
    localStorage.setItem('cart', JSON.stringify(cart));
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

// Display related products
function displayRelatedProducts() {
    const relatedProductsContainer = document.querySelector('.related-products-container');
    
    if (relatedProductsContainer) {
        // Get random products for related items section
        const shuffledProducts = [...products].sort(() => 0.5 - Math.random());
        const relatedProducts = shuffledProducts.slice(0, 4);
        
        relatedProducts.forEach(product => {
            const productElement = createRelatedProductElement(product);
            relatedProductsContainer.appendChild(productElement);
        });
    }
}

// Create related product element
function createRelatedProductElement(product) {
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
    
    productDiv.innerHTML = `
        <div class="product-image">
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
        addToCart(product);
    });
    
    return productDiv;
}

// Add to cart function for related products
function addToCart(product) {
    // Get cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
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
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart display
    updateCartDisplay();
    
    // Create fly to cart animation
    createAddToCartAnimation(product);
    
    // Show notification
    showNotification(`${product.name} added to cart!`);
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