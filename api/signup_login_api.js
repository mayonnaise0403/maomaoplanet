const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cookieParser = require('cookie-parser');
const dotenv = require("dotenv");
let Signup = require("../models/signup").Signup;
let Login = require("../models/login").Login;
dotenv.config();



const secretKey = process.env.Jwt_Secrect_Key;


router.use(bodyParser.json());
router.use(cookieParser());

Signup = new Signup();
Login = new Login();


router.get("/member", (req, res) => {
    res.render("member.html")
})


router.post("/login", async (req, res) => {
    try {
        const isLogin = await isLoginSuccess(req.body.email, req.body.password);
        if (isLogin) {
            const data = await getData(req.body.email, req.body.password);
            const payload = {
                email: req.body.email,
                nickname: data.nickname,
                userId: data.userId
            };
            const options = { expiresIn: '24h' };
            const token = jwt.sign(payload, secretKey, options);
            res.cookie('access_token', token, { httpOnly: true, expires: new Date(Date.now() + 3600000 * 24 * 7) });
            res.status(200).send({ status: "success", "message": "登入成功", "nickname": isLogin.nickname });
        } else {
            res.status(400).send({ status: "error", "message": "無此用戶" });
        }
    } catch (err) {
        res.status(500).send({ "status": "error", "message": "內部伺服器出現錯誤" });
    }
});



router.post("/send_email", (req, res) => {
    let userEmail = req.body.email;
    let time = new Date().getTime();
    let code = time.toString().substring(time.toString().length - 4);
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        auth: {
            user: process.env.email,
            pass: process.env.Email_Password
        },
    });

    transporter.sendMail({
        from: process.env.email,
        to: userEmail,
        subject: "歡迎使用毛毛星球",
        html: `驗證碼是:${code}`,
    }).then(() => {
        res.send({ "code": code });
    }).catch(() => {
        res.send({ "message": "寄出失敗" });
    })

})

router.post("/confirm_signup", (req, res) => {
    try {
        AddSignupData(req.body.nickname, req.body.email, req.body.password)
            .then(() => {
                res.status(200).send({ status: "success", message: "註冊成功" })
            })
    } catch (err) {
        res.status(500).send({ status: "error", message: "內部伺服器出現錯誤" })
    }

})

router.post("/signup", (req, res) => {
    try {
        if (req.body.nickname && req.body.email && req.body.password) {
            checkEmailAvailability(req.body.email)
                .then((result) => {
                    if (result) {
                        res.status(200).send({ "status": "success", "message": "email驗證" });
                    }
                }

                );
        } else {
            res.status(400).send({ "status": "error", "message": "註冊資料不可為空" });
        }
    } catch (err) {
        res.status(500).send({ "status": "error", "message": "內部伺服器出現錯誤" });
    }
})




async function getData(email, password) {
    const data = await Login.getUserData(email, password);
    return { nickname: data[0].nickname, userId: data[0].user_id };

}

async function isLoginSuccess(email, password) {
    const isLogin = await Login.checkLogin(email, password);
    return isLogin;
}

async function checkEmailAvailability(email) {
    const isAvailable = await Signup.checkEmail(email);
    return isAvailable;
}

async function AddSignupData(nickname, email, password) {
    await Signup.addSignupData(nickname, email, password);
}

module.exports = router;




