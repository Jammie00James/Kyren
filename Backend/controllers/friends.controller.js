const e = require('express');
const jwt = require('jsonwebtoken')
const db = require('../Data/config')
const validateType = require('../utils/typevalidator')

exports.request = (req, res) => {
    const user = req.user;
    let targ = req.params.id
    let x = validateType(targ,"string")
    if(x){return res.status(401).json({error:"Invalid Parameter"})}
    if(user.id == targ){return res.status(401).json({error:"Cannot send self Request"})}
    let query = 'SELECT * FROM Users WHERE id = ?';

    db.query(query, targ,(err, result) => {
        if (err) {
            console.log('Error executing query:', err);
            return res.json({ error: "An error occured" })
        }
        if (result.length < 1) {
            return res.json({ error: "User not found" })
        } else {
            const request = { sender_id:user.id,recipient_id:targ};

            query = 'SELECT * FROM Friends WHERE (user1_id = ? OR user1_id = ?) AND (user2_id = ? OR user2_id = ?)'
            db.query(query,[request.sender_id,request.recipient_id,request.sender_id,request.recipient_id],(err,result) =>{
                if (err) {
                    console.log('Error executing query:', err);
                    return res.json({ error: "An error occured" })
                }
                if (result.length > 0) {
                    return res.json({ error: "Users Are already friends" })
                } else {
                    query = 'SELECT * FROM Friend_Requests WHERE (sender_id = ? OR sender_id = ?) AND (recipient_id = ? OR recipient_id = ?)'
                    db.query(query, [request.sender_id, request.recipient_id, request.sender_id,request.recipient_id], ( err, results) => {
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
            })
        }
    });
}

exports.accept = (req,res) => {
    const user = req.user;
    let targ = req.params.id
    let x = validateType(targ,"string")
    if(x){return res.status(401).json({error:"Invalid Parameter"})}
    if(user.id == targ){return res.status(401).json({error:"Cannot accept self friend request"})}
    const request = { user1_id:targ,user2_id:user.id};
    let query = 'SELECT * FROM Friend_Requests WHERE sender_id = ? AND recipient_id = ?';
    db.query(query, [request.user1_id, request.user2_id], ( err, results) => {
        if (err) { 
            console.log(err);
            return res.status(401).json({ error: "An error occured" }) 
        }
        if(results.length < 1){
            return res.status(200).json({ message: "No request Found" })
        }
        query = 'INSERT INTO Friends SET ?'
        db.query(query, request, (err) => {
            if (err) { 
                console.log(err);
                return res.status(401).json({ error: "An error occured" }) 
            }
            query = 'DELETE FROM Friend_Requests WHERE id = ?'
            db.query(query, results[0].id, (err) => {
                if (err) { 
                    console.log(err);
                    return res.status(401).json({ error: "An error occured" }) 
                }
                return res.status(200).json({ message: "Request accepted" })
            });
        });
    });

}

exports.decline = (req, res) => {
    const user = req.user;
    let targ = req.params.id
    let x = validateType(targ,"string")
    if(x){return res.status(401).json({error:"Invalid Parameter"})}
    if(user.id == targ){return res.status(401).json({error:"Cannot accept self friend request"})}
    const request = { user1_id:targ,user2_id:user.id};
    let query = 'SELECT * FROM Friend_Requests WHERE sender_id = ? AND recipient_id = ?';
    db.query(query, [request.user1_id, request.user2_id], ( err, results) => {
        if (err) { 
            console.log(err);
            return res.status(401).json({ error: "An error occured" }) 
        }
        if(results.length < 1){
            return res.status(200).json({ message: "No request Found" })
        }
        query = 'DELETE FROM Friend_Requests WHERE id = ?'
        db.query(query, results[0].id, (err) => {
            if (err) { 
                console.log(err);
                return res.status(401).json({ error: "An error occured" }) 
            }
            return res.status(200).json({ message: "Request declined" })
        }); 
    });
}

exports.all = (req, res) => {
    const user = req.user;
    const { search } = req.query
    let query = 'SELECT * FROM Friends WHERE user1_id = ? OR user2_id = ?';
    db.query(query, [user.id, user.id], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return;
        }
        if(results.length < 1){
            return res.status(200).json({});
        }
        let relations = results
        let friedsid = []
        relations.forEach(element => {
        if(element.user1_id == user.id){
            friedsid.push(element.user2_id)
        }else{
            friedsid.push(element.user1_id)
        }
        });
        if(!search){
            query = `SELECT id, username, email, status FROM Users WHERE id IN (?)`;
            db.query(query,[friedsid],(err,result) => {
                if (err) {
                    console.error('Error executing query:', err);
                    return;
                }
                return res.status(200).json(result);
            })
        }else{
            let x = validateType(search,"string")
            if(x){return res.status(401).json({error:"Invalid Parameter"})}
            query = `SELECT id, username, email, status FROM Users WHERE username LIKE ? AND id IN (?)`;
            db.query(query,[`${search}%`,friedsid],(err,result) => {
                if (err) {
                    console.error('Error executing query:', err);
                    return;
                }
                return res.status(200).json(result);
            });
        }
    });
}

exports.remove = (req, res) => {
    const user = req.user;
    let targ = req.params.id
    let x = validateType(targ,"string")
    if(x){return res.status(401).json({error:"Invalid Parameter"})}    
    const request = { user1_id:user.id,user2_id:targ};
    let query = 'SELECT * FROM Friends WHERE (user1_id = ? OR user1_id = ?) AND (user2_id = ? OR user2_id = ?)';
    db.query(query, [request.user1_id,request.user2_id,request.user1_id,request.user2_id], ( err, results) => {
        if (err) { 
            console.log(err);
            return res.status(401).json({ error: "An error occured" }) 
        }
        if(results.length < 1){
            return res.status(200).json({ message: "Friend not Found" })
        }
        query = 'DELETE FROM Friends WHERE id = ?'
        db.query(query, results[0].id, (err) => {
            if (err) { 
                console.log(err);
                return res.status(401).json({ error: "An error occured" }) 
            }
            return res.status(200).json({ message: "Friend Removed" })
        }); 
    });

  };
  