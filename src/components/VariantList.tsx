import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Spinner, Card, Dropdown, DropdownButton, Alert } from 'react-bootstrap';
import Chat from './Chat';

interface Variant {
  id: string;
  name: string;
  description?: string;
}

const VariantList: React.FC = () => {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  useEffect(() => {
    const fetchVariants = async () => {
      try {
        const response = await axios.get<Variant[]>('https://webspark.markhazleton.com/api/PromptSpark/Variant');
        setVariants(response.data);
      } catch (err) {
        const message = axios.isAxiosError(err) && err.response
          ? err.response.data?.message || 'Failed to load variants'
          : 'An unexpected error occurred';
        setError(message);
        console.error('Error fetching variants:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVariants();
  }, []);

  const handleSelectVariant = (variant: Variant) => {
    setSelectedVariant(variant);
  };

  const handleCloseModal = () => {
    setSelectedVariant(null);
  };

  return (
    <div className="container">
      <h2 className="mb-4">PromptSpark Variants</h2>
      {!loading && !error && (
        <>
          {/* Dropdown for Variants */}
          <DropdownButton
            id="variant-dropdown"
            title={selectedVariant ? selectedVariant.name : 'Select a Variant'}
            className="mb-4"
          >
            {variants.map((variant) => (
              <Dropdown.Item key={variant.id} onClick={() => handleSelectVariant(variant)}>
                {variant.name}
              </Dropdown.Item>
            ))}
          </DropdownButton>

          {/* Button to Join Chat */}
          <Button
            variant="primary"
            onClick={() => setSelectedVariant(selectedVariant)}
            disabled={!selectedVariant}
          >
            Join Chat
          </Button>
        </>
      )}

      {/* Bootstrap Card to Explain PromptSpark and Variants */}
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>What is PromptSpark?</Card.Title>
          <Card.Text>
            PromptSpark is a tool designed to help developers optimize their prompts for large language models (LLMs). 
            A "Variant Spark" represents a specific configuration or version of a prompt, allowing users to compare, 
            refine, and test different prompt strategies for their applications.
          </Card.Text>
          <Card.Text>
            PromptSpark is a powerful framework designed to help users optimize their usage of language models like GPT. 
            It provides a suite of tools for managing, tracking, and experimenting with prompts to enhance productivity 
            and ensure reliable outputs. By structuring your interactions with language models, PromptSpark helps you achieve higher efficiency and better outcomes.
          </Card.Text>
          <Card.Subtitle className="mt-3 mb-2">What is a Variant Spark?</Card.Subtitle>
          <Card.Text>
            A variant spark is a customized configuration or specialized prompt template tailored to a specific use case. 
            Variants allow you to adapt the behavior of the model for tasks like brainstorming, summarization, 
            data analysis, or other specialized functions. Each variant acts as a starting point for focused 
            and efficient interactions with the model.
          </Card.Text>          <Card.Link href="https://webspark.markhazleton.com/PromptSpark/home/learnmore" target="_blank">
            Learn more about PromptSpark
          </Card.Link>
          <div className="ratio ratio-16x9">
            <iframe
              src="https://www.youtube.com/embed/GVAhKtAn0Sk?si=Ep91bh7YZvm3DuVr"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>


        </Card.Body>
      </Card>

      {loading && (
        <div className="text-center my-4">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}


      {/* Modal for Chat */}
      {selectedVariant && (
        <Modal show={true} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>{selectedVariant.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{selectedVariant.description || 'No description available.'}</p>
            <Chat variantName={selectedVariant.name} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default VariantList;
