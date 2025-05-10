import React, { useEffect } from 'react';
import './Notification.css';
import { AiOutlineCheckCircle, AiOutlineExclamationCircle } from 'react-icons/ai';

const Notification = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    if (!message) return; // guard clause

    const timer = setTimeout(() => {
      onClose();
    }, 2000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  // ❗ Ensure nothing renders if there's no message
  if (!message) return null;

  const icon =
    type === 'error' ? (
      <AiOutlineExclamationCircle className="toast-icon error" />
    ) : (
      <AiOutlineCheckCircle className="toast-icon success" />
    );

  return (
    <div className={`toast-notification ${type}`}>
      {icon}
      <span>{message}</span>
    </div>
  );
};


export default Notification;
