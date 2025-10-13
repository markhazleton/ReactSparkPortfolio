import React from 'react';

interface UpdateNotificationProps {
  show: boolean;
  onUpdate: () => void;
  onDismiss: () => void;
}

export const UpdateNotification: React.FC<UpdateNotificationProps> = ({
  show,
  onUpdate,
  onDismiss
}) => {
  if (!show) return null;

  return (
    <div className="position-fixed top-0 start-50 translate-middle-x mt-3 update-notification">
      <div className="alert alert-info alert-dismissible d-flex align-items-center" role="alert">
        <i className="bi bi-info-circle-fill me-2"></i>
        <div className="flex-grow-1">
          <strong>Update Available!</strong> A new version is ready.
        </div>
        <button 
          type="button" 
          className="btn btn-sm btn-outline-primary me-2"
          onClick={onUpdate}
        >
          <i className="bi bi-arrow-clockwise me-1"></i>
          Update Now
        </button>
        <button 
          type="button" 
          className="btn-close" 
          aria-label="Dismiss"
          onClick={onDismiss}
        ></button>
      </div>
    </div>
  );
};