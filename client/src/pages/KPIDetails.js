import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './KPIDetails.css';

const KPIDetails = () => {
  const { staffId } = useParams();
  const navigate = useNavigate();
  const [kpis, setKpis] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5050/api/kpis?staffId=${staffId}`)
      .then(res => res.json())
      .then(data => {
        setKpis(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching KPIs:', err);
        setLoading(false);
      });
  }, [staffId]);

  const handleStatusChange = async (kpiId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5050/api/kpis/${kpiId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update status');

      setKpis(prev =>
        prev.map(kpi =>
          kpi.id === kpiId ? { ...kpi, status: newStatus } : kpi
        )
      );
    } catch (err) {
      console.error('Error updating KPI status:', err);
    }
  };

  const handleBack = () => {
    navigate('/verify-kpi');
  };

  if (loading) {
    return (
      <div className="container">
        <p>Loading KPI details...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <button onClick={handleBack} className="back-button">← Back</button>
      <h2>KPI Details</h2>
      {kpis.length === 0 ? (
        <p>No KPIs found for staff ID: {staffId}</p>
      ) : (
        kpis.map(kpi => (
          <div key={kpi.id} className="kpi-card">
            <h3>{kpi.title}</h3>
            <p><strong>Category:</strong> {kpi.category}</p>
            <p><strong>Due Date:</strong> {kpi.dueDate}</p>
            <p><strong>Status:</strong> {kpi.status}</p>
            {kpi.evidence && (
              <a href={kpi.evidence} download>
                <button>Download Evidence</button>
              </a>
            )}
            {kpi.status === 'Pending' && (
              <>
                <button onClick={() => handleStatusChange(kpi.id, 'Accepted')}>Accept</button>
                <button onClick={() => handleStatusChange(kpi.id, 'Rejected')}>Reject</button>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default KPIDetails;
