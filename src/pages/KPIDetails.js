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

  const filteredKPIs = filter === 'All' ? kpis : kpis.filter(kpi => kpi.status === filter);

  return (
    <div className="page-container">
      <div className="details-container">
        <h2 className="heading">Assigned KPIs</h2>

        <div className="filter-bar">
          <label>Status Filter:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option>All</option>
            <option>Pending</option>
            <option>Accepted</option>
            <option>Rejected</option>
          </select>
        </div>

        <div className="kpi-list">
          {filteredKPIs.map(kpi => (
            <div key={kpi.id} className="kpi-detail-box">
              <h4>{kpi.title}</h4>
              <p><strong>Due Date:</strong> {kpi.dueDate}</p>
              <p className={`status-badge ${kpi.status.toLowerCase()}`}>
                {kpi.status === 'Pending' ? '⚠ Pending Verification' : kpi.status}
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
