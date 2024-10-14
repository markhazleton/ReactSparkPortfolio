import React, { useEffect, useState } from 'react';
import { Card, Spinner, Alert, ListGroup } from 'react-bootstrap'; // Import Bootstrap components
import { format } from 'date-fns'; // Import date-fns for date formatting

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
        const response = await fetch(`${import.meta.env.BASE_URL}rss.xml`);
        const rssData = await response.text();

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(rssData, 'application/xml');
        const items = xmlDoc.getElementsByTagName('item');

        const parsedArticles: Article[] = [];
        for (let i = 0; i < items.length; i++) {
          const titleElement = items[i].getElementsByTagName('title')[0];
          const linkElement = items[i].getElementsByTagName('link')[0];
          const pubDateElement = items[i].getElementsByTagName('pubDate')[0];

          const title = titleElement?.textContent?.trim() || '';
          const link = linkElement?.textContent?.trim() || '';
          const pubDate = pubDateElement?.textContent?.trim() || '';

          parsedArticles.push({ title, link, pubDate });
        }

        setArticles(parsedArticles);
        setLoading(false);
      } catch (err) {
        setError('Error loading RSS feed.');
        setLoading(false);
      }
    };

    fetchRSSFeed();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMMM d, yyyy'); // Formats the date to 'Month day, Year'
  };

  return (
    <section id="articles" className="py-5">
      <div className="container">
        <h2 className="mb-4">Latest Articles</h2>

        {loading && (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        )}
        {error && <Alert variant="danger">{error}</Alert>}

        {!loading && !error && (
          <ListGroup variant="flush">
            {articles.map((article, index) => (
              <ListGroup.Item key={index} className="mb-3">
                <Card>
                  <Card.Body>
                    <Card.Title>
                      <a href={article.link} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                        {article.title}
                      </a>
                    </Card.Title>
                    <Card.Text className="text-muted">
                      Published on: {formatDate(article.pubDate)}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </div>
    </section>
  );
};

export default Articles;
