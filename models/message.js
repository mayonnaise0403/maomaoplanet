const pool = require("../database_connect").pool;
let mysqlQuery, values, result, isSuccess;
const dotenv = require("dotenv");
dotenv.config();


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

    async storeGroupMessage(senderId, groupId, message) {
        try {
            mysqlQuery = "INSERT INTO `group_message`(sender_id, group_id, message) VALUES(?, ?, ?);";
            values = [senderId, groupId, message];
            const results = await pool.query(mysqlQuery, values);
        } catch (error) {
            console.error("error:", error.message);
        }
    }


    async getMessage(myId, friendId) {
        mysqlQuery = 'SELECT sender_id,\
                        recipient_id,\
                        message,\
                        is_read,\
                        time\
                        FROM chat_message WHERE (sender_id = ? AND recipient_id = ?) OR (sender_id = ? AND recipient_id = ?) order by time  asc;';
        values = [myId, friendId, friendId, myId];
        try {
            const queryResults = await pool.query(mysqlQuery, values);
            result = queryResults[0];

        } catch (error) {
            console.log(error.message);
        }
        return result;
    }

    async getGroupMessage(groupId) {
        mysqlQuery = 'SELECT\
                    group_message.sender_id,\
                    group_message.message,\
                    group_message.time,\
                    member.nickname as sender_nickname,\
                    member.headshot as sender_headshot,\
                    (SELECT COUNT(*) FROM group_message_is_read WHERE group_id = ?) as read_count\
                    FROM group_message\
                    INNER JOIN member\
                    ON sender_id = user_id\
                    WHERE group_message.group_id = ? \
                    ORDER BY time asc; '
        values = [groupId, groupId];
        try {
            const queryResults = await pool.query(mysqlQuery, values);
            result = queryResults[0];

        } catch (error) {
            console.log(error.message);
        }
        return result;
    }





    async getGroupLatestMessage(userId) {
        mysqlQuery = "SELECT \
                    group_message.group_id,\
                    group_message.sender_id,\
                    group_message.message,\
                    group_data.headshot as group_headshot,\
                    group_data.group_name, \
                    (CASE WHEN EXISTS(SELECT * FROM  group_message_is_read WHERE \
                    group_message_is_read.group_id = group_message.group_id and \
                    is_read_member_id = ? group by group_message.group_id \
                    ) THEN 1 else 0 END)AS is_read\
                    FROM group_message\
                    INNER JOIN group_member ON \
                    group_message.group_id = group_member.group_id and group_member.member_id = ?\
                    INNER JOIN group_data on\
                    group_data.group_id =group_message.group_id\
                    INNER JOIN member ON \
                    group_message.sender_id = member.user_id\
                    WHERE time = (\
                    SELECT MAX(time)\
                    FROM group_message\
                    WHERE group_message.group_id = group_member.group_id\
                    )\
                    GROUP BY group_message.group_id\
                    ORDER BY `time` desc; "
        values = [userId, userId]
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

    async updateGroupMsgStatus(group_id, read_member_id) {
        try {
            mysqlQuery = 'INSERT INTO `group_message_is_read`(group_id, is_read_member_id) VALUES(?, ?) \
                        ON DUPLICATE KEY UPDATE group_id = ?, is_read_member_id = ?'
            values = [group_id, read_member_id, group_id, read_member_id];
            const results = await pool.query(mysqlQuery, values);
        } catch (error) {
            console.error("error:", error.message);
        }

    }

    async deleteIsReadStatus(group_id) {
        try {
            mysqlQuery = 'DELETE FROM `group_message_is_read` WHERE group_id = ?'
            values = [group_id];
            const results = await pool.query(mysqlQuery, values);
        } catch (error) {
            console.error("error:", error.message);
        }
    }

    async getIsReadCount(group_id) {
        mysqlQuery = 'SELECT COUNT(*) AS readCount FROM group_message_is_read WHERE group_id = ?';
        values = [group_id];
        try {
            const queryResults = await pool.query(mysqlQuery, values);
            result = queryResults[0];

        } catch (error) {
            console.log(error.message);
        }
        return result;
    }

    async getChatPictureAndVideo(selfId, friendId) {
        mysqlQuery = 'SELECT message from chat_message where\
                     ((sender_id = ? AND recipient_id = ?) OR (sender_id = ? AND recipient_id = ?))  \
                     AND message like ?';
        values = [selfId, friendId, friendId, selfId, `${process.env.S3_File_Url}%`];
        try {
            const queryResults = await pool.query(mysqlQuery, values);
            result = queryResults[0];

        } catch (error) {
            console.log(error.message);
        }
        return result;
    }

    async getGroupPictureAndVideo(groupId) {
        mysqlQuery = 'SELECT message from group_message where\
                     group_id = ? \
                     AND message like ?';
        values = [groupId, `${process.env.S3_File_Url}%`];
        try {
            const queryResults = await pool.query(mysqlQuery, values);
            result = queryResults[0];

        } catch (error) {
            console.log(error.message);
        }
        return result;
    }

    async isFriend(selfId, friendId) {
        mysqlQuery = 'SELECT *\
                    FROM friend_list f1\
                    WHERE user_id = ?\
                    AND user_friend_id = ?\
                    AND EXISTS(\
                    SELECT *\
                    FROM friend_list f2\
                    WHERE f1.user_id = f2.user_friend_id\
                    AND f1.user_friend_id = f2.user_id);';
        values = [selfId, friendId];
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