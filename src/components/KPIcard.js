function KPIcard({
  title,
  description,
  progress,
  dueDate,
  assignedTo,
  verified, // Add verified prop here
  onShowEvidence,
  onShowProgress
}) {
  let statusLabel = 'Behind';
  let statusClass = 'behind';
  
  if (progress >= 80) {
    statusLabel = 'On Track';
    statusClass = 'on-track';
  } else if (progress === 100) {
    statusLabel = 'Completed';
    statusClass = 'completed';
  }

  const verifiedLabel = verified ? 'Verified' : 'Not Verified';
  const verifiedClass = verified ? 'verified' : 'not-verified';

  return (
    <div className="kpi-card">
      <div className="d-flex justify-content-between">
        <h6>{title}</h6>
        <span className={`status-chip ${statusClass}`}>{statusLabel}</span>
      </div>
      <p className="text-muted">{description}</p>
      <div className="progress mb-2">
        <div className="progress-bar bg-info" style={{ width: `${progress}%` }}>{progress}%</div>
      </div>
      <small className="text-muted">Due Date: {dueDate} | Assigned To: {assignedTo}</small><br />
      
      {/* Display verified status */}
      <div className={`verified-status ${verifiedClass}`}>
        <small className={`text-${verifiedClass === 'verified' ? 'success' : 'danger'}`}>{verifiedLabel}</small>
      </div>
      
      <button className="btn btn-link btn-sm" type="button" onClick={onShowEvidence}>📁 Evidence</button>
      <button className="btn btn-outline-primary btn-sm" type="button" onClick={onShowProgress}>Update Progress</button>
    </div>
  );
}

export default KPIcard;
