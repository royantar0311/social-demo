import React from 'react';
import './input.css';
function Input({ message, setMessage, sendMessage }) {
  return (
    <div className='input'>
      <form className='input__form'>
        <input
          className='input__input'
          type='text'
          placeholder='Type a message...'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => (e.key === 'Enter' ? sendMessage(e) : null)}
        ></input>
        <button className='input__btn' onClick={(e) => sendMessage(e)}>
          Send
        </button>
      </form>
    </div>
  );
}

export default Input;
