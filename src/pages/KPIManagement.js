
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Import uuid to generate unique IDs

const KpiManagement = () => {
  const [kpis, setKpis] = useState([
    { id: 'KPI-2025-001', title: 'Increase Website Traffic', desc: 'Grow traffic by 20% in Q3 through targeted ad campaigns', staff: 'Afiq', dept: 'Marketing', managerName: 'Priya Patel', managerId: 'MGR-110', staffId: 'EMP-201', startDate: '2025-07-01', endDate: '2025-09-30', category: 'Performance', priority: 'High' },
    { id: 'KPI-2025-002', title: 'Social Media Engagement', desc: 'Boost Instagram engagement by 15% through reels.', staff: 'Afiq', dept: 'Marketing', managerName: 'Priya Patel', managerId: 'MGR-110', staffId: 'EMP-201', startDate: '2025-07-01', endDate: '2025-09-15', category: 'Performance', priority: 'Medium' },
    { id: 'KPI-2025-003', title: 'Develop Landing Page', desc: 'Design and launch product landing page for campaign.', staff: 'Afiq', dept: 'Marketing', managerName: 'Priya Patel', managerId: 'MGR-110', staffId: 'EMP-201', startDate: '2025-07-10', endDate: '2025-08-31', category: 'Documentation', priority: 'Low' },
    { id: 'KPI-2025-004', title: 'Complete Financial Audit', desc: 'Ensure Q2 financial audit is completed and submitted.', staff: 'Alif', dept: 'Finance', managerName: 'Priya Patel', managerId: 'MGR-110', staffId: 'EMP-202', startDate: '2025-07-05', endDate: '2025-08-15', category: 'Compliance', priority: 'Medium' },
    { id: 'KPI-2025-005', title: 'Create Forecasting Mode', desc: 'Develop predictive model for Q4 budgeting.', staff: 'Alif', dept: 'Finance', managerName: 'Priya Patel', managerId: 'MGR-110', staffId: 'EMP-202', startDate: '2025-07-10', endDate: '2025-09-25', category: 'Performance', priority: 'High' },
    { id: 'KPI-2025-006', title: 'Revise Company Policy', desc: 'Update internal policy documents and publish to portal.', staff: 'Amira', dept: 'HR', managerName: 'Priya Patel', managerId: 'MGR-110', staffId: 'EMP-203', startDate: '2025-07-01', endDate: '2025-08-20', category: 'Documentation', priority: 'Low' },
    { id: 'KPI-2025-007', title: 'Improve Ticket Response Time', desc: 'Reduce average support response to under 1 hour.', staff: 'Marsya', dept: 'IT', managerName: 'Priya Patel', managerId: 'MGR-110', staffId: 'EMP-204', startDate: '2025-07-10', endDate: '2025-09-25', category: 'Performance', priority: 'High' },
    { id: 'KPI-2025-008', title: 'Deploy Helpdesk System', desc: 'Implement and onboard staff to new helpdesk tool.', staff: 'Marsya', dept: 'IT', managerName: 'Priya Patel', managerId: 'MGR-110', staffId: 'EMP-204', startDate: '2025-07-15', endDate: '2025-08-30', category: 'Compliance', priority: 'Medium' },
    { id: 'KPI-2025-009', title: 'Standardize Financial Templates', desc: 'Create unified templates for all quarterly reports', staff: 'Zikri', dept: 'Finance', managerName: 'Priya Patel', managerId: 'MGR-110', staffId: 'EMP-205', startDate: '2025-07-12', endDate: '2025-09-15', category: 'Documentation', priority: 'Medium' },
  ]);

  const [filterDept, setFilterDept] = useState('all');
  const [formData, setFormData] = useState({ title: '', desc: '', staff: '', dept: '', managerName: '', managerId: '', staffId: '', startDate: '', endDate: '', category: '', priority: '' });
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [isDetailsPopupOpen, setIsDetailsPopupOpen] = useState(false);

  useEffect(() => {
    if (isEditMode && editId) {
      const kpi = kpis.find((k) => k.id === editId);
      if (kpi) {
        setFormData({ ...kpi });
      }
    }
  }, [isEditMode, editId]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const openAddPopup = () => {
    setFormData({ title: '', desc: '', staff: '', dept: '', managerName: '', managerId: '', staffId: '', startDate: '', endDate: '', category: '', priority: '' });
    setIsEditMode(false);
    setEditId(null);
    setIsPopupOpen(true);
  };

  const openEditPopup = (id) => {
    setEditId(id);
    setIsEditMode(true);
    setIsPopupOpen(true);
  };

  const openDetailsPopup = (id) => {
    setEditId(id);
    setIsDetailsPopupOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(formData).some(v => v === '')) {
      alert('Please fill in all fields.');
      return;
    }

    const updatedKPI = { ...formData, id: editId || uuidv4() };
    if (isEditMode) {
      setKpis(prev => prev.map((kpi) => (kpi.id === editId ? updatedKPI : kpi)));
    } else {
      setKpis(prev => [...prev, updatedKPI]);
    }

    setIsPopupOpen(false);
    setEditId(null);
    setIsEditMode(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this KPI?")) {
      setKpis(prev => prev.filter((kpi) => kpi.id !== id));
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const getSortedKpis = () => {
    let filtered = kpis.filter(kpi => (filterDept === 'all' ? true : kpi.dept === filterDept));
    if (!sortConfig.key) return filtered;

    return [...filtered].sort((a, b) => {
      const valA = a[sortConfig.key];
      const valB = b[sortConfig.key];

      if (typeof valA === 'number') {
        return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
      } else {
        return sortConfig.direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
    });
  };

  const sortedKpis = getSortedKpis();

  const renderPriorityColor = (priority) => {
    if (priority === 'High') return { backgroundColor: 'red', color: 'white' };
    if (priority === 'Medium') return { backgroundColor: 'yellow', color: 'black' };
    return { backgroundColor: 'green', color: 'white' };
  };

  const renderSortIcons = (key) => {
    const isActive = sortConfig.key === key;
    return (
      <span style={{ fontSize: '12px', marginLeft: '4px' }}>
        <span style={{ fontWeight: isActive && sortConfig.direction === 'asc' ? 'bold' : 'normal' }}>↑</span>
        <span style={{ fontWeight: isActive && sortConfig.direction === 'desc' ? 'bold' : 'normal' }}>↓</span>
      </span>
    );
  };

  return (
    <div className="section">
      <h2 className="heading">KPI Management</h2>
      <p className="description">View, add, update, and delete key performance indicators with ease.</p>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
     <button type="button" style={btnPrimary} onClick={openAddPopup}>
        Add KPI
    </button>

        <div>
          <label htmlFor="departmentFilter">Filter by Department:</label>{' '}
          <select id="departmentFilter" onChange={(e) => setFilterDept(e.target.value)} value={filterDept}>
            <option value="all">All</option>
            <option value="IT">IT Department</option>
            <option value="HR">HR Department</option>
            <option value="Finance">Finance Department</option>
            <option value="Marketing">Marketing Department</option>
          </select>
        </div>
      </div>

      {isPopupOpen && (
        <div style={popupOverlayStyle}>
          <div style={popupStyle}>
            <h3>{isEditMode ? 'Edit KPI' : 'Add New KPI'}</h3>
            <div
  style={{
    maxHeight: '70vh',
    overflowY: 'auto',
    padding: '20px',
    boxSizing: 'border-box',
  }}
>
  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
    <label>Title:</label>
    <input type="text" name="title" value={formData.title} onChange={handleChange} />

    <label>Description:</label>
    <input type="text" name="desc" value={formData.desc} onChange={handleChange} />

    <label>Staff ID:</label>
    <input type="text" name="staffId" value={formData.staffId} onChange={handleChange} />

    <label>Staff Name:</label>
    <input type="text" name="staff" value={formData.staff} onChange={handleChange} />

    <label>Department:</label>
    <input type="text" name="dept" value={formData.dept} onChange={handleChange} />

    <label>Manager Name:</label>
    <input type="text" name="managerName" value={formData.managerName} onChange={handleChange} />

    <label>Manager ID:</label>
    <input type="text" name="managerId" value={formData.managerId} onChange={handleChange} />

    <label>Start Date:</label>
    <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />

    <label>End Date:</label>
    <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />

    <label>Category:</label>
    <input type="text" name="category" value={formData.category} onChange={handleChange} />

    <label>Priority:</label>
    <select name="priority" value={formData.priority} onChange={handleChange}>
      <option value="">Select</option>
      <option value="High">High</option>
      <option value="Medium">Medium</option>
      <option value="Low">Low</option>
    </select>

    <button type="submit" style={btnPrimary}>{isEditMode ? 'Update KPI' : 'Add KPI'}</button>
    <button type="button" style={btnSecondary} onClick={() => setIsPopupOpen(false)}>Cancel</button>
  </form>
</div>
          </div>
        </div>
      )}

      {isDetailsPopupOpen && (
        <div style={popupOverlayStyle}>
          <div style={popupStyle}>
            <h3>KPI Details</h3>
            {kpis.filter(kpi => kpi.id === editId).map(kpi => (
              <div key={kpi.id}>
                <p><strong>Title:</strong> {kpi.title}</p>
                <p><strong>Description:</strong> {kpi.desc}</p>
                <p><strong>Staff Name:</strong> {kpi.staff}</p>
                <p><strong>Staff ID:</strong> {kpi.staffId}</p>
                <p><strong>Manager Name:</strong> {kpi.managerName}</p>
                <p><strong>Manager ID:</strong> {kpi.managerId}</p>
                <p><strong>Start Date:</strong> {kpi.startDate}</p>
                <p><strong>End Date:</strong> {kpi.endDate}</p>
                <p><strong>Category:</strong> {kpi.category}</p>
                <p><strong>Priority:</strong> {kpi.priority}</p>
              </div>
            ))}
            <button type="button" style={btnSecondary} onClick={() => setIsDetailsPopupOpen(false)}>Close</button>
          </div>
        </div>
      )}

      <table style={tableStyle}>
  <thead>
    <tr>
      <th style={thStyle} onClick={() => handleSort('title')}>Title {renderSortIcons('title')}</th>
      <th style={thStyle} onClick={() => handleSort('staff')}>Staff Name {renderSortIcons('staff')}</th>
      <th style={thStyle} onClick={() => handleSort('dept')}>Department {renderSortIcons('dept')}</th>
      <th style={thStyle} onClick={() => handleSort('priority')}>Priority {renderSortIcons('priority')}</th>
      <th style={thStyle}>Actions</th>
    </tr>
  </thead>
  <tbody>
    {sortedKpis.map(kpi => (
      <tr key={kpi.id} style={rowHoverStyle}>
        <td style={tdStyle}>{kpi.title}</td>
        <td style={tdStyle}>{kpi.staff}</td>
        <td style={tdStyle}>{kpi.dept}</td>
        <td style={{ ...tdStyle, ...renderPriorityColor(kpi.priority) }}>{kpi.priority}</td>
        <td style={tdStyle}>
          <button onClick={() => openDetailsPopup(kpi.id)} style={btnTertiary}>Details</button>
          <button onClick={() => openEditPopup(kpi.id)} style={btnPrimary}>Edit</button>
          <button onClick={() => handleDelete(kpi.id)} style={btnSecondary}>Delete</button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
    </div>
  );
};

// Styles
const popupBtnStyle = {
  padding: '10px 20px',
  borderRadius: '6px',
  border: 'none',
  fontSize: '14px',
  cursor: 'pointer',
};

const btnPrimary = {
  backgroundColor: '#4F7942',
  color: '#fff',
  padding: '8px 12px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

const btnSecondary = {
  backgroundColor: '#FF2400',
  color: '#fff',
  padding: '8px 12px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

const btnTertiary = {
  backgroundColor: '#0b5c66',
  color: '#fff',
  padding: '8px 12px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

const inputStyle = {
  padding: '8px',
  marginBottom: '10px',
  width: '100%',
};

const popupOverlayStyle = {
  position: 'fixed',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const popupStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '10px',
  maxWidth: '600px',
  width: '100%',
  maxHeight: '90%',
  overflowY: 'auto',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '20px',
  border: '1px solid #ccc',
};

const thStyle = {
  border: '1px solid #ccc',
  padding: '12px',
  textAlign: 'left',
  backgroundColor: '#0b5c66',
  color: 'white',
};

const tdStyle = {
  border: '1px solid #ccc',
  padding: '12px',
};

const rowHoverStyle = {
  backgroundColor: '#f9f9f9',
};

export default KpiManagement;
