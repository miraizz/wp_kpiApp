import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { dummyKPIs } from '../data/dummyKPIs';
import Footer from '../components/Footer'; // if it's a separate component
import './KPIDetails.css';

export default function KPIDetails() {
  const { staffId } = useParams();
  const staffKPIs = dummyKPIs.filter(kpi => kpi.assignedTo.staffId === staffId);

  const [kpis, setKpis] = useState(staffKPIs);
  const [selectedKPI, setSelectedKPI] = useState(null);
  const dialogRef = useRef();
  const [filter, setFilter] = useState('All');

  const openDetails = (kpi) => {
    setSelectedKPI(kpi);
    dialogRef.current?.showModal();
  };

  const updateStatus = (id, newStatus) => {
    setKpis(prev =>
      prev.map(kpi =>
        kpi.id === id ? { ...kpi, status: newStatus, comments: selectedKPI.comments } : kpi
      )
    );
    dialogRef.current?.close();
  };

  // Modify the filter to allow filtering based on specific statuses
  const filteredKPIs = filter === 'All' 
    ? kpis 
    : kpis.filter(kpi => {
        if (filter === 'In Progress') return !kpi.submitted;
        if (filter === 'Need Approval') return kpi.submitted && kpi.verifyStatus === 'Pending';
        if (filter === 'Accepted') return kpi.verifyStatus === 'Accepted';
        if (filter === 'Rejected') return kpi.verifyStatus === 'Rejected';
        return true;
      });

  return (
    <div className="page-container">
      <div className="details-container">
        <h2 className="heading">Assigned KPIs</h2>

        {/* Filter Bar - Positioned to the left with dropdown */}
        <div className="filter-bar">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="All">All</option>
            <option value="In Progress">In Progress</option>
            <option value="Need Approval">Need Approval</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="kpi-list">
          {filteredKPIs.map(kpi => (
            <div key={kpi.id} className="kpi-detail-box">
              <h4>{kpi.title}</h4>
              <p><strong>Due Date:</strong> {kpi.dueDate}</p>
              <p className={`status-badge ${kpi.submitted ? 'need-approval' : 'in-progress'}`}>
                {kpi.submitted ? '⚠ Need Approval' : 'In Progress'} {/* Show "Need Approval" or "In Progress" based on submission */}
              </p>
              <p className={`status-badge ${kpi.status.toLowerCase()}`}>
                {kpi.status} {/* Show the current status */}
              </p>
              <button className="view-btn" onClick={() => openDetails(kpi)}>View Details</button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <dialog ref={dialogRef} className="modal-dialog">
        {selectedKPI && (
          <div>
            <h3>{selectedKPI.title}</h3>
            <p><strong>Description:</strong> {selectedKPI.description}</p>
            <p><strong>Category:</strong> {selectedKPI.category}</p>
            <p><strong>Priority:</strong> {selectedKPI.priority}</p>
            <p><strong>Due Date:</strong> {selectedKPI.dueDate}</p>

            <p><strong>Status:</strong> {selectedKPI.status}</p> {/* Show status */}
            <p><strong>Verification Status:</strong> {selectedKPI.submitted ? 'Need Approval' : 'In Progress'}</p> {/* Show verification status */}

            {selectedKPI.evidence ? (
              <div className="evidence-section">
                <p><strong>Evidence:</strong> {selectedKPI.evidence.split('/').pop()}</p>
                <a
                  href={selectedKPI.evidence}
                  download
                  className="download-btn"
                >
                  Download
                </a>
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
}