const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const messageRoute = require('./routes/messagesRoutes');
const app = express();
const socket = require('socket.io');
require('dotenv').config();

app.use(cors());
app.use(express.json());

app.use('/api/auth', userRoutes);
app.use('/api/messages', messageRoute);

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('Connected to MongoDB');

    // Inicia el servidor después de conectarse a MongoDB
    const server = app.listen(process.env.PORT, () => {
      console.log(`Server is running on port: ${server.address().port}`);
    });

    const io = socket(server, {
      cors: {
        origin: 'http://localhost:3000',
        credentials: true,
      },
    });

    global.onlineUsers = new Map();

    io.on("connection", (socket) => {
      global.chatSocket = socket;
      socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
      });

      socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if(sendUserSocket) {
          socket.to(sendUserSocket).emit("msg-receive", data.message);
        }
      });
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB', error);
  });