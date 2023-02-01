const pool = require("../database_connect").pool;
const dotenv = require("dotenv");
dotenv.config();
let mysqlQuery, values, result;

class Signup {

    async addSignupData(nickname, email, password) {
        try {
            const mysqlQuery = 'INSERT INTO member(nickname,email,password,headshot) VALUES(?,?,?,?);';
            const values = [nickname, email, password, `${process.env.S3_Url}default_headshot.png`];
            const results = await pool.query(mysqlQuery, values);
            console.log(results);
        } catch (error) {
            console.error("error:", error.message);
        }
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