const pool = require("../database_connect").pool;
let mysqlQuery, values, result;


class Search {

    async findUserWithNickname(nickname, selfId) {
        mysqlQuery = 'SELECT \
                    member.nickname,\
                    member.user_id,\
                    member.email\
                FROM member\
                WHERE member.user_id NOT IN(\
                SELECT user_friend_id\
                FROM friend_list\
                WHERE user_id = ?\
                ) AND member.nickname = ? AND member.user_id != ?; ';
        values = [selfId, nickname, selfId];
        try {
            const queryResults = await pool.query(mysqlQuery, values);
            result = queryResults[0];
        } catch (error) {
            console.log(error.message);
        }
        console.log(result)
        return result;

    }

    async findUserWithEmail(email, selfId) {
        mysqlQuery = 'SELECT \
                    member.user_id,\
                    member.nickname,\
                    member.email \
                FROM member\
                WHERE member.user_id NOT IN(\
                SELECT user_friend_id\
                FROM friend_list\
                WHERE user_id = ?\
                )FROM member WHERE email = ? AND user_id != ?;';
        values = [selfId, email, selfId];
        try {
            const queryResults = await pool.query(mysqlQuery, values);
            result = queryResults[0];

        } catch (error) {
            console.log(error.message);
        }
        return result;

    }

    async getUserId(email) {
        mysqlQuery = 'SELECT user_id FROM member where email = ?;';
        values = [email];
        try {
            const queryResults = await pool.query(mysqlQuery, values);
            result = queryResults[0];
        } catch (error) {
            console.log(error.message);
        }
        return result;
    }

    async addFriend(userId, friendId) {
        mysqlQuery = 'INSERT INTO friend_list(user_id, user_friend_id) VALUES(?, ?);';
        values = [userId, friendId];
        await pool.query(mysqlQuery, values, (error, results) => {
            if (error) {
                console.log("error");
                console.log(error.message);
            }
            console.log(results);
        })
    }

    async getFriendList(userId) {
        mysqlQuery = 'select member.nickname, member.user_id from member inner join friend_list on friend_list.user_id = ? AND user_friend_id = member.user_id;';
        values = [userId];
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
    Search
};