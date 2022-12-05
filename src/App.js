import './App.css';
import React from 'react';
import axios from 'axios';
import reducer from './reducer';
import JoinBlock from './components/JoinBlock';
import socket from './components/Socket';
import Chat from './components/Chat';

function App() {
  const [state, dispatch] = React.useReducer(reducer, {
    entered: false,
    chatId: null,
    userName: null,
    users: [],
    messages: [],
  });
  const onLogin = async (obj) => {
    dispatch({
      type: 'ENTERED',
      payload: obj,
    });
    socket.emit('CHAT:ENTER', obj);
    const { data } = await axios.get(`/chat/${obj.chatId}`);
    dispatch({
      type: 'SET_DATA',
      payload: data,
    });
  };

  const setUsers = (users) => {
    dispatch({
      type: 'SET_USERS',
      payload: users,
    });
  };
  const addMessage = (message) => {
    dispatch({
      type: 'NEW_MESSAGE',
      payload: message,
    });
  };
  React.useEffect(() => {
    socket.on('CHAT:SET_USERS', setUsers);
    socket.on('CHAT:NEW_MESSAGE', addMessage);
  }, []);
  console.log(state);
  window.socket = socket;
  return (
    <div className="wrapper">
      {!state.entered ? (
        <JoinBlock onLogin={onLogin} />
      ) : (
        <Chat {...state} onAddMessage={addMessage} />
      )}
    </div>
  );
}

export default App;
