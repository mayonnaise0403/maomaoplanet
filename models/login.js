const pool = require("../database_connect").pool;
let mysqlQuery, values, result;

class Login {

    async checkLogin(email, password) {
        mysqlQuery = 'SELECT * FROM member WHERE email = ? AND password = ?;';
        values = [email, password];
        try {
            const queryResults = await pool.query(mysqlQuery, values);
            if (queryResults[0].length === 1) {
                result = true;
            } else {
                result = false;
            }
        } catch (error) {
            console.log(error.message);
            result = false;
        }
        return result;
    }


    async getUserData(email, password) {
        mysqlQuery = 'SELECT member.nickname,member.user_id FROM member WHERE email = ? AND password = ?;';
        values = [email, password];
        try {
            const queryResults = await pool.query(mysqlQuery, values);
            result = queryResults[0]
            console.log(result)
        } catch (error) {
            console.log(error.message);
        }
        return result;
    }


}


module.exports = {
    Login
};