import React from 'react';
import './input.css';
let offset = 0;
let file;
let fileData = [];
let size;
let fileName = '';
let fileInfo = {};
let fileType = '';
let chunkSize = 100 * 1024;
function Input({
  message,
  setMessage,
  sendMessage,
  setMessages,
  socket,
  incomingFile,
  name,
  percentage,
  setIsOwn,
  setPercentage,
}) {
  let onLoadHandler = function (evt) {
    if (evt.target.error == null) {
      console.log(evt.target.result.byteLength);
      offset += evt.target.result.byteLength;
      setPercentage((offset / size) * 100);
      //console.log(offset);
      fileData.push(evt.target.result);
      socket.emit('file-data', evt.target.result, () => {});
    } else {
      console.log(evt.target.error);
      console.log('complete');
      socket.emit('file-sending-complete', evt.target.error, () => {});
      return;
    }
    if (offset >= size) {
      const blob = new Blob([...fileData], { fileType });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;

      setMessages((messages) => [
        ...messages,
        { text: fileName, user: name, link: link },
      ]);

      fileData = [];
      document.getElementById('input__fileUploadBtn').value = null;
      socket.emit('file-sending-complete', null, () => {});

      size = 0;
      offset = 0;
      file = null;
      fileInfo = {};
      return;
    }

    readBlock(offset, chunkSize, file);
  };

  const readBlock = (_offset, length, _file) => {
    //console.log('here');
    let reader = new FileReader();
    let blob = _file.slice(_offset, length + _offset);
    reader.onload = onLoadHandler;
    reader.readAsArrayBuffer(blob);
  };

  const onChange = (e) => {
    file = e.target.files[0];

    if (file === undefined || file.size === 0) {
      document.getElementById('input__fileUploadBtn').value = null;
      return;
    }
    fileName = file.name;
    size = file.size;
    fileType = file.type;
    fileInfo = {
      name: file.name,
      size,
      type: file.type,
      sender: name,
    };
    //console.log('sending', fileData);
    setIsOwn('true');
    socket.emit('send-file', fileInfo, () => {
      readBlock(offset, chunkSize, file);
    });
  };
  return (
    <div className='input'>
      <form className='input__form'>
        <input
          className='input__fileUploadBtn'
          type='file'
          id='input__fileUploadBtn'
          onChange={onChange}
          disabled={incomingFile === 'true' ? true : false}
        ></input>
        <label htmlFor='input__fileUploadBtn' id='input__fileUploadBtnLabel'>
          {incomingFile === 'true' ? `${percentage.toFixed(0)}%` : 'Choose'}
        </label>
        <input
          className='input__input'
          type='text'
          placeholder='Type a message...'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => (e.key === 'Enter' ? sendMessage(e) : null)}
        ></input>
        <button
          className='input__sendMessageBtn'
          onClick={(e) => sendMessage(e)}
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default Input;
