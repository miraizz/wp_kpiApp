import React from 'react'
import './Staff.css';

const Staff = () => {
  return (
    <div className="staff-page">
      <div className="content-container">
        <h2 className="heading">Staff Dashboard</h2>
        <p className="description">Manage and track key performance indicators</p>
      </div>

      <div className="cards-container">
        <div className="card">
          <div className="card-title total-kpis">4</div>
          <div className="card-content">Total</div>
        </div>

        <div className="card">
          <div className="card-title on-track">2</div>
          <div className="card-content">On Track</div>
        </div>

        <div className="card">
          <div className="card-title at-risk">3</div>
          <div className="card-content">At Risk</div>
        </div>

        <div className="card">
          <div className="card-title behind">4</div>
          <div className="card-content">Behind</div>
        </div>
      </div>

      <div className='big-card-container'>
        <div className='big-card'>

        </div>
      </div>
    </div>
  )
}

export default Staff