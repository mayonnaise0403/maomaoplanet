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

router.use(cookieParser(process.env.COOKIE_SECRET));
router.use(bodyParser.json());

console.log(process.env.COOKIE_SECRET)


Signup = new Signup();
Login = new Login();


router.get("/member", (req, res) => {
    if (!req.signedCookies.access_token) {
        res.clearCookie('access_token');
        res.render("homepage.html")
    } else {
        res.clearCookie('access_token');
        res.render("homepage.html")
    }

    // try {
    //     if (!req.signedCookies.access_token) {
    //         res.clearCookie('access_token');
    //         res.render("homepage.html")
    //     } else {
    //         const token = req.signedCookies.access_token;
    //         jwt.verify(token, secretKey, (err, decoded) => {
    //             if (err && err.name === 'TokenExpiredError') {
    //                 res.clearCookie('access_token');
    //                 res.render("homepage.html")
    //             } else if (err) {
    //                 res.clearCookie('access_token');
    //                 res.render("homepage.html")
    //             } else {
    //                 res.render("member.html")
    //             }
    //         });

    //     }
    // } catch (err) {
    //     res.render("error_page.html")
    // }

})

router.get("/error", (req, res) => {
    res.render("error_page.html")
})

router.post("/signout", (req, res) => {
    try {
        res.clearCookie('access_token');
        res.status(200).send({ status: "success", message: "登出成功" })
    } catch (err) {
        res.status(500).send({ status: "error", message: "內部伺服器發生錯誤" })
    }
})


router.post("/login", async (req, res) => {
    try {
        const isLogin = await Login.checkLogin(req.body.email, req.body.password);
        if (isLogin) {
            const data = await getData(req.body.email, req.body.password);
            const payload = {
                email: req.body.email,
                nickname: data.nickname,
                userId: data.userId
            };
            const options = { expiresIn: '24h' };
            const token = jwt.sign(payload, secretKey, options);
            try {
                res.cookie('access_token', token, { signed: true, httpOnly: true, expires: new Date(Date.now() + 3600000 * 24 * 7) });
            } catch (err) {
                console.log(err)
            }
            res.status(200).send({ status: "success", "message": "登入成功", "nickname": isLogin.nickname });
        } else {
            res.status(400).send({ status: "error", "message": "無此用戶" });
        }
    } catch (err) {
        res.status(500).send({ "status": "error", "message": "內部伺服器出現錯誤" });
    }
});



router.post("/send_email", (req, res) => {
    try {
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
        console.log(code)
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
    } catch (err) {
        res.status(500).send({ status: "error", message: "內部伺服器出現錯誤" })
    }


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
                        res.status(200).send({ status: "success", message: "email驗證" });
                    } else {
                        res.status(400).send({ status: "error", message: "email已被註冊過了" });
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


async function checkEmailAvailability(email) {
    const isAvailable = await Signup.checkEmail(email);
    return isAvailable;
}

async function AddSignupData(nickname, email, password) {
    await Signup.addSignupData(nickname, email, password);
}

module.exports = router;




