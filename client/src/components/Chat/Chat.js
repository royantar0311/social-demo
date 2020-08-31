import React, { useEffect, useState } from 'react';
import querystring from 'query-string';
import io from 'socket.io-client';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
let socket;
let fileData = [];
let fileType = '';
let fileName = '';
let fileSender = '';
let fileSize = 0;
let fileSizeRecieved = 0;
let isOwn = 'false';
function Chat({ location }) {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [percentage, setPercentage] = useState(0);
  const [incomingFile, setIncomingFile] = useState('false');
  const END_POINT = 'https://social-web-server.herokuapp.com/';
  // const setIsOwn = (bool) => {
  //   isOwn = bool;
  // };
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
  const setIsOwn = (bool) => {
    isOwn = bool;
    console.log('aiche', isOwn);
  };
  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((messages) => [...messages, message]);
    });
  }, []);
  useEffect(() => {
    socket.on('file', (fileToRecieve) => {
      setIncomingFile('true');
      fileName = fileToRecieve.name;
      fileSize = fileToRecieve.size;
      fileType = fileToRecieve.type;
      fileSender = fileToRecieve.sender;
      console.log(fileToRecieve);
      if (isOwn === 'false') {
        console.log('here 1');
        socket.on('recieve-file-data', recievingListener);
      } else {
        socket.removeListener('recieve-file-data', recievingListener);
        console.log('here 2');
      }
    });

    socket.on('file-recieve-complete', (err) => {
      setIncomingFile('false');
      if (err) {
        console.log(err);
        return;
      }

      if (isOwn === 'true') {
        resetFields();

        return;
      }

      console.log('ekhaneo aiche', isOwn);

      const blob = new Blob([...fileData], { fileType });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;

      setMessages((messages) => [
        ...messages,
        { text: fileName, user: fileSender, link: link },
      ]);
      //setIsOwn('false');
      resetFields();
    });
  }, []);

  const resetFields = () => {
    setPercentage(0);
    fileData = [];
    fileType = '';
    fileSizeRecieved = 0;
    fileName = '';
    fileSender = '';
    fileSize = 0;
    isOwn = 'false';
  };
  const recievingListener = (recievedChunk) => {
    // setFileSizeRecieved(
    //   (fileSizeRecieved) => fileSizeRecieved + recievedChunk.byteLength
    // );

    fileSizeRecieved += recievedChunk.byteLength;
    console.log((fileSizeRecieved / fileSize) * 100);
    setPercentage((fileSizeRecieved / fileSize) * 100);
    fileData.push(recievedChunk);
    recievedChunk = '';
  };
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
          socket={socket}
          incomingFile={incomingFile}
          name={name}
          percentage={percentage}
          setIsOwn={setIsOwn}
          setPercentage={setPercentage}
          setMessages={setMessages}
        />
      </div>
    </div>
  );
}

export default Chat;
