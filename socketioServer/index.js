const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  const objWithIdIndex = users.findIndex((user) => user.socketId === socketId);
  users.splice(objWithIdIndex, 1);
  return users;
};

const getUser = (userId) => {
  return users.find((u) => u.userId === userId);
};

io.on("connection", (socket) => {
  // 1. addUser on our list
  // 2. send all users are connected
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  // send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    io.to(user.socketId).emit("getMessage", {
      senderId,
      text,
    });
  });

  // 1. disconect user from socket server
  // 2. send updated users
  socket.on("disconnect", () => {
    const currentUsers = removeUser(socket.id);
    io.emit("getUsers", currentUsers);
  });
});
