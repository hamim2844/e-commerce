document.addEventListener('DOMContentLoaded', function() {
    console.log('AI Assistant script loaded');
    
    // AI Assistant elements
    const aiToggle = document.getElementById('ai-assistant-toggle');
    const aiContainer = document.getElementById('ai-assistant-container');
    const aiClose = document.getElementById('ai-assistant-close');
    const aiMessages = document.getElementById('ai-messages');
    const aiInput = document.getElementById('ai-input');
    const aiSendBtn = document.getElementById('ai-send-btn');
    
    // Log if elements are found
    console.log('AI elements found:', {
        aiToggle: !!aiToggle,
        aiContainer: !!aiContainer,
        aiClose: !!aiClose,
        aiMessages: !!aiMessages,
        aiInput: !!aiInput,
        aiSendBtn: !!aiSendBtn
    });
    
    // API configuration - direct API key usage
    const API_KEY = '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';
    const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
    const API_MODEL = 'deepseek/deepseek-chat:free';
    const API_TEMPERATURE = 0.7;
    const API_MAX_TOKENS = 500;
    
    // Check if AI assistant was previously active
    const wasActive = localStorage.getItem('aiAssistantActive') === 'true';
    if (wasActive) {
        aiContainer.classList.add('active');
    }
    
    // Get current page info
    const currentPage = getCurrentPage();
    console.log('Current page detected:', currentPage);
    
    // Load chat history
    loadChatHistory();
    
    // Product data for the AI to reference
    const products = {
        men: [
            { id: 1, name: "Classic Fit Dress Shirt", category: "clothing", type: "formal", price: 59.99, colors: ["white", "blue", "black"] },
            { id: 2, name: "Slim Fit Jeans", category: "clothing", type: "casual", price: 79.99, colors: ["blue", "black", "grey"] },
            { id: 3, name: "Leather Derby Shoes", category: "shoes", type: "formal", price: 129.99, colors: ["brown", "black"] },
            { id: 4, name: "Canvas Sneakers", category: "shoes", type: "casual", price: 69.99, colors: ["white", "black", "red", "blue"] },
            { id: 5, name: "Wool Blend Blazer", category: "clothing", type: "formal", price: 199.99, colors: ["navy", "grey", "black"] },
            { id: 6, name: "Graphic T-Shirt", category: "clothing", type: "casual", price: 29.99, colors: ["white", "black", "grey", "blue"] },
            { id: 7, name: "Leather Watch", category: "accessories", type: "formal", price: 149.99, colors: ["brown", "black"] },
            { id: 8, name: "Sunglasses", category: "accessories", type: "casual", price: 89.99, colors: ["black", "tortoise"] }
        ],
        women: [
            { id: 9, name: "Floral Summer Dress", category: "clothing", type: "casual", price: 69.99, colors: ["blue", "pink", "yellow"] },
            { id: 10, name: "High-Waisted Jeans", category: "clothing", type: "casual", price: 84.99, colors: ["blue", "black", "white"] },
            { id: 11, name: "Leather Ankle Boots", category: "shoes", type: "casual", price: 119.99, colors: ["brown", "black", "tan"] },
            { id: 12, name: "Silk Blouse", category: "clothing", type: "formal", price: 89.99, colors: ["white", "cream", "black", "red"] },
            { id: 13, name: "Statement Necklace", category: "accessories", type: "formal", price: 49.99, colors: ["gold", "silver"] },
            { id: 14, name: "Tote Bag", category: "accessories", type: "casual", price: 59.99, colors: ["brown", "black", "navy", "red"] }
        ],
        electronics: [
            { id: 15, name: "Wireless Headphones", category: "audio", price: 129.99, features: ["Noise cancellation", "Bluetooth 5.0", "30-hour battery"] },
            { id: 16, name: "Smart Watch", category: "wearables", price: 249.99, features: ["Heart rate monitor", "GPS", "Water resistant"] },
            { id: 17, name: "Bluetooth Speaker", category: "audio", price: 79.99, features: ["Waterproof", "10-hour battery", "360° sound"] },
            { id: 18, name: "Wireless Earbuds", category: "audio", price: 99.99, features: ["Touch controls", "20-hour battery", "Sweat resistant"] }
        ]
    };
    
    // Store information
    const storeInfo = {
        name: "hemels style",
        description: "An e-commerce website selling fashion items, electronics, and accessories",
        categories: ["men's fashion", "women's fashion", "electronics", "accessories"],
        shipping: "Free standard shipping on orders over $50. Standard delivery takes 3-5 business days. Express shipping (additional $15) takes 1-2 business days.",
        returns: "30-day return policy. Items must be unworn with original tags attached. You can initiate a return from your account page or contact customer service.",
        sizes: {
            men: "S, M, L, XL, XXL. For formal shirts, we also provide collar sizes from 14\" to 18\".",
            women: "XS, S, M, L, XL. For dresses and pants, we also offer sizes 0-14."
        },
        contact: {
            email: "info@hemelsstyle.com",
            phone: "+1 (555) 123-4567",
            address: "123 Shopping Street, Retail City, SC 12345"
        },
        hours: "Monday-Friday: 9am-6pm, Saturday: 10am-5pm, Sunday: Closed"
    };
    
    // Toggle AI assistant visibility
    aiToggle.addEventListener('click', function() {
        aiContainer.classList.add('active');
        localStorage.setItem('aiAssistantActive', 'true');
        
        // If first time opening, add welcome message based on current page
        if (aiMessages.querySelectorAll('.ai-message').length <= 1) {
            const welcomeMessage = getWelcomeMessage(currentPage);
            setTimeout(() => {
                addMessage(welcomeMessage, 'incoming');
            }, 500);
        }
    });
    
    aiClose.addEventListener('click', function() {
        aiContainer.classList.remove('active');
        localStorage.setItem('aiAssistantActive', 'false');
    });
    
    // Get welcome message based on current page
    function getWelcomeMessage(page) {
        switch(page) {
            case 'home':
                return "Welcome to hemels style! I can help you explore our collections, find specific products, or answer questions about our store. What are you looking for today?";
            case 'men':
                return "Welcome to our Men's Collection! I can suggest outfits, help you find specific items, or answer questions about men's fashion. How can I assist you?";
            case 'women':
                return "Welcome to our Women's Collection! I can recommend styles, help you find specific items, or answer questions about women's fashion. How can I help you today?";
            case 'electronics':
                return "Welcome to our Electronics section! I can help you find the perfect tech gadgets or answer questions about our electronic products. What are you interested in?";
            case 'cart':
                return "I see you're viewing your cart! Need help with checkout, shipping options, or have questions about your selected items?";
            case 'wishlist':
                return "Looking at your wishlist? I can help you compare items, check for sales, or move items to your cart. What would you like to do?";
            default:
                return "Hello! I'm your shopping assistant at hemels style. How can I help you today?";
        }
    }
    
    // Get current page
    function getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('index.html') || path === '/') return 'home';
        if (path.includes('men-collection.html')) return 'men';
        if (path.includes('women-collection.html')) return 'women';
        if (path.includes('electronics-collection.html')) return 'electronics';
        if (path.includes('cart.html')) return 'cart';
        if (path.includes('wishlist.html')) return 'wishlist';
        if (path.includes('products.html')) return 'products';
        if (path.includes('categories.html')) return 'categories';
        return 'other';
    }
    
    // Save chat history
    function saveChatHistory() {
        const messages = Array.from(aiMessages.querySelectorAll('.ai-message')).map(msg => {
            const type = msg.classList.contains('ai-outgoing') ? 'outgoing' : 'incoming';
            const content = msg.querySelector('p')?.textContent || '';
            return { type, content };
        });
        
        if (messages.length > 0) {
            localStorage.setItem('aiChatHistory', JSON.stringify(messages));
        }
    }
    
    // Load chat history
    function loadChatHistory() {
        const history = localStorage.getItem('aiChatHistory');
        if (history) {
            try {
                const messages = JSON.parse(history);
                
                // Clear default message if we have history
                if (messages.length > 0) {
                    aiMessages.innerHTML = '';
                }
                
                // Add messages from history
                messages.forEach(msg => {
                    if (msg.content) {
                        addMessage(msg.content, msg.type, false);
                    }
                });
                
                // Scroll to bottom
                aiMessages.scrollTop = aiMessages.scrollHeight;
            } catch (e) {
                console.error('Error loading chat history:', e);
            }
        }
    }
    
    // Send message function
    function sendMessage() {
        const message = aiInput.value.trim();
        if (message === '') return;
        
        // Add user message to chat
        addMessage(message, 'outgoing');
        aiInput.value = '';
        
        // Show typing indicator
        showTypingIndicator();
        
        // Get conversation history for context
        const conversationHistory = getConversationHistory();
        
        // Process with DeepSeek API
        callAIAPI(message, conversationHistory, currentPage)
            .then(response => {
                removeTypingIndicator();
                addMessage(response, 'incoming');
                
                // Check for navigation requests
                checkForNavigation(message, response);
            })
            .catch(error => {
                console.error('Error calling AI API:', error);
                removeTypingIndicator();
                addMessage("I'm sorry, I'm having trouble connecting right now. Please try again later. Error: " + error.message, 'incoming');
            });
    }
    
    // Get conversation history
    function getConversationHistory() {
        const messages = Array.from(aiMessages.querySelectorAll('.ai-message')).map(msg => {
            const role = msg.classList.contains('ai-outgoing') ? 'user' : 'assistant';
            const content = msg.querySelector('p')?.textContent || '';
            return { role, content };
        });
        
        return messages;
    }
    
    // Call AI API directly
    async function callAIAPI(message, history, currentPage) {
        try {
            // Create system prompt based on current page
            const systemPrompt = createSystemPrompt(currentPage);
            
            // Prepare conversation history for the API
            const messages = [
                { role: 'system', content: systemPrompt }
            ];
            
            // Add conversation history (limited to last 10 messages to save tokens)
            const recentHistory = history.slice(-10);
            recentHistory.forEach(msg => {
                messages.push(msg);
            });
            
            // Add current user message if not already in history
            if (recentHistory.length === 0 || recentHistory[recentHistory.length - 1].role !== 'user') {
                messages.push({ role: 'user', content: message });
            }
            
            console.log('Sending request to OpenRouter API:', {
                url: API_URL,
                model: API_MODEL,
                messages: messages
            });
            
            // Call the OpenRouter API directly
            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${API_KEY}`,
                        'HTTP-Referer': window.location.origin || 'http://localhost:3000',
                        'X-Title': 'Hemels Style AI Assistant'
                    },
                    body: JSON.stringify({
                        model: API_MODEL,
                        messages: messages,
                        temperature: API_TEMPERATURE,
                        max_tokens: API_MAX_TOKENS
                    })
                });
                
                console.log('Response status:', response.status);
                
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Error response text:', errorText);
                    let errorData = {};
                    try {
                        errorData = JSON.parse(errorText);
                    } catch (e) {
                        console.error('Failed to parse error response as JSON');
                    }
                    console.error('Error from OpenRouter API:', errorData);
                    throw new Error(errorData.error || `API request failed with status ${response.status}`);
                }
                
                const data = await response.json();
                console.log('Received response from OpenRouter:', data);
                return data.choices[0].message.content;
            } catch (fetchError) {
                console.error('Fetch error:', fetchError);
                throw fetchError;
            }
            
        } catch (error) {
            console.error('Error calling AI API:', error);
            // Fallback to simple responses if API fails
            return getSimpleResponse(message, currentPage);
        }
    }
    
    // Create system prompt based on current page
    function createSystemPrompt(page) {
        let basePrompt = `You are a helpful AI shopping assistant for ${storeInfo.name}, an e-commerce website. 
You provide concise, friendly, and helpful responses about our products and services.
Current website section: ${page}.
`;
        
        // Add page-specific instructions
        switch(page) {
            case 'men':
                basePrompt += `
You are currently on the Men's Collection page. Help users find men's clothing, suggest outfits, and answer questions about men's fashion.
Our men's collection includes dress shirts, jeans, shoes, blazers, t-shirts, watches, and sunglasses.`;
                break;
            case 'women':
                basePrompt += `
You are currently on the Women's Collection page. Help users find women's clothing, suggest outfits, and answer questions about women's fashion.
Our women's collection includes summer dresses, high-waisted jeans, ankle boots, silk blouses, statement necklaces, and tote bags.`;
                break;
            case 'electronics':
                basePrompt += `
You are currently on the Electronics Collection page. Help users find electronics and gadgets, and answer technical questions.
Our electronics collection includes wireless headphones, smart watches, bluetooth speakers, and wireless earbuds.`;
                break;
            case 'cart':
                basePrompt += `
You are currently on the Shopping Cart page. Help users with checkout processes, shipping options, and payment methods.`;
                break;
            case 'wishlist':
                basePrompt += `
You are currently on the Wishlist page. Help users manage their saved items, compare products, and move items to their cart.`;
                break;
        }
        
        // Add store information
        basePrompt += `
Store Information:
- Shipping: ${storeInfo.shipping}
- Returns: ${storeInfo.returns}
- Contact: Email: ${storeInfo.contact.email}, Phone: ${storeInfo.contact.phone}
- Business Hours: ${storeInfo.hours}

Keep your responses short, helpful, and focused on assisting with shopping. If the user asks to navigate to another page, suggest it with "Would you like to go to [page]?"
`;
        
        return basePrompt;
    }
    
    // Simple fallback responses if API fails
    function getSimpleResponse(message, currentPage) {
        console.log('Using fallback response for:', message);
        message = message.toLowerCase();
        
        if (containsAny(message, ['hi', 'hello', 'hey'])) {
            return "Hello! How can I help you today?";
        }
        
        if (containsAny(message, ['thank', 'thanks'])) {
            return "You're welcome! Is there anything else you need help with?";
        }
        
        if (containsAny(message, ['shipping', 'delivery'])) {
            return storeInfo.shipping;
        }
        
        if (containsAny(message, ['return', 'refund'])) {
            return storeInfo.returns;
        }
        
        if (containsAny(message, ['contact', 'phone', 'email'])) {
            return `You can contact us at ${storeInfo.contact.email} or ${storeInfo.contact.phone}.`;
        }
        
        return "I'm here to help with your shopping needs. Can you please tell me what you're looking for?";
    }
    
    // Check for navigation requests
    function checkForNavigation(userMessage, aiResponse) {
        userMessage = userMessage.toLowerCase();
        
        if (containsAny(userMessage, ['go to', 'take me to', 'navigate to', 'show me'])) {
            if (containsAny(userMessage, ['home', 'main page'])) {
                suggestNavigation('index.html', 'home page');
            } else if (containsAny(userMessage, ['men', "men's"])) {
                suggestNavigation('men-collection.html', "men's collection");
            } else if (containsAny(userMessage, ['women', "women's"])) {
                suggestNavigation('women-collection.html', "women's collection");
            } else if (containsAny(userMessage, ['electronics', 'tech', 'gadgets'])) {
                suggestNavigation('electronics-collection.html', "electronics section");
            } else if (containsAny(userMessage, ['cart', 'shopping cart'])) {
                suggestNavigation('cart.html', "shopping cart");
            } else if (containsAny(userMessage, ['wishlist', 'favorites', 'saved items'])) {
                suggestNavigation('wishlist.html', "wishlist");
            } else if (containsAny(userMessage, ['products', 'all products'])) {
                suggestNavigation('products.html', "all products");
            } else if (containsAny(userMessage, ['categories', 'all categories'])) {
                suggestNavigation('categories.html', "categories page");
            }
        }
        
        // Also check AI's response for navigation suggestions
        if (aiResponse.includes("go to") || 
            aiResponse.includes("navigate to") || 
            aiResponse.includes("check out") ||
            aiResponse.includes("visit the")) {
            
            if (aiResponse.includes("home page")) {
                suggestNavigation('index.html', "home page");
            } else if (aiResponse.includes("men's collection")) {
                suggestNavigation('men-collection.html', "men's collection");
            } else if (aiResponse.includes("women's collection")) {
                suggestNavigation('women-collection.html', "women's collection");
            } else if (aiResponse.includes("electronics")) {
                suggestNavigation('electronics-collection.html', "electronics section");
            } else if (aiResponse.includes("cart")) {
                suggestNavigation('cart.html', "shopping cart");
            } else if (aiResponse.includes("wishlist")) {
                suggestNavigation('wishlist.html', "wishlist");
            } else if (aiResponse.includes("products page")) {
                suggestNavigation('products.html', "products page");
            } else if (aiResponse.includes("categories page")) {
                suggestNavigation('categories.html', "categories page");
            }
        }
    }
    
    // Add message to chat
    function addMessage(content, type, saveHistory = true) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ai-${type}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'ai-avatar';
        
        const icon = document.createElement('i');
        icon.className = type === 'incoming' ? 'fas fa-robot' : 'fas fa-user';
        avatar.appendChild(icon);
        
        const messageContent = document.createElement('div');
        messageContent.className = 'ai-message-content';
        
        const paragraph = document.createElement('p');
        paragraph.textContent = content;
        messageContent.appendChild(paragraph);
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        
        aiMessages.appendChild(messageDiv);
        aiMessages.scrollTop = aiMessages.scrollHeight;
        
        if (saveHistory) {
            saveChatHistory();
        }
    }
    
    // Show typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'ai-message ai-incoming ai-typing-indicator';
        
        const avatar = document.createElement('div');
        avatar.className = 'ai-avatar';
        
        const icon = document.createElement('i');
        icon.className = 'fas fa-robot';
        avatar.appendChild(icon);
        
        const typingContent = document.createElement('div');
        typingContent.className = 'ai-typing';
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('span');
            typingContent.appendChild(dot);
        }
        
        typingDiv.appendChild(avatar);
        typingDiv.appendChild(typingContent);
        
        aiMessages.appendChild(typingDiv);
        aiMessages.scrollTop = aiMessages.scrollHeight;
    }
    
    // Remove typing indicator
    function removeTypingIndicator() {
        const typingIndicator = document.querySelector('.ai-typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    // Helper function to check if message contains any of the keywords
    function containsAny(message, keywords) {
        return keywords.some(keyword => message.includes(keyword));
    }
    
    // Suggest navigation with button
    function suggestNavigation(url, pageName) {
        // Create navigation button
        setTimeout(() => {
            const navDiv = document.createElement('div');
            navDiv.className = 'ai-navigation-suggestion';
            
            const navButton = document.createElement('button');
            navButton.className = 'ai-nav-button';
            navButton.textContent = `Go to ${pageName}`;
            navButton.onclick = function() {
                window.location.href = url;
            };
            
            navDiv.appendChild(navButton);
            aiMessages.appendChild(navDiv);
            aiMessages.scrollTop = aiMessages.scrollHeight;
        }, 500);
    }
    
    // Event listeners for sending messages
    aiSendBtn.addEventListener('click', sendMessage);
    
    aiInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}); 