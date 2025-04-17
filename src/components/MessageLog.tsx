import React from 'react';
import '../styles/MessageLog.css';

interface MessageLogProps {
  message: string;
}

const MessageLog: React.FC<MessageLogProps> = ({ message }) => {
  return (
    <div className="message-log">
      <div className="message-content">
        {message || '遊戲開始！擲骰子開始你的回合。'}
      </div>
    </div>
  );
};

export default MessageLog; 