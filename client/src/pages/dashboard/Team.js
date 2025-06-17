import React, { useEffect, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import '../Manager.css';

ChartJS.register(ChartDataLabels, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

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

  const calculateScore = (staffKPIs) => {
    return staffKPIs.reduce((total, kpi) => {
      if (kpi.progress === 100 && kpi.status === 'Completed' && kpi.submitted && kpi.verifyStatus === 'Accepted') {
        return total + 10; // Completed and verified
      } else if (kpi.progress === 100 && kpi.status === 'Completed' && kpi.submitted && kpi.verifyStatus === 'Pending') {
        return total + 5; // Completed but pending verification
      } else if (kpi.progress > 0) {
        return total + Math.floor(kpi.progress / 10); // Partial progress
      }
      return total;
    }, 0);
  };

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

  const score = calculateScore(selectedKPIs);

  // Prepare data for performance chart
  const performanceData = {
    labels: ['Completed', 'Pending Review', 'In Progress'],
    datasets: [{
      data: [
        completed,
        pendingReview,
        total - completed - pendingReview
      ],
      backgroundColor: ['#77DD77', '#FFB347', '#84B6F4'],
      borderWidth: 1
    }]
  };

  const performanceOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      },
      datalabels: {
        color: '#fff',
        formatter: (value) => value || ''
      }
    }
  };

  // Prepare data for progress trend
  const progressData = {
    labels: selectedKPIs.map(kpi => kpi.title),
    datasets: [{
      label: 'Progress',
      data: selectedKPIs.map(kpi => kpi.progress),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  };

  const progressOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Progress (%)'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

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
            .map(staff => {
              const staffKPIs = kpis.filter(kpi => kpi.assignedTo?.staffId === staff.staffId);
              const staffScore = calculateScore(staffKPIs);
              
              return (
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
                  <div className="staff-score">
                    <span className="score-badge">{staffScore} pts</span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Right Column: Staff Details */}
      <div className="right-column">
        {selectedStaff ? (
          (() => {
            const staff = staffWithKPIs.find(s => s.staffId === selectedStaff);
            return (
              <div className="staff-details">
                {/* Staff Header */}
                <div className="staff-header">
                  <div className="avatar-large">{getAvatar(staff.name)}</div>
                  <div className="staff-info-large">
                    <h2>{staff.name}</h2>
                    <p>{staff.department}</p>
                  </div>
                  <div className="score-display">
                    <h3>Total Score</h3>
                    <div className="score-value">{score} points</div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="manager-cards-container">
                  <div className="aliff-card">
                    <h3 className="manager-card-name">Total KPIs</h3>
                    <div className="manager-card-number">{total}</div>
                  </div>
                  <div className="aliff-card">
                    <h3 className="manager-card-name">Completion Rate</h3>
                    <div className="manager-card-number">{avgCompletion}%</div>
                  </div>
                  <div className="aliff-card">
                    <h3 className="manager-card-name">Completed</h3>
                    <div className="manager-card-number">{completed}</div>
                  </div>
                  <div className="aliff-card">
                    <h3 className="manager-card-name">Pending Review</h3>
                    <div className="manager-card-number">{pendingReview}</div>
                  </div>
                </div>

                {/* Charts Section */}
                <div className="charts-container">
                  <div className="chart-card">
                    <h3>Performance Overview</h3>
                    <div className="chart-wrapper">
                      <Doughnut data={performanceData} options={performanceOptions} />
                    </div>
                  </div>
                  <div className="chart-card">
                    <h3>Progress by KPI</h3>
                    <div className="chart-wrapper">
                      <Bar data={progressData} options={progressOptions} />
                    </div>
                  </div>
                </div>

                {/* Scoring System Explanation */}
                <div className="scoring-system">
                  <h3>Scoring System</h3>
                  <ul>
                    <li>✅ Completed & Verified KPI: 10 points</li>
                    <li>⏳ Completed & Pending Verification: 5 points</li>
                    <li>📈 Partial Progress: 1 point per 10% progress</li>
                  </ul>
                </div>
              </div>
            );
          })()
        ) : (
          <div className="select-prompt">
            <h3>Select a team member to view their details</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Team;
