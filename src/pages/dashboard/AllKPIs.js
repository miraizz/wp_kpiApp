import React, { useState } from 'react';
import { dummyKPIs } from '../../data/dummyKPIs';

const AllKPIs = () => {
  const [search, setSearch] = useState("");

  const filteredKPIs = dummyKPIs.filter((kpi) =>
    kpi.title.toLowerCase().includes(search.toLowerCase()) ||
    kpi.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="all-kpis-container">
      <div className="aliff-search-bar-container">
        <input
          type="text"
          placeholder="Search KPIs by title or description"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="aliff-search-bar"
        />
      </div>

      <div className="kpi-grid">
        {filteredKPIs.length === 0 ? (
          <p>No KPIs found</p>
        ) : (
          filteredKPIs.map((kpi, index) => (
            <div key={index} className="kpi-card">
              <h3 className="kpi-title">{kpi.title}</h3>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p className="kpi-description">{kpi.description}</p>
                <span className={`kpi-priority ${kpi.priority.toLowerCase()}`}>{kpi.priority}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                <span style={{ fontSize: '12px', color: '#555' }}>Progress</span>
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#000' }}>{kpi.progress}%</span>
              </div>

              <div className="progress-bar-container">
                <div
                  className="progress-bar"
                  style={{ width: `${kpi.progress}%` }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '0.5rem' }}>
                <p className="kpi-start-date">Start: {kpi.startDate}</p>
                <p className="kpi-due-date">Due: {kpi.dueDate}</p>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AllKPIs;
