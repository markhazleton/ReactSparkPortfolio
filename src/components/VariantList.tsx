import React, { useState } from 'react';
import { Spinner, Alert, Modal, Button } from 'react-bootstrap';
import { useFetchVariants } from './hooks/useFetchVariants';
import Chat from './Chat';
import { Variant } from './types';
import VariantDropdown from './modules/VariantDropdown';
import PromptSparkInfo from './modules/PromptSparkInfo';

const VariantList: React.FC = () => {
  const { variants, loading, error } = useFetchVariants(
    'https://webspark.markhazleton.com/api/PromptSpark/Variant'
  );
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  const handleCloseModal = () => setSelectedVariant(null);

  return (
    <div className="container">
      <h2 className="mb-4">PromptSpark Variants</h2>

      {/* Display loading spinner */}
      {loading && (
        <div className="text-center my-4">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}

      {/* Display error message */}
      {error && (
        <Alert variant="danger" dismissible>
          {error}
        </Alert>
      )}

      {/* Display VariantDropdown and Join Chat button if no errors */}
      {!loading && !error && (
        <>
          <VariantDropdown
            variants={variants}
            selectedVariant={selectedVariant}
            onSelect={setSelectedVariant}
          />
          <Button variant="primary" disabled={!selectedVariant} onClick={() => {}}>
            Join Chat
          </Button>
        </>
      )}

      {/* Include PromptSparkInfo component for static content */}
      <PromptSparkInfo />

      {/* Fullscreen Modal for Chat */}
      {selectedVariant && (
        <Modal show={true} onHide={handleCloseModal} fullscreen>
          <Modal.Header closeButton>
            <Modal.Title>Chat with {selectedVariant.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Chat variantName={selectedVariant.name} />
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

export default VariantList;
