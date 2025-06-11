import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Notification from '../components/Notifications'; 

const Logout = () => {
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(true);

  useEffect(() => {
    sessionStorage.clear();

    // Navigate after a short delay to allow the toast to show
    const timeout = setTimeout(() => {
      navigate('/');
    }, 2000);

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <>
      {showNotification && (
        <Notification
          message="You have been logged out."
          onClose={() => setShowNotification(false)}
        />
      )}
    </>
  );
};

export default Logout;
