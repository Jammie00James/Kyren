const mysql     = require('mysql');
const dotenv = require('dotenv')


dotenv.config({path:'../config/.env'})
const db = mysql.createConnection({
  host     : process.env.DATABASE_HOST,
  user     : process.env.DATABASE_USER,
  password : process.env.DATABASE_PASSWORD,
  database : process.env.DATABASE
});

db.connect((err) => {
  if (err){
     console.log(err);
     return;
  }
  console.log("It Db has connected")
});


module.exports = db
