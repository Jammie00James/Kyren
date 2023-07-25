
const { Server } = require("socket.io");


const io = new Server(4000);

io.on("connection", (socket) => {
  console.log("Fooooolllllllll")

    // send a message to the client
    socket.send(JSON.stringify({
      type: "hello from server",
      content: [ 1, "2" ]
    }));

  // send a message to the client
  socket.emit("hello from server", 1, "2", { 3: Buffer.from([4]) });

  // receive a message from the client
  socket.on("hello from client", (...args) => {
    // ...
  });
});
