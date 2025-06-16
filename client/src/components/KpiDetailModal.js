import React, { useState, useEffect } from 'react';
import './KpiDetailModal.css'; // Import custom CSS

function KpiDetailModal({ show, onClose, onSubmit, kpiDetails }) {
  const [selectedProgress, setSelectedProgress] = useState(0);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [comment, setComment] = useState('');
  const [files, setFiles] = useState([]);
  const [hasEvidence, setHasEvidence] = useState(false);
  const [comments, setComments] = useState([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showEvidenceSection, setShowEvidenceSection] = useState(false);
  const [evidenceUploaded, setEvidenceUploaded] = useState(false);
  const [evidenceError, setEvidenceError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (kpiDetails) {
      // Get the latest progress from comments or use the KPI's progress
      const latestComment = kpiDetails.comments && kpiDetails.comments.length > 0 
        ? kpiDetails.comments[kpiDetails.comments.length - 1]
        : null;
      
      const latestProgress = latestComment ? latestComment.progress : (kpiDetails.progress || 0);
      
      setSelectedProgress(latestProgress);
      setCurrentProgress(latestProgress);
      setComment('');
      setFiles([]);
      setHasEvidence(kpiDetails.evidenceFiles && kpiDetails.evidenceFiles.length > 0);
      setComments(kpiDetails.comments || []);
      setShowSuccessAlert(false);
      setShowEvidenceSection(latestProgress === 100 && !kpiDetails.submitted);
      setEvidenceUploaded(kpiDetails.evidenceFiles && kpiDetails.evidenceFiles.length > 0);
    }
  }, [kpiDetails]);

  if (!kpiDetails) return null;

  // Update isSubmitted check to also verify progress and evidence
  const isSubmitted = kpiDetails.submitted === true && kpiDetails.progress === 100 && kpiDetails.evidenceFiles && kpiDetails.evidenceFiles.length > 0;

  // Get the latest progress for display
  const displayProgress = comments.length > 0 ? comments[comments.length - 1].progress : currentProgress;

  // Get clean title without verification status
  const cleanTitle = kpiDetails.title.replace(/\s*Verified$/, '');

  const handleProgressChange = (newProgress) => {
    setSelectedProgress(newProgress);
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleClearSelectedFiles = () => {
    setFiles([]);
    // Reset the file input
    const fileInput = document.querySelector('.file-input');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleEvidenceUpload = async () => {
    if (files.length > 0) {
      setIsUploading(true);
      setEvidenceError('');
      try {
        console.log('Starting evidence upload with files:', files.length);

        const base64Files = await Promise.all(files.map(file => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              // Extract the base64 data without the data URL prefix
              const base64Data = reader.result.split(',')[1];
              resolve({
                filename: file.name,
                mimetype: file.type,
                data: base64Data,
                uploadedAt: new Date().toISOString()
              });
            };
            reader.onerror = (error) => {
              console.error('Error reading file:', error);
              reject(error);
            };
            reader.readAsDataURL(file);
          });
        }));

        const response = await fetch(`/api/kpi/${kpiDetails.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            evidenceFiles: base64Files,
            progress: currentProgress
          })
        });

        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.error || 'Failed to upload evidence');
        }

        setHasEvidence(true);
        setEvidenceUploaded(true);
        setFiles([]);
        setSuccessMessage('Evidence uploaded successfully! Now you can submit your KPI.');
        setShowSuccessAlert(true);
        setEvidenceError('');
        // Notify parent component
        const updatedKpi = await fetch(`/api/kpi/${kpiDetails.id}`).then(res => res.json());
        if (onSubmit) {
          onSubmit({
            type: 'evidence',
            evidence: base64Files,
            updatedKpi
          });
        }
      } catch (error) {
        console.error('Failed to upload evidence:', error);
        setEvidenceError(error.message || 'Error uploading evidence. Please try again.');
        setHasEvidence(false);
        setEvidenceUploaded(false);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleClearEvidence = () => {
    setFiles([]);
    setEvidenceError('');
    setIsUploading(false);
  };

  const handleProgressSubmit = async () => {
    if (!comment.trim()) {
      return alert('Please add a comment before updating progress.');
    }

    const newComment = {
      text: comment,
      date: new Date().toISOString(),
      progress: selectedProgress,
      by: 'Staff'
    };

    const updatedComments = [...comments, newComment];

    try {
      console.log('Sending update request with:', {
        id: kpiDetails.id,
        progress: selectedProgress,
        comments: updatedComments,
        status: getStatusFromProgress(selectedProgress)
      });

      // Make the API call first
      const response = await fetch(`/api/kpi/${kpiDetails.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          progress: selectedProgress,
          comments: updatedComments,
          status: getStatusFromProgress(selectedProgress)
        })
      });

      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to update KPI');
      }

      // Update local state only after successful API call
      setComments(updatedComments);
      setCurrentProgress(selectedProgress);

      // Update local state
      if (selectedProgress === 100) {
        setShowEvidenceSection(true);
        setSuccessMessage('Progress updated to 100%. Please upload evidence next.');
      } else {
        setShowEvidenceSection(false);
        setHasEvidence(false);
        setSuccessMessage('Progress updated successfully.');
      }

      // Notify parent component of the update
      if (onSubmit) {
        onSubmit({
          type: 'progress',
          progress: selectedProgress,
          comments: updatedComments,
          comment: comment
        });
      }

      setShowSuccessAlert(true);
      setComment('');
    } catch (error) {
      console.error('Error updating progress:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
      alert(`Failed to update progress: ${error.message}`);
    }
  };

  const getStatusFromProgress = (progress) => {
    if (progress === 100) return 'Completed';
    if (progress >= 60) return 'On Track';
    if (progress === 40) return 'At Risk';
    return 'Behind';
  };

  const handleKpiSubmit = async () => {
    if (currentProgress !== 100) {
      return alert('Progress must be 100% before submitting.');
    }
    
    if (!evidenceUploaded) {
      return alert('Please upload evidence before submitting.');
    }

    const finalCommentText = comments.length > 0 ? comments[comments.length - 1].text : 'Final submission';

    const finalComment = {
      text: finalCommentText,
      date: new Date().toISOString(),
      progress: 100,
      isFinal: true,
      by: 'Staff'
    };

    const updatedComments = [...comments, finalComment];

    try {
      const response = await fetch(`/api/kpi/${kpiDetails.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submitted: true,
          verifyStatus: 'Pending',
          progress: 100,
          comments: updatedComments
        })
      });

      if (!response.ok) throw new Error('Failed to submit KPI');

      setComments(updatedComments);
      setSuccessMessage('KPI submitted successfully and is now pending verification.');
      setShowSuccessAlert(true);
      setShowEvidenceSection(false); // Hide evidence section after submission
    } catch (error) {
      console.error('Error submitting KPI:', error);
      alert('Failed to submit KPI. Please try again.');
    }
  };

  const canSubmitKpi = currentProgress === 100 && evidenceUploaded && !isSubmitted;

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
            <h5>{cleanTitle}</h5>
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
          <h6>Current Progress: {currentProgress}%</h6>
          <div className="progress-container">
            <div
              className={`progress-bar ${currentProgress === 100 ? 'progress-complete' : ''}`}
              style={{ width: `${currentProgress}%` }}>
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
              {kpiDetails.verifyStatus === 'Accepted' ? (
                <div className="verified-message">
                  <span className="verified-icon">✓</span>
                  Your KPI has been verified and approved by the manager.
                </div>
              ) : kpiDetails.verifyStatus === 'Rejected' ? (
                <div className="rejected-message">
                  <span className="rejected-icon">✕</span>
                  Your KPI submission has been rejected. Please check with your manager for details.
                </div>
              ) : (
                <div className="pending-message">
                  <span className="pending-icon">⏳</span>
                  Your KPI has been submitted. Please wait for verification.
                </div>
              )}
            </div>
          ) : (
            <>

              {/* Hide Progress & Comment update when progress is 100 */}
              {currentProgress !== 100 && (
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
                </>
              )}


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
                  {files.length > 0 && (
                    <div className="selected-files">
                      <p>Selected files:</p>
                      <ul>
                        {files.map((file, index) => (
                          <li key={index}>
                            {file.name}
                            <button 
                              className="remove-file-btn"
                              onClick={() => {
                                const newFiles = [...files];
                                newFiles.splice(index, 1);
                                setFiles(newFiles);
                              }}
                            >
                              ×
                            </button>
                          </li>
                        ))}
                      </ul>
                      <button 
                        className="clear-files-btn"
                        onClick={handleClearSelectedFiles}
                      >
                        Clear All Files
                      </button>
                    </div>
                  )}
                  <button
                    className={`upload-btn ${files.length === 0 || isUploading ? 'disabled' : ''}`}
                    onClick={handleEvidenceUpload}
                    disabled={files.length === 0 || isUploading}>
                    {isUploading ? 'Uploading...' : 'Upload Evidence'}
                  </button>
                  {evidenceError && (
                    <div className="alert alert-danger" style={{ marginTop: 8 }}>
                      {evidenceError}
                      <button className="close-alert" onClick={handleClearEvidence} style={{ marginLeft: 8 }}>
                        Clear
                      </button>
                    </div>
                  )}
                  {hasEvidence && (
                    <div className="evidence-list">
                      <label>Uploaded Files:</label>
                      <ul>
                        {(kpiDetails.evidenceFiles || []).map((file, idx) => (
                          <li key={idx}>
                            <a href={`data:${file.mimetype};base64,${file.data}`} download={file.filename}>
                              {file.filename}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
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
            onClick={onClose}>
            Close
          </button>

          {!isSubmitted && (
            <>
              {/* Update Progress Button */}
              <button
                className={`update-btn ${!comment.trim() ? 'disabled' : ''}`}
                onClick={handleProgressSubmit}
                disabled={!comment.trim()}>
                Update Progress
              </button>

              {/* Submit KPI Button - Only if progress is 100% and evidence is uploaded */}
              {showEvidenceSection && (
                <button
                  className={`submit-btn ${!canSubmitKpi ? 'disabled' : ''}`}
                  onClick={handleKpiSubmit}
                  disabled={!canSubmitKpi}>
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