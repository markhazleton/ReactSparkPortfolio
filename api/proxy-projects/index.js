const axios = require('axios');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a projects proxy request.');

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
        const projectsUrl = 'https://markhazleton.com/projects.json';
        
        context.log(`Fetching projects from: ${projectsUrl}`);

        // Make request to projects.json with timeout
        const response = await axios.get(projectsUrl, {
            timeout: 5000,
            headers: {
                'User-Agent': 'ReactSparkPortfolio/1.0'
            }
        });

        // Validate the response
        if (!response.data) {
            throw new Error('No data received from projects API');
        }

        // Validate that it's an array
        if (!Array.isArray(response.data)) {
            throw new Error('Projects data is not an array');
        }

        context.log(`Successfully fetched ${response.data.length} projects`);

        // Return the projects data
        context.res = {
            status: 200,
            headers: context.res.headers,
            body: response.data
        };

    } catch (error) {
        context.log.error('Error fetching projects:', error.message);

        // Return error response with fallback data
        const fallbackProjects = [
            {
                "id": 1,
                "image": "assets/img/frogsfolly.png",
                "p": "Frogsfolly",
                "d": "My first website, setup to share photos with my family but is now a 'Kitchen Sink' of demos and test ideas. The site is built with Web Project Mechanics CMS.",
                "h": "https://frogsfolly.com"
            },
            {
                "id": 2,
                "image": "assets/img/travelfrogsfolly.png",
                "p": "Travel Frogsfolly",
                "d": "A website with places we have traveled with a few pictures and descriptions of the highlights. The site is built with Web Project Mechanics CMS",
                "h": "https://travel.frogsfolly.com"
            },
            {
                "id": 3,
                "image": "assets/img/controlorigins.jpg",
                "p": "Control Origins",
                "d": "At Control Origins, our mission is to empower organizations with innovative technology solutions that drive value creation and enable them to achieve their business goals.",
                "h": "https://controlorigins.com"
            }
        ];

        context.res = {
            status: 200,
            headers: context.res.headers,
            body: fallbackProjects
        };
    }
};