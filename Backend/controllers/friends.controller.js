const jwt = require('jsonwebtoken')
const db = require('../data')
const validateType = require('../utils/typevalidator')

exports.request = (req, res) => {
    const user = req.user;
    let targ = req.params.id
    let x = validateType(targ,"string")
    if(x){return res.status(401).json({error:"Invalid Parameter"})}

    let query = 'SELECT * FROM Users WHERE id = ?';

    db.query(query, targ,(err, result) => {
        if (err) {
            console.log('Error executing query:', err);
            return res.json({ error: "An error occured" })
        }
        if (result.length > 0) {
            return res.json({ error: "User not found" })
        } else {
            const request = { sender_id:user.id,recipent_id:targ};


            query = 'SELECT * FROM Friend_Requests WHERE sender_id = ? AND recipent_id = ?'
            db.query(query, [request.sender_id, request.recipent_id], ( err, results) => {
                if (err) { 
                    console.log(err);
                    return res.status(401).json({ error: "An error occured" }) 
                }
                if(results.length > 0){
                    return res.status(200).json({ message: "Request already sent" })
                }


                query = 'INSERT INTO Friend_Requests SET ?'
                db.query(query, request, (err) => {
                    if (err) { 
                        console.log(err);
                        return res.status(401).json({ error: "An error occured" }) 
                    }
                    return res.status(200).json({ message: "Request sent" })
                });
            });
        }
    });
}

exports.accept = (req,res) => {

}

exports.reject = (req, res) => {

}

exports.search = (req, res) => {
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
                    const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY);

                    // Send the token back to the client
                    res.cookie('jwt', token, { httpOnly: true, secure: true }).json({message:"user logined"});
                }
            });
        }
    });
}


exports.remove = (req, res) => {
    res.clearCookie('jwt');
    res.json({ success: true, message: 'Logout successful' });
  };
  