import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { dummyKPIs, getStaffKpiCount } from '../data/dummyKPIs';
import './VerifyKPI.css';

const VerifyKPI = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    department: '', // Removed verificationStatus filter
  });

  const [kpis, setKpis] = useState(dummyKPIs);
  const [selectedKPI, setSelectedKPI] = useState(null);
  const dialogRef = useRef();

  const openDetails = (kpi) => {
    setSelectedKPI(kpi);
    dialogRef.current?.showModal();
  };

  const updateStatus = (id, newStatus) => {
    // Update the KPI's status and verification status
    const updatedKPIs = kpis.map(kpi => {
      if (kpi.id === id) {
        return {
          ...kpi,
          status: newStatus,
          verifyStatus: newStatus === 'Accepted' ? 'Accepted' : 'Rejected',
        };
      }
      return kpi;
    });

    // Update the state with the modified KPIs
    setKpis(updatedKPIs);

    // Close the modal after the action
    dialogRef.current?.close();
  };

  // Filter for KPIs that need approval (submitted: true and verifyStatus: "Pending")
  const pendingKpis = kpis.filter(kpi => kpi.submitted === true && kpi.verifyStatus === 'Pending');

  // Apply search and other filters
  const filteredData = pendingKpis.filter((item) => {
    return (
      item.assignedTo.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filters.category ? item.category === filters.category : true) &&
      (filters.department ? item.assignedTo.department === filters.department : true)
    );
  });

  return (
    <div className="container">
      <h2 className="heading">Verify KPI</h2>
      <p className="description">Verify the evidence submitted by staff</p>

      {/* Search and Filter Controls */}
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
            <option value="Documentation">Documentation</option>
            <option value="Performance">Performance</option>
            <option value="Compliance">Compliance</option>
          </select>

          <select name="department" value={filters.department} onChange={(e) => setFilters({ ...filters, department: e.target.value })}>
            <option value="">All Departments</option>
            <option value="HR">HR</option>
            <option value="IT">IT</option>
            <option value="Finance">Finance</option>
            <option value="Marketing">Marketing</option>
          </select>
        </div>
      </div>

      {/* KPI Table */}
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
          {filteredData.length > 0 ? (
            filteredData.map((kpi, index) => (
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

      {/* Modal for KPI Details */}
      <dialog ref={dialogRef} className="modal-dialog">
        {selectedKPI && (
          <div>
            <h3>{selectedKPI.title}</h3>
            <p><strong>Description:</strong> {selectedKPI.description}</p>
            <p><strong>Category:</strong> {selectedKPI.category}</p>
            <p><strong>Priority:</strong> {selectedKPI.priority}</p>
            <p><strong>Due Date:</strong> {selectedKPI.dueDate}</p>

            <p><strong>Status:</strong> {selectedKPI.status}</p>
            <p><strong>Verification Status:</strong> {selectedKPI.verifyStatus}</p>

            {selectedKPI.evidence ? (
              <div className="evidence-section">
                <p><strong>Evidence:</strong> {selectedKPI.evidence.split('/').pop()}</p>
                <a href={selectedKPI.evidence} download className="download-btn">Download</a>
              </div>
            ) : (
              <p className="text-gray-400 italic text-sm">No evidence uploaded.</p>
            )}

            <div className="comment-section">
              <label htmlFor="comment"><strong>Final Comment:</strong></label>
              <textarea
                id="comment"
                rows="3"
                value={selectedKPI.comments || ''}
                onChange={(e) =>
                  setSelectedKPI({ ...selectedKPI, comments: e.target.value })
                }
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
