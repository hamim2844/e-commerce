// Order Confirmation Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Display order information
    displayOrderInfo();
    
    // Display featured products
    displayFeaturedProducts();
    
    // Setup event listeners
    setupEventListeners();
});

// Display order information
function displayOrderInfo() {
    // Get order data from localStorage
    const orderData = JSON.parse(localStorage.getItem('lastOrder'));
    
    if (!orderData) {
        // No order data found, redirect to home
        window.location.href = 'index.html';
        return;
    }
    
    // Update order information
    document.getElementById('order-id').textContent = orderData.orderId;
    document.getElementById('order-total').textContent = orderData.total;
    
    // Format and display date
    const orderDate = new Date(orderData.date);
    const formattedDate = orderDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('order-date').textContent = formattedDate;
    
    // Display payment method
    let paymentMethod = 'Cash on Delivery';
    
    switch (orderData.payment) {
        case 'bkash':
            paymentMethod = 'bKash';
            break;
        case 'nagad':
            paymentMethod = 'Nagad';
            break;
        case 'rocket':
            paymentMethod = 'Rocket';
            break;
    }
    
    document.getElementById('payment-method').textContent = paymentMethod;
    
    // Clear cart count
    const cartCount = document.querySelectorAll('.cart-count');
    cartCount.forEach(el => {
        el.textContent = '0';
    });
}

// Display featured products
function displayFeaturedProducts() {
    const featuredProductsContainer = document.getElementById('featured-products');
    
    if (featuredProductsContainer) {
        // Get random products for featured items section
        const shuffledProducts = [...products].sort(() => 0.5 - Math.random());
        const featuredProducts = shuffledProducts.slice(0, 4);
        
        featuredProducts.forEach(product => {
            const productElement = createProductElement(product);
            featuredProductsContainer.appendChild(productElement);
        });
    }
}

// Create product element
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

// Setup event listeners
function setupEventListeners() {
    const trackOrderBtn = document.getElementById('track-order-btn');
    
    if (trackOrderBtn) {
        trackOrderBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Order tracking is not available in this demo.');
        });
    }
} 