// Checkout Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize checkout display
    updateOrderSummary();
    
    // Set up payment method toggles
    setupPaymentMethods();
    
    // Set up form submission
    setupFormSubmission();
});

// Update order summary
function updateOrderSummary() {
    const orderItemsContainer = document.getElementById('order-items');
    const checkoutSubtotal = document.getElementById('checkout-subtotal');
    const checkoutShipping = document.getElementById('checkout-shipping');
    const checkoutTax = document.getElementById('checkout-tax');
    const checkoutTotal = document.getElementById('checkout-total');
    
    // Get cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Update cart count
    const cartCount = document.querySelectorAll('.cart-count');
    const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.forEach(el => {
        el.textContent = totalQuantity;
    });
    
    // Clear order items
    orderItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        // Show empty cart message
        orderItemsContainer.innerHTML = `
            <div class="empty-order">
                <p>Your cart is empty. <a href="products.html">Continue shopping</a>.</p>
            </div>
        `;
        
        // Zero out totals
        checkoutSubtotal.textContent = '$0.00';
        checkoutShipping.textContent = '$0.00';
        checkoutTax.textContent = '$0.00';
        checkoutTotal.textContent = '$0.00';
    } else {
        // Add each item to the order summary
        cart.forEach(item => {
            const itemSubtotal = (item.price * item.quantity).toFixed(2);
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            orderItem.innerHTML = `
                <div class="order-item-info">
                    <div class="order-item-details">
                        <h4>${item.name}</h4>
                        <p>Qty: ${item.quantity}</p>
                    </div>
                </div>
                <div class="order-item-price">$${itemSubtotal}</div>
            `;
            
            orderItemsContainer.appendChild(orderItem);
        });
        
        // Calculate totals
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const shipping = subtotal > 0 ? (subtotal > 100 ? 0 : 10) : 0;
        const tax = subtotal * 0.07; // 7% tax rate
        const total = subtotal + shipping + tax;
        
        // Update totals display
        checkoutSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        checkoutShipping.textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
        checkoutTax.textContent = `$${tax.toFixed(2)}`;
        checkoutTotal.textContent = `$${total.toFixed(2)}`;
    }
}

// Set up payment method toggles
function setupPaymentMethods() {
    const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
    
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            // Hide all payment details first
            document.querySelectorAll('.payment-details').forEach(details => {
                details.style.display = 'none';
            });
            
            // Show selected payment details if any
            const paymentId = this.id;
            const detailsId = paymentId.replace('payment-', '') + '-details';
            const details = document.getElementById(detailsId);
            
            if (details) {
                details.style.display = 'block';
            }
        });
    });
}

// Form submission
function setupFormSubmission() {
    const placeOrderBtn = document.getElementById('place-order-btn');
    const billingForm = document.getElementById('billing-form');
    
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Check if cart is empty
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            if (cart.length === 0) {
                showNotification('Your cart is empty!');
                return;
            }
            
            // Check if terms are accepted
            const termsCheckbox = document.getElementById('terms');
            if (!termsCheckbox.checked) {
                showNotification('Please accept the terms and conditions');
                return;
            }
            
            // Check if form is valid
            const formInputs = billingForm.querySelectorAll('input[required], select[required]');
            let isValid = true;
            
            formInputs.forEach(input => {
                if (!input.value.trim()) {
                    input.classList.add('error');
                    isValid = false;
                } else {
                    input.classList.remove('error');
                }
            });
            
            if (!isValid) {
                showNotification('Please fill in all required fields');
                return;
            }
            
            // Check selected payment method
            const selectedPayment = document.querySelector('input[name="payment-method"]:checked').value;
            
            // Validate payment details based on selected method
            if (selectedPayment === 'bkash') {
                const bkashNumber = document.getElementById('bkash-number').value;
                const bkashTrxId = document.getElementById('bkash-trxid').value;
                
                if (!bkashNumber || !bkashTrxId) {
                    showNotification('Please enter bKash payment details');
                    return;
                }
            } else if (selectedPayment === 'nagad') {
                const nagadNumber = document.getElementById('nagad-number').value;
                const nagadTrxId = document.getElementById('nagad-trxid').value;
                
                if (!nagadNumber || !nagadTrxId) {
                    showNotification('Please enter Nagad payment details');
                    return;
                }
            } else if (selectedPayment === 'rocket') {
                const rocketNumber = document.getElementById('rocket-number').value;
                const rocketTrxId = document.getElementById('rocket-trxid').value;
                
                if (!rocketNumber || !rocketTrxId) {
                    showNotification('Please enter Rocket payment details');
                    return;
                }
            }
            
            // Process the order (in a real system, this would send data to the server)
            const orderData = {
                items: cart,
                subtotal: document.getElementById('checkout-subtotal').textContent,
                shipping: document.getElementById('checkout-shipping').textContent,
                tax: document.getElementById('checkout-tax').textContent,
                total: document.getElementById('checkout-total').textContent,
                payment: selectedPayment,
                date: new Date().toISOString(),
                orderId: generateOrderId()
            };
            
            // Save order in localStorage (for demo purposes)
            localStorage.setItem('lastOrder', JSON.stringify(orderData));
            
            // Clear the cart
            localStorage.setItem('cart', JSON.stringify([]));
            
            // Redirect to order confirmation page
            window.location.href = 'order-confirmation.html';
        });
    }
}

// Generate random order ID
function generateOrderId() {
    const timestamp = new Date().getTime().toString().slice(-6);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ORD-${timestamp}-${random}`;
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