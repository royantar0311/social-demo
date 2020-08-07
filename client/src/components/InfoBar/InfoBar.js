import React from 'react';
import './infobar.css';
function InfoBar({ room }) {
  return (
    <div className='infobar'>
      <div className='infobar__leftInnerContainer'>
        <h3>{`${room}`}</h3>
      </div>
      <div className='infobar__rightInnerContainer'>
        <a href='/'>x</a>
      </div>
    </div>
  );
}

export default InfoBar;
