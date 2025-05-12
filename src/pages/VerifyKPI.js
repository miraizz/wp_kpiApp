import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { dummyKPIs, getStaffKpiCount } from '../data/dummyKPIs';
import './VerifyKPI.css';

const VerifyKPI = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    department: '',
  });

  // Create KPI summaries per staff
  const staffSummaries = getStaffKpiCount(dummyKPIs).map((staff) => {
    const kpis = dummyKPIs.filter(kpi => kpi.assignedTo.staffId === staff.staffId);
    const categories = [...new Set(kpis.map(kpi => kpi.category))];
    const hasPending = kpis.some(kpi => kpi.status === 'Pending');

    return {
      id: staff.staffId,
      name: staff.name,
      department: staff.department,
      category: categories.length === 1 ? categories[0] : 'Multiple',
      kpiCount: staff.kpiCount,
      status: hasPending ? 'Need Approval' : 'Completed'
    };
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const filteredData = staffSummaries.filter((item) => {
    return (
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filters.category ? item.category === filters.category : true) &&
      (filters.status ? item.status === filters.status : true) &&
      (filters.department ? item.department === filters.department : true)
    );
  });

  return (
    <div className="container">
      <h2 className="heading">Verify KPI</h2>
      <p className="description">Verify the evidence submitted by a staff</p>

      {/* Search and Filter Controls */}
      <div className="filter-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search staff..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <select name="category" value={filters.category} onChange={handleFilterChange}>
            <option value="">All Categories</option>
            <option value="Documentation">Documentation</option>
            <option value="Performance">Performance</option>
            <option value="Compliance">Compliance</option>
          </select>

          <select name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="">All Statuses</option>
            <option value="Need Approval">Need Approval</option>
            <option value="Completed">Completed</option>
          </select>

          <select name="department" value={filters.department} onChange={handleFilterChange}>
            <option value="">All Departments</option>
            <option value="HR">HR</option>
            <option value="IT">IT</option>
            <option value="Finance">Finance</option>
            <option value="Marketing">Marketing</option>
          </select>
        </div>
      </div>

      {/* KPI Table */}
      <table className="kpi-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Staff Name</th>
            <th>Department</th>
            <th>Category</th>
            <th>No. of KPIs</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((staff, index) => (
              <tr key={staff.id}>
                <td>{index + 1}</td>
                <td>{staff.name}</td>
                <td>{staff.department}</td>
                <td>{staff.category}</td>
                <td>{staff.kpiCount}</td>
                <td>
                  <span className={`status-badge ${staff.status === 'Completed' ? 'completed' : 'need-approval'}`}>
                    {staff.status}
                  </span>
                </td>
                <td>
                  <Link to={`/kpi-details/${staff.id}`}>
                    <button className="view-btn">View KPIs</button>
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No results found.</td>
            </tr> 
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VerifyKPI;
