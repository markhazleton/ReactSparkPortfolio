import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
const Articles = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchRSSFeed = async () => {
            try {
                // Fetch the RSS file from the public folder
                const response = await fetch('/rss.xml');
                const rssData = await response.text();
                // Log the raw XML data to ensure it's loaded correctly
                console.log('Raw RSS Data:', rssData);
                // Parse the XML using DOMParser
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(rssData, 'application/xml');
                // Log the parsed XML document to check its structure
                console.log('Parsed XML Document:', xmlDoc);
                const items = xmlDoc.getElementsByTagName('item');
                // Log the number of <item> elements found
                console.log('Number of <item> elements found:', items.length);
                const parsedArticles = [];
                for (let i = 0; i < items.length; i++) {
                    const titleElement = items[i].getElementsByTagName('title')[0];
                    const linkElement = items[i].getElementsByTagName('link')[0];
                    const pubDateElement = items[i].getElementsByTagName('pubDate')[0];
                    // Trim whitespace from the elements
                    const title = titleElement?.textContent?.trim() || '';
                    const link = linkElement?.textContent?.trim() || '';
                    const pubDate = pubDateElement?.textContent?.trim() || '';
                    parsedArticles.push({ title, link, pubDate });
                }
                // Log the parsed articles to ensure they're being processed correctly
                console.log('Parsed Articles:', parsedArticles);
                setArticles(parsedArticles);
                setLoading(false);
            }
            catch (err) {
                console.error('Error loading RSS feed:', err);
                setError('Error loading RSS feed.');
                setLoading(false);
            }
        };
        fetchRSSFeed();
    }, []);
    return (_jsx("section", { id: "articles", className: "py-5", children: _jsxs("div", { className: "container", children: [_jsx("h2", { children: "Latest Articles" }), loading && _jsx("p", { children: "Loading articles..." }), error && _jsx("p", { children: error }), !loading && !error && (_jsx("ul", { className: "list-unstyled", children: articles.map((article, index) => (_jsxs("li", { className: "mb-2", children: [_jsx("a", { href: article.link, target: "_blank", rel: "noopener noreferrer", className: "text-decoration-none", children: article.title }), _jsx("p", { children: article.pubDate })] }, index))) }))] }) }));
};
export default Articles;
