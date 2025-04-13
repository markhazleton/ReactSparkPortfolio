// Azure Function to proxy RSS feed requests
// This avoids CORS issues by having the server fetch the RSS feed instead of the browser

const fetch = require('node-fetch');

module.exports = async function (context, req) {
    context.log('Processing RSS proxy request');
    
    // Get the source URL (default to Mark's blog)
    const sourceUrl = req.headers["x-rss-source"] || "https://markhazleton.com/rss.xml";
    
    try {
        // Fetch the RSS feed from the source
        const response = await fetch(sourceUrl, {
            headers: {
                'Accept': 'application/xml, text/xml, */*',
                'User-Agent': 'ReactSparkPortfolio/1.0 RSS-Proxy'
            },
            timeout: 10000 // 10 second timeout
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch RSS: ${response.status} ${response.statusText}`);
        }
        
        // Get the RSS XML content
        const rssContent = await response.text();
        
        // Return the RSS content
        context.res = {
            status: 200,
            headers: {
                "Content-Type": "application/xml",
                "Cache-Control": "max-age=3600", // Cache for 1 hour
                "Access-Control-Allow-Origin": "*" // Allow any site to access this API
            },
            body: rssContent
        };
        
        context.log('Successfully proxied RSS feed');
    } catch (error) {
        context.log.error(`Error proxying RSS feed: ${error.message}`);
        
        context.res = {
            status: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                error: "Failed to retrieve RSS feed",
                message: error.message
            })
        };
    }
};