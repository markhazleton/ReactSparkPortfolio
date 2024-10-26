import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Chat from './Chat';

interface Variant {
  id: string;
  name: string;
  description: string;
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
        if (axios.isAxiosError(err) && err.response) {
          setError(err.response.data?.message || 'Failed to load variants');
        } else {
          setError('Failed to load variants');
        }
        console.error("Error fetching variants:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVariants();
  }, []);

  const handleVariantClick = useCallback((e: React.MouseEvent, variant: Variant) => {
    e.preventDefault();
    setSelectedVariant(variant);
  }, []);

  const handleCloseModal = () => {
    setSelectedVariant(null);
  };

  if (loading) return <div className="text-center my-4">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container">
      <h2 className="mb-4">Variants List <i className="bi bi-card-list"></i></h2>
      <ul className="list-group">
        {variants.map((variant) => (
          <li key={variant.id} className="list-group-item d-flex justify-content-between align-items-center" >
            <a href="#" className="link-primary" onClick={(e) => handleVariantClick(e, variant)}>
              {variant.name}
            </a>
            <i className="bi bi-arrow-right-circle"></i>
          </li>
        ))}
      </ul>

      {/* Modal for variant details and chat messages */}
      {selectedVariant && (
        <div
          className="modal fade show"
          tabIndex={-1}
          style={{ display: 'block' }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="variantModalTitle"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="variantModalTitle">
                  {selectedVariant.name}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  title="close"
                  onClick={handleCloseModal}
                  aria-label="Close modal"
                ></button>
              </div>
              <div className="modal-body">
                <p>{selectedVariant.description || 'No description available.'}</p>
                <Chat variantName={selectedVariant.name} /> {/* Chat component for real-time messages */}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Overlay for modals */}
      {selectedVariant && <div className="modal-backdrop fade show" onClick={handleCloseModal}></div>}
    </div>
  );
};

export default VariantList;
