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
    let expiredTriggered = false; // prevents double execution

    const resetTimer = () => {
      if (expiredTriggered) return;

      clearTimeout(timeout);

      timeout = setTimeout(() => {
        // Check again if user is still present
        if (!sessionStorage.getItem('user')) return;

        sessionStorage.clear();
        expiredTriggered = true;
        setExpired(true);
        setTimeout(() => navigate('/'), 2000);
      }, 600000); // 10 minutes
    };

    const events = ['mousemove', 'keydown', 'click'];
    events.forEach((e) => window.addEventListener(e, resetTimer));

    resetTimer(); // start timer on mount

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
