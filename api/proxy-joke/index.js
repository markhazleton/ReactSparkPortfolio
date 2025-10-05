const axios = require('axios');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a joke proxy request.');

    // Set CORS headers
    context.res.headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        context.res = {
            status: 200,
            headers: context.res.headers
        };
        return;
    }

    try {
        // Extract category from query params or default to 'Any'
        const category = req.query.category || 'Any';
        const safeMode = req.query.safeMode !== 'false'; // Default to true
        
        // Build the JokeAPI URL
        const jokeApiUrl = `https://v2.jokeapi.dev/joke/${category}${safeMode ? '?safe-mode' : ''}`;
        
        context.log(`Fetching joke from: ${jokeApiUrl}`);

        // Make request to JokeAPI with timeout
        const response = await axios.get(jokeApiUrl, {
            timeout: 5000,
            headers: {
                'User-Agent': 'ReactSparkPortfolio/1.0'
            }
        });

        // Validate the response
        if (!response.data) {
            throw new Error('No data received from JokeAPI');
        }

        // Check if the API returned an error
        if (response.data.error) {
            throw new Error(`JokeAPI error: ${response.data.message || 'Unknown error'}`);
        }

        context.log('Successfully fetched joke');

        // Return the joke data
        context.res = {
            status: 200,
            headers: context.res.headers,
            body: response.data
        };

    } catch (error) {
        context.log.error('Error fetching joke:', error.message);

        // Return error response with fallback joke
        const fallbackJoke = {
            error: false,
            category: "Programming",
            type: "single",
            joke: "Why do programmers prefer dark mode? Because light attracts bugs!",
            flags: {
                nsfw: false,
                religious: false,
                political: false,
                racist: false,
                sexist: false,
                explicit: false
            },
            id: 0,
            safe: true,
            lang: "en"
        };

        context.res = {
            status: 200,
            headers: context.res.headers,
            body: fallbackJoke
        };
    }
};