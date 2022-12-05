const express = require('express');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  },
});

app.use(express.json());

const chat = new Map();

app.get('/chat/:id', (req, res) => {
  const { id: chatId } = req.params;
  console.log(chatId);
  const obj = chat.has(chatId)
    ? {
        users: [...chat.get(chatId).get('users').values()],
        messages: [...chat.get(chatId).get('messages').values()],
      }
    : { users: [], messages: [] };
  res.json(obj);
});

app.post('/chat', (req, res) => {
  const { chatId, userName } = req.body;
  if (!chat.has(chatId)) {
    chat.set(
      chatId,
      new Map([
        ['users', new Map()],
        ['messages', []],
      ]),
    );
  }
  res.send();
});

io.on('connection', (socket) => {
  socket.on('CHAT:ENTER', ({ chatId, userName }) => {
    socket.join(chatId);
    chat.get(chatId).get('users').set(socket.id, userName);
    const users = [...chat.get(chatId).get('users').values()];
    socket.broadcast.to(chatId).emit('CHAT:SET_USERS', users);
  });
  console.log('user connected', socket.id);

  socket.on('CHAT:NEW_MESSAGE', ({ chatId, userName, text }) => {
    console.log('new message');
    const obj = {
      userName,
      text,
    };
    chat.get(chatId).get('messages').push(obj);
    socket.broadcast.to(chatId).emit('CHAT:NEW_MESSAGE', obj);
  });

  socket.on('disconnect', () => {
    chat.forEach((value, chatId) => {
      if (value.get('users').delete(socket.id)) {
        const users = [...value.get('users').values()];
        socket.broadcast.to(chatId).emit('CHAT:SET_USERS', users);
      }
    });
  });
});

server.listen(8888, (err) => {
  if (err) {
    throw Error(err);
  }
  console.log('сервер запущен');
});
