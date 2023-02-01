const pool = require("../database_connect").pool;
const dotenv = require("dotenv");
dotenv.config();
let mysqlQuery, values, isSuccess;


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
}


module.exports = {
    Update
};