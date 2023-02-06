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

    async createGroup(groupId, groupName, groupMemberIdArr) {
        try {
            mysqlQuery = 'INSERT INTO group_members(group_name, group_id, member_id,group_members.headshot) VALUES (?, ?, ?,?);';
            for (const memberId of groupMemberIdArr) {
                values = [groupName, groupId, memberId, `${process.env.S3_Url}default_headshot.png`];
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



}


module.exports = {
    Update
};