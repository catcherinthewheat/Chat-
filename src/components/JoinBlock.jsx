import React from 'react';

import axios from 'axios';

function JoinBlock({ onLogin }) {
  const [chatId, setChatId] = React.useState('');
  const [userName, setUserName] = React.useState('');
  const [isLoading, setLoading] = React.useState(false);
  const onEnter = async () => {
    if (!chatId || !userName) {
      return alert('Введите данные');
    }
    const obj = { chatId, userName };
    setLoading(true);
    await axios.post('/chat', obj);
    onLogin(obj);
  };
  return (
    <div className="join-block">
      <input
        type="text"
        placeholder="Chat ID"
        value={chatId}
        onChange={(e) => setChatId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Your name"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <button disabled={isLoading} onClick={onEnter} className="btn btn-success">
        {isLoading ? 'Entering...' : 'Enter'}
      </button>
    </div>
  );
}

export default JoinBlock;
