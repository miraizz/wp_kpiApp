import React, { useEffect } from 'react';
import './Notification.css';
import { AiOutlineCheckCircle, AiOutlineExclamationCircle, AiOutlineClose } from 'react-icons/ai';

const Notification = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 2000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const icon =
    type === 'error' ? (
      <AiOutlineExclamationCircle className="toast-icon error" />
    ) : (
      <AiOutlineCheckCircle className="toast-icon success" />
    );

  return (
    <div className={`toast-notification ${type}`}>
      <div className="toast-left">
        {icon}
        <span>{message}</span>
      </div>

      {type === 'error' && (
        <button className="toast-close" onClick={onClose}>
          <AiOutlineClose />
        </button>
      )}
    </div>
  );
};

export default Notification;
