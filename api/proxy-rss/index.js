// Azure Function to proxy RSS feed requests
// This avoids CORS issues by having the server fetch the RSS feed instead of the browser

const fetch = require('node-fetch');

module.exports = async function (context, req) {
    context.log('Processing RSS proxy request');
    
    // Get the source URL (default to Mark's blog)
    const sourceUrl = req.headers["x-rss-source"] || "https://markhazleton.com/rss.xml";
    
    context.log(`Fetching RSS from source: ${sourceUrl}`);
    
    try {
        // Fetch the RSS feed from the source with improved settings
        const response = await fetch(sourceUrl, {
            headers: {
                'Accept': 'application/xml, text/xml, application/rss+xml, */*',
                'User-Agent': 'ReactSparkPortfolio/1.0 RSS-Proxy (Node.js)',
                'Cache-Control': 'no-cache'
            },
            timeout: 15000, // 15 second timeout
            follow: 3 // Follow up to 3 redirects
        });
        
        if (!response.ok) {
            context.log.error(`Failed to fetch RSS from ${sourceUrl}: ${response.status} ${response.statusText}`);
            throw new Error(`Failed to fetch RSS: ${response.status} ${response.statusText}`);
        }
        
        // Get the RSS XML content
        const rssContent = await response.text();
        
        if (!rssContent || rssContent.trim() === '') {
            context.log.error(`Received empty response from ${sourceUrl}`);
            throw new Error('Received empty response from RSS source');
        }
        
        // Basic validation that we got XML
        if (!rssContent.includes('<rss') && !rssContent.includes('<feed')) {
            context.log.warn(`Response might not be valid RSS/XML: ${rssContent.substring(0, 100)}...`);
        }
        
        context.log(`Successfully retrieved ${rssContent.length} bytes of RSS data`);
        
        // Return the RSS content with appropriate headers
        context.res = {
            status: 200,
            headers: {
                "Content-Type": "application/xml",
                "Cache-Control": "max-age=3600", // Cache for 1 hour
                "Access-Control-Allow-Origin": "*", // Allow any site to access this API
                "Access-Control-Allow-Headers": "Content-Type, X-RSS-Source, Cache-Control",
                "Access-Control-Allow-Methods": "GET, OPTIONS"
            },
            body: rssContent
        };
        
        context.log('Successfully proxied RSS feed');
    } catch (error) {
        context.log.error(`Error proxying RSS feed: ${error.message}`);
        
        // Return a proper error response
        context.res = {
            status: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type, X-RSS-Source, Cache-Control",
                "Access-Control-Allow-Methods": "GET, OPTIONS"
            },
            body: JSON.stringify({
                error: "Failed to retrieve RSS feed",
                message: error.message,
                source: sourceUrl,
                timestamp: new Date().toISOString()
            })
        };
    }
};