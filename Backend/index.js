const dotenv = require('dotenv')
dotenv.config()
const port = 3000

const express = require('express')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const http = require('http');
const socketIO = require('socket.io');
const {websocketAuth} = require('./middlewares/auth');
const createWebsocket = require('./handlers/websockethandler');




const app = express()
const server = http.createServer(app)
const io = socketIO(server)


app.use(bodyParser.json());
app.use(cookieParser());
app.use('/auth', require('./routes/auth.route'));
app.use('/friends', require('./routes/friends.route'));
//app.use('/home', require('./routes/home.route'));
//app.use('/chat', require('./routes/chat.route'));
//io.use(websocketAuth);


app.get('/', (req, res) =>{
  res.status(200).send("Hello")
})

console.log("001")
createWebsocket(io);
console.log("005")

app.all('*', (req,res) => {
    res.status(404).send('Page not Found')
  })


server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});