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

  useEffect(() => {
    if (kpiDetails) {
      setSelectedProgress(kpiDetails.progress || 0);
      setCurrentProgress(kpiDetails.progress || 0);
      setComment('');
      setFiles([]);
      setHasEvidence(kpiDetails.evidenceFiles && kpiDetails.evidenceFiles.length > 0);
      setComments(kpiDetails.comments || []);
      setShowSuccessAlert(false);
      setShowEvidenceSection(kpiDetails.progress === 100);
      setEvidenceUploaded(false);
    }
  }, [kpiDetails]);

  if (!kpiDetails) return null;

  const isSubmitted = kpiDetails.submitted === true;

  const handleProgressChange = (newProgress) => {
    setSelectedProgress(newProgress);
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleEvidenceUpload = async () => {
    if (files.length > 0) {
      try {
        const base64Files = await Promise.all(files.map(file => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve({
              filename: file.name,
              mimetype: file.type,
              data: reader.result
            });
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        }));

        const response = await fetch(`/api/kpi/${kpiDetails.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ evidenceFiles: base64Files })
        });

        if (!response.ok) throw new Error('Failed to upload evidence');

        const updated = await response.json();
        setHasEvidence(updated.evidenceFiles?.length > 0);
        setEvidenceUploaded(true);
        setFiles([]);
        setSuccessMessage('Evidence uploaded successfully! Now you can submit your KPI.');
        setShowSuccessAlert(true);
      } catch (error) {
        console.error('Failed to upload evidence:', error);
        alert('Error uploading evidence. Please try again.');
      }
    }
  };

  const handleProgressSubmit = async () => {
    if (!comment.trim()) {
      return alert('Please add a comment before updating progress.');
    }

    const newComment = {
      text: comment,
      date: new Date().toLocaleString(),
      progress: selectedProgress,
      by: 'Staff'
    };

    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    setCurrentProgress(selectedProgress);

    try {
      const response = await fetch(`/api/kpi/${kpiDetails.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          progress: selectedProgress,
          comments: updatedComments
        })
      });

      if (!response.ok) throw new Error('Failed to update progress');

      if (selectedProgress === 100) {
        setShowEvidenceSection(true);
        setSuccessMessage('Progress updated to 100%. Please upload evidence next.');
      } else {
        setShowEvidenceSection(false);
        setHasEvidence(false);
        setSuccessMessage('Progress updated successfully.');
      }

      setShowSuccessAlert(true);
      setComment('');
    } catch (error) {
      console.error('Error updating progress:', error);
      alert('Failed to update progress. Please try again.');
    }
  };

  const handleKpiSubmit = async () => {
    if (!evidenceUploaded) {
      return alert('Please upload evidence before submitting.');
    }

    const finalCommentText = comments.length > 0 ? comments[comments.length - 1].text : '';

    const finalComment = {
      text: finalCommentText,
      date: new Date().toLocaleString(),
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
          comments: updatedComments
        })
      });

      if (!response.ok) throw new Error('Failed to submit KPI');

      setComments(updatedComments);
      setSuccessMessage('KPI submitted successfully and is now pending verification.');
      setShowSuccessAlert(true);
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
                  <button
                    className={`upload-btn ${files.length === 0 ? 'disabled' : ''}`}
                    onClick={handleEvidenceUpload}
                    disabled={files.length === 0}>
                    Upload Evidence
                  </button>

                  {hasEvidence && (
                    <div className="evidence-list">
                      <label>Uploaded Files:</label>
                      <ul>
                        {(kpiDetails.evidenceFiles || []).map((file, idx) => (
                          <li key={idx}>
                            <a href={file.data} download={file.filename}>
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