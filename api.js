// API Client for Hemels Style E-commerce

// Base API URL
const API_URL = '/api';

// Product API
const ProductAPI = {
    // Get all products with optional filters
    getProducts: async (filters = {}) => {
        try {
            // Build query string from filters
            const queryParams = new URLSearchParams();
            
            if (filters.category) queryParams.append('category', filters.category);
            if (filters.tag) queryParams.append('tag', filters.tag);
            if (filters.search) queryParams.append('search', filters.search);
            if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
            if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
            if (filters.sort) queryParams.append('sort', filters.sort);
            if (filters.limit) queryParams.append('limit', filters.limit);
            if (filters.page) queryParams.append('page', filters.page);
            
            const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
            
            const response = await fetch(`${API_URL}/products${queryString}`);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch products');
            }
            
            return data;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    },
    
    // Get a single product by ID
    getProduct: async (productId) => {
        try {
            const response = await fetch(`${API_URL}/products/${productId}`);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch product details');
            }
            
            return data.data;
        } catch (error) {
            console.error('Error fetching product details:', error);
            throw error;
        }
    },
    
    // Get top rated products
    getTopProducts: async () => {
        try {
            const response = await fetch(`${API_URL}/products/top`);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch top products');
            }
            
            return data.data;
        } catch (error) {
            console.error('Error fetching top products:', error);
            throw error;
        }
    },
    
    // Add a product review
    addReview: async (productId, reviewData, token) => {
        try {
            const response = await fetch(`${API_URL}/products/${productId}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(reviewData)
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to add review');
            }
            
            return data.data;
        } catch (error) {
            console.error('Error adding review:', error);
            throw error;
        }
    }
};

// Category API
const CategoryAPI = {
    // Get all categories
    getCategories: async () => {
        try {
            const response = await fetch(`${API_URL}/categories`);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch categories');
            }
            
            return data.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },
    
    // Get a single category by ID
    getCategory: async (categoryId) => {
        try {
            const response = await fetch(`${API_URL}/categories/${categoryId}`);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch category details');
            }
            
            return data.data;
        } catch (error) {
            console.error('Error fetching category details:', error);
            throw error;
        }
    },
    
    // Get products in a category
    getCategoryProducts: async (categoryId) => {
        try {
            const response = await fetch(`${API_URL}/categories/${categoryId}/products`);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch category products');
            }
            
            return data.data;
        } catch (error) {
            console.error('Error fetching category products:', error);
            throw error;
        }
    }
};

// User Authentication API
const AuthAPI = {
    // Register a new user
    register: async (userData) => {
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }
            
            return data;
        } catch (error) {
            console.error('Error during registration:', error);
            throw error;
        }
    },
    
    // Login a user
    login: async (email, password) => {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }
            
            return data;
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    },
    
    // Logout a user
    logout: async () => {
        try {
            const response = await fetch(`${API_URL}/auth/logout`);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Logout failed');
            }
            
            return data;
        } catch (error) {
            console.error('Error during logout:', error);
            throw error;
        }
    },
    
    // Get current user profile
    getCurrentUser: async (token) => {
        try {
            const response = await fetch(`${API_URL}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch user profile');
            }
            
            return data.data;
        } catch (error) {
            console.error('Error fetching user profile:', error);
            throw error;
        }
    },
    
    // Update user details
    updateUserDetails: async (userData, token) => {
        try {
            const response = await fetch(`${API_URL}/auth/updatedetails`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(userData)
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to update user details');
            }
            
            return data.data;
        } catch (error) {
            console.error('Error updating user details:', error);
            throw error;
        }
    },
    
    // Update user password
    updatePassword: async (passwords, token) => {
        try {
            const response = await fetch(`${API_URL}/auth/updatepassword`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(passwords)
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to update password');
            }
            
            return data;
        } catch (error) {
            console.error('Error updating password:', error);
            throw error;
        }
    }
};

// Order API
const OrderAPI = {
    // Create a new order
    createOrder: async (orderData, token) => {
        try {
            const response = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(orderData)
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to create order');
            }
            
            return data.data;
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    },
    
    // Get order by ID
    getOrder: async (orderId, token) => {
        try {
            const response = await fetch(`${API_URL}/orders/${orderId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch order details');
            }
            
            return data.data;
        } catch (error) {
            console.error('Error fetching order details:', error);
            throw error;
        }
    },
    
    // Get user's orders
    getUserOrders: async (token) => {
        try {
            const response = await fetch(`${API_URL}/orders/myorders`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch orders');
            }
            
            return data.data;
        } catch (error) {
            console.error('Error fetching user orders:', error);
            throw error;
        }
    },
    
    // Update order to paid
    updateOrderToPaid: async (orderId, paymentResult, token) => {
        try {
            const response = await fetch(`${API_URL}/orders/${orderId}/pay`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(paymentResult)
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to update payment status');
            }
            
            return data.data;
        } catch (error) {
            console.error('Error updating payment status:', error);
            throw error;
        }
    }
};

// Export the API client
window.API = {
    Product: ProductAPI,
    Category: CategoryAPI,
    Auth: AuthAPI,
    Order: OrderAPI
}; 