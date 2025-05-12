import React from 'react'
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
    // Add "Verified" to title for verified KPIs
    let updatedKpi = { ...kpi };
    
    // Ensure status reflects 100% progress
    if (kpi.progress === 100 && kpi.status !== 'Completed') {
      updatedKpi.status = 'Completed';
    }
    
    // Add "Verified" to title for verified KPIs
    if (kpi.verifyStatus === "Accepted") {
      updatedKpi.title = updatedKpi.title + " Verified";
    }
    
    return updatedKpi;
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
    <div className="staff-container">
      <h3 className="staff-heading">My KPI</h3>

      {/* KPI Stats Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-card-title">Total KPIs</div>
          <div className="summary-card-value total-kpis">{totalKpis}</div>
        </div>
        <div className="summary-card">
          <div className="summary-card-title">On Track</div>
          <div className="summary-card-value on-track">{onTrack}</div>
        </div>
        <div className="summary-card">
          <div className="summary-card-title">Needs Attention</div>
          <div className="summary-card-value at-risk">{needsAttention}</div>
        </div>
        <div className="summary-card">
          <div className="summary-card-title">Completed</div>
          <div className="summary-card-value completed-kpi">{completed}</div>
        </div>
        <div className="summary-card">
          <div className="summary-card-title">Incomplete</div>
          <div className="summary-card-value incomplete-kpi">{incomplete}</div>
        </div>
        <div className="summary-card">
          <div className="summary-card-title">Verified</div>
          <div className="summary-card-value verified-kpi">{verified}</div>
        </div>
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

      {/* KPI List - Using custom grid */}
      <div className="row">
        {filteredKpis.map((kpi, index) => (
          <div className="col-6" key={index}>
            <div className="kpi-card">
              <div className="kpi-header">
                <h6 className="kpi-title">
                  {kpi.title}
                  {kpi.verifyStatus === "Accepted" && (
                    <span className="verification-badge verified">
                      ✓ Verified
                    </span>
                  )}
                </h6>
                <span className={`status-chip ${kpi.progress === 100 ? 'completed' : kpi.status.replace(/ /g, '-').toLowerCase()}`}>
                  {kpi.progress === 100 ? 'COMPLETED' : kpi.status.toUpperCase()}
                </span>
              </div>
              
              <p className="kpi-description">{kpi.description}</p>
              
              <div className="progress-container">
              <div 
                className={`progress-bar ${kpi.progress === 100 ? 'success' : 'info'}`} 
                style={{ width: `${kpi.progress}%`, color: '#FFFFFF' }}
              >
                {kpi.progress}%
              </div>
              </div>
              
              <div className="kpi-footer">
                <div className="kpi-meta">
                  Due: {kpi.dueDate} | {kpi.assignedTo ? kpi.assignedTo.name : 'N/A'}
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
    </div>
  )
}

export default Staff