require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, './')));

// API proxy route for OpenRouter
app.post('/api/chat', async (req, res) => {
    try {
        // Get the API key from environment variables
        const apiKey = process.env.OPENROUTER_API_KEY;
        
        if (!apiKey) {
            return res.status(500).json({ 
                error: 'API key not configured. Please set OPENROUTER_API_KEY in .env file.' 
            });
        }

        // Forward the request to OpenRouter API
        const response = await axios.post(
            process.env.OPENROUTER_API_URL || 'https://openrouter.ai/api/v1/chat/completions',
            req.body,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                    'HTTP-Referer': req.headers.origin || 'http://localhost:3000',
                    'X-Title': 'Hemels Style AI Assistant'
                }
            }
        );

        // Return the response from OpenRouter
        return res.json(response.data);
    } catch (error) {
        console.error('Error calling OpenRouter API:', error.message);
        
        // If the error has a response, send that data
        if (error.response) {
            return res.status(error.response.status).json({
                error: error.response.data || 'Error from OpenRouter API',
                status: error.response.status
            });
        }
        
        // Otherwise send a generic error
        return res.status(500).json({ error: 'Failed to call OpenRouter API' });
    }
});

// Serve the AI config
app.get('/js/config.js', (req, res) => {
    // Generate the config.js file dynamically
    const configContent = `// AI Assistant Configuration
const AI_CONFIG = {
    // API endpoint (points to our server proxy)
    apiEndpoint: '/api/chat',
    
    // Model configuration
    model: '${process.env.OPENROUTER_MODEL || 'deepseek/deepseek-chat:free'}',
    temperature: 0.7,
    maxTokens: 500
};`;

    res.setHeader('Content-Type', 'application/javascript');
    res.send(configContent);
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to view the website`);
}); 