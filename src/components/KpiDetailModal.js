import React, { useState, useEffect } from 'react';
import './KpiDetailModal.css'; // Import custom CSS

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

  // If modal is not showing, don't render anything
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Modal Header */}
        <div className="modal-header">
          <h3 className="modal-title">KPI Details</h3>
          <button 
            onClick={onClose}
            className="close-button"
          >
            ×
          </button>
        </div>
        
        {/* Modal Body */}
        <div className="modal-body">
          {/* KPI Details Header */}
          <div className="kpi-details-header">
            <h5>{kpiDetails.title}</h5>
            <p className="kpi-description">{kpiDetails.description}</p>
            <div className="kpi-info-row">
              <span>Category: <strong>{kpiDetails.category}</strong></span>
              <span>Priority: <strong>{kpiDetails.priority}</strong></span>
              <span>Status: <strong>{kpiDetails.status}</strong></span>
            </div>
            <div className="kpi-info-row">
              <span>Start Date: <strong>{kpiDetails.startDate}</strong></span>
              <span>Due Date: <strong>{kpiDetails.dueDate}</strong></span>
              <span>Verification: <strong>{kpiDetails.verifyStatus}</strong></span>
            </div>
          </div>

          {/* Success alert for actions */}
          {showSuccessAlert && (
            <div className="alert alert-success">
              <span>{successMessage}</span>
              <button 
                className="close-alert"
                onClick={() => setShowSuccessAlert(false)}
              >
                ×
              </button>
            </div>
          )}

          {/* Progress Display - Show actual KPI progress */}
          <h6>Current Progress: {kpiDetails.progress || 0}%</h6>
          <div className="progress-container">
            <div 
              className={`progress-bar ${(kpiDetails.progress || 0) === 100 ? 'progress-complete' : ''}`} 
              style={{ width: `${kpiDetails.progress || 0}%` }}>
            </div>
          </div>
          
          {/* Display comments if available */}
          {comments.length > 0 && (
            <div className="comments-section">
              <h6>Progress Comments:</h6>
              <div className="comments-container">
                {comments.map((comment, index) => (
                  <div key={index} className="comment-item">
                    <div className="comment-header">
                      <small className="comment-date">{comment.date || 'Unknown date'}</small>
                      <small className="progress-badge">
                        {comment.progress || 0}%
                      </small>
                    </div>
                    <p>{comment.text}</p>
                    {comment.isFinal && 
                      <small className="final-comment">Final submission comment</small>
                    }
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Display submitted message or edit controls */}
          {isSubmitted ? (
            <div className="submitted-message">
              Your KPI has been submitted. Please wait for verification.
            </div>
          ) : (
            <>
              {/* Progress Selection */}
              <div className="form-group">
                <label>Update Progress</label>
                <div className="progress-buttons">
                  {[20, 40, 60, 80, 100].map((val) => (
                    <button
                      key={val}
                      className={`progress-btn ${selectedProgress === val ? 'selected' : ''}`}
                      onClick={() => handleProgressChange(val)}
                    >
                      {val}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment Input */}
              <div className="form-group">
                <label htmlFor="comment">Comment</label>
                <textarea
                  id="comment"
                  rows={3}
                  className="comment-textarea"
                  placeholder="Add a comment about your progress..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
              </div>

              {/* Evidence Upload - Only show after progress is updated to 100% */}
              {showEvidenceSection && (
                <div className="form-group">
                  <label>Upload Evidence</label>
                  {!hasEvidence && (
                    <div className="warning-alert">
                      <i className="warning-icon">⚠️</i>
                      Please upload evidence to complete your KPI submission.
                    </div>
                  )}
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="file-input"
                  />
                  <button
                    className={`upload-btn ${files.length === 0 ? 'disabled' : ''}`}
                    onClick={handleEvidenceUpload}
                    disabled={files.length === 0}
                  >
                    Upload Evidence
                  </button>
                  {hasEvidence && <small className="success-text">✓ Evidence uploaded</small>}
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button 
            className="close-btn"
            onClick={onClose}
          >
            Close
          </button>
          
          {!isSubmitted && (
            <>
              {/* Update Progress Button */}
              <button
                className={`update-btn ${!comment.trim() ? 'disabled' : ''}`}
                onClick={handleProgressSubmit}
                disabled={!comment.trim()}
              >
                Update Progress
              </button>
              
              {/* Submit KPI Button - Only if progress is 100% and evidence is uploaded */}
              {showEvidenceSection && (
                <button
                  className={`submit-btn ${!hasEvidence ? 'disabled' : ''}`}
                  onClick={handleKpiSubmit}
                  disabled={!hasEvidence}
                >
                  Submit KPI
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default KpiDetailModal;