// Login Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Toggle between login and signup forms
    setupFormToggle();
    
    // Toggle password visibility
    setupPasswordToggle();
    
    // Setup form submissions
    setupFormSubmissions();
});

// Setup form toggle functionality
function setupFormToggle() {
    const loginToggle = document.getElementById('login-toggle');
    const signupToggle = document.getElementById('signup-toggle');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    
    if (loginToggle && signupToggle) {
        loginToggle.addEventListener('click', function() {
            loginToggle.classList.add('active');
            signupToggle.classList.remove('active');
            loginForm.classList.add('active');
            signupForm.classList.remove('active');
        });
        
        signupToggle.addEventListener('click', function() {
            signupToggle.classList.add('active');
            loginToggle.classList.remove('active');
            signupForm.classList.add('active');
            loginForm.classList.remove('active');
        });
    }
}

// Toggle password visibility
function setupPasswordToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const passwordField = this.closest('.password-field').querySelector('input');
            const type = passwordField.getAttribute('type');
            
            if (type === 'password') {
                passwordField.setAttribute('type', 'text');
                this.innerHTML = '<i class="fas fa-eye-slash"></i>';
            } else {
                passwordField.setAttribute('type', 'password');
                this.innerHTML = '<i class="fas fa-eye"></i>';
            }
        });
    });
}

// Setup form submissions
function setupFormSubmissions() {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    
    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            if (!email || !password) {
                showNotification('Please fill in all required fields');
                return;
            }
            
            // For demo purposes, we'll just simulate a successful login
            // In a real application, you would send these credentials to your server
            
            // Save login state to localStorage
            const user = {
                email: email,
                name: email.split('@')[0], // Just use the part before @ as name for demo
                isLoggedIn: true
            };
            
            localStorage.setItem('user', JSON.stringify(user));
            
            showNotification('Login successful!');
            
            // Redirect to home page after a short delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        });
    }
    
    // Signup form submission
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fullname = document.getElementById('fullname').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const agreeTerms = document.getElementById('agree-terms').checked;
            
            if (!fullname || !email || !password || !confirmPassword) {
                showNotification('Please fill in all required fields');
                return;
            }
            
            if (password !== confirmPassword) {
                showNotification('Passwords do not match');
                return;
            }
            
            if (!agreeTerms) {
                showNotification('Please agree to the Terms & Conditions');
                return;
            }
            
            // For demo purposes, we'll just simulate a successful registration
            // In a real application, you would send these credentials to your server
            
            // Save user to localStorage
            const user = {
                name: fullname,
                email: email,
                isLoggedIn: true
            };
            
            localStorage.setItem('user', JSON.stringify(user));
            
            showNotification('Account created successfully!');
            
            // Redirect to home page after a short delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        });
    }
    
    // Social login buttons
    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons.forEach(button => {
        button.addEventListener('click', function() {
            showNotification('Social login is not available in this demo');
        });
    });
    
    // Forgot password link
    const forgotPasswordLink = document.querySelector('.forgot-password');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Password reset functionality is not available in this demo');
        });
    }
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