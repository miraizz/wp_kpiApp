import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Notification from './Notifications';

const SessionManager = () => {
  const navigate = useNavigate();
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      sessionStorage.clear();
      setExpired(true);

      // Give user a moment to see the notification, then redirect
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }, 3000000); // session expires after 30 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <>
      {expired && (
        <Notification
          message="Session expired (demo)"
          type="error"
          onClose={() => setExpired(false)}
        />
      )}
    </>
  );
};

export default SessionManager;
