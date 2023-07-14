const express = require('express')
const bodyParser = require('body-parser');
const port = 3000

const app = express()

app.use(bodyParser.json());
app.use('/auth', require('./routes/auth.route'));
app.use('/friends', require('./routes/friends.route'));
app.use('/auth', require('./routes/auth.route'));
app.use('/auth', require('./routes/auth.route'));

app.get('/', (req, res) =>{
  res.status(200).send("Hello")
})



app.all('*',authenticateToken, (req,res) => {
    res.status(404).send('Page not Found')
  })

app.listen(port, () => console.log(`Example app listening on port ${port}!`))