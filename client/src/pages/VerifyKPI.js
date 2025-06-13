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
      const newComment = {
        text: finalComment,
        date: new Date().toLocaleString(),
        by: 'Manager',
        isFinal: true
      };

      const res = await fetch(`/api/kpi/verify/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verifyStatus: newStatus,
          status: newStatus === 'Accepted' ? 'Completed' : 'Rejected',
          comments: [...(selectedKPI.comments || []), newComment]
        })
      });

      if (!res.ok) throw new Error('Failed to update KPI');

      setKpis(prev => prev.filter(kpi => kpi.id !== id));
      dialogRef.current?.close();
    } catch (err) {
      console.error(err.message);
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
              <td colSpan="7">No results found.</td>
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

            {selectedKPI.evidenceFiles && selectedKPI.evidenceFiles.length > 0 ? (
              <div className="evidence-section">
                <h5>Evidence Files:</h5>
                <ul>
                  {selectedKPI.evidenceFiles.map((file, idx) => (
                    <li key={idx}>
                      <a href={file.data} download={file.filename}>
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
              <button onClick={() => updateStatus(selectedKPI.id, 'Accepted')} className="accept">Accept</button>
              <button onClick={() => updateStatus(selectedKPI.id, 'Rejected')} className="reject">Reject</button>
              <button onClick={() => dialogRef.current?.close()} className="back-button">Close</button>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
};

export default VerifyKPI;
