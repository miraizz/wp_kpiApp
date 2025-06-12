import React, { useState, useEffect } from 'react';
import './KPIManagement.css';

const KPIManagement = () => {
  const [kpis, setKpis] = useState([]);
  const [filterDept, setFilterDept] = useState('all');
  const [formData, setFormData] = useState({
    title: '', description: '', staffId: '', staffName: '', department: '',
    managerName: '', managerId: '', startDate: '', endDate: '', category: '', priority: ''
  });
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [detailsId, setDetailsId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    fetch('/api/kpi')
      .then(res => res.json())
      .then(data => setKpis(data))
      .catch(err => console.error('Error loading KPIs:', err));
  }, []);

  const openForm = (edit = false, id = null) => {
    if (edit) {
      const kpi = kpis.find(k => k.id === id);
      // if (!kpi) return;

      setFormData({
        title: kpi.title, description: kpi.description, staffId: kpi.assignedTo.staffId,
        staffName: kpi.assignedTo.name, department: kpi.assignedTo.department,
        managerName: kpi.assignedBy.name, managerId: kpi.assignedBy.managerId,
        startDate: kpi.startDate, endDate: kpi.dueDate, category: kpi.category, priority: kpi.priority
      });
      setEditId(id);
      setIsEditMode(true);
    } else {
      setFormData({
        title: '', description: '', staffId: '', staffName: '', department: '',
        managerName: '', managerId: '', startDate: '', endDate: '', category: '', priority: ''
      });
      setIsEditMode(false);
      setEditId(null);
    }
    setIsPopupOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isEditMode ? `/api/kpi/${editId}` : '/api/kpi';
    const method = isEditMode ? 'PUT' : 'POST';

    const payload = {
      title: formData.title,
      description: formData.description || '',
      category: formData.category,
      priority: formData.priority,
      startDate: formData.startDate,
      dueDate: formData.endDate,
      status: 'On Track',
      progress: 0,
      assignedTo: {
        name: formData.staffName,
        staffId: formData.staffId,
        department: formData.department
      },
      assignedBy: {
        name: formData.managerName,
        managerId: formData.managerId
      }
    };

    try {
      const res = await fetch(`http://localhost:5050${url}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save KPI');

      // Refetch or update list manually
      setKpis(prev =>
        isEditMode
          ? prev.map(kpi => (kpi.id === editId ? data : kpi))
          : [...prev, data]
      );

      setIsPopupOpen(false);
    } catch (err) {
      console.error(err.message);
    }
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(`/api/kpi/${confirmDeleteId}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Delete failed');

      setKpis(prev => prev.filter(kpi => kpi.id !== confirmDeleteId));
      setConfirmDeleteId(null);
    } catch (err) {
      console.error(err.message);
    }
  };

  const renderBadge = (priority) => {
    let className = 'status-badge ';
    if (priority === 'High') className += 'high';
    else if (priority === 'Medium') className += 'medium';
    else className += 'low';
    return <span className={className}>{priority}</span>;
  };

  const filteredKPIs = kpis.filter(kpi =>
    filterDept === 'all' || kpi.assignedTo?.department === filterDept
  );

  return (
    <div className="container">
      <h2 className='heading'>KPI Management</h2>
      <p className="description">View, assign, update, and delete key performance indicators.</p>

      <div className='filter-bar'>
        <button className="assign-btn" onClick={() => openForm(false)}>
          Assign KPI
        </button>
        <select value={filterDept} onChange={e => setFilterDept(e.target.value)}>
          <option value="all">All Departments</option>
          <option value="HR">HR</option>
          <option value="Finance">Finance</option>
          <option value="Marketing">Marketing</option>
          <option value="IT">IT</option>
        </select>
      </div>

      <table className="kpi-table">
        <thead>
          <tr>
            <th>KPI ID</th>
            <th>Title</th>
            <th>Staff</th>
            <th>Department</th>
            <th>Priority</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredKPIs.map(kpi => (
            <tr key={kpi.id}>
              <td>{kpi.id}</td>
              <td>{kpi.title}</td>
              <td>{kpi.assignedTo?.name}</td>
              <td>{kpi.assignedTo?.department}</td>
              <td>{renderBadge(kpi.priority)}</td>
              <td className='action-buttons'>
                <button className="action-details" onClick={() => setDetailsId(kpi._id)}>
                  Details
                </button>
                <button className="action-edit" onClick={() => openForm(true, kpi._id)}>
                  Edit
                </button>
                <button className="action-delete" onClick={() => setConfirmDeleteId(kpi._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add modal for Form, Details, Delete Confirmation here like before (reuse your JSX) */}
    </div>
  );
};

export default KPIManagement;
