import React, { useState } from 'react';
import { Spinner, Alert, Modal, Button, Card, Nav, Badge, Form, InputGroup } from 'react-bootstrap';
import { useFetchVariants } from './hooks/useFetchVariants';
import Chat from './Chat';
import { Variant } from './types';
import PromptSparkInfo from './modules/PromptSparkInfo';
import { Robot, Star, Search, InfoCircle, XCircle, ChatDots } from 'react-bootstrap-icons';
import { useTheme } from '../contexts/ThemeContext';

// Extended variant interface with categories and featured flag
interface EnhancedVariant extends Variant {
  category: string;
  featured?: boolean;
  icon?: string;  // Could be a URL or icon name
}

const VariantList: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const { variants: rawVariants, loading, error } = useFetchVariants(
    'https://webspark.markhazleton.com/api/PromptSpark/Variant'
  );
  
  const [selectedVariant, setSelectedVariant] = useState<EnhancedVariant | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showDescription, setShowDescription] = useState<string | null>(null);
  
  // Transform and categorize variants
  const enhancedVariants: EnhancedVariant[] = React.useMemo(() => {
    if (!rawVariants || rawVariants.length === 0) return [];
    
    // Assign categories and featured status based on variant properties
    return rawVariants.map((variant): EnhancedVariant => {
      // This is where you would assign real categories based on naming conventions or other data
      // For now, we'll create categories based on name patterns
      let category = 'General';
      let featured = false;
      
      const lowerName = variant.name.toLowerCase();
      
      if (lowerName.includes('gpt')) {
        category = 'GPT Models';
      } else if (lowerName.includes('code') || lowerName.includes('dev')) {
        category = 'Development';
      } else if (lowerName.includes('creative') || lowerName.includes('story') || lowerName.includes('write')) {
        category = 'Creative';
      } else if (lowerName.includes('data') || lowerName.includes('analysis')) {
        category = 'Data Analysis';
      }
      
      // Mark some variants as featured (you would customize this logic)
      if (lowerName.includes('4') || lowerName.includes('latest') || lowerName.includes('featured')) {
        featured = true;
      }
      
      return {
        ...variant,
        category,
        featured,
        // Add a default description if none exists
        description: variant.description || `Chat with the ${variant.name} variant of PromptSpark AI.`
      };
    });
  }, [rawVariants]);
  
  // Generate unique categories
  const categories = React.useMemo(() => {
    if (enhancedVariants.length === 0) return ['all'];
    const uniqueCategories = Array.from(new Set(['all', ...enhancedVariants.map(v => v.category)]));
    return uniqueCategories;
  }, [enhancedVariants]);
  
  // Get featured variants - limit to only 3
  const featuredVariants = React.useMemo(() => {
    return enhancedVariants.filter(v => v.featured).slice(0, 3);
  }, [enhancedVariants]);
  
  // Filter variants based on search and category
  const filteredVariants = React.useMemo(() => {
    return enhancedVariants.filter(variant => {
      const matchesSearch = searchTerm === '' || 
        variant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (variant.description && variant.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = activeCategory === 'all' || variant.category === activeCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [enhancedVariants, searchTerm, activeCategory]);
  
  const handleCloseModal = () => setSelectedVariant(null);
  
  const handleStartChat = (variant: EnhancedVariant) => {
    setSelectedVariant(variant);
  };
  
  const toggleDescription = (id: string) => {
    if (showDescription === id) {
      setShowDescription(null);
    } else {
      setShowDescription(id);
    }
  };

  return (
    <div className={`container py-5 ${isDark ? 'text-light' : ''}`}>
      <div className="row mb-4">
        <div className="col-lg-6">
          <h2 className="mb-0 d-flex align-items-center">
            <Robot size={32} className="text-primary me-2" />
            PromptSpark AI Assistants
          </h2>
          <p className={isDark ? 'text-light-emphasis mt-2' : 'text-body-secondary mt-2'}>
            Select an AI assistant to chat with and get personalized help
          </p>
        </div>
        <div className="col-lg-6">
          <InputGroup className="mb-3">
            <InputGroup.Text className={isDark ? 'bg-dark text-light border-secondary' : 'bg-light'}>
              <Search />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search assistants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={isDark ? 'bg-dark text-light border-secondary' : ''}
              aria-label="Search assistants"
            />
            {searchTerm && (
              <Button 
                variant={isDark ? 'outline-light' : 'outline-dark'} 
                onClick={() => setSearchTerm('')}
                aria-label="Clear search"
              >
                <XCircle />
              </Button>
            )}
          </InputGroup>
        </div>
      </div>

      {/* Display loading spinner */}
      {loading && (
        <div className="text-center my-4">
          <Spinner animation="border" role="status" variant={isDark ? 'light' : 'primary'}>
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className={isDark ? 'text-light-emphasis mt-2' : 'text-body-secondary mt-2'}>Loading AI assistants...</p>
        </div>
      )}

      {/* Display error message */}
      {error && (
        <Alert variant="danger" dismissible className="d-flex align-items-center">
          <InfoCircle className="me-2 flex-shrink-0" />
          <div>Error loading AI assistants: {error}</div>
        </Alert>
      )}

      {/* Display categorized variants */}
      {!loading && !error && enhancedVariants.length > 0 && (
        <React.Fragment>
          {/* Category Navigation */}
          <Nav 
            key="category-nav"
            variant={isDark ? 'dark' : 'pills'} 
            className="mb-4 flex-nowrap overflow-auto pb-2"
            activeKey={activeCategory}
            onSelect={(key) => key && setActiveCategory(key)}
          >
            {categories.map(category => (
              <Nav.Item key={category}>
                <Nav.Link 
                  eventKey={category}
                  className={`text-nowrap mx-1 ${activeCategory === category ? 'category-active' : 'category-inactive'} ${isDark && activeCategory === category ? 'category-active-dark' : ''}`}
                >
                  {category === 'all' ? 'All Assistants' : category}
                  {category !== 'all' && (
                    <Badge 
                      bg={isDark ? 'secondary' : 'light'} 
                      text={isDark ? 'light' : 'dark'} 
                      pill 
                      className="ms-2"
                    >
                      {enhancedVariants.filter(v => v.category === category).length}
                    </Badge>
                  )}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
          
          {/* Featured Variants (if selected category is 'all' and not searching) - limited to 3 */}
          {activeCategory === 'all' && !searchTerm && featuredVariants.length > 0 && (
            <div key="featured-variants" className="mb-5">
              <h3 className="h5 mb-3 d-flex align-items-center">
                <Star className="text-warning me-2" /> Featured Assistants
              </h3>
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {featuredVariants.map((variant, index) => (
                  <div className="col" key={`featured-${variant.id || index}`}>
                    <Card 
                      className={`h-100 border-primary shadow-sm border-2 ${isDark ? 'bg-dark text-light border-primary' : ''}`}
                    >
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div className="d-flex align-items-center">
                            <div className="rounded-circle bg-primary p-2 me-2">
                              <Robot size={24} className="text-white" />
                            </div>
                            <h5 className="card-title mb-0">{variant.name}</h5>
                          </div>
                          <Badge bg="warning" text="dark">Featured</Badge>
                        </div>
                        
                        <Card.Text className={isDark ? 'text-light-emphasis' : 'text-body-secondary'}>
                          {variant.description}
                        </Card.Text>
                      </Card.Body>
                      <Card.Footer className={`border-top-0 ${isDark ? 'bg-dark' : 'bg-white'}`}>
                        <Button 
                          variant={isDark ? 'primary' : 'primary'} 
                          className="w-100 d-flex align-items-center justify-content-center"
                          onClick={() => handleStartChat(variant)}
                        >
                          <ChatDots className="me-2" /> Start Chat
                        </Button>
                      </Card.Footer>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* PromptSpark Info section (moved between featured and full list) */}
          {activeCategory === 'all' && !searchTerm && (
            <div key="promptspark-info" className="mb-5">
              <PromptSparkInfo />
            </div>
          )}
          
          {/* All Filtered Variants */}
          <div key="filtered-variants" className="mb-4">
            {activeCategory !== 'all' || searchTerm ? (
              <h3 className="h5 mb-3">
                {filteredVariants.length} {filteredVariants.length === 1 ? 'Assistant' : 'Assistants'} Found
              </h3>
            ) : (
              <h3 className="h5 mb-3">All Assistants</h3>
            )}
            
            {filteredVariants.length === 0 ? (
              <Alert variant={isDark ? 'secondary' : 'info'} className="d-flex align-items-center">
                <InfoCircle className="me-2 flex-shrink-0" />
                <div>No assistants match your search criteria. Try different terms or categories.</div>
              </Alert>
            ) : (
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {filteredVariants.map((variant, index) => (
                  <div className="col" key={`filtered-${variant.id || index}`}>
                    <Card 
                      className={`h-100 shadow-sm ${isDark ? 'bg-dark text-light border-secondary' : ''}`}
                    >
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div className="d-flex align-items-center">
                            <div className="rounded-circle bg-secondary p-2 me-2">
                              <Robot size={20} className="text-white" />
                            </div>
                            <h5 className="card-title mb-0">{variant.name}</h5>
                          </div>
                          <Badge 
                            bg={isDark ? 'secondary' : 'light'} 
                            text={isDark ? 'light' : 'dark'}
                          >
                            {variant.category}
                          </Badge>
                        </div>
                        
                        <Card.Text 
                          className={`small ${isDark ? 'text-light-emphasis' : 'text-body-secondary'}`}
                        >
                          <>
                            {variant.description && variant.description.length > 100 && showDescription !== variant.id
                              ? `${variant.description.substring(0, 100)}... `
                              : variant.description}
                              
                            {variant.description && variant.description.length > 100 && (
                              <Button 
                                variant="link" 
                                size="sm" 
                                className={`p-0 ${isDark ? 'text-light' : ''}`}
                                onClick={() => toggleDescription(variant.id)}
                              >
                                {showDescription === variant.id ? 'Show less' : 'Show more'}
                              </Button>
                            )}
                          </>
                        </Card.Text>
                      </Card.Body>
                      <Card.Footer className={`border-top-0 ${isDark ? 'bg-dark' : 'bg-white'}`}>
                        <Button 
                          variant={isDark ? 'outline-light' : 'outline-primary'} 
                          className="w-100 d-flex align-items-center justify-content-center"
                          onClick={() => handleStartChat(variant)}
                        >
                          <ChatDots className="me-2" /> Start Chat
                        </Button>
                      </Card.Footer>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </div>
        </React.Fragment>
      )}

      {/* Fullscreen Modal for Chat */}
      {selectedVariant && (
        <Modal show={true} onHide={handleCloseModal} fullscreen className={isDark ? 'dark-modal' : ''}>
          <Modal.Header closeButton className={isDark ? 'bg-dark text-light border-secondary' : ''}>
            <Modal.Title className="d-flex align-items-center">
              <Robot className="me-2" /> Chat with {selectedVariant.name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className={isDark ? 'bg-dark text-light' : ''}>
            <Chat variantName={selectedVariant.name} />
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

export default VariantList;
