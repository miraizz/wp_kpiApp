import React, { useState } from 'react';
import './Profile.css'; 
import Notification from '../components/Notifications';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('view');
  const [notification, setNotification] = useState('');

  // Demo user data
  const [profile, setProfile] = useState({
    name: sessionStorage.getItem('name') || 'User Name',
    email: sessionStorage.getItem('email') || 'No email',
    phone: sessionStorage.getItem('phone') || 'Not set',
    department: sessionStorage.getItem('department') || 'Not specified',
    role: sessionStorage.getItem('role') || 'Staff'
  });


  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = () => {
    Object.entries(profile).forEach(([key, value]) => {
        sessionStorage.setItem(key, value);
    });
    setNotification('Profile updated successfully (demo)');
  };



  const handleChangePassword = () => {
    if (passwords.new !== passwords.confirm) {
        setNotification('New passwords do not match.');
    } else {
        setNotification('Password changed successfully (demo)');
    }
  };


  const handleDeactivate = () => {
    setNotification("Account deactivated (demo)");
  };

  

  return (
    <div className="profile-container">
    <Notification message={notification} onClose={() => setNotification('')} />
      <h2>User Profile</h2>
      <div className="profile-tab-buttons">
        {['view', 'edit', 'password', 'deactivate'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={activeTab === tab ? 'active' : ''}
          >
            {tab === 'view' && 'View Profile'}
            {tab === 'edit' && 'Edit Profile'}
            {tab === 'password' && 'Change Password'}
            {tab === 'deactivate' && 'Deactivate Account'}
          </button>
        ))}
      </div>

      {activeTab === 'view' && (
        <div className="profile-card">
          <div className="profile-avatar">
              {profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>

          <h3>{profile.name}</h3>
          <p>{profile.role}</p>
          <div className="details">
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Phone:</strong> {profile.phone}</p>
            <p><strong>Department:</strong> {profile.department}</p>
            <p><strong>Role:</strong> {profile.role}</p>
          </div>
        </div>
      )}

      {activeTab === 'edit' && (
        <div className="profile-card">
            <h3>Edit Profile</h3>
            <p>Update your personal information.</p>

            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" name="name" value={profile.name} onChange={handleProfileChange} />

            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={profile.email} onChange={handleProfileChange} />

            <label htmlFor="phone">Phone</label>
            <input type="tel" id="phone" name="phone" value={profile.phone} onChange={handleProfileChange} />

            <label htmlFor="department">Department</label>
            <input type="text" id="department" name="department" value={profile.department} onChange={handleProfileChange} />

            <label htmlFor="role">Role</label>
            <input type="text" id="role" name="role" value={profile.role} readOnly />

            <button onClick={handleSaveProfile}>Save Changes</button>
        </div>
       )}


    {activeTab === 'password' && (
        <div className="profile-card">
            <h3>Change Password</h3>
            <p>Update your account password.</p>

            <label htmlFor="current">Current Password</label>
            <input
            type="password"
            id="current"
            name="current"
            placeholder="Enter current password"
            value={passwords.current}
            onChange={handlePasswordChange}
            />

            <label htmlFor="new">New Password</label>
            <input
            type="password"
            id="new"
            name="new"
            placeholder="Enter new password"
            value={passwords.new}
            onChange={handlePasswordChange}
            />

            <label htmlFor="confirm">Confirm New Password</label>
            <input
            type="password"
            id="confirm"
            name="confirm"
            placeholder="Confirm new password"
            value={passwords.confirm}
            onChange={handlePasswordChange}
            />

            <button onClick={handleChangePassword}>Change Password</button>
        </div>
        )}


      {activeTab === 'deactivate' && (
        <div className="profile-card danger">
          <h3>Deactivate Account</h3>
          <p>This will deactivate your account and remove your data from the system.</p>
          <div className="profile-warning">
            <strong>Warning</strong><br />
            This action cannot be undone. This will permanently deactivate your account and remove your data from our servers.
          </div>
          <button className="profile-danger-btn" onClick={handleDeactivate}>Deactivate Account</button>
        </div>
      )}
    </div>
  );
};

export default Profile;
