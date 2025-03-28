import React, { useEffect, useState } from 'react';
import { 
  Card, 
  Spinner, 
  Alert, 
  ListGroup, 
  Badge,
  Form,
  InputGroup 
} from 'react-bootstrap';
import { 
  JournalRichtext, 
  Calendar3, 
  ArrowUpRightSquare, 
  Search,
  ExclamationTriangle,
  InfoCircle 
} from 'react-bootstrap-icons';
import { format, parseISO } from 'date-fns';

interface Article {
  title: string;
  link: string;
  pubDate: string;
  category?: string;
}

const Articles: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filter, setFilter] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>(['all']);

  useEffect(() => {
    const fetchRSSFeed = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.BASE_URL}rss.xml`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch RSS feed: ${response.statusText}`);
        }
        
        const rssData = await response.text();

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(rssData, 'application/xml');
        
        if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
          throw new Error('Error parsing XML');
        }
        
        const items = xmlDoc.getElementsByTagName('item');
        
        if (items.length === 0) {
          setArticles([]);
          setLoading(false);
          return;
        }

        const parsedArticles: Article[] = [];
        const categorySet = new Set<string>(['all']);
        
        for (let i = 0; i < items.length; i++) {
          const titleElement = items[i].getElementsByTagName('title')[0];
          const linkElement = items[i].getElementsByTagName('link')[0];
          const pubDateElement = items[i].getElementsByTagName('pubDate')[0];
          const categoryElements = items[i].getElementsByTagName('category');
          
          const title = titleElement?.textContent?.trim() || '';
          const link = linkElement?.textContent?.trim() || '';
          const pubDate = pubDateElement?.textContent?.trim() || '';
          
          // Extract categories
          let mainCategory = '';
          if (categoryElements.length > 0) {
            mainCategory = categoryElements[0]?.textContent?.trim() || '';
            categorySet.add(mainCategory);
          }

          // Parse the date to ensure it's valid
          let validPubDate = pubDate;
          try {
            parseISO(pubDate);
          } catch (e) {
            validPubDate = new Date().toISOString();
          }

          parsedArticles.push({ 
            title, 
            link, 
            pubDate: validPubDate,
            category: mainCategory 
          });
        }

        // Sort articles by publication date (newest first)
        parsedArticles.sort((a, b) => {
          return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
        });

        setArticles(parsedArticles);
        setCategories(Array.from(categorySet));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching RSS feed:', err);
        setError('Unable to load articles. Please try again later.');
        setLoading(false);
      }
    };

    fetchRSSFeed();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'MMMM d, yyyy');
    } catch (e) {
      return 'Unknown date';
    }
  };

  // Filter articles based on search term and category
  const filteredArticles = articles.filter(article => {
    const matchesSearch = searchTerm === '' || 
      article.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || 
      article.category === filter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <section className="py-5">
      <div className="container">
        <div className="row mb-4">
          <div className="col-lg-6">
            <h2 className="mb-0 d-flex align-items-center">
              <JournalRichtext size={28} className="text-primary me-2" />
              Latest Articles
            </h2>
            <p className="text-muted mt-2">
              Explore technical insights and professional articles
            </p>
          </div>
          <div className="col-lg-6">
            <InputGroup className="mb-3">
              <InputGroup.Text className="bg-white">
                <Search />
              </InputGroup.Text>
              <Form.Control
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
            {categories.length > 1 && (
              <div className="d-flex flex-wrap gap-2 mt-2">
                {categories.map((category, index) => (
                  <Badge 
                    key={index}
                    bg={filter === category ? 'primary' : 'light'} 
                    text={filter === category ? 'white' : 'dark'}
                    className="py-2 px-3 cursor-pointer"
                    onClick={() => setFilter(category)}
                    style={{ cursor: 'pointer' }}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {loading && (
          <div className="text-center my-5">
            <Spinner animation="border" variant="primary" role="status" className="mb-3">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="text-muted">Loading articles...</p>
          </div>
        )}
        
        {error && (
          <Alert variant="danger" className="d-flex align-items-center">
            <ExclamationTriangle className="me-2 flex-shrink-0" />
            <div>{error}</div>
          </Alert>
        )}

        {!loading && !error && filteredArticles.length === 0 && (
          <Alert variant="info" className="d-flex align-items-center">
            <InfoCircle className="me-2 flex-shrink-0" />
            <div>No articles found matching your search criteria.</div>
          </Alert>
        )}

        {!loading && !error && filteredArticles.length > 0 && (
          <div className="row row-cols-1 row-cols-md-2 g-4">
            {filteredArticles.map((article, index) => (
              <div className="col" key={index}>
                <Card className="h-100 shadow-sm hover-shadow transition">
                  <Card.Body>
                    <Card.Title className="mb-3">
                      <a 
                        href={article.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-decoration-none text-dark stretched-link"
                      >
                        {article.title}
                      </a>
                    </Card.Title>
                    
                    <div className="d-flex align-items-center justify-content-between mt-3">
                      <div className="d-flex align-items-center text-muted small">
                        <Calendar3 className="me-1" />
                        {formatDate(article.pubDate)}
                      </div>
                      
                      {article.category && (
                        <Badge bg="light" text="dark" className="py-1 px-2">
                          {article.category}
                        </Badge>
                      )}
                    </div>
                  </Card.Body>
                  <Card.Footer className="bg-white border-top-0 text-end">
                    <small className="text-muted d-flex align-items-center justify-content-end">
                      Read more <ArrowUpRightSquare className="ms-1" size={12} />
                    </small>
                  </Card.Footer>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Articles;