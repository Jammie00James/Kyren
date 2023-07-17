const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const db = require('../Data/config')
const dotenv = require('dotenv')

dotenv.config({ path: '../config/.env' })

exports.register = (req, res) => {
    const { username, email, password } = req.body

    let query = 'SELECT * FROM Users WHERE email = ?';
    db.query(query, email, async (err, result) => {
        if (err) {
            return console.error('Error executing query:', err);
        }
        if (result.length > 0) {
            return res.json({ message: "User alreasy exists" })
        } else {
            let hashedPassword = await bcrypt.hash(password, 9);
            const user = { username, email, password: hashedPassword };
            query = 'INSERT INTO Users SET ?'
            db.query(query, user, (err, result) => {
                if (err) { throw err; }
                console.log('User created')
                return res.json({ message: "User created" })
            });
        }
    });
}




exports.login = (req, res) => {
    const { email, password } = req.body

    let query = 'SELECT * FROM Users WHERE email = ?';
    db.query(query, email, async (err, result) => {
        if (err) {
            return console.error('Error executing query:', err);
        }
        if (result.length < 1) {
            return res.json({ message: "User not found" })
        } else {
            let user = result[0]
            bcrypt.compare(password, user.password, (err, result) => {
                if (err || !result) {
                    res.status(401).json({ error: 'Invalid email or password' });
                } else {
                    // Create a JWT token
                    const token = jwt.sign({ email: user.email }, 'balablurepublic4');

                    // Send the token back to the client
                    res.cookie('jwt', token, { httpOnly: true, secure: true }).json({message:"user logined"});
                }
            });
        }
    });
}


exports.logout = (req, res) => {
    res.clearCookie('jwt');
    res.json({ success: true, message: 'Logout successful' });
  };
  