import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function ProgressUpdate({ show, currentProgress, onClose, onSubmit }) {
    const [selected, setSelected] = useState(currentProgress);
    const [comment, setComment] = useState('');

    const handleSubmit = () => {
        if (!selected) return alert('Please select a progress percentage.');
        onSubmit(selected, comment);
        onClose();
    };

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Update Progress for KPI</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Current Progress: <strong>{selected}%</strong></p>
                <div className="mb-3 d-flex gap-2 flex-wrap">
                    {[20, 40, 60, 80, 100].map(val => (
                        <Button
                            key={val}
                            variant={selected === val ? 'primary' : 'outline-primary'}
                            onClick={() => setSelected(val)}
                        >
                            {val}%
                        </Button>
                    ))}
                </div>
                <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Add any comments about your progress..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="mb-3"
                />
                <Button className="w-100" onClick={handleSubmit}>Submit</Button>
            </Modal.Body>
        </Modal>
    );
}

export default ProgressUpdate;