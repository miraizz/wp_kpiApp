import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

function EvidenceUpload({ show, onClose, onUpload }) {
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleUpload = () => {
    if (files.length > 0) {
      onUpload(files);
      setFiles([]);
    }
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Upload Evidence</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input type="file" multiple onChange={handleFileChange} className="form-control" />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={handleUpload} disabled={files.length === 0}>
          Upload
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EvidenceUpload;