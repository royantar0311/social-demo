import React, { useEffect, useState } from 'react';
import querystring from 'query-string';
import io from 'socket.io-client';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
let socket;

function Chat({ location }) {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  let booli = false;

  const END_POINT = 'https://social-web-server.herokuapp.com/';

  useEffect(() => {
    const { name, room } = querystring.parse(location.search);

    socket = io(END_POINT);

    setName(name);
    setRoom(room);
    socket.emit('joined', { name, room }, () => {});
    console.log(socket);

    return () => {
      socket.emit('disconnect');

      socket.off();
    };
  }, [END_POINT, location.search]);

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((messages) => [...messages, message]);
      console.log('here');
    });
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message) {
      socket.emit('sendMessage', message, () => {
        setMessage('');
      });
    }
  };

  return (
    <div className='chat'>
      <div className='chat__container'>
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input
          setMessage={setMessage}
          sendMessage={sendMessage}
          message={message}
        />
      </div>
    </div>
  );
}

export default Chat;
