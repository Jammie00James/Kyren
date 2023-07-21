const db = require('../Data/config')

function checkChat({ sender_id, recipient_id, message }) {
    let query = 'SELECT * FROM Private_Conversations WHERE (user1_id = ? OR user1_id = ?) AND (user2_id = ? OR user2_id = ?)';
    db.query(query, [sender_id,recipient_id,sender_id,recipient_id], ( err, results) => {
        if (err) { 
            return console.log(err);
        }
        if(results.length < 1){
            let query = 'SELECT * FROM Friends WHERE (user1_id = ? OR user1_id = ?) AND (user2_id = ? OR user2_id = ?)';
            db.query(query, [sender_id,recipient_id,sender_id,recipient_id], ( err, results) => {
                if (err) { 
                    return console.log(err);
                }
                if(results.length > 0){
                    let Private_Conversation  = { user1_id:sender_id, user2_id:recipient_id}
                    query = 'INSERT INTO Private_Conversations SET ?'
                    db.query(query, Private_Conversation, (err) => {
                        if (err) { 
                            console.log(err);
                            return console.log({ error: "An error occured" }) 
                        }
                        console.log({ message: "Conversaion created" })
                        query = 'SELECT * FROM Private_Conversations WHERE (user1_id = ? OR user1_id = ?) AND (user2_id = ? OR user2_id = ?)';
                        db.query(query, [sender_id,recipient_id,sender_id,recipient_id], ( err, results) => {
                            if (err) { 
                                return console.log(err);
                            }
                            if(results.length > 0){
                                let Private_Message  = {conversation_id:results[0].id, sender_id:sender_id, recipient_id:recipient_id, message:message}
                                query = 'INSERT INTO Private_Messages SET ?'
                                db.query(query, Private_Message, (err) => {
                                    if (err) { 
                                        console.log(err);
                                        return console.log({ error: "An error occured" }) 
                                    }
                                    console.log({ message: "messaged saved" })
                                });   
                            }
                        });
                    });   
                }else{
                    return console.log({ error: "Users not Friends" })
                }
        
            });
        }else{
            let Private_Message  = {conversation_id:results[0].id, sender_id:sender_id, recipient_id:recipient_id, message:message}
            query = 'INSERT INTO Private_Messages SET ?'
            db.query(query, Private_Message, (err) => {
                if (err) { 
                    console.log(err);
                    return console.log({ error: "An error occured" }) 
                }
                console.log({ message: "messaged saved" })
            }); 
        }

    });
}


module.exports = checkChat