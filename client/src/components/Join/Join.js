import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './join.css';

function Join() {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  return (
    <div className='join'>
      <h3 className='join__heading'>Join</h3>

      <input
        className='join__input'
        placeholder='Name'
        type='text'
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className='join__input'
        placeholder='Room'
        type='text'
        onChange={(e) => setRoom(e.target.value)}
      />
      <Link
        onClick={(e) => (!room || !name ? e.preventDefault() : null)}
        to={`/chat?name=${name}&room=${room}`}
      >
        <button className='join__button'>Join Room</button>
      </Link>
    </div>
  );
}

export default Join;
