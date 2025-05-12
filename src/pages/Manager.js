import React, { useState } from 'react';
import Overview from './dashboard/Overview';
import Analytics from './dashboard/Analytics';
import Team from './dashboard/Team';
import AllKPIs from './dashboard/AllKPIs';
import './Manager.css';

const Manager = () => {
  const [activeTab, setActiveTab] = useState('Overview');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Overview':
        return <Overview />
      case 'Analytics':
        return <Analytics />;
      case 'Team':
        return <Team />;
      case 'All KPIs':
        return <AllKPIs />;;
      default:
        return null;
    }
  };

  return (
    <div className="manager-page">
      <div className="header">
        <h2 className="heading">Manager Dashboard</h2>
        <p className="description">Manage and track key performance indicators</p>
      </div>

      <div className="tabs">
        {['Overview', 'Analytics', 'Team', 'All KPIs'].map((tab) => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Manager;