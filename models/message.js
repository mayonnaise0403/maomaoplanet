const pool = require("../database_connect").pool;
let mysqlQuery, values, result;


class Message {

    storeMessage(myId, friendId, message) {
        mysqlQuery = "INSERT INTO `chat_message`(my_id, friend_id, message) VALUES(?, ?, ?);";
        values = [myId, friendId, message];
        pool.query(mysqlQuery, values, (error, results) => {
            if (error) {
                console.log("error");
                console.log(error.message);
            }
            console.log(results);
        })
    }


    async getMessage(myId, friendId) {
        mysqlQuery = 'SELECT my_id,friend_id,message FROM chat_message WHERE (my_id = ? AND friend_id = ?) OR (my_id = ? AND friend_id = ?) order by time  asc;';
        values = [myId, friendId, friendId, myId];
        try {
            const queryResults = await pool.query(mysqlQuery, values);
            result = queryResults[0];

        } catch (error) {
            console.log(error.message);
        }
        return result;


    }


}



module.exports = {
    Message
};