const express = require('express')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv')


dotenv.config()
const port = 3000

const app = express()

app.use(bodyParser.json());
app.use(cookieParser());
app.use('/auth', require('./routes/auth.route'));
app.use('/friends', require('./routes/friends.route'));
//app.use('/home', require('./routes/home.route'));
//app.use('/chat', require('./routes/chat.route'));

app.get('/', (req, res) =>{
  res.status(200).send("Hello")
})



app.all('*', (req,res) => {
    res.status(404).send('Page not Found')
  })

app.listen(port, () => console.log(`App listening on port ${port}!`))