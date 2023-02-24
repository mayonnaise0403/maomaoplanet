const pool = require("../database_connect").pool;
let mysqlQuery, values, result;


class Search {

    async findUserWithNickname(nickname, selfId) {
        mysqlQuery = 'SELECT \
                    member.nickname,\
                    member.user_id,\
                    member.email,\
                    member.headshot\
                FROM member\
                WHERE member.user_id NOT IN(\
                SELECT user_friend_id\
                FROM friend_list\
                WHERE user_id = ?\
                ) AND member.nickname like ? AND member.user_id != ?; ';
        values = [selfId, `%${nickname}%`, selfId];
        try {
            const queryResults = await pool.query(mysqlQuery, values);
            result = queryResults[0];
        } catch (error) {
            console.log(error.message);
        }
        return result;

    }

    async findUserWithEmail(email, selfId) {
        mysqlQuery = 'SELECT \
                    member.user_id,\
                    member.nickname,\
                    member.email ,\
                    member.headshot\
                FROM member\
                WHERE member.user_id NOT IN(\
                SELECT user_friend_id\
                FROM friend_list\
                WHERE user_id = ?\
                )AND email = ? AND user_id != ?;';
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
        mysqlQuery = 'INSERT INTO friend_list(user_id, user_friend_id) VALUES(?, ?)\
                    ON DUPLICATE KEY UPDATE user_id = ?, user_friend_id = ?;';
        values = [userId, friendId, userId, friendId];
        await pool.query(mysqlQuery, values, (error, results) => {
            if (error) {
                console.log(error.message);
            }
        })
    }

    async addUserToGroupFriendlist(selfId, groupId) {
        mysqlQuery = "SELECT \
                    member.nickname,\
                    member.user_id,\
                    member.headshot\
                    FROM member\
                    INNER JOIN friend_list ON \
                    friend_list.user_id = ? AND friend_list.user_friend_id = member.user_id\
                    WHERE member.user_id NOT IN(\
                    SELECT group_members.member_id\
                    FROM group_members\
                    WHERE group_members.group_id = ?\
                    UNION\
                    SELECT ?);"
        values = [selfId, groupId, selfId];
        try {
            const queryResults = await pool.query(mysqlQuery, values);
            result = queryResults[0];
        } catch (error) {
            console.log(error.message);
        }
        return result;
    }

    async getFriendList(userId) {
        mysqlQuery = 'select member.nickname,\
                            member.user_id,\
                            member.headshot\
                            from member inner join friend_list on friend_list.user_id = ? AND user_friend_id = member.user_id;';
        values = [userId];
        try {
            const queryResults = await pool.query(mysqlQuery, values);
            result = queryResults[0];

        } catch (error) {
            console.log(error.message);
        }
        return result;

    }

    async getGroupList(userId) {
        mysqlQuery = "select group_members.group_name,\
                    group_members.group_id,\
                    group_members.headshot\
                    from group_members where  group_members.member_id = ?";
        values = [userId];
        try {
            const queryResults = await pool.query(mysqlQuery, values);
            result = queryResults[0];

        } catch (error) {
            console.log(error.message);
        }
        return result;
    }

    async searchFriend(selfId, nickname) {
        mysqlQuery = "select\
        user_friend_id as user_id,\
        nickname,\
        headshot\
        from member \
        inner join friend_list on\
        member.user_id = friend_list.user_friend_id\
        where friend_list.user_id = ? AND member.nickname like ? ;";
        values = [selfId, `%${nickname}%`];
        try {
            const queryResults = await pool.query(mysqlQuery, values);
            result = queryResults[0];

        } catch (error) {
            console.log(error.message);
        }
        return result;
    }

    async getGroupMemberData(groupId) {
        mysqlQuery = 'select nickname,user_id,member.headshot from member\
        inner join group_members on group_id = ? and member_id = user_id;'
        values = [groupId];
        try {
            const queryResults = await pool.query(mysqlQuery, values);
            result = queryResults[0];

        } catch (error) {
            console.log(error.message);
        }
        return result;
    }

    async getGroupMemberId(groupId) {
        mysqlQuery = 'select group_members.member_id from group_members where group_id = ?;'
        values = [groupId];
        try {
            const queryResults = await pool.query(mysqlQuery, values);
            result = queryResults[0];

        } catch (error) {
            console.log(error.message);
        }
        return result;
    }

    async getGroupMember(selfId, groupId) {
        mysqlQuery = 'select \
                member.nickname,\
                member.headshot,\
                group_members.member_id,\
                (CASE WHEN EXISTS(SELECT * FROM  friend_list WHERE \
                 user_id = ? and user_friend_id = group_members.member_id\
                ) THEN 1 else 0 END)AS is_friend\
                from group_members\
                inner join member on\
                group_members.member_id = member.user_id\
                where group_members.group_id = ?;'
        values = [selfId, groupId];
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