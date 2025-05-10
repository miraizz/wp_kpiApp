import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './VerifyKPI.css';


const allData = [
  {
    id: 1,
    name: 'John Doe',
    department: 'HR',
    category: 'Documentation',
    kpiCount: 3,
    status: 'Pending',
  },
  {
    id: 2,
    name: 'Jane Smith',
    department: 'IT',
    category: 'Performance',
    kpiCount: 2,
    status: 'Accepted',
  },
  {
    id: 3,
    name: 'Alice Tan',
    department: 'Finance',
    category: 'Compliance',
    kpiCount: 1,
    status: 'Rejected',
  },
];

const VerifyKPI = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    department: '',
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const filteredData = allData.filter((item) => {
    return (
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filters.category ? item.category === filters.category : true) &&
      (filters.status ? item.status === filters.status : true) &&
      (filters.department ? item.department === filters.department : true)
    );
  });

  return (
    <div className="container">
      <h2>Verify KPI</h2>

      {/* Search & Filter Section */}
      <div className="filter-section">
        <input
          type="text"
          placeholder="Search staff..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select name="category" value={filters.category} onChange={handleFilterChange}>
          <option value="">All Categories</option>
          <option value="Documentation">Documentation</option>
          <option value="Performance">Performance</option>
          <option value="Compliance">Compliance</option>
        </select>

        <select name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Accepted">Accepted</option>
          <option value="Rejected">Rejected</option>
        </select>

        <select name="department" value={filters.department} onChange={handleFilterChange}>
          <option value="">All Departments</option>
          <option value="HR">HR</option>
          <option value="IT">IT</option>
          <option value="Finance">Finance</option>
        </select>
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
                <td>{staff.status}</td>
                <td>
                  <Link to={`/verify-kpi/${staff.id}`}>
                    <button>See Details</button>
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
