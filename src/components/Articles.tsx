import React, { useEffect, useState } from 'react';

interface Article {
  title: string;
  link: string;
  pubDate: string;
}

const Articles: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRSSFeed = async () => {
      try {
        // Fetch the RSS file from the public folder
        const response = await fetch(`${import.meta.env.BASE_URL}rss.xml`);
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

        const parsedArticles: Article[] = [];
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
      } catch (err) {
        console.error('Error loading RSS feed:', err);
        setError('Error loading RSS feed.');
        setLoading(false);
      }
    };

    fetchRSSFeed();
  }, []);

  return (
    <section id="articles" className="py-5">
      <div className="container">
        <h2>Latest Articles</h2>

        {loading && <p>Loading articles...</p>}
        {error && <p>{error}</p>}

        {!loading && !error && (
          <ul className="list-unstyled">
            {articles.map((article, index) => (
              <li key={index} className="mb-2">
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-decoration-none"
                >
                  {article.title}
                </a>
                <p>{article.pubDate}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default Articles;
