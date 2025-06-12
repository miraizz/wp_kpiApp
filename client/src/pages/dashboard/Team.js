import React, { useEffect, useState } from 'react';
import '../Manager.css';

const Team = () => {
  const [kpis, setKpis] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStaff, setSelectedStaff] = useState(null);

  useEffect(() => {
    fetch('/api/kpi')
      .then(res => res.json())
      .then(data => setKpis(data))
      .catch(err => console.error('Error loading KPIs:', err));
  }, []);

  const staffWithKPIs = kpis
    .map(kpi => kpi.assignedTo)
    .filter((staff, index, self) =>
      staff &&
      staff.staffId &&
      self.findIndex(s => s.staffId === staff.staffId) === index
    );

  const handleStaffSelect = (staffId) => {
    setSelectedStaff(staffId);
  };

  const getAvatar = (name) => {
    return name ? name[0].toUpperCase() : '?';
  };

  const selectedKPIs = kpis.filter(kpi => kpi.assignedTo?.staffId === selectedStaff);

  const total = selectedKPIs.length;

  const completed = selectedKPIs.filter(
    kpi =>
      kpi.progress === 100 &&
      kpi.status === 'Completed' &&
      kpi.submitted === true &&
      kpi.verifyStatus === 'Accepted'
  ).length;

  const pendingReview = selectedKPIs.filter(
    kpi =>
      kpi.progress === 100 &&
      kpi.status === 'Completed' &&
      kpi.submitted === true &&
      kpi.verifyStatus === 'Pending'
  ).length;

  const avgCompletion = total
    ? Math.round(selectedKPIs.reduce((sum, kpi) => sum + parseInt(kpi.progress || 0), 0) / total)
    : 0;

  return (
    <div className="team-container">
      {/* Left Column: Search + Team List */}
      <div className="left-column">
        <div className="aliff-search-bar-container">
          <input
            type="text"
            placeholder="Search team members..."
            className="aliff-search-bar"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="team-card">
          <div className="team-header">
            <h3 className="team-title">Team Members</h3>
          </div>
          {staffWithKPIs
            .filter(staff =>
              searchTerm === "" || staff.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map(staff => (
              <div
                key={staff.staffId}
                className={`team-item ${selectedStaff === staff.staffId ? 'selected' : ''}`}
                onClick={() => handleStaffSelect(staff.staffId)}
              >
                <div className="avatar">{getAvatar(staff.name)}</div>
                <div className="staff-info">
                  <p className="staff-name">{staff.name}</p>
                  <p className="staff-department">{staff.department}</p>
                </div>
                <div className="kpi-count">
                  {kpis.filter(kpi => kpi.assignedTo.staffId === staff.staffId).length} KPIs
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Right Column: Staff Details */}
      <div className="right-column">
        {selectedStaff ? (
          (() => {
            const staff = staffWithKPIs.find(s => s.staffId === selectedStaff);
            return (
              <div className="staff-details"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  padding: "16px",
                  fontSize: "1.25rem",
                  width: "100%",
                }}
              >
                {/* Avatar, Name, and Department */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "16px",
                  }}
                >
                  <div
                    className="avatar"
                    style={{
                      width: "64px",
                      height: "64px",
                      backgroundColor: "#007bff",
                      color: "white",
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "16px",
                    }}
                  >
                    {getAvatar(staff.name)}
                  </div>
                  <div
                    className="staff-info"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <p
                      className="staff-name"
                      style={{
                        fontSize: 20,
                        fontWeight: 1000,
                        marginBottom: "4px",
                      }}
                    >
                      {staff.name}
                    </p>
                    <p
                      className="staff-department"
                      style={{
                        color: "#666",
                        fontSize: "1rem",
                      }}
                    >
                      {staff.department}
                    </p>
                  </div>
                </div>

                {/* KPI Metrics */}
                <div className="manager-cards-container"
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    gap: "16px",
                  }}
                >
                  <div className="aliff-card" style={{ flex: 1 }}>
                    <h3 className="manager-card-name">KPIs</h3>
                    <div className="manager-card-number">{total}</div>
                  </div>
                  <div className="aliff-card" style={{ flex: 1 }}>
                    <h3 className="manager-card-name">Completion</h3>
                    <div className="manager-card-number">{avgCompletion}%</div>
                  </div>
                  <div className="aliff-card" style={{ flex: 1 }}>
                    <h3 className="manager-card-name">Completed</h3>
                    <div className="manager-card-number">{completed}</div>
                  </div>
                  <div className="aliff-card" style={{ flex: 1 }}>
                    <h3 className="manager-card-name">Pending Review</h3>
                    <div className="manager-card-number">{pendingReview}</div>
                  </div>
                </div>
              </div>
            );
          })()
        ) : (
          <h3>Select a team member to view their details</h3>
        )}
      </div>
    </div>
  );
};

export default Team;
