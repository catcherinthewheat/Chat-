import React from 'react';
import socket from './Socket';

function Chat({ users, messages, userName, chatId, onAddMessage }) {
  const [messageValue, setMessageValue] = React.useState('');
  const messageRef = React.useRef(null);
  const onSendMessage = () => {
    socket.emit('CHAT:NEW_MESSAGE', {
      userName,
      chatId,
      text: messageValue,
    });
    onAddMessage({
      userName,
      text: messageValue,
    });
    setMessageValue('');
  };
  React.useEffect(() => {
    messageRef.current.scrollTo(0, 99999);
  }, [messages]);
  return (
    <div className="chat">
      <div className="chat-users">
        Chat: <b>{chatId}</b>
        <hr />
        Online: <b>{users.length}:</b>
        <ul>
          {users.map((name, index) => (
            <li key={name + index}>{name}</li>
          ))}
        </ul>
      </div>
      <div className="chat-messages">
        <div ref={messageRef} className="messages">
          {messages.map((message) => (
            <div className="message">
              <p>{message.text}</p>
              <div>
                <span>{message.userName}</span>
              </div>
            </div>
          ))}
        </div>
        <form>
          <textarea
            value={messageValue}
            onChange={(e) => setMessageValue(e.target.value)}
            className="form-control"
            rows="3"></textarea>
          <button onClick={onSendMessage} type="button" className="btn btn-primary">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
