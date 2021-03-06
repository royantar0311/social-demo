import React from 'react';

import ReactEmoji from 'react-emoji';
import './message.css';
const Message = ({ message: { text, user, link }, name }) => {
  let isSentByCurrentUser = false;
  const trimmedName = name.trim().toLowerCase();

  if (user === trimmedName) {
    isSentByCurrentUser = true;
  }
  const onClick = (e) => {
    e.preventDefault();
    if (link) {
      link.click();
    }
  };

  return isSentByCurrentUser ? (
    <div className='messageContainer justifyEnd'>
      <p className='sentText pr-10'>{trimmedName}</p>
      <div className='messageBox backgroundBlue'>
        <p className='messageText colorWhite' onClick={onClick}>
          {ReactEmoji.emojify(text)}
        </p>
      </div>
    </div>
  ) : (
    <div className='messageContainer justifyStart'>
      <div className='messageBox backgroundLight'>
        <p className='messageText colorDark' onClick={onClick}>
          {ReactEmoji.emojify(text)}
        </p>
      </div>
      <p className='sentText pl-10'>{user}</p>
    </div>
  );
};

export default Message;
