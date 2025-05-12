import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import EvidenceUpload from './EvidenceUpload';
import ProgressUpdate from './ProgressUpdate';

function KpiDetailModal({ show, onClose, kpi, onProgressSubmit }) {
  if (!kpi) return null;

  return (
    <Modal show={show} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>KPI Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>{kpi.title}</h5>
        <p>{kpi.description}</p>
        <p><strong>Status:</strong> {kpi.status}</p>
        <p><strong>Progress:</strong> {kpi.progress}%</p>
        <p><strong>Due Date:</strong> {kpi.dueDate}</p>
        <p><strong>Assigned To:</strong> {kpi.assignedTo?.name || 'N/A'}</p>

        <hr />

        {/* Progress Update */}
        <h6>Update Progress</h6>
        <ProgressUpdate
          show={true}
          currentProgress={kpi.progress}
          onClose={() => {}}
          onSubmit={onProgressSubmit}
        />

        {/* Evidence Upload */}
        <h6 className="mt-4">Submit Evidence</h6>
        <EvidenceUpload show={true} onClose={() => {}} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default KpiDetailModal;
