import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EvidenceUpload from '../components/EvidenceUpload';
import ProgressUpdate from '../components/ProgressUpdate';
import KpiDetailModal from '../components/KpiDetailModal';
import './Staff.css';
import { dummyKPIs } from '../data/dummyKPIs';

function Staff() {
  // Initialize KPIs with correct statuses
  const [kpis, setKpis] = useState(dummyKPIs.map(kpi => {
    // Set initial status based on progress
    let status = kpi.status;
    if (kpi.progress === 100) {
      status = 'Completed';
    } else if (kpi.progress >= 60) {
      status = 'On Track';
    } else if (kpi.progress === 40) {
      status = 'At Risk';
    } else {
      status = 'Behind';
    }
    
    return {
      ...kpi,
      status: status,
      comments: [] // Initialize comments array for each KPI
    };
  }));
  const [selectedKpi, setSelectedKpi] = useState(null);
  const [selectedKpiIndex, setSelectedKpiIndex] = useState(null);
  const [activeEvidenceIndex, setActiveEvidenceIndex] = useState(null);
  const [activeProgressIndex, setActiveProgressIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortOption, setSortOption] = useState("None");

  const navigate = useNavigate();

  const handleProgressSubmit = (index, newValue) => {
    const updated = [...kpis];
    updated[index].progress = newValue;
    
    // Update status based on progress
    if (newValue === 100) {
      updated[index].status = 'Completed';
    } else if (newValue >= 60) {
      updated[index].status = 'On Track';
    } else if (newValue === 40) {
      updated[index].status = 'At Risk';
    } else {
      updated[index].status = 'Behind';
    }
    
    setKpis(updated);
    setActiveProgressIndex(null);
  };

  const handleEvidenceUpload = (index, file) => {
    const updatedKpis = [...kpis];
    updatedKpis[index].files = updatedKpis[index].files || [];
    updatedKpis[index].files.push(file);
    setKpis(updatedKpis);
  };

  const handleKpiSelection = (kpi, index) => {
    setSelectedKpi({...kpi}); // Create a copy to avoid direct reference
    setSelectedKpiIndex(index);
  };

  const handleKpiDetailSubmit = (data) => {
    if (selectedKpiIndex !== null) {
      const updated = [...kpis];
      
      // Handle different types of submissions
      switch (data.type) {
        case 'progress':
          // Update progress and status
          updated[selectedKpiIndex].progress = data.progress;
          
          // Add the comment to the comments array
          if (!updated[selectedKpiIndex].comments) {
            updated[selectedKpiIndex].comments = [];
          }
          
          if (data.comment) {
            const newComment = {
              text: data.comment,
              date: new Date().toLocaleString(),
              progress: data.progress
            };
            
            // If we received comments array from the modal, use that
            if (data.comments) {
              updated[selectedKpiIndex].comments = data.comments;
            } else {
              // Otherwise append the new comment
              updated[selectedKpiIndex].comments.push(newComment);
            }
          }
          
          // Update status based on progress
          if (data.progress === 100) {
            updated[selectedKpiIndex].status = 'Completed';
          } else if (data.progress >= 60) {
            updated[selectedKpiIndex].status = 'On Track';
          } else if (data.progress === 40) {
            updated[selectedKpiIndex].status = 'At Risk';
          } else {
            updated[selectedKpiIndex].status = 'Behind';
          }
          
          // Update KPIs list and selected KPI
          setKpis(updated);
          setSelectedKpi({...updated[selectedKpiIndex]});
          break;
          
        case 'evidence':
          // Handle evidence files
          if (data.evidence && data.evidence.length > 0) {
            updated[selectedKpiIndex].files = updated[selectedKpiIndex].files || [];
            updated[selectedKpiIndex].files = [...updated[selectedKpiIndex].files, ...data.evidence];
            
            // If progress was included in the evidence upload, maintain it
            if (data.progress) {
              updated[selectedKpiIndex].progress = data.progress;
            }
          }
          setKpis(updated);
          // Update the selected KPI to reflect changes
          setSelectedKpi({...updated[selectedKpiIndex]});
          break;
          
        case 'submit':
          // Mark KPI as submitted and update all relevant fields
          updated[selectedKpiIndex].submitted = true;
          updated[selectedKpiIndex].verifyStatus = 'Pending';
          updated[selectedKpiIndex].progress = 100;
          updated[selectedKpiIndex].status = 'Completed'; // Ensure status is set to Completed
          
          // Add final comment if provided
          if (data.comment) {
            if (!updated[selectedKpiIndex].comments) {
              updated[selectedKpiIndex].comments = [];
            }
            
            const finalComment = {
              text: data.comment,
              date: new Date().toLocaleString(),
              progress: 100,
              isFinal: true
            };
            
            // If we received comments array, use that
            if (data.comments) {
              updated[selectedKpiIndex].comments = data.comments;
            } else {
              // Otherwise add the final comment
              updated[selectedKpiIndex].comments.push(finalComment);
            }
          }
          
          setKpis(updated);
          setSelectedKpi({...updated[selectedKpiIndex]});
          break;
          
        default:
          break;
      }
    }
  };

  // Filter and display KPIs
  let filteredKpis = kpis.map(kpi => {
    // Ensure status reflects 100% progress
    if (kpi.progress === 100 && kpi.status !== 'Completed') {
      return { ...kpi, status: 'Completed' };
    }
    return kpi;
  }).filter(kpi => {
    // Update filter conditions to include Incomplete and Verified
    const matchesFilter = filterStatus === "All"
      || (filterStatus === "On Track" && kpi.status === "On Track" && kpi.progress < 100)
      || (filterStatus === "Needs Attention" && (kpi.status === "Behind" || kpi.status === "At Risk"))
      || (filterStatus === "Completed" && kpi.progress === 100)
      || (filterStatus === "Incomplete" && kpi.progress < 100)
      || (filterStatus === "Verified" && kpi.verifyStatus === "Accepted");

    const matchesSearch = kpi.title.toLowerCase().includes(searchQuery.toLowerCase())
      || kpi.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  if (sortOption === "Due Date") {
    filteredKpis.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  } else if (sortOption === "Progress") {
    filteredKpis.sort((a, b) => b.progress - a.progress);
  }

  const totalKpis = kpis.length;
  const onTrack = kpis.filter(k => k.status === "On Track").length;
  const needsAttention = kpis.filter(k => k.status === "Behind" || k.status === "At Risk").length;
  const completed = kpis.filter(k => k.progress === 100).length;
  const incomplete = kpis.filter(k => k.progress < 100).length;
  const verified = kpis.filter(k => k.verifyStatus === "Accepted").length;

  return (
    <div className="container mt-4">
      <h3>My KPI</h3>

      {/* KPI Stats Cards - Updated with new styling and added Incomplete and Verified cards */}
      <div className="row mb-4">
        <div className="col-md-2 mb-3">
          <div className="card shadow-sm p-3 text-center h-100">
            <h6 className="mb-2">Total KPIs</h6>
            <h3 className="mb-0 total-kpis" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{totalKpis}</h3>
          </div>
        </div>
        <div className="col-md-2 mb-3">
          <div className="card shadow-sm p-3 text-center h-100">
            <h6 className="mb-2">On Track</h6>
            <h3 className="mb-0 on-track" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{onTrack}</h3>
          </div>
        </div>
        <div className="col-md-2 mb-3">
          <div className="card shadow-sm p-3 text-center h-100">
            <h6 className="mb-2">Needs Attention</h6>
            <h3 className="mb-0 at-risk" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{needsAttention}</h3>
          </div>
        </div>
        <div className="col-md-2 mb-3">
          <div className="card shadow-sm p-3 text-center h-100">
            <h6 className="mb-2">Completed</h6>
            <h3 className="mb-0 completed-kpi" style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#198754' }}>{completed}</h3>
          </div>
        </div>
        <div className="col-md-2 mb-3">
          <div className="card shadow-sm p-3 text-center h-100">
            <h6 className="mb-2">Incomplete</h6>
            <h3 className="mb-0 incomplete-kpi" style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#6c757d' }}>{incomplete}</h3>
          </div>
        </div>
        <div className="col-md-2 mb-3">
          <div className="card shadow-sm p-3 text-center h-100">
            <h6 className="mb-2">Verified</h6>
            <h3 className="mb-0 verified-kpi" style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#0dcaf0' }}>{verified}</h3>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
        <input 
          type="text" 
          className="form-control w-50 mb-2" 
          placeholder="Search KPIs..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
        />

        <div className="mb-2">
          {["All", "On Track", "Needs Attention", "Completed", "Incomplete", "Verified"].map(status => (
            <button 
              key={status}
              className={`btn mx-1 ${filterStatus === status ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setFilterStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>

        <select 
          className="form-select w-auto mb-2" 
          value={sortOption} 
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="None">Sort By</option>
          <option value="Due Date">Due Date</option>
          <option value="Progress">Progress</option>
        </select>
      </div>

      {/* KPI List - Updated to show 2 cards per row */}
      <div className="row">
        {filteredKpis.map((kpi, index) => (
          <div className="col-md-6 mb-3" key={index}>
            <div className="kpi-card p-3 border rounded h-100 shadow-sm">
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="mb-0">
                  {kpi.title}
                  {kpi.verifyStatus === "Accepted" && (
                    <span className="verification-badge accepted">
                      <i className="fa fa-check-circle mr-1"></i> Verified
                    </span>
                  )}
                </h6>
                <span className={`status-chip ${kpi.progress === 100 ? 'completed' : kpi.status.replace(/ /g, '-').toLowerCase()}`}>
                  {kpi.progress === 100 ? 'Completed' : kpi.status}
                </span>
              </div>
              <p className="text-muted my-2" style={{ fontSize: '0.9rem' }}>{kpi.description}</p>
              <div className="progress mb-2" style={{ height: '12px' }}>
                <div 
                  className={`progress-bar ${kpi.progress === 100 ? 'bg-success' : 'bg-info'}`} 
                  style={{ width: `${kpi.progress}%` }}
                >
                  {kpi.progress}%
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center mt-2">
                <small className="text-muted">
                  Due: {kpi.dueDate} | {kpi.assignedTo ? kpi.assignedTo.name : 'N/A'}
                  {kpi.submitted && (
                    <span className={`verification-badge ${kpi.verifyStatus.toLowerCase()}`} style={{ marginLeft: '8px' }}>
                      {kpi.verifyStatus}
                    </span>
                  )}
                </small>
                <button 
                  className="btn btn-outline-primary btn-sm" 
                  onClick={() => handleKpiSelection(kpi, index)}
                >
                  View KPI
                </button>
              </div>

              {/* Evidence Upload & Progress Update */}
              <EvidenceUpload
                show={activeEvidenceIndex === index}
                onClose={() => setActiveEvidenceIndex(null)}
              />
              <ProgressUpdate
                show={activeProgressIndex === index}
                currentProgress={kpi.progress}
                onClose={() => setActiveProgressIndex(null)}
                onSubmit={(value) => handleProgressSubmit(index, value)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* KPI Detail Modal */}
      <KpiDetailModal
        show={selectedKpi !== null}
        onClose={() => {
          setSelectedKpi(null);
          setSelectedKpiIndex(null);
        }}
        onSubmit={handleKpiDetailSubmit}
        kpiDetails={selectedKpi}
      />
    </div>
  );
}

export default Staff;