const pool = require("../database_connect").pool;
const dotenv = require("dotenv");
dotenv.config();
let mysqlQuery, values, isSuccess, results;


class Update {
    async updateNickname(newNickname, userId) {
        mysqlQuery = 'UPDATE `member` SET `nickname` = ?  WHERE `user_id` = ? ;';
        values = [newNickname, userId];
        try {
            const queryResults = await pool.query(mysqlQuery, values);
            isSuccess = true;

        } catch (error) {
            console.log(error.message);
            isSuccess = false;
        }
        return isSuccess;
    }

    async updateEmail(newEmail, userId) {
        mysqlQuery = 'UPDATE `member` SET `email` = ?  WHERE `user_id` = ? ;';
        values = [newEmail, userId];
        try {
            const queryResults = await pool.query(mysqlQuery, values);
            isSuccess = true;

        } catch (error) {
            console.log(error.message);
            isSuccess = false;
        }
        return isSuccess;
    }

    updateHeadshot(userId) {
        mysqlQuery = 'UPDATE `member` SET `headshot` = ?  WHERE `user_id` = ? ;';
        values = [`${process.env.S3_Url}userId${userId}`, userId];
        pool.query(mysqlQuery, values, (error, results) => {
            if (error) {
                console.log("error");
                console.log(error.message);
            }
            console.log(results);
        })
    }

    async updateGroupHeadshot(groupId, headshot) {
        mysqlQuery = 'UPDATE `group_data` SET headshot = ? WHERE group_id = ?';
        values = [headshot, groupId];
        try {
            const queryResults = await pool.query(mysqlQuery, values);
            isSuccess = true;
        } catch (error) {
            console.log("error:", error.message);
            isSuccess = false;
        }
        return isSuccess;

    }

    async updateGroupName(groupId, groupName) {
        mysqlQuery = 'UPDATE `group_data` SET group_name = ? WHERE group_id = ?';
        values = [groupName, groupId];
        try {
            const queryResults = await pool.query(mysqlQuery, values);
            isSuccess = true;
        } catch (error) {
            console.error("error:", error.message);
            isSuccess = false;
        }
        return isSuccess;
    }

    async leaveGroup(groupId, userId) {
        mysqlQuery = 'DELETE FROM `group_member` WHERE group_id = ? AND member_id = ?';
        values = [groupId, userId];
        try {
            const queryResults = await pool.query(mysqlQuery, values);
            isSuccess = true;
        } catch (error) {
            console.error("error:", error.message);
            isSuccess = false;
        }
        return isSuccess;
    }

    async createGroup(groupId, groupMemberIdArr) {
        try {
            mysqlQuery = 'INSERT INTO group_member(group_id, member_id) VALUES (?, ?);';
            for (const memberId of groupMemberIdArr) {
                console.log(memberId)
                values = [groupId, memberId];
                await pool.query(mysqlQuery, values, (error, results) => {
                    if (error) {
                        console.log("error");
                        console.log(error.message);
                    }
                    console.log(results);
                })
            }
        } catch (error) {
            console.error("error:", error.message);
        }
    }

    async createGroupData(groupId, groupName) {
        try {
            mysqlQuery = 'INSERT INTO group_data(group_id, group_name, headshot) VALUES (?, ?,?);'

            values = [groupId, groupName, `${process.env.S3_Url}default_headshot.png`];
            const results = await pool.query(mysqlQuery, values);
        } catch (error) {
            console.error("error:", error.message);
        }
    }

    async updateGroupMember(groupId, userId) {
        try {
            mysqlQuery = 'INSERT INTO group_member(group_id, member_id) values (?,?)'


            values = [groupId, userId];
            const results = await pool.query(mysqlQuery, values);
        } catch (error) {
            console.error("error:", error.message);
        }

    }





}


module.exports = {
    Update
};