const socketIO = require('socket.io');
const activeConnections = new Map();
const checkChat = require('../utils/chatUtil.js')

function createWebsocket(io) {
    console.log("002")
    io.on('connection', (socket) => {
      console.log('New WebSocket connection:', socket.id);
      const user = socket.user;
      // Store the WebSocket connection with the user ID in the activeConnections map
      activeConnections.set(user.id, socket);
  
      // Handle chat events
      socket.on('chatMessage', async(data) => {
        // Your chat message handling code
        console.log('Chat message received:');
        const { sender_Id, receiver_Id, message } = data
        
   //     if (sender_Id == user.id) {
          //Handle message with database
          checkChat({ sender_Id, receiver_Id, message });

        // Broadcast the chat message to the appropriate recipient (friend)
          const friendSocket = activeConnections.get(receiver_Id);
          if (friendSocket) {
            friendSocket.emit('chatMessage', {
              senderId: sender_Id,
              message: message,
            });
          }
       // }

      });
  
      // You can handle disconnections and remove the WebSocket connection from the map
      socket.on('disconnect', () => {
        console.log('WebSocket connection closed:', socket.id);
        activeConnections.delete(user.id);
        // Clean up any related resources or data
      });
    });
  }
  
  module.exports = createWebsocket();
  