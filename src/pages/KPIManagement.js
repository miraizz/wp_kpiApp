import React, { useState, useEffect } from 'react';
import { dummyKPIs } from '../data/dummyKPIs';
import './KPIManagement.css';

const KPIManagement = () => {
  const [kpis, setKpis] = useState(dummyKPIs);
  const [filterDept, setFilterDept] = useState('all');
  const [formData, setFormData] = useState({
    title: '', description: '', staffId: '', staffName: '', department: '',
    managerName: '', managerId: '', startDate: '', endDate: '', category: '', priority: ''
  });
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [detailsId, setDetailsId] = useState(null);

  const openForm = (edit = false, id = null) => {
    if (edit) {
      const kpi = kpis.find(k => k.id === id);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      setKpis(prev =>
        prev.map(kpi => kpi.id === editId
          ? {
              ...kpi,
              title: formData.title,
              description: formData.description,
              category: formData.category,
              priority: formData.priority,
              startDate: formData.startDate,
              dueDate: formData.endDate,
              assignedTo: {
                name: formData.staffName,
                staffId: formData.staffId,
                department: formData.department
              },
              assignedBy: {
                name: formData.managerName,
                managerId: formData.managerId
              }
            }
          : kpi
        )
      );
    } else {
      const newKPI = {
        id: `KPI-${Date.now()}`,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        startDate: formData.startDate,
        dueDate: formData.endDate,
        status: 'Pending',
        progress: '0',
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
      setKpis([...kpis, newKPI]);
    }
    setIsPopupOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this KPI?')) {
      setKpis(prev => prev.filter(kpi => kpi.id !== id));
    }
  };

  const renderBadge = (priority) => {
    let className = 'status-badge ';
    if (priority === 'High') className += 'high';
    else if (priority === 'Medium') className += 'medium';
    else className += 'low';
    return <span className={className}>{priority}</span>;
  };

  const filteredKPIs = kpis.filter(kpi => {
    return filterDept === 'all' || kpi.assignedTo.department === filterDept;
  });

  return (
    <div className="container">
      <h2 className="heading">KPI Management</h2>
      <p className="description">View, assign, update, and delete key performance indicators.</p>

      <div className="filter-bar">
        <button className="assign-btn" onClick={() => openForm(false)}>Assign KPI</button>
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
              <td>{kpi.assignedTo.name}</td>
              <td>{kpi.assignedTo.department}</td>
              <td>{renderBadge(kpi.priority)}</td>
              <td className="action-buttons">
                <button className="action-details" onClick={() => setDetailsId(kpi.id)}>Details</button>
                <button className="action-edit" onClick={() => openForm(true, kpi.id)}>Edit</button>
                <button className="action-delete" onClick={() => handleDelete(kpi.id)}>Delete</button>
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
                  <p><strong>Start Date:</strong> {kpi.startDate}</p>
                  <p><strong>Due Date:</strong> {kpi.dueDate}</p>
                  <p><strong>Category:</strong> {kpi.category}</p>
                  <p><strong>Priority:</strong> {kpi.priority}</p>
                </div>
              ) : null;
            })()}
            <button className="red-btn" onClick={() => setDetailsId(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KPIManagement;
