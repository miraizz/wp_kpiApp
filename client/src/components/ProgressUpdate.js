// src/components/ProgressUpdate.js
import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function ProgressUpdate({ show, currentProgress, onClose, onSubmit }) {
    const [selectedProgress, setSelectedProgress] = useState(currentProgress || 0);
    const [comment, setComment] = useState('');

    const handleSubmit = () => {
        if (!selectedProgress) {
            alert('Please select a progress percentage.');
            return;
        }
        if (!comment.trim()) {
            alert('Please add a comment before submitting.');
            return;
        }

        // Submit both progress and comment
        onSubmit({
            type: 'progress',
            progress: selectedProgress,
            comment: comment.trim()
        });

        // Reset UI state
        setSelectedProgress(currentProgress || 0);
        setComment('');
        onClose();
    };

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Update KPI Progress</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Current Progress: <strong>{selectedProgress}%</strong></p>
                <div className="mb-3 d-flex gap-2 flex-wrap">
                    {[20, 40, 60, 80, 100].map(val => (
                        <Button
                            key={val}
                            variant={selectedProgress === val ? 'primary' : 'outline-primary'}
                            onClick={() => setSelectedProgress(val)}
                        >
                            {val}%
                        </Button>
                    ))}
                </div>
                <Form.Group controlId="comment">
                    <Form.Label>Comment</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Enter your comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </Form.Group>
                <Button className="w-100 mt-3" onClick={handleSubmit}>
                    Submit Progress
                </Button>
            </Modal.Body>
        </Modal>
    );
}

export default ProgressUpdate;
