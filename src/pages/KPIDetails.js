import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './KPIDetails.css';


const kpis = [
  {
    staffId: 1,
    kpis: [
      {
        id: 101,
        title: 'Complete Annual Report',
        category: 'Documentation',
        dueDate: '2025-06-15',
        evidence: '/files/annual-report.pdf',
        status: 'Pending',
      },
    ],
  },
];

const KPIDetails = () => {
  const { staffId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(kpis.find(k => k.staffId === parseInt(staffId)));

  const handleStatusChange = (kpiId, newStatus) => {
    const updatedKPIs = data.kpis.map(kpi =>
      kpi.id === kpiId ? { ...kpi, status: newStatus } : kpi
    );
    setData({ ...data, kpis: updatedKPIs });
  };

  const handleBack = () => {
    navigate('/verify-kpi');
  };

  return (
    <div className="container">
      <button onClick={handleBack} className="back-button">← Back</button>
      <h2>KPI Details</h2>
      {data.kpis.map(kpi => (
        <div key={kpi.id} className="kpi-card">
          <h3>{kpi.title}</h3>
          <p><strong>Category:</strong> {kpi.category}</p>
          <p><strong>Due Date:</strong> {kpi.dueDate}</p>
          <p><strong>Status:</strong> {kpi.status}</p>
          <a href={kpi.evidence} download>
            <button>Download Evidence</button>
          </a>
          {kpi.status === 'Pending' && (
            <>
              <button onClick={() => handleStatusChange(kpi.id, 'Accepted')}>Accept</button>
              <button onClick={() => handleStatusChange(kpi.id, 'Rejected')}>Reject</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default KPIDetails;
