import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import Notification from '../components/Notifications';

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('view');
  const [notification, setNotification] = useState('');
  const [profile, setProfile] = useState(null); // null initially to check for loading state
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  useEffect(() => {
    const email = sessionStorage.getItem('email');
    if (!email) {
      setNotification('⚠️ No email found in session');
      return;
    }

    fetch(`/api/profile?email=${encodeURIComponent(email)}`)
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setProfile(data.user);
        } else {
          setNotification(data.error || '❌ Profile not found');
        }
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setNotification('❌ Failed to fetch profile');
      });
  }, []);

  const handleProfileChange = (e) => {
    setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    const { fullName, email, phone, department } = profile;

    if (!fullName || !email || !phone || !department) {
      setNotification('⚠️ All fields (Full Name, Email, Phone, Department) are required.');
      return;
    }

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });

      const data = await res.json();
      if (!res.ok) return setNotification(data.error || '❌ Failed to update profile');

      setProfile(data.user);
      sessionStorage.setItem('name', data.user.fullName);
      sessionStorage.setItem('email', data.user.email);
      sessionStorage.setItem('phone', data.user.phone);
      sessionStorage.setItem('department', data.user.department);
      sessionStorage.setItem('role', data.user.role);

      setNotification('✅ Profile updated successfully');
    } catch {
      setNotification('❌ Error updating profile');
    }
  };

  const handleChangePassword = async () => {
    if (passwords.new !== passwords.confirm)
      return setNotification('⚠️ New passwords do not match');

    try {
      const res = await fetch('/api/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: profile.email,
          currentPassword: passwords.current,
          newPassword: passwords.new
        })
      });

      const result = await res.json();
      if (!res.ok) return setNotification(result.error || '❌ Password change failed');

      setNotification('✅ Password changed successfully');
      setPasswords({ current: '', new: '', confirm: '' });
    } catch {
      setNotification('❌ Error changing password');
    }
  };

  const handleDeactivate = async () => {
    if (!window.confirm('Are you sure you want to deactivate your account?')) return;

    try {
      const res = await fetch('/api/', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: profile.email })
      });

      const result = await res.json();

      if (!res.ok) return setNotification(result.error || '❌ Failed to deactivate');

      sessionStorage.clear();
      setNotification('✅ Account deactivated');
      navigate('/signup');
    } catch {
      setNotification('❌ Error deactivating account');
    }
  };

  if (!profile) {
    return (
      <div className="profile-container">
        <Notification message={notification} onClose={() => setNotification('')} />
        <p>Loading profile...</p>
      </div>
    );
  }

  const getInitials = (fullName) =>
    fullName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'US';

  return (
    <div className="profile-container">
      <Notification message={notification} onClose={() => setNotification('')} />
      <h2>User Profile</h2>

      <div className="profile-tab-buttons">
        {['view', 'edit', 'password', 'deactivate'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={activeTab === tab ? 'active' : ''}
          >
            {{
              view: 'View Profile',
              edit: 'Edit Profile',
              password: 'Change Password',
              deactivate: 'Deactivate Account'
            }[tab]}
          </button>
        ))}
      </div>

      {activeTab === 'view' && (
        <div className="profile-card">
          <div className="profile-avatar">{getInitials(profile.fullName)}</div>
          <h3>{profile.fullName}</h3>
          <div className="details">
            <p><strong>Staff ID:</strong> {profile.staffId}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Phone:</strong> {profile.phone || 'N/A'}</p>
            <p><strong>Department:</strong> {profile.department || 'N/A'}</p>
            <p><strong>Role:</strong> {profile.role}</p>
          </div>
        </div>
      )}

      {activeTab === 'edit' && (
        <div className="profile-card">
          <h3>Edit Profile</h3>
          <label>Full Name</label>
          <input name="fullName" value={profile.fullName || ''} onChange={handleProfileChange} />

          <label>Email</label>
          <input name="email" value={profile.email || ''} onChange={handleProfileChange} />

          <label>Phone</label>
          <input name="phone" value={profile.phone || ''} onChange={handleProfileChange} />

          <label>Department</label>
          <input name="department" value={profile.department || ''} onChange={handleProfileChange} />

          <label>Role</label>
          <input name="role" value={profile.role || ''} readOnly />

          <button onClick={handleSaveProfile}>Save Changes</button>
        </div>
      )}

      {activeTab === 'password' && (
        <div className="profile-card">
          <h3>Change Password</h3>
          <label>Enter Current Password</label>
          <input type="password" name="current" value={passwords.current} onChange={handlePasswordChange} />

          <label>Enter New Password</label>
          <input type="password" name="new" value={passwords.new} onChange={handlePasswordChange} />

          <label>Confirm New Password</label>
          <input type="password" name="confirm" value={passwords.confirm} onChange={handlePasswordChange} />

          <button onClick={handleChangePassword}>Change Password</button>
        </div>
      )}

      {activeTab === 'deactivate' && (
        <div className="profile-card danger">
          <h3>Deactivate Account</h3>
          <p>This will permanently remove your account and all data.</p>
          <div className="profile-warning">
            <strong>Warning:</strong><br />This action cannot be undone.
          </div>
          <button className="profile-danger-btn" onClick={handleDeactivate}>Deactivate Account</button>
        </div>
      )}
    </div>
  );
};

export default Profile;
