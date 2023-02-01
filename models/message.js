const pool = require("../database_connect").pool;
let mysqlQuery, values, result, isSuccess;


class Message {

    async storeMessage(myId, friendId, message) {

        try {
            mysqlQuery = "INSERT INTO `chat_message`(sender_id, recipient_id, message) VALUES(?, ?, ?);";
            values = [myId, friendId, message];
            const results = await pool.query(mysqlQuery, values);
        } catch (error) {
            console.error("error:", error.message);
        }
    }


    async getMessage(myId, friendId) {
        mysqlQuery = 'SELECT sender_id,recipient_id,message,is_read FROM chat_message WHERE (sender_id = ? AND recipient_id = ?) OR (sender_id = ? AND recipient_id = ?) order by time  asc;';
        values = [myId, friendId, friendId, myId];
        try {
            const queryResults = await pool.query(mysqlQuery, values);
            result = queryResults[0];

        } catch (error) {
            console.log(error.message);
        }
        return result;
    }

    async getLatestMessage(myId) {
        mysqlQuery = "WITH cte AS (\
                    SELECT sender_id,\
                    recipient_id,\
                    message,\
                    time,\
                    is_read,\
                    ROW_NUMBER() OVER(PARTITION BY LEAST(sender_id, recipient_id), GREATEST(sender_id, recipient_id) ORDER BY time DESC) AS rn\
                    FROM chat_message\
                    WHERE ? IN(sender_id, recipient_id)\
                    )\
                    SELECT my_member.nickname AS sender_nickname,\
                    friend_member.nickname AS recipient_nickname,\
                    my_member.headshot AS sender_headshot,\
                    friend_member.headshot AS recipient_headshot,\
                    cte.sender_id,\
                    cte.recipient_id,\
                    cte.message, cte.time,\
                    cte.is_read,\
                    (CASE\
                    WHEN EXISTS(SELECT * FROM friend_list WHERE friend_list.user_id = cte.sender_id AND friend_list.user_friend_id = cte.recipient_id)\
                    AND EXISTS(SELECT * FROM friend_list WHERE friend_list.user_id = cte.recipient_id AND friend_list.user_friend_id = cte.sender_id)\
                    THEN 0\
                    ELSE(CASE\
                    WHEN EXISTS(SELECT * FROM friend_list WHERE friend_list.user_id = cte.sender_id AND friend_list.user_friend_id = cte.recipient_id) THEN cte.recipient_id\
                    ELSE cte.sender_id\
                    END)\
                    END) AS non_friend_id\
                    FROM cte\
                    JOIN member AS my_member\
                    ON cte.sender_id = my_member.user_id\
                    JOIN member AS friend_member\
                    ON cte.recipient_id = friend_member.user_id\
                    WHERE cte.rn = 1\
                    ORDER BY time DESC; "
        values = [myId];
        try {
            const queryResults = await pool.query(mysqlQuery, values);
            result = queryResults[0];

        } catch (error) {
            console.log(error.message);
        }
        return result;
    }

    async updateMsgStatus(sender_id, recipient_id) {
        mysqlQuery = 'UPDATE `chat_message` SET `is_read` = 1  WHERE `sender_id` = ? AND recipient_id = ? ;';
        values = [sender_id, recipient_id];
        try {
            const queryResults = await pool.query(mysqlQuery, values);
            isSuccess = true;

        } catch (error) {
            console.log(error.message);
            isSuccess = false;
        }
        return isSuccess;
    }


}



module.exports = {
    Message
};