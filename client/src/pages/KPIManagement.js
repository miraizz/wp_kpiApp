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
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetch('/api/kpi')
      .then(res => res.json())
      .then(data => {
        setKpis(data);

        // Extract unique departments
        const uniqueDepts = Array.from(
          new Set(data.map(k => k.assignedTo?.department).filter(Boolean))
        );
        setDepartments(uniqueDepts);
      })
      .catch(err => console.error('Error loading KPIs:', err));
  }, []);

  const openForm = (edit = false, id = null) => {
    if (edit) {
      const kpi = kpis.find(k => k.id === id);
      if (!kpi) {
        console.error(`KPI with id ${id} not found`);
        return; // ✅ Prevent crash
      }

      setFormData({
        title: kpi.title,
        description: kpi.description,
        staffId: kpi.assignedTo.staffId,
        staffName: kpi.assignedTo.name,
        department: kpi.assignedTo.department,
        managerName: kpi.assignedBy.name,
        managerId: kpi.assignedBy.managerId,
        startDate: kpi.startDate,
        endDate: kpi.dueDate,
        category: kpi.category,
        priority: kpi.priority
      });

      setEditId(id);
      setIsEditMode(true);
    } else {
      // Reset form
      setFormData({
        title: '', description: '', staffId: '', staffName: '', department: '',
        managerName: '', managerId: '', startDate: '', endDate: '', category: '', priority: ''
      });
      setEditId(null);
      setIsEditMode(false);
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
          {departments.map(dept => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
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
                <button className="action-details" onClick={() => setDetailsId(kpi.id)}>
                  Details
                </button>
                <button className="action-edit" onClick={() => openForm(true, kpi.id)}>
                  Edit
                </button>
                <button className="action-delete" onClick={() => setConfirmDeleteId(kpi.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Assign/Edit */}
      {isPopupOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>{isEditMode ? 'Edit KPI' : 'Assign New KPI'}</h3>
            <form onSubmit={handleSubmit} className="kpi-form">
              <label>Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} />

              <label>Description</label>
              <input type="text" name="description" value={formData.description} onChange={handleChange} />

              <label>Staff ID</label>
              <input type="text" name="staffId" value={formData.staffId} onChange={handleChange} />

              <label>Staff Name</label>
              <input type="text" name="staffName" value={formData.staffName} onChange={handleChange} />

              <label>Department</label>
              <input type="text" name="department" value={formData.department} onChange={handleChange} />

              <label>Manager Name</label>
              <input type="text" name="managerName" value={formData.managerName} onChange={handleChange} />

              <label>Manager ID</label>
              <input type="text" name="managerId" value={formData.managerId} onChange={handleChange} />

              <label>Start Date</label>
              <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />

              <label>End Date</label>
              <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />

              <label>Category</label>
              <input type="text" name="category" value={formData.category} onChange={handleChange} />

              <label>Priority</label>
              <select name="priority" value={formData.priority} onChange={handleChange}>
                <option value="">Select Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              <button type="submit" className="form-button green">{isEditMode ? 'Update KPI' : 'Assign KPI'}</button>
              <button type="button" className="form-button red" onClick={() => setIsPopupOpen(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Details */}
      {detailsId && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>KPI Details</h3>
            {(() => {
              const kpi = kpis.find(k => k.id === detailsId);
              return kpi ? (
                <div>
                  <p><strong>Title:</strong> {kpi.title}</p>
                  <p><strong>Description:</strong> {kpi.description}</p>
                  <p><strong>Staff:</strong> {kpi.assignedTo.name}</p>
                  <p><strong>Staff ID:</strong> {kpi.assignedTo.staffId}</p>
                  <p><strong>Department:</strong> {kpi.assignedTo.department}</p>
                  <p><strong>Manager:</strong> {kpi.assignedBy.name}</p>
                  <p><strong>Manager ID:</strong> {kpi.assignedBy.managerId}</p>
                  <p><strong>Start Date:</strong> {kpi.startDate?.substring(0, 10)}</p>
                  <p><strong>Due Date:</strong> {kpi.dueDate?.substring(0, 10)}</p>
                  <p><strong>Category:</strong> {kpi.category}</p>
                  <p><strong>Priority:</strong> {kpi.priority}</p>
                </div>
              ) : null;
            })()}
            <button className="red-btn" onClick={() => setDetailsId(null)}>Close</button>
          </div>
        </div>
      )}
      {/* 🆕 Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Are you absolutely sure?</h3>
            <p>This action cannot be undone. This will permanently delete the KPI from the system.</p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button className="form-button red" onClick={confirmDelete}>Yes, delete this KPI</button>
              <button className="form-button green" onClick={() => setConfirmDeleteId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KPIManagement;
