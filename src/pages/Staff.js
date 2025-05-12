import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EvidenceUpload from '../components/EvidenceUpload';
import ProgressUpdate from '../components/ProgressUpdate';
import './Staff.css';
import { dummyKPIs } from '../data/dummyKPIs';

function Staff() {
  const [kpis, setKpis] = useState(dummyKPIs);  // Initialize state with dummyKPIs
  const [activeEvidenceIndex, setActiveEvidenceIndex] = useState(null);
  const [activeProgressIndex, setActiveProgressIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortOption, setSortOption] = useState("None");

  const navigate = useNavigate();

  const handleProgressSubmit = (index, newValue) => {
    const updated = [...kpis];
    updated[index].progress = newValue;
    if (newValue >= 60) updated[index].status = 'On Track';
    else if (newValue === 40) updated[index].status = 'At Risk';
    else updated[index].status = 'Behind';
    setKpis(updated);
    setActiveProgressIndex(null);
  };

  let filteredKpis = kpis.filter(kpi => {
    const matchesFilter = filterStatus === "All"
      || (filterStatus === "On Track" && kpi.status === "On Track")
      || (filterStatus === "Needs Attention" && (kpi.status === "Behind" || kpi.status === "At Risk"))
      || (filterStatus === "Completed" && kpi.progress === 100);

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
  const verified = kpis.filter(k => k.verified === true).length;

  return (
    <div className="container mt-4">
      <h3>My KPI</h3>

      <div className="d-flex justify-content-between mb-4">
        <div className="card text-white bg-info p-3 w-100 mx-1 text-center">
          <h6>Total KPIs</h6>
          <h4>{totalKpis}</h4>
        </div>
        <div className="card text-white bg-success p-3 w-100 mx-1 text-center">
          <h6>On Track</h6>
          <h4>{onTrack}</h4>
        </div>
        <div className="card text-white bg-warning p-3 w-100 mx-1 text-center">
          <h6>Needs Attention</h6>
          <h4>{needsAttention}</h4>
        </div>
        <div className="card text-white bg-secondary p-3 w-100 mx-1 text-center">
          <h6>Completed</h6>
          <h4>{completed}</h4>
        </div>
      </div>

      <div className="d-flex justify-content-between mb-4">
        <div className="card text-white bg-danger p-3 w-100 mx-1 text-center">
          <h6>Incomplete</h6>
          <h4>{incomplete}</h4>
        </div>
        <div className="card text-white bg-primary p-3 w-100 mx-1 text-center">
          <h6>Verified</h6>
          <h4>{verified}</h4>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
        <input 
          type="text" 
          className="form-control w-50 mb-2" 
          placeholder="Search KPIs..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
        />

        <div className="mb-2">
          {["All", "On Track", "Needs Attention", "Completed"].map(status => (
            <button 
              key={status}
              className={`btn mx-1 ${filterStatus === status ? 'btn-primary' : 'btn-outline-primary'}`}
              style={{ borderRadius: '50px' }}
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

      {filteredKpis.map((kpi, index) => (
        <div className="kpi-card mb-3 p-3 border rounded" key={index}>
          <div className="d-flex justify-content-between">
            <h6>{kpi.title}</h6>
            <span className={`status-chip ${kpi.status.replace(/ /g, '-').toLowerCase()}`}>{kpi.status}</span>
          </div>
          <p className="text-muted">{kpi.description}</p>
          <div className="progress mb-2">
            <div className="progress-bar bg-info" style={{ width: `${kpi.progress}%` }}>{kpi.progress}%</div>
          </div>
          <small className="text-muted">
            Due Date: {kpi.dueDate} | Assigned To: {kpi.assignedTo}
          </small><br />
          <button className="btn btn-outline-secondary btn-sm mt-2" onClick={() => {
            setSelectedKpi(kpi);
            navigate(`/kpi/${index}`);
          }}>View KPI</button>

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
      ))}
    </div>
  );
}

export default Staff;
