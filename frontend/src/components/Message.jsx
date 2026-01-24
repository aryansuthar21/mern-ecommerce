// frontend/src/components/Message.jsx
import React from 'react';
import { Alert } from 'react-bootstrap';

// Default variant is 'info' if not passed
const Message = ({ variant = 'info', children }) => {
  return <Alert variant={variant}>{children}</Alert>;
};

export default Message;