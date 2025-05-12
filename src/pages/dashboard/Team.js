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
      {/* Search Bar */}
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search team members..."
          className="search-bar"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Main Content - Team List + Details */}
      <div>
        {/* Team List */}
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

        {/* Team Details */}
        <div className="team-details">
          {selectedStaff ? (
            (() => {
              const staff = staffWithKPIs.find(s => s.staffId === selectedStaff);
              return (
                <div className="card">
                  <div className="card-content">
                    <h3>Staff Details</h3>
                    <p>Name: {staff.name}</p>
                    <p>Department: {staff.department}</p>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="card">
              <div className="card-content">
                <h3>Select a team member to view their details</h3>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Team;