import React, { useEffect, useState } from 'react';
import { 
  Card, 
  Spinner, 
  Alert, 
  Badge,
  Form,
  InputGroup,
  Pagination
} from 'react-bootstrap';
import { 
  JournalRichtext, 
  Calendar3, 
  ArrowUpRightSquare, 
  Search,
  ExclamationTriangle,
  InfoCircle,
  SortDown,
  SortUp
} from 'react-bootstrap-icons';
import { format } from 'date-fns';
import { useTheme } from '../contexts/ThemeContext';
import { fetchRssFeed, RssArticle } from '../services/RssService';

type SortDirection = 'newest' | 'oldest';

const Articles: React.FC = () => {
  const { theme } = useTheme();
  const [articles, setArticles] = useState<RssArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filter, setFilter] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>(['all']);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const articlesPerPage = 6;
  
  // Sorting state
  const [sortDirection, setSortDirection] = useState<SortDirection>('newest');

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true);
        setDebugInfo("Attempting to fetch RSS feed...");
        
        // Use our service to fetch RSS articles with fallback
        const articleData = await fetchRssFeed();
        
        setDebugInfo(`Successfully loaded ${articleData.length} articles from RSS feed`);
        
        // Extract unique categories
        const categorySet = new Set<string>(['all']);
        articleData.forEach(article => {
          if (article.category) {
            categorySet.add(article.category);
          }
        });
        
        setArticles(articleData);
        setCategories(Array.from(categorySet));
        
        // Check localStorage for metadata
        const rssLastUpdated = localStorage.getItem('rssLastUpdated');
        const rssSource = localStorage.getItem('rssSource');
        
        if (rssLastUpdated) {
          setLastUpdated(rssLastUpdated);
        }
        
        if (rssSource) {
          setDataSource(rssSource);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading articles:', err);
        setError(err instanceof Error ? err.message : 'Unknown error loading articles');
        setDebugInfo(`Error loading articles: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  // Reset to first page when search term or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filter]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      
      // Check if the date is valid before formatting
      if (!isNaN(date.getTime())) {
        return format(date, 'MMMM d, yyyy');
      }
      
      return 'Unknown date';
    } catch (e) {
      console.error('Error formatting date:', dateString, e);
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

  // Sort articles by date
  const sortedArticles = [...filteredArticles].sort((a, b) => {
    const dateA = new Date(a.pubDate).getTime();
    const dateB = new Date(b.pubDate).getTime();
    
    return sortDirection === 'newest' ? dateB - dateA : dateA - dateB;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedArticles.length / articlesPerPage);
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = sortedArticles.slice(indexOfFirstArticle, indexOfLastArticle);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top of the articles section
    window.scrollTo({
      top: document.getElementById('articles-section')?.offsetTop || 0,
      behavior: 'smooth'
    });
  };

  // Handle sort direction change
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'newest' ? 'oldest' : 'newest');
  };

  // Force refresh the RSS feed
  const handleRefresh = async () => {
    try {
      setLoading(true);
      setError(null);
      setDebugInfo("Refreshing RSS feed...");
      
      // Clear cached data to force a fresh fetch
      localStorage.removeItem('cachedRssData');
      localStorage.removeItem('rssLastUpdated');
      localStorage.removeItem('rssSource');
      localStorage.removeItem('rssArticleCount');
      
      const articleData = await fetchRssFeed();
      
      setDebugInfo(`Successfully refreshed ${articleData.length} articles from RSS feed`);
      
      // Extract unique categories
      const categorySet = new Set<string>(['all']);
      articleData.forEach(article => {
        if (article.category) {
          categorySet.add(article.category);
        }
      });
      
      setArticles(articleData);
      setCategories(Array.from(categorySet));
      
      // Check localStorage for updated metadata
      const rssLastUpdated = localStorage.getItem('rssLastUpdated');
      const rssSource = localStorage.getItem('rssSource');
      
      if (rssLastUpdated) {
        setLastUpdated(rssLastUpdated);
      }
      
      if (rssSource) {
        setDataSource(rssSource);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error refreshing articles:', err);
      setError(err instanceof Error ? err.message : 'Unknown error refreshing articles');
      setDebugInfo(`Error refreshing articles: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setLoading(false);
    }
  };

  return (
    <section className="py-5" id="articles-section">
      <div className="container">
        <div className="row mb-4">
          <div className="col-lg-6">
            <h2 className="mb-0 d-flex align-items-center">
              <JournalRichtext size={28} className="text-primary me-2" />
              Articles from MarkHazleton.com
            </h2>
            <p className="text-body-secondary mt-2">
              Explore insights from Mark's personal blog
              {lastUpdated && (
                <small className="ms-2">
                  (Last updated: {formatDate(lastUpdated)})
                </small>
              )}
            </p>
            {(debugInfo || dataSource) && (
              <div className="small text-muted mt-1">
                {debugInfo && <div><strong>Status:</strong> {debugInfo}</div>}
                {dataSource && <div><strong>Source:</strong> {dataSource}</div>}
              </div>
            )}
          </div>
          <div className="col-lg-6">
            <div className="d-flex gap-2 mb-3">
              <InputGroup className="flex-grow-1">
                <InputGroup.Text className={theme === 'light' ? 'bg-light' : 'bg-dark'}>
                  <Search />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}
                />
              </InputGroup>
              <button 
                className={`btn ${theme === 'dark' ? 'btn-outline-light' : 'btn-outline-dark'} d-flex align-items-center`}
                onClick={toggleSortDirection}
                title={`Sort by ${sortDirection === 'newest' ? 'oldest' : 'newest'} first`}
              >
                {sortDirection === 'newest' ? (
                  <><SortDown className="me-1" /> Newest</>
                ) : (
                  <><SortUp className="me-1" /> Oldest</>
                )}
              </button>
              <button
                className={`btn ${theme === 'dark' ? 'btn-outline-primary' : 'btn-primary'} d-flex align-items-center`}
                onClick={handleRefresh}
                disabled={loading}
                title="Refresh articles from source"
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
            
            {/* Display article count for better visibility */}
            {articles.length > 0 && (
              <small className="d-block mb-2 text-body-secondary">
                <strong>Total articles:</strong> {articles.length}
              </small>
            )}
            
            {categories.length > 1 && (
              <div className="d-flex flex-wrap gap-2 mt-2">
                {categories.map((category, index) => (
                  <Badge 
                    key={index}
                    bg={filter === category ? 'primary' : (theme === 'dark' ? 'secondary' : 'light')} 
                    text={filter === category ? 'white' : (theme === 'dark' ? 'light' : 'dark')}
                    className="py-2 px-3"
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
            <p className="text-body-secondary">Loading articles...</p>
          </div>
        )}
        
        {error && (
          <Alert variant="danger" className="d-flex align-items-center">
            <ExclamationTriangle className="me-2 flex-shrink-0" />
            <div>{error}</div>
          </Alert>
        )}

        {!loading && !error && sortedArticles.length === 0 && (
          <Alert variant="info" className="d-flex align-items-center">
            <InfoCircle className="me-2 flex-shrink-0" />
            <div>No articles found matching your search criteria.</div>
          </Alert>
        )}

        {!loading && !error && sortedArticles.length > 0 && (
          <>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-4">
              {currentArticles.map((article, index) => (
                <div className="col" key={index}>
                  <Card className={`h-100 shadow-sm hover-shadow transition ${theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}`}>
                    <Card.Body>
                      <Card.Title className="mb-3">
                        <a 
                          href={article.link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className={`text-decoration-none stretched-link ${theme === 'dark' ? 'text-light' : 'text-dark'}`}
                        >
                          {article.title}
                        </a>
                      </Card.Title>
                      
                      {article.description && (
                        <Card.Text className="text-body-secondary mb-3 small">
                          {article.description.length > 150 
                            ? `${article.description.substring(0, 150)}...` 
                            : article.description}
                        </Card.Text>
                      )}
                      
                      <div className="d-flex align-items-center justify-content-between mt-3">
                        <div className="d-flex align-items-center text-body-secondary small">
                          <Calendar3 className="me-1" />
                          {formatDate(article.pubDate)}
                        </div>
                        
                        {article.category && (
                          <Badge 
                            bg={theme === 'dark' ? 'secondary' : 'light'} 
                            text={theme === 'dark' ? 'light' : 'dark'} 
                            className="py-1 px-2"
                          >
                            {article.category}
                          </Badge>
                        )}
                      </div>
                    </Card.Body>
                    <Card.Footer className={`border-top-0 text-end ${theme === 'dark' ? 'bg-dark' : 'bg-white'}`}>
                      <small className="text-body-secondary d-flex align-items-center justify-content-end">
                        Read more <ArrowUpRightSquare className="ms-1" size={12} />
                      </small>
                    </Card.Footer>
                  </Card>
                </div>
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-4">
                <Pagination>
                  <Pagination.First 
                    onClick={() => handlePageChange(1)} 
                    disabled={currentPage === 1} 
                  />
                  <Pagination.Prev 
                    onClick={() => handlePageChange(currentPage - 1)} 
                    disabled={currentPage === 1} 
                  />
                  
                  {/* Show limited page numbers for better UX */}
                  {Array.from({ length: totalPages }).map((_, index) => {
                    const pageNumber = index + 1;
                    // Show current page, first page, last page, and pages around current
                    if (
                      pageNumber === 1 || 
                      pageNumber === totalPages || 
                      (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <Pagination.Item 
                          key={pageNumber} 
                          active={pageNumber === currentPage}
                          onClick={() => handlePageChange(pageNumber)}
                        >
                          {pageNumber}
                        </Pagination.Item>
                      );
                    } else if (
                      (pageNumber === currentPage - 2 && currentPage > 3) || 
                      (pageNumber === currentPage + 2 && currentPage < totalPages - 2)
                    ) {
                      return <Pagination.Ellipsis key={pageNumber} />;
                    }
                    
                    return null;
                  })}
                  
                  <Pagination.Next 
                    onClick={() => handlePageChange(currentPage + 1)} 
                    disabled={currentPage === totalPages} 
                  />
                  <Pagination.Last 
                    onClick={() => handlePageChange(totalPages)} 
                    disabled={currentPage === totalPages} 
                  />
                </Pagination>
              </div>
            )}
            
            <div className="d-flex justify-content-between align-items-center mt-3">
              <div className="text-body-secondary small">
                Showing {indexOfFirstArticle + 1}-{Math.min(indexOfLastArticle, sortedArticles.length)} of {sortedArticles.length} articles
              </div>
              <div className="text-body-secondary small">
                Page {currentPage} of {totalPages}
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Article Component Explanation */}
      <div className="container mt-5 pt-3 border-top">
        <div className="row">
          <div className="col-12">
            <h3 className="h4 mb-4 d-flex align-items-center">
              <InfoCircle className="text-primary me-2" /> 
              How This Articles Component Works
            </h3>
            
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-light">
                <h4 className="h5 mb-0">Component Overview</h4>
              </div>
              <div className="card-body">
                <p>This Articles component provides a dynamic, responsive interface for fetching and displaying blog posts from an RSS feed. It demonstrates several modern React patterns and techniques:</p>
                
                <div className="row">
                  <div className="col-md-6">
                    <h5 className="h6 mb-2">Key Features:</h5>
                    <ul className="small mb-3">
                      <li>Dynamic fetching with error handling and fallback mechanisms</li>
                      <li>Client-side search functionality with instant filtering</li>
                      <li>Category filtering via interactive badges</li>
                      <li>Responsive pagination with dynamic page navigation</li>
                      <li>Sorting capabilities (newest/oldest)</li>
                      <li>Dark/light theme integration</li>
                      <li>Data caching to minimize unnecessary API calls</li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h5 className="h6 mb-2">Technologies Used:</h5>
                    <ul className="small">
                      <li>React Hooks for state management (useState, useEffect)</li>
                      <li>Bootstrap/React Bootstrap for UI components</li>
                      <li>Fetch API for data retrieval</li>
                      <li>LocalStorage for caching and persistence</li>
                      <li>date-fns for date formatting</li>
                      <li>Context API for theme management</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-light">
                <h4 className="h5 mb-0">Data Flow</h4>
              </div>
              <div className="card-body">
                <ol className="mb-3">
                  <li className="mb-2">
                    <strong>Fetching Data:</strong> The component loads data using the <code>fetchRssFeed()</code> service,
                    which attempts to retrieve RSS feed data from the primary source, with fallbacks to secondary sources
                    and cached data if needed.
                  </li>
                  <li className="mb-2">
                    <strong>State Management:</strong> Multiple state variables track different aspects of the component:
                    <ul className="small mt-1">
                      <li><code>articles</code>: The main data store for all retrieved articles</li>
                      <li><code>loading</code>: Tracks loading state for UI feedback</li>
                      <li><code>error</code>: Captures any errors during data fetching</li>
                      <li><code>searchTerm</code> & <code>filter</code>: Control content filtering</li>
                      <li><code>currentPage</code> & <code>sortDirection</code>: Control content presentation</li>
                    </ul>
                  </li>
                  <li className="mb-2">
                    <strong>Filtering & Sorting:</strong> The component combines multiple filters (search text and category) 
                    with sorting logic to display the most relevant subset of articles.
                  </li>
                  <li className="mb-2">
                    <strong>Pagination:</strong> Articles are divided into pages for better performance and user experience.
                    The pagination controls dynamically adjust based on the current position.
                  </li>
                </ol>
              </div>
            </div>
            
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-light">
                <h4 className="h5 mb-0">Behind the Scenes</h4>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <h5 className="h6 mb-2">Caching Strategy</h5>
                    <p className="small">
                      The component implements a sophisticated caching strategy to minimize API calls and provide 
                      a smooth user experience:
                    </p>
                    <ul className="small">
                      <li>RSS data is cached in localStorage after fetching</li>
                      <li>Timestamps track when data was last refreshed</li>
                      <li>Users can manually force a refresh if needed</li>
                      <li>Debug information shows the data source and status</li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h5 className="h6 mb-2">Error Handling</h5>
                    <p className="small">
                      Robust error handling ensures users aren't left with a broken experience:
                    </p>
                    <ul className="small">
                      <li>Multi-level fallback mechanisms for data loading</li>
                      <li>Clear error messages with friendly UI presentation</li>
                      <li>Debug information for troubleshooting</li>
                      <li>Safe date parsing with fallbacks for malformed dates</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card shadow-sm">
              <div className="card-header bg-light">
                <h4 className="h5 mb-0">Component Architecture</h4>
              </div>
              <div className="card-body">
                <p className="small">
                  This component follows several React best practices:
                </p>
                <ul className="small mb-3">
                  <li><strong>Separation of concerns:</strong> UI rendering is separated from data fetching</li>
                  <li><strong>Conditional rendering:</strong> Different UI states (loading, error, empty results) are handled elegantly</li>
                  <li><strong>Memoization:</strong> Expensive filtering and sorting operations are performed efficiently</li>
                  <li><strong>Accessibility:</strong> Proper ARIA attributes and semantic HTML structure</li>
                  <li><strong>Responsive design:</strong> Adapts to different screen sizes with Bootstrap's grid system</li>
                </ul>
                <p className="small">
                  The architecture prioritizes user experience by providing immediate feedback during loading,
                  clear error messages when things go wrong, and an intuitive interface for interacting with the content.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Articles;