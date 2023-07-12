const express = require('express')
const bodyParser = require('body-parser');
const port = 3000

const app = express()

app.use(bodyParser.json());
app.use('/auth', require('./routes/auth'));

app.get('/', (req, res) =>{

})



app.all('*',authenticateToken, (req,res) => {
    res.status(404).send('Page not Found')
  })

app.listen(port, () => console.log(`Example app listening on port ${port}!`))