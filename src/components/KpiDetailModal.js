import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';

function KpiDetailModal({ show, onClose, onSubmit, kpiDetails }) {
  // Basic states for the modal
  const [selectedProgress, setSelectedProgress] = useState(0);
  const [comment, setComment] = useState('');
  
  // Update states when KPI details change or when modal is shown
  useEffect(() => {
    if (kpiDetails && show) {
      setSelectedProgress(kpiDetails.progress || 0);
      setComment('');
    }
  }, [kpiDetails, show]);

  // Return early if no KPI is selected
  if (!kpiDetails) return null;

  // Handle progress button clicks
  const handleProgressChange = (newProgress) => {
    setSelectedProgress(newProgress);
  };

  // Handle progress update submission
  const handleProgressSubmit = () => {
    // Validation
    if (!comment.trim()) {
      return alert('Please add a comment before updating progress.');
    }

    // Create new comment
    const newComment = {
      text: comment,
      date: new Date().toLocaleString(),
      progress: selectedProgress
    };
    
    // Create updated comments array
    const updatedComments = [...(kpiDetails.comments || []), newComment];
    
    // Match the parent component's expected data structure
    onSubmit({
      type: 'progress',
      progress: selectedProgress,
      comment: comment,
      comments: updatedComments
    });
    
    // Clear comment field after successful update
    setComment('');
    
    // Optionally close the modal after successful update
    // Uncomment this if you want the modal to close after submission
    // onClose();
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>KPI Details</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {/* KPI Title and Description */}
        <h5>{kpiDetails.title}</h5>
        <p>Grow traffic by 20% in Q3 through targeted ad campaigns.</p>
        
        {/* KPI Metadata - Styled to match the screenshot */}
        <div className="mb-3">
          <div style={{ marginBottom: '10px' }}>
            <span style={{ marginRight: '15px' }}>Category: {kpiDetails.category || 'Performance'}</span>
            <span style={{ marginRight: '15px' }}>Priority: {kpiDetails.priority || 'High'}</span>
            <span>Status: {kpiDetails.status || 'On Track'}</span>
          </div>
          <div>
            <span style={{ marginRight: '15px' }}>Start Date: {kpiDetails.startDate || '2025-07-01'}</span>
            <span style={{ marginRight: '15px' }}>Due Date: {kpiDetails.dueDate || '2025-09-30'}</span>
            <span>Verification: {kpiDetails.verification || 'Pending'}</span>
          </div>
        </div>
        
        {/* Current Progress Indicator */}
        <div className="mb-3">
          <div style={{ marginBottom: '5px' }}>Current Progress: {kpiDetails.progress || 80}%</div>
          <div className="progress" style={{ height: '20px' }}>
            <div 
              className="progress-bar bg-success" 
              style={{ width: `${kpiDetails.progress || 80}%` }}>
              {kpiDetails.progress || 80}%
            </div>
          </div>
        </div>
        
        {/* Update Progress Section */}
        <div className="mb-3">
          <div style={{ marginBottom: '10px' }}>Update Progress</div>
          <div style={{ display: 'flex', gap: '5px' }}>
            {[20, 40, 60, 80, 100].map((val) => (
              <Button
                key={val}
                variant={selectedProgress === val ? 'primary' : 'outline-primary'}
                onClick={() => handleProgressChange(val)}
                style={{ flex: '1', borderRadius: '4px' }}
              >
                {val}%
              </Button>
            ))}
          </div>
        </div>
        
        {/* Comment Field */}
        <div>
          <div style={{ marginBottom: '10px' }}>Comment</div>
          <textarea
            className="form-control"
            rows={4}
            placeholder="Add a comment about your progress..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{ resize: 'none', marginBottom: '15px' }}
          />
        </div>
      </Modal.Body>

      <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 15px' }}>
        <Button 
          variant="secondary" 
          onClick={onClose}
          style={{ backgroundColor: '#f8f9fa', color: '#212529', border: '1px solid #dee2e6' }}
        >
          Close
        </Button>
        <Button
          variant="primary"
          onClick={handleProgressSubmit}
          style={{ backgroundColor: '#0d6efd' }}
        >
          Update Progress
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default KpiDetailModal;