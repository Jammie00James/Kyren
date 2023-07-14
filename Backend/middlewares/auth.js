const db = require('../Data/config')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser');

dotenv.config({ path: '../config/.env' })

const authenticateUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    // Verify the token
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      } else {
        //Check if user exists from db
        const sql = 'SELECT id,username,email FROM Users WHERE email = ?';
        db.query(sql, decoded.email, (err, results) => {
          if (err) {
            console.log(err);
            return res.status(401).json({ error: 'An error occured' });
          }
          if (results.length === 0) {
            return res.status(401).json({ error: 'User not found' });
          }
          //Store the decoded information in the request object for further use
          const user = results[0];
          req.user = user;
          next();
        });
      }
    });
  } else {
    return res.status(401).json({ error: 'No token provided' });
  }
}



module.exports = authenticateUser