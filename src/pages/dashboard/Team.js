import React, { useState } from 'react';
import { dummyKPIs } from '../../data/dummyKPIs';
import '../Manager.css';

const Team = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStaff, setSelectedStaff] = useState(null);

  // Filter staff by search term
  const staffWithKPIs = dummyKPIs.map(kpi => kpi.assignedTo).filter((staff, index, self) =>
    self.findIndex(s => s.staffId === staff.staffId) === index // Ensure unique staff
  );

  const handleStaffSelect = (staffId) => {
    setSelectedStaff(staffId);
  };

  const getAvatar = (name) => {
    return name ? name[0].toUpperCase() : '?';
  };

  return (
    <div className="team-container">
      {/* Left Column: Search + Team List */}
      <div className="left-column">
        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Search team members..."
            className="search-bar"
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
                  {dummyKPIs.filter(kpi => kpi.assignedTo.staffId === staff.staffId).length} KPIs
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
                  flexDirection: "column", // Stack items vertically
                  alignItems: "flex-start", // Align items to the start
                  padding: "16px",
                  fontSize: "1.25rem",
                  width: "100%", // Ensure the staff details container takes full width
                }}
              >
                {/* Avatar, Name, and Department Section */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "16px", // Space between staff info and the cards below
                  }}
                >
                  {/* Avatar */}
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
                      marginRight: "16px", // Space between avatar and staff info
                    }}
                  >
                    {getAvatar(staff.name)}
                  </div>

                  {/* Staff Info (Name and Department) */}
                  <div
                    className="staff-info"
                    style={{
                      display: "flex",
                      flexDirection: "column", // Ensure name and department are stacked vertically
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

                {/* Container for KPI and Other Cards */}
                <div className="manager-cards-container"
                  style={{
                    width: "100%", // Full width of the parent
                    display: "flex",
                    flexDirection: "row", // Align cards horizontally
                    justifyContent: "space-between", // Distribute cards evenly
                    gap: "16px", // Space between cards
                  }}
                >
                  <div className="card" style={{ flex: 1 }}>
                    <h3 className="manager-card-name">KPIs</h3>
                    <div className="manager-card-number">10</div>
                  </div>
                  <div className="card" style={{ flex: 1 }}>
                    <h3 className="manager-card-name">Completion</h3>
                    <div className="manager-card-number">100%</div>
                  </div>
                  <div className="card" style={{ flex: 1 }}>
                    <h3 className="manager-card-name">Completed</h3>
                    <div className="manager-card-number">10</div>
                  </div>
                  <div className="card" style={{ flex: 1 }}>
                    <h3 className="manager-card-name">Pending Review</h3>
                    <div className="manager-card-number">10</div>
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