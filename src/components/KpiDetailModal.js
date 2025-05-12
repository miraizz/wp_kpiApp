import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

function KpiDetailModal({ show, onClose, onSubmit, kpiDetails }) {
  // Basic states for the modal
  const [selectedProgress, setSelectedProgress] = useState(0);
  const [currentProgress, setCurrentProgress] = useState(0); // Actual progress from KPI
  const [comment, setComment] = useState('');
  const [files, setFiles] = useState([]);
  const [hasEvidence, setHasEvidence] = useState(false);
  const [comments, setComments] = useState([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showEvidenceSection, setShowEvidenceSection] = useState(false);
  
  // Update states when KPI details change
  useEffect(() => {
    if (kpiDetails) {
      setSelectedProgress(kpiDetails.progress || 0);
      setCurrentProgress(kpiDetails.progress || 0);
      setComment('');
      setFiles([]);
      
      // Check if evidence files exist
      setHasEvidence(kpiDetails.files && kpiDetails.files.length > 0);
      
      // Initialize comments array if it exists in kpiDetails
      setComments(kpiDetails.comments || []);
      setShowSuccessAlert(false);
      
      // Only show evidence section if current progress is 100%
      setShowEvidenceSection(kpiDetails.progress === 100);
    }
  }, [kpiDetails]);

  // Return early if no KPI is selected
  if (!kpiDetails) return null;

  // Check if KPI is already submitted
  const isSubmitted = kpiDetails.submitted === true;

  // Handle progress button clicks
  const handleProgressChange = (newProgress) => {
    setSelectedProgress(newProgress);
  };

  // Handle file selection
  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  // Handle evidence upload
  const handleEvidenceUpload = () => {
    if (files.length > 0) {
      // Send evidence to parent component
      onSubmit({
        type: 'evidence',
        evidence: files,
        progress: currentProgress
      });
      
      // Set evidence as uploaded locally
      setHasEvidence(true);
      
      // Clear files after upload
      setFiles([]);
      
      // Show success message for evidence upload
      setSuccessMessage('Evidence uploaded successfully! You can now submit your KPI.');
      setShowSuccessAlert(true);
    }
  };

  // Handle progress update submission
  const handleProgressSubmit = () => {
    // Basic validation
    if (!comment.trim()) {
      return alert('Please add a comment before updating progress.');
    }

    // Create new comment
    const newComment = {
      text: comment,
      date: new Date().toLocaleString(),
      progress: selectedProgress
    };
    
    // Update local comments array
    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    
    // Update current progress (this controls when to show evidence section)
    setCurrentProgress(selectedProgress);
    
    // Only show evidence section if selected progress is 100%
    if (selectedProgress === 100) {
      setShowEvidenceSection(true);
      // Show success message with evidence reminder for 100% progress
      setSuccessMessage('Progress updated to 100%! Please upload evidence before submitting your KPI.');
    } else {
      setShowEvidenceSection(false);
      setHasEvidence(false); // Reset evidence when progress is not 100%
      // Regular success message
      setSuccessMessage('Progress updated successfully!');
    }
    
    // Match the parent component's expected data structure
    onSubmit({
      type: 'progress',
      progress: selectedProgress,
      comment: comment,
      comments: updatedComments
    });
    
    // Show success alert
    setShowSuccessAlert(true);
    
    // Clear comment field after successful update
    setComment('');
  };
  
  // Handle final KPI submission
  const handleKpiSubmit = () => {
    // Get the last comment from the comments array to use as final comment
    let finalCommentText = "";
    if (comments.length > 0) {
      finalCommentText = comments[comments.length - 1].text;
    }
    
    // Create final comment object using the last comment text
    const finalComment = {
      text: finalCommentText,
      date: new Date().toLocaleString(),
      progress: 100,
      isFinal: true
    };
    
    // Update comments with final comment (if not empty)
    let updatedComments = [...comments];
    if (finalCommentText) {
      updatedComments = [...comments, finalComment];
    }
    
    // Match the parent component's expected data structure
    onSubmit({
      type: 'submit',
      progress: 100,
      comment: finalCommentText,
      comments: updatedComments
    });
    
    // Show success message
    setSuccessMessage('KPI submitted successfully!');
    setShowSuccessAlert(true);
  };

  // Define when Submit KPI button should be enabled
  const canSubmitKpi = currentProgress === 100 && hasEvidence && !isSubmitted;

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>KPI Details</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {/* KPI Details Header */}
        <div className="kpi-details-header mb-4 p-3 border-bottom">
          <h5>{kpiDetails.title}</h5>
          <p className="text-muted mb-1">{kpiDetails.description}</p>
          <div className="d-flex justify-content-between mb-2">
            <span>Category: <strong>{kpiDetails.category}</strong></span>
            <span>Priority: <strong>{kpiDetails.priority}</strong></span>
            <span>Status: <strong>{kpiDetails.status}</strong></span>
          </div>
          <div className="d-flex justify-content-between">
            <span>Start Date: <strong>{kpiDetails.startDate}</strong></span>
            <span>Due Date: <strong>{kpiDetails.dueDate}</strong></span>
            <span>Verification: <strong>{kpiDetails.verifyStatus}</strong></span>
          </div>
        </div>

        {/* Success alert for actions */}
        {showSuccessAlert && (
          <Alert 
            variant="success" 
            onClose={() => setShowSuccessAlert(false)} 
            dismissible
          >
            {successMessage}
          </Alert>
        )}

        {/* Progress Display - Show actual KPI progress */}
        <h6>Current Progress: {kpiDetails.progress || 0}%</h6>
        <div className="progress mb-3">
          <div 
            className={`progress-bar ${(kpiDetails.progress || 0) === 100 ? 'bg-success' : 'bg-info'}`} 
            style={{ width: `${kpiDetails.progress || 0}%` }}>
            {kpiDetails.progress || 0}%
          </div>
        </div>
        
        {/* Display comments if available */}
        {comments.length > 0 && (
          <div className="mb-4">
            <h6>Progress Comments:</h6>
            <div className="comment-history p-2 border rounded" style={{ maxHeight: '150px', overflowY: 'auto' }}>
              {comments.map((comment, index) => (
                <div key={index} className="mb-2 p-2 border-bottom">
                  <div className="d-flex justify-content-between">
                    <small className="text-muted">{comment.date || 'Unknown date'}</small>
                    <small className="badge bg-info">{comment.progress || 0}%</small>
                  </div>
                  <p className="mb-0">{comment.text}</p>
                  {comment.isFinal && <small className="text-success">Final submission comment</small>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Display submitted message or edit controls */}
        {isSubmitted ? (
          <Alert variant="info" className="mt-3">
            Your KPI has been submitted. Please wait for verification.
          </Alert>
        ) : (
          <>
            {/* Progress Selection */}
            <Form.Group className="mb-3">
              <Form.Label>Update Progress</Form.Label>
              <div className="d-flex gap-2 mb-3">
                {[20, 40, 60, 80, 100].map((val) => (
                  <Button
                    key={val}
                    variant={selectedProgress === val ? 'primary' : 'outline-primary'}
                    onClick={() => handleProgressChange(val)}
                  >
                    {val}%
                  </Button>
                ))}
              </div>
            </Form.Group>

            {/* Comment Input */}
            <Form.Group className="mb-3">
              <Form.Label>Comment</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Add a comment about your progress..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </Form.Group>

            {/* Evidence Upload - Only show after progress is updated to 100% */}
            {showEvidenceSection && (
              <Form.Group className="mb-3">
                <Form.Label>Upload Evidence</Form.Label>
                {!hasEvidence && (
                  <Alert variant="warning" className="mb-2">
                    <i className="fa fa-exclamation-triangle"></i> Please upload evidence to complete your KPI submission.
                  </Alert>
                )}
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="form-control mb-2"
                />
                <Button
                  variant="outline-secondary"
                  onClick={handleEvidenceUpload}
                  disabled={files.length === 0}
                >
                  Upload Evidence
                </Button>
                {hasEvidence && <small className="text-success d-block mt-1">✓ Evidence uploaded</small>}
              </Form.Group>
            )}
          </>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Close</Button>
        
        {!isSubmitted && (
          <>
            {/* Update Progress Button */}
            <Button
              variant="primary"
              onClick={handleProgressSubmit}
              disabled={!comment.trim()}
            >
              Update Progress
            </Button>
            
            {/* Submit KPI Button - Only if progress is 100% and evidence is uploaded */}
            {showEvidenceSection && (
              <Button
                variant="success"
                onClick={handleKpiSubmit}
                disabled={!hasEvidence}
              >
                Submit KPI
              </Button>
            )}
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default KpiDetailModal;