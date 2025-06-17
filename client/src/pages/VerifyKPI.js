import React, { useState, useEffect, useRef } from 'react';
import './VerifyKPI.css';

const VerifyKPI = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ category: '', department: '' });
  const [kpis, setKpis] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedKPI, setSelectedKPI] = useState(null);
  const [finalComment, setFinalComment] = useState('');
  const dialogRef = useRef();

  useEffect(() => {
    fetch('/api/kpi')
      .then(res => res.json())
      .then(data => {
        const verifiedData = Array.isArray(data) ? data.filter(kpi =>
          kpi.submitted === true &&
          kpi.verifyStatus === 'Pending'
        ) : [];
        setKpis(verifiedData);

        const uniqueDepts = Array.from(new Set(data.map(k => k.assignedTo?.department).filter(Boolean)));
        const uniqueCats = Array.from(new Set(data.map(k => k.category).filter(Boolean)));
        setDepartments(uniqueDepts);
        setCategories(uniqueCats);
      })
      .catch(err => {
        console.error('Error loading KPIs:', err);
        setKpis([]);
      });
  }, []);

  const openDetails = (kpi) => {
    setSelectedKPI(kpi);
    setFinalComment('');
    dialogRef.current?.showModal();
  };

  const updateStatus = async (id, newStatus) => {
    try {
      console.log('Submitting verification for KPI:', id, '→', newStatus);

      const res = await fetch(`http://localhost:5050/api/kpi/verify/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          comment: finalComment
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update KPI');
      }

      // Remove verified KPI from list
      setKpis(prev => prev.filter(kpi => kpi.id !== id));
      dialogRef.current?.close();
      alert(`KPI has been ${newStatus.toLowerCase()} successfully.`);
    } catch (err) {
      console.error('Verification error:', err.message);
      alert('Error: ' + err.message);
    }
  };

  const filteredKPIs = kpis.filter(kpi => {
    return (
      kpi.assignedTo?.name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filters.category ? kpi.category === filters.category : true) &&
      (filters.department ? kpi.assignedTo?.department === filters.department : true)
    );
  });

  return (
    <div className="container">
      <h2 className="heading">Verify KPI</h2>
      <p className="description">Verify the evidence submitted by staff</p>

      <div className="filter-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search staff..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <select name="category" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select name="department" value={filters.department} onChange={(e) => setFilters({ ...filters, department: e.target.value })}>
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      <table className="kpi-table">
        <thead>
          <tr>
            <th>No</th>
            <th>KPI ID</th>
            <th>Staff Name</th>
            <th>Department</th>
            <th>Category</th>
            <th>Verification Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredKPIs.length > 0 ? (
            filteredKPIs.map((kpi, index) => (
              <tr key={kpi.id}>
                <td>{index + 1}</td>
                <td>{kpi.id}</td>
                <td>{kpi.assignedTo.name}</td>
                <td>{kpi.assignedTo.department}</td>
                <td>{kpi.category}</td>
                <td>
                  <span className={`status-badge ${kpi.verifyStatus === 'Pending' ? 'need-approval' : 'in-progress'}`}>
                    {kpi.verifyStatus}
                  </span>
                </td>
                <td>
                  <button className="view-btn" onClick={() => openDetails(kpi)}>Verify KPI</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ color: '#666', fontSize: '1.1rem' }}>
                  <p style={{ marginBottom: '0.5rem' }}>No KPIs pending verification at the moment.</p>
                  <p style={{ fontSize: '0.9rem', color: '#888' }}>Staff members will need to submit their completed KPIs for verification first.</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <dialog ref={dialogRef} className="modal-dialog">
        {selectedKPI && (
          <div>
            <h3>{selectedKPI.title}</h3>
            <p><strong>Description:</strong> {selectedKPI.description}</p>
            <p><strong>Category:</strong> {selectedKPI.category}</p>
            <p><strong>Priority:</strong> {selectedKPI.priority}</p>
            <p><strong>Due Date:</strong> {new Date(selectedKPI.dueDate).toLocaleDateString()}</p>
            <p><strong>Status:</strong> {selectedKPI.status}</p>
            <p><strong>Verification Status:</strong> {selectedKPI.verifyStatus}</p>

            {selectedKPI.evidenceFiles?.length > 0 ? (
              <div className="evidence-section">
                <h5>Evidence Files:</h5>
                <ul>
                  {selectedKPI.evidenceFiles.map((file, idx) => (
                    <li key={idx}>
                      <a
                        href={`data:${file.mimetype};base64,${file.data}`}
                        download={file.filename}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {file.filename}
                      </a>
                      {/* <embed src={file.data} type={file.mimetype} width="100%" height="400px" /> */}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-gray-400 italic text-sm">No evidence uploaded.</p>
            )}

            {/* Display comments if any */}
            {selectedKPI.comments?.length > 0 && (
              <div className="comment-history">
                <h5>Previous Comments:</h5>
                <ul>
                  {selectedKPI.comments.map((comment, idx) => (
                    <li key={idx}>
                      <p><strong>{comment.by}</strong> ({new Date(comment.date).toLocaleString()}):</p>
                      <p>{comment.text}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {/* Final comment input for verification */}
            <div className="comment-section">
              <label htmlFor="comment"><strong>Final Comment:</strong></label>
              <textarea
                id="comment"
                rows="3"
                value={finalComment}
                onChange={(e) => setFinalComment(e.target.value)}
                placeholder="Write final remark before approval/rejection..."
              />
            </div>

            <div className="actions">
              <button
                disabled={!finalComment.trim()}
                onClick={() => updateStatus(selectedKPI.id, 'Accepted')}
                className="accept"
              >
                Accept
              </button>
              <button
                disabled={!finalComment.trim()}
                onClick={() => updateStatus(selectedKPI.id, 'Rejected')}
                className="reject"
              >
                Reject
              </button>
              <button onClick={() => dialogRef.current?.close()} className="back-button">Close</button>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
};

export default VerifyKPI;
