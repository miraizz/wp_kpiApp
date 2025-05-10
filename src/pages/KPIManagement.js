import React, { useState } from 'react';

const KpiManagement = () => {
  const [kpis, setKpis] = useState([
    {
      title: 'Update Website',
      desc: 'Ensure the company site is updated',
      target: 90,
      staff: 'Marsya',
      dept: 'IT Department',
    },
    {
      title: 'Recruit Staff',
      desc: 'Hire 3 new developers',
      target: 70,
      staff: 'Amira',
      dept: 'HR Department',
    },
    {
      title: 'Submit Q2 Budget',
      desc: 'Prepare and submit Q2 financial forecast',
      target: 60,
      staff: 'Firzanah',
      dept: 'Finance Department',
    },
  ]);

  const [filterDept, setFilterDept] = useState('all');
  const [sortCol, setSortCol] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    target: '',
    staff: '',
    dept: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { title, desc, target, staff, dept } = formData;

    if (!title || !desc || !target || !staff || !dept) {
      alert('Please fill in all fields.');
      return;
    }

    setKpis(prev => [...prev, { ...formData, target: Number(target) }]);
    setFormData({ title: '', desc: '', target: '', staff: '', dept: '' });
  };

  const filteredKpis = kpis.filter(kpi =>
    filterDept === 'all' ? true : kpi.dept === filterDept
  );

  const handleSort = (col) => {
    const sorted = [...filteredKpis].sort((a, b) => {
      const valA = a[col].toString().toLowerCase();
      const valB = b[col].toString().toLowerCase();
      return isNaN(valA) ? valA.localeCompare(valB) : valA - valB;
    });
    setKpis(sorted);
    setSortCol(col);
  };

  return (
    <div className="section">
      <h2>KPI Management</h2>
      <p>View, add, update, and delete key performance indicators with ease.</p>

      <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
        <label htmlFor="title">KPI Title:</label><br />
        <input type="text" name="title" value={formData.title} onChange={handleChange} style={inputStyle} /><br />

        <label htmlFor="desc">Description:</label><br />
        <textarea name="desc" value={formData.desc} onChange={handleChange} rows="3" style={inputStyle}></textarea><br />

        <label htmlFor="target">Target Value:</label><br />
        <input type="number" name="target" value={formData.target} onChange={handleChange} style={inputStyle} /><br />

        <label htmlFor="staff">Staff Name:</label><br />
        <input type="text" name="staff" value={formData.staff} onChange={handleChange} style={inputStyle} /><br />

        <label htmlFor="dept">Department:</label><br />
        <input type="text" name="dept" value={formData.dept} onChange={handleChange} style={inputStyle} /><br />

        <button type="submit" style={btnPrimary}>Add KPI</button>
        <button type="reset" style={btnSecondary} onClick={() => setFormData({ title: '', desc: '', target: '', staff: '', dept: '' })}>Clear</button>
      </form>

      <div style={{ marginTop: '40px', textAlign: 'right' }}>
        <label htmlFor="departmentFilter">Filter by Department:</label>
        <select id="departmentFilter" onChange={(e) => setFilterDept(e.target.value)} value={filterDept}>
          <option value="all">All</option>
          <option value="IT Department">IT Department</option>
          <option value="HR Department">HR Department</option>
          <option value="Finance Department">Finance Department</option>
        </select>
      </div>

      <div style={{ overflowX: 'auto', marginTop: '20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '2px solid #0b5c66' }}>
          <thead style={{ backgroundColor: '#0b5c66', color: 'white' }}>
            <tr>
              <th style={thStyle} onClick={() => handleSort('title')}>Title ⬍</th>
              <th style={thStyle}>Description</th>
              <th style={thStyle} onClick={() => handleSort('target')}>Target ⬍</th>
              <th style={thStyle} onClick={() => handleSort('staff')}>Staff Name ⬍</th>
              <th style={thStyle} onClick={() => handleSort('dept')}>Department ⬍</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredKpis.map((kpi, idx) => (
              <tr key={idx}>
                <td style={tdStyle}>{kpi.title}</td>
                <td style={tdStyle}>{kpi.desc}</td>
                <td style={tdStyle}>{kpi.target}%</td>
                <td style={tdStyle}>{kpi.staff}</td>
                <td style={tdStyle}>{kpi.dept}</td>
                <td style={tdStyle}>
                  <button style={btnPrimary}>Edit</button>
                  <button style={{ ...btnSecondary, marginLeft: '5px', backgroundColor: '#b22222' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '15px',
};

const btnPrimary = {
  padding: '10px 20px',
  backgroundColor: '#0b5c66',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const btnSecondary = {
  padding: '10px 20px',
  backgroundColor: '#aaa',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const thStyle = {
  padding: '10px',
  border: '1px solid #0b5c66',
  cursor: 'pointer',
};

const tdStyle = {
  padding: '10px',
  border: '1px solid #0b5c66',
};

export default KpiManagement;
