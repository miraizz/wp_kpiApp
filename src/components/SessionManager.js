import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Notification from './Notifications';

const SessionManager = () => {
  const [expired, setExpired] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = sessionStorage.getItem('user');
    if (!user) return;

    let timeout;

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        sessionStorage.clear();
        setExpired(true);
        setTimeout(() => navigate('/'), 2000);
      }, 600000); // 600 seconds
    };

    const events = ['mousemove', 'keydown', 'click'];
    events.forEach((e) => window.addEventListener(e, resetTimer));

    resetTimer();

    return () => {
      clearTimeout(timeout);
      events.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  }, [navigate]);

  return (
    <>
      {expired && (
        <Notification
          message="Session expired due to inactivity. Please login again."
          type="error"
          onClose={() => setExpired(false)}
        />
      )}
    </>
  );
};

export default SessionManager;
