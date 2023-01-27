const pool = require("../database_connect").pool;
let mysqlQuery, values, result;

class Signup {

    addSignupData(nickname, email, password) {
        mysqlQuery = 'INSERT INTO member(nickname,email,password) VALUES(?,?,?);';
        values = [nickname, email, password];
        pool.query(mysqlQuery, values, (error, results) => {
            if (error) {
                console.log("error");
                console.log(error.message);
            }
            console.log(results);
        })
    }

    async checkEmail(email) {
        mysqlQuery = 'SELECT * FROM member WHERE email = ?;';
        values = [email];
        try {
            const queryResults = await pool.query(mysqlQuery, values);
            if (queryResults[0].length === 0) {
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
}


module.exports = {
    Signup

};