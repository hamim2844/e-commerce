// Collection Pages JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Determine which collection page we're on
    const menProductsContainer = document.getElementById('men-products');
    const womenProductsContainer = document.getElementById('women-products');
    const electronicsProductsContainer = document.getElementById('electronics-products');
    
    // Initialize appropriate collection
    if (menProductsContainer) {
        displayMenCollection();
        animateCollectionHero();
    } else if (womenProductsContainer) {
        displayWomenCollection();
        animateCollectionHero();
    } else if (electronicsProductsContainer) {
        displayElectronicsCollection();
        animateCollectionHero();
    }
    
    // Set up filter functionality for collection pages
    setupCollectionFilters();
    
    // Set up price range filter
    setupPriceRangeFilter();
    
    // Setup advanced animation for collection hero
    function animateCollectionHero() {
        const heroText = document.querySelector('.collection-hero-text');
        const heroImage = document.querySelector('.collection-hero-image');
        
        if (heroText && heroImage) {
            // Add animation classes
            heroText.classList.add('animated', 'fadeInLeft');
            heroImage.classList.add('animated', 'fadeInRight');
            
            // Add animation styles if not already in CSS
            const style = document.createElement('style');
            style.textContent = `
                .animated {
                    animation-duration: 1s;
                    animation-fill-mode: both;
                }
                .fadeInLeft {
                    animation-name: fadeInLeft;
                }
                .fadeInRight {
                    animation-name: fadeInRight;
                }
                @keyframes fadeInLeft {
                    from {
                        opacity: 0;
                        transform: translate3d(-50px, 0, 0);
                    }
                    to {
                        opacity: 1;
                        transform: translate3d(0, 0, 0);
                    }
                }
                @keyframes fadeInRight {
                    from {
                        opacity: 0;
                        transform: translate3d(50px, 0, 0);
                    }
                    to {
                        opacity: 1;
                        transform: translate3d(0, 0, 0);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
});

// Display men's collection products
function displayMenCollection(filter = 'all', sortOption = 'default') {
    const productsContainer = document.getElementById('men-products');
    if (!productsContainer) return;
    
    // Show loading indicator
    showLoadingIndicator(productsContainer);
    
    // Filter men's products from the main products array
    let menProducts = products.filter(product => 
        product.category === 'Fashion' || 
        product.category === 'Accessories' || 
        product.id === 2 || product.id === 4 || product.id === 8
    );
    
    // Apply additional filter if specified
    if (filter !== 'all') {
        switch(filter) {
            case 'clothing':
                menProducts = menProducts.filter(p => p.category === 'Fashion');
                break;
            case 'shoes':
                menProducts = menProducts.filter(p => p.name.toLowerCase().includes('shoe'));
                break;
            case 'accessories':
                menProducts = menProducts.filter(p => p.category === 'Accessories');
                break;
        }
    }
    
    // Apply sorting
    sortProducts(menProducts, sortOption);
    
    // Add a small delay to show the loading effect
    setTimeout(() => {
        // Clear loading indicator
        productsContainer.innerHTML = '';
        
        // Create product elements and add to container with staggered animation
        if (menProducts.length === 0) {
            showEmptyState(productsContainer);
        } else {
            menProducts.forEach((product, index) => {
                const productElement = createProductElement(product);
                productElement.style.opacity = "0";
                productElement.style.transform = "translateY(20px)";
                productsContainer.appendChild(productElement);
                
                // Staggered animation with delay
                setTimeout(() => {
                    productElement.style.transition = "opacity 0.5s ease, transform 0.5s ease";
                    productElement.style.opacity = "1";
                    productElement.style.transform = "translateY(0)";
                }, index * 100);
            });
        }
        
        // Update active filter button
        updateActiveFilterButton(filter);
        
        // Show filter feedback
        if (filter !== 'all') {
            showFilterNotification(filter, menProducts.length);
        }
    }, 500);
}

// Display women's collection products
function displayWomenCollection(filter = 'all', sortOption = 'default') {
    const productsContainer = document.getElementById('women-products');
    if (!productsContainer) return;
    
    // Show loading indicator
    showLoadingIndicator(productsContainer);
    
    // Filter women's products from the main products array
    let womenProducts = products.filter(product => 
        product.category === 'Fashion' || 
        product.category === 'Beauty' ||
        product.category === 'Accessories' ||
        product.id === 6
    );
    
    // Apply additional filter if specified
    if (filter !== 'all') {
        switch(filter) {
            case 'clothing':
                womenProducts = womenProducts.filter(p => p.category === 'Fashion');
                break;
            case 'beauty':
                womenProducts = womenProducts.filter(p => p.category === 'Beauty');
                break;
            case 'accessories':
                womenProducts = womenProducts.filter(p => p.category === 'Accessories');
                break;
        }
    }
    
    // Apply sorting
    sortProducts(womenProducts, sortOption);
    
    // Add a small delay to show the loading effect
    setTimeout(() => {
        // Clear loading indicator
        productsContainer.innerHTML = '';
        
        // Create product elements and add to container with staggered animation
        if (womenProducts.length === 0) {
            showEmptyState(productsContainer);
        } else {
            womenProducts.forEach((product, index) => {
                const productElement = createProductElement(product);
                productElement.style.opacity = "0";
                productElement.style.transform = "translateY(20px)";
                productsContainer.appendChild(productElement);
                
                // Staggered animation with delay
                setTimeout(() => {
                    productElement.style.transition = "opacity 0.5s ease, transform 0.5s ease";
                    productElement.style.opacity = "1";
                    productElement.style.transform = "translateY(0)";
                }, index * 100);
            });
        }
        
        // Update active filter button
        updateActiveFilterButton(filter);
        
        // Show filter feedback
        if (filter !== 'all') {
            showFilterNotification(filter, womenProducts.length);
        }
    }, 500);
}

// Display electronics collection products
function displayElectronicsCollection(filter = 'all', sortOption = 'default') {
    const productsContainer = document.getElementById('electronics-products');
    if (!productsContainer) return;
    
    // Show loading indicator
    showLoadingIndicator(productsContainer);
    
    // Filter electronics products from the main products array
    let electronicsProducts = products.filter(product => 
        product.category === 'Electronics' ||
        product.id === 1 || product.id === 3 || product.id === 5 || product.id === 8
    );
    
    // Apply additional filter if specified
    if (filter !== 'all') {
        switch(filter) {
            case 'audio':
                electronicsProducts = electronicsProducts.filter(p => 
                    p.name.toLowerCase().includes('headphone') || 
                    p.name.toLowerCase().includes('speaker')
                );
                break;
            case 'wearables':
                electronicsProducts = electronicsProducts.filter(p => 
                    p.name.toLowerCase().includes('tracker') || 
                    p.name.toLowerCase().includes('watch')
                );
                break;
            case 'accessories':
                electronicsProducts = electronicsProducts.filter(p => 
                    p.name.toLowerCase().includes('mouse') || 
                    p.category === 'Accessories'
                );
                break;
        }
    }
    
    // Apply sorting
    sortProducts(electronicsProducts, sortOption);
    
    // Add a small delay to show the loading effect
    setTimeout(() => {
        // Clear loading indicator
        productsContainer.innerHTML = '';
        
        // Create product elements and add to container with staggered animation
        if (electronicsProducts.length === 0) {
            showEmptyState(productsContainer);
        } else {
            electronicsProducts.forEach((product, index) => {
                const productElement = createProductElement(product);
                productElement.style.opacity = "0";
                productElement.style.transform = "translateY(20px)";
                productsContainer.appendChild(productElement);
                
                // Staggered animation with delay
                setTimeout(() => {
                    productElement.style.transition = "opacity 0.5s ease, transform 0.5s ease";
                    productElement.style.opacity = "1";
                    productElement.style.transform = "translateY(0)";
                }, index * 100);
            });
        }
        
        // Update active filter button
        updateActiveFilterButton(filter);
        
        // Show filter feedback
        if (filter !== 'all') {
            showFilterNotification(filter, electronicsProducts.length);
        }
    }, 500);
}

// Show loading indicator
function showLoadingIndicator(container) {
    container.innerHTML = `
        <div class="loading-indicator">
            <div class="spinner"></div>
            <p>Loading products...</p>
        </div>
    `;
    
    // Add loading styles if not already in CSS
    if (!document.getElementById('loading-styles')) {
        const style = document.createElement('style');
        style.id = 'loading-styles';
        style.textContent = `
            .loading-indicator {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                width: 100%;
                padding: 50px 0;
            }
            .spinner {
                width: 50px;
                height: 50px;
                border: 4px solid rgba(126, 87, 194, 0.2);
                border-radius: 50%;
                border-top-color: var(--primary-color);
                animation: spin 1s linear infinite;
                margin-bottom: 15px;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Show empty state when no products match filters
function showEmptyState(container) {
    container.innerHTML = `
        <div class="empty-products">
            <i class="fas fa-search"></i>
            <h3>No products found</h3>
            <p>We couldn't find any products matching your criteria.</p>
            <button class="btn reset-filter">Clear Filters</button>
        </div>
    `;
    
    // Add empty state styles if not already in CSS
    if (!document.getElementById('empty-state-styles')) {
        const style = document.createElement('style');
        style.id = 'empty-state-styles';
        style.textContent = `
            .empty-products {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                text-align: center;
                width: 100%;
                padding: 80px 0;
                animation: fadeIn 0.5s ease;
            }
            .empty-products i {
                font-size: 3rem;
                color: var(--border-color);
                margin-bottom: 15px;
            }
            .empty-products h3 {
                font-size: 1.5rem;
                margin-bottom: 10px;
                color: var(--text-color);
            }
            .empty-products p {
                color: var(--text-color);
                opacity: 0.8;
                margin-bottom: 20px;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add reset button functionality
    document.querySelector('.reset-filter').addEventListener('click', function() {
        // Reset filters
        const sortOption = document.getElementById('sort-select').value;
        
        // Determine which collection page we're on
        if (document.getElementById('men-products')) {
            displayMenCollection('all', sortOption);
        } else if (document.getElementById('women-products')) {
            displayWomenCollection('all', sortOption);
        } else if (document.getElementById('electronics-products')) {
            displayElectronicsCollection('all', sortOption);
        }
        
        // Reset price range slider
        const priceRange = document.getElementById('price-range');
        const maxPrice = document.getElementById('max-price');
        if (priceRange && maxPrice) {
            priceRange.value = 500;
            maxPrice.textContent = '$500';
        }
        
        // Show notification
        showNotification("Filters have been reset");
    });
}

// Show filter notification
function showFilterNotification(filter, count) {
    let filterName = '';
    switch (filter) {
        case 'clothing':
            filterName = 'Clothing';
            break;
        case 'shoes':
            filterName = 'Shoes';
            break;
        case 'accessories':
            filterName = 'Accessories';
            break;
        case 'beauty':
            filterName = 'Beauty';
            break;
        case 'audio':
            filterName = 'Audio';
            break;
        case 'wearables':
            filterName = 'Wearables';
            break;
        default:
            filterName = 'Category';
    }
    
    showNotification(`Showing ${count} ${filterName} products`);
}

// Set up filter functionality for collection pages
function setupCollectionFilters() {
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            const sortOption = document.getElementById('sort-select').value;
            
            // Add button animation
            this.classList.add('filter-btn-clicked');
            setTimeout(() => {
                this.classList.remove('filter-btn-clicked');
            }, 300);
            
            // Add filter button styles if not already in CSS
            if (!document.getElementById('filter-btn-styles')) {
                const style = document.createElement('style');
                style.id = 'filter-btn-styles';
                style.textContent = `
                    .filter-btn-clicked {
                        animation: clickEffect 0.3s ease;
                    }
                    @keyframes clickEffect {
                        0% { transform: scale(1); }
                        50% { transform: scale(0.95); }
                        100% { transform: scale(1); }
                    }
                `;
                document.head.appendChild(style);
            }
            
            // Determine which collection page we're on
            if (document.getElementById('men-products')) {
                displayMenCollection(filter, sortOption);
            } else if (document.getElementById('women-products')) {
                displayWomenCollection(filter, sortOption);
            } else if (document.getElementById('electronics-products')) {
                displayElectronicsCollection(filter, sortOption);
            }
        });
    });
    
    // Sort dropdown
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const currentFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';
            
            // Determine which collection page we're on
            if (document.getElementById('men-products')) {
                displayMenCollection(currentFilter, this.value);
            } else if (document.getElementById('women-products')) {
                displayWomenCollection(currentFilter, this.value);
            } else if (document.getElementById('electronics-products')) {
                displayElectronicsCollection(currentFilter, this.value);
            }
            
            // Show notification for sorting
            let sortText = '';
            switch (this.value) {
                case 'price-low':
                    sortText = 'Price: Low to High';
                    break;
                case 'price-high':
                    sortText = 'Price: High to Low';
                    break;
                case 'name-asc':
                    sortText = 'Name: A to Z';
                    break;
                case 'name-desc':
                    sortText = 'Name: Z to A';
                    break;
                default:
                    sortText = 'Default';
            }
            
            showNotification(`Sorted by: ${sortText}`);
        });
    }
}

// Set up price range filter
function setupPriceRangeFilter() {
    const priceRange = document.getElementById('price-range');
    const maxPrice = document.getElementById('max-price');
    const filterBtn = document.querySelector('.price-range .btn');
    
    if (priceRange && maxPrice) {
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
                
                // Add button animation
                this.classList.add('filter-btn-clicked');
                setTimeout(() => {
                    this.classList.remove('filter-btn-clicked');
                }, 300);
                
                // Determine which collection page we're on and apply filters
                if (document.getElementById('men-products')) {
                    applyPriceFilter('men', currentFilter, sortOption, maxPriceValue);
                } else if (document.getElementById('women-products')) {
                    applyPriceFilter('women', currentFilter, sortOption, maxPriceValue);
                } else if (document.getElementById('electronics-products')) {
                    applyPriceFilter('electronics', currentFilter, sortOption, maxPriceValue);
                }
            });
        }
    }
}

// Apply price filter to the appropriate collection
function applyPriceFilter(collectionType, filter, sortOption, maxPrice) {
    let productsContainer;
    let filteredProducts;
    
    // Show loading indicator
    if (collectionType === 'men') {
        productsContainer = document.getElementById('men-products');
    } else if (collectionType === 'women') {
        productsContainer = document.getElementById('women-products');
    } else if (collectionType === 'electronics') {
        productsContainer = document.getElementById('electronics-products');
    }
    
    if (productsContainer) {
        showLoadingIndicator(productsContainer);
    }
    
    // Get appropriate container and initial filtered products
    switch(collectionType) {
        case 'men':
            productsContainer = document.getElementById('men-products');
            filteredProducts = products.filter(product => 
                (product.category === 'Fashion' || 
                product.category === 'Accessories' || 
                product.id === 2 || product.id === 4 || product.id === 8)
            );
            break;
        case 'women':
            productsContainer = document.getElementById('women-products');
            filteredProducts = products.filter(product => 
                (product.category === 'Fashion' || 
                product.category === 'Beauty' ||
                product.category === 'Accessories' ||
                product.id === 6)
            );
            break;
        case 'electronics':
            productsContainer = document.getElementById('electronics-products');
            filteredProducts = products.filter(product => 
                (product.category === 'Electronics' ||
                product.id === 1 || product.id === 3 || product.id === 5 || product.id === 8)
            );
            break;
    }
    
    // Apply category/type filter
    if (filter !== 'all') {
        if (collectionType === 'men') {
            switch(filter) {
                case 'clothing':
                    filteredProducts = filteredProducts.filter(p => p.category === 'Fashion');
                    break;
                case 'shoes':
                    filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes('shoe'));
                    break;
                case 'accessories':
                    filteredProducts = filteredProducts.filter(p => p.category === 'Accessories');
                    break;
            }
        } else if (collectionType === 'women') {
            switch(filter) {
                case 'clothing':
                    filteredProducts = filteredProducts.filter(p => p.category === 'Fashion');
                    break;
                case 'beauty':
                    filteredProducts = filteredProducts.filter(p => p.category === 'Beauty');
                    break;
                case 'accessories':
                    filteredProducts = filteredProducts.filter(p => p.category === 'Accessories');
                    break;
            }
        } else if (collectionType === 'electronics') {
            switch(filter) {
                case 'audio':
                    filteredProducts = filteredProducts.filter(p => 
                        p.name.toLowerCase().includes('headphone') || 
                        p.name.toLowerCase().includes('speaker')
                    );
                    break;
                case 'wearables':
                    filteredProducts = filteredProducts.filter(p => 
                        p.name.toLowerCase().includes('tracker') || 
                        p.name.toLowerCase().includes('watch')
                    );
                    break;
                case 'accessories':
                    filteredProducts = filteredProducts.filter(p => 
                        p.name.toLowerCase().includes('mouse') || 
                        p.category === 'Accessories'
                    );
                    break;
            }
        }
    }
    
    // Apply price filter
    filteredProducts = filteredProducts.filter(product => product.price <= maxPrice);
    
    // Apply sorting
    sortProducts(filteredProducts, sortOption);
    
    // Add a small delay to show the loading effect
    setTimeout(() => {
        // Clear container
        productsContainer.innerHTML = '';
        
        // Display filtered products or "no products" message
        if (filteredProducts.length === 0) {
            showEmptyState(productsContainer);
        } else {
            filteredProducts.forEach((product, index) => {
                const productElement = createProductElement(product);
                productElement.style.opacity = "0";
                productElement.style.transform = "translateY(20px)";
                productsContainer.appendChild(productElement);
                
                // Staggered animation with delay
                setTimeout(() => {
                    productElement.style.transition = "opacity 0.5s ease, transform 0.5s ease";
                    productElement.style.opacity = "1";
                    productElement.style.transform = "translateY(0)";
                }, index * 100);
            });
        }
        
        // Show notification
        showNotification(`Showing products under $${maxPrice}`);
    }, 500);
}

// Helper function to update active filter button
function updateActiveFilterButton(filter) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-filter') === filter) {
            btn.classList.add('active');
        }
    });
}

// Helper function to sort products
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

// Create product element with fly-to-cart animation
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