const db = require('../Data/config')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')


//dotenv.config({ path: '../config/.env' })

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

const websocketAuth = (socket, next) => {
  try {
    const headers = socket.request.headers;

  // Retrieve the JWT token from the 'Authorization' header
    const authHeader = headers['authorization'];
    const token = authHeader.split(' ')[1]
    if (token) {
      // Verify the token
      jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
          return next(new Error('Authentication error'));
        } else {
          //Check if user exists from db
          const sql = 'SELECT id,username,email FROM Users WHERE email = ?';
          db.query(sql, decoded.email, (err, results) => {
            if (err) {
              console.log(err);
              return next(new Error('Authentication error'));
            }
            if (results.length === 0) {
              return next(new Error('User not found'));
            }
            //Store the decoded information in the request object for further use
            const user = results[0];
            socket.user = user;
            return next();
          });
        }
      });
    }
  } catch (error) {
    // If the token is invalid or authentication fails, you can close the connection
    return next(new Error('Authentication error'));
  }
}

module.exports = {authenticateUser, websocketAuth}