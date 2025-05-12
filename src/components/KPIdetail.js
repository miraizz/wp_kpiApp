import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ProgressUpdate from './ProgressUpdate';
import EvidenceUpload from './EvidenceUpload';

function KpiDetailsModal({ show, onClose, kpi, onProgressSubmit, onEvidenceSubmit, onVerifySubmit }) {
  const [progressComment, setProgressComment] = useState(kpi.comment || "");

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{kpi.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{kpi.description}</p>
        <p><strong>Status:</strong> {kpi.status}</p>
        <p><strong>Progress:</strong> {kpi.progress}%</p>

        <ProgressUpdate
          show={true}
          currentProgress={kpi.progress}
          comment={progressComment}
          onCommentChange={setProgressComment}
          onSubmit={(value) => {
            onProgressSubmit(value, progressComment);
            setProgressComment("");
          }}
        />

        {kpi.progress === 100 && (
          <EvidenceUpload
            show={true}
            onClose={() => {}}
            onUpload={(file) => onEvidenceSubmit(file)}
          />
        )}

        {kpi.evidence && (
          <div className="mt-2">
            <strong>Evidence:</strong> <a href={kpi.evidence} target="_blank" rel="noopener noreferrer">View File</a>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Close</Button>
        {kpi.progress === 100 && kpi.evidence && (
          <Button variant="success" onClick={onVerifySubmit}>Submit for Verification</Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default KpiDetailsModal;
