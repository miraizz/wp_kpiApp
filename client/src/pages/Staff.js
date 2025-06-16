import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EvidenceUpload from '../components/EvidenceUpload';
import ProgressUpdate from '../components/ProgressUpdate';
import KpiDetailModal from '../components/KpiDetailModal';
import './Staff.css';

function Staff() {
  const [kpis, setKpis] = useState([]);
  const [selectedKpi, setSelectedKpi] = useState(null);
  const [selectedKpiIndex, setSelectedKpiIndex] = useState(null);
  const [activeEvidenceIndex, setActiveEvidenceIndex] = useState(null);
  const [activeProgressIndex, setActiveProgressIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortOption, setSortOption] = useState("None");

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));

    if (!user || !user.staffId) {
      console.warn("No staffId found in sessionStorage. Redirecting to login.");
      navigate("/login");
      return;
    }

    fetch(`/api/kpi/staff/${user.staffId}`)
      .then(res => res.json())
      .then(data => {
        const initialized = data.map(kpi => ({
          ...kpi,
          status: getStatusFromProgress(kpi.progress),
          comments: kpi.comments || [],
          files: kpi.files || []
        }));
        setKpis(initialized);
      })
      .catch(err => {
        console.error("Error fetching KPIs:", err);
        setKpis([]);
      });
  }, [navigate]);

  const getStatusFromProgress = (progress) => {
    if (progress === 100) return 'Completed';
    if (progress >= 60) return 'On Track';
    if (progress === 40) return 'At Risk';
    return 'Behind';
  };

  const handleProgressSubmit = async (index, newValue) => {
    const updated = [...kpis];
    const kpi = updated[index];

    const comment = {
      text: `Progress updated to ${newValue}%`,
      date: new Date().toISOString(),
      progress: newValue,
      isFinal: false,
      by: 'Staff'
    };

    kpi.progress = newValue;
    kpi.status = getStatusFromProgress(newValue);
    kpi.comments = Array.isArray(kpi.comments) ? [...kpi.comments, comment] : [comment];

    // 🔥 Save to DB
    try {
      const response = await fetch(`/api/kpi/${kpi.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          progress: newValue,
          status: kpi.status,
          comments: kpi.comments
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update KPI');
      }

      const updatedKPI = await response.json();
      updated[index] = updatedKPI;
      setKpis(updated);
      setActiveProgressIndex(null);
    } catch (err) {
      console.error('Error updating progress:', err);
      alert('Error updating KPI progress.');
    }
  };

  const handleEvidenceUpload = (index, file) => {
    const updated = [...kpis];
    updated[index].files.push(file);
    setKpis(updated);
  };

  const handleKpiSelection = (kpi, index) => {
    setSelectedKpi({ ...kpi });
    setSelectedKpiIndex(index);
  };

  const handleKpiDetailSubmit = async (data) => {
    if (!selectedKpi) return;

    const updatedKPIs = [...kpis];
    const kpiIndex = updatedKPIs.findIndex(k => k.id === selectedKpi.id);
    const kpi = updatedKPIs[selectedKpiIndex];

    if (data.type === 'progress') {
      // Update progress
      kpi.progress = data.progress;
      kpi.comments = data.comments;
      kpi.status = data.progress === 100 ? 'Completed' : 'In Progress';
      kpi.status = getStatusFromProgress(data.progress);
      if (data.comment) {
        kpi.comments.push({
          text: data.comment,
          date: new Date().toLocaleString(),
          progress: data.progress,
        });
      }
    } else if (data.type === 'evidence') {
      const kpi = updatedKPIs[selectedKpiIndex];

      // Append new evidence
      kpi.files.push(...(data.evidence || []));
      kpi.hasEvidence = true;

      // 🔥 Send to backend
      fetch(`/api/kpi/${kpi.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files: kpi.files }) // <-- update the files array
      });

      setKpis(updatedKPIs);
      setSelectedKpi({ ...kpi });

    } else if (data.type === 'submit') {
      const kpi = updatedKPIs[selectedKpiIndex];

      kpi.submitted = true;
      kpi.verifyStatus = 'Pending';
      kpi.progress = 100;
      kpi.status = 'Completed';

      if (data.comment) {
        kpi.comments.push({
          text: data.comment,
          date: new Date().toLocaleString(),
          progress: 100,
          isFinal: true,
        });
      }
      // 🔥 Save to DB
      fetch(`/api/kpi/${kpi.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submitted: true,
          verifyStatus: 'Pending',
          progress: 100,
          status: 'Completed',
          comments: kpi.comments,
        }),
      });
      setKpis(updatedKPIs);
      setSelectedKpi({ ...kpi });
    }
  };

  let filteredKpis = kpis
    .map(kpi => {
      let updated = { ...kpi };
      if (kpi.progress === 100 && kpi.status !== 'Completed') {
        updated.status = 'Completed';
      }
      if (kpi.verifyStatus === "Accepted") {
        updated.title = updated.title + " Verified";
      }
      return updated;
    })
    .filter(kpi => {
      const matchesFilter = filterStatus === "All"
        || (filterStatus === "On Track" && kpi.status === "On Track" && kpi.progress < 100)
        || (filterStatus === "Needs Attention" && (kpi.status === "Behind" || kpi.status === "At Risk"))
        || (filterStatus === "Completed" && kpi.progress === 100)
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
  const needsAttention = kpis.filter(k => ["Behind", "At Risk"].includes(k.status)).length;
  const completed = kpis.filter(k => k.progress === 100).length;
  const incomplete = kpis.filter(k => k.progress < 100).length;
  const verified = kpis.filter(k => k.verifyStatus === "Accepted").length;

  return (
    <div className="staff-container">
      <h3 className="staff-heading">My KPI</h3>

      {/* KPI Stats Cards */}
      <div className="summary-cards">
        <div className="summary-card"><div className="summary-card-title">Total KPIs</div><div className="summary-card-value total-kpis">{totalKpis}</div></div>
        <div className="summary-card"><div className="summary-card-title">On Track</div><div className="summary-card-value on-track">{onTrack}</div></div>
        <div className="summary-card"><div className="summary-card-title">Needs Attention</div><div className="summary-card-value at-risk">{needsAttention}</div></div>
        <div className="summary-card"><div className="summary-card-title">Completed</div><div className="summary-card-value completed-kpi">{completed}</div></div>
        <div className="summary-card"><div className="summary-card-title">Incomplete</div><div className="summary-card-value incomplete-kpi">{incomplete}</div></div>
        <div className="summary-card"><div className="summary-card-title">Verified</div><div className="summary-card-value verified-kpi">{verified}</div></div>
      </div>

      {/* Search & Filter Controls */}
      <div className="search-filters">
        <input
          type="text"
          className="search-input"
          placeholder="Search KPIs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="filter-group">
          {["All", "On Track", "Needs Attention", "Completed", "Verified"].map(status => (
            <button
              key={status}
              className={`filter-btn ${filterStatus === status ? 'active' : ''}`}
              onClick={() => setFilterStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>
        <select
          className="sort-select"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="None">Sort By</option>
          <option value="Due Date">Due Date</option>
          <option value="Progress">Progress</option>
        </select>
      </div>

      {/* KPI List */}
      <div className="row">
        {filteredKpis.map((kpi, index) => (
          <div className="col-6" key={index}>
            <div className="kpi-card">
              <div className="kpi-header">
                <h6 className="kpi-title">
                  {kpi.title}
                  {kpi.verifyStatus === "Accepted" && (
                    <span className="verification-badge verified">✓ Verified</span>
                  )}
                </h6>
                <span className={`status-chip ${kpi.status.replace(/ /g, '-').toLowerCase()}`}>
                  {kpi.status.toUpperCase()}
                </span>
              </div>
              <p className="kpi-description">{kpi.description}</p>
              <div className="progress-container">
                <div
                  className={`progress-bar ${kpi.progress === 100 ? 'success' : 'info'}`}
                  style={{ width: `${kpi.progress}%` }}
                >
                  {kpi.progress}%
                </div>
              </div>
              <div className="kpi-footer">
                <div className="kpi-meta">
                  Due: {kpi.dueDate}
                  {kpi.verifyStatus && (
                    <span className={`verification-badge ${kpi.verifyStatus.toLowerCase()}`}>
                      {kpi.verifyStatus}
                    </span>
                  )}
                </div>
                <button
                  className="btn btn-outline-primary btn-small"
                  onClick={() => handleKpiSelection(kpi, index)}
                >
                  View KPI
                </button>
              </div>
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
