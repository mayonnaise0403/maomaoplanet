const router = require('express').Router();
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser');
const AWS = require('aws-sdk');
let bodyParser = require("body-parser");
const https = require('https');
let Update = require("../models/update_data").Update;
let Signup = require("../models/signup").Signup;
const nodemailer = require('nodemailer');
dotenv.config();

const secretKey = process.env.Jwt_Secrect_Key;


router.use(cookieParser());
router.use(bodyParser.json({ limit: '5000mb' }));
router.use(bodyParser.urlencoded({ limit: '5000mb', extended: true }));
router.use(bodyParser.urlencoded({
    extended: true
}))

Update = new Update();
Signup = new Signup();

router.get("/api/user_data", async (req, res) => {
    try {
        const token = req.cookies.access_token;
        const decoded = jwt.decode(token, secretKey);
        const defaultUrl = `${process.env.S3_Url}default_headshot.png`;
        const url = `${process.env.S3_Url}userId${decoded.userId}`;
        const result = await isHaveHeadshot(url);
        if (result) {
            res.status(200).send({ nickname: decoded.nickname, email: decoded.email, headshot: url })

        } else {
            res.status(200).send({ nickname: decoded.nickname, email: decoded.email, headshot: defaultUrl })
        }


    } catch (err) {
        res.status(500).send({ "status": "error", "message": "內部伺服器出現錯誤" });
    }
})

router.post("/update_nickname", (req, res) => {
    const token = req.cookies.access_token;
    const decoded = jwt.decode(token, secretKey);
    const newNickname = req.body.newNickname;
    isUpdateNicknameSuccess(newNickname, decoded.userId)
        .then((result) => {
            if (result) {
                //更新token
                decoded.nickname = newNickname;
                // res.clearCookie('access_token');
                const options = { expiresIn: '24h' };
                const token = jwt.sign(decoded, secretKey);
                res.cookie('access_token', token, { httpOnly: true, expires: new Date(Date.now() + 3600000 * 24 * 7) });

                res.status(200).send({ status: "success" })
            } else {
                res.status(500).send({ status: "error" })
            }
        })
})

router.post("/update_verify_email", (req, res) => {
    let newEmail = req.body.newEmail;
    checkEmailAvailability(newEmail)
        .then((result) => {
            if (result) {
                const time = new Date().getTime();
                const code = time.toString().substring(time.toString().length - 4);
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
                    to: newEmail,
                    subject: "毛毛星球-信箱更改驗證",
                    html: `驗證碼是:${code}`,
                }).then(() => {
                    res.send({ status: "success", code: code });
                }).catch(() => {
                    res.send({ status: "error", "message": "寄出失敗" });
                })
            } else {
                res.send({ status: "error", message: "信箱已被使用過" });
            }
        })

})

router.post("/update_email", (req, res) => {
    const token = req.cookies.access_token;
    const decoded = jwt.decode(token, secretKey);
    const newEmail = req.body.newEmail;
    isUpdateEmailSuccess(newEmail, decoded.userId)
        .then((result) => {
            if (result) {
                //更新token
                decoded.email = newEmail;
                const token = jwt.sign(decoded, secretKey);
                res.cookie('access_token', token, { httpOnly: true, expires: new Date(Date.now() + 3600000 * 24 * 7) });
                res.status(200).send({ status: "success" })
            } else {
                res.status(500).send({ status: "error" })
            }
        })

})

router.post("/upload_headshot", (req, res) => {
    const token = req.cookies.access_token;
    const decoded = jwt.decode(token, secretKey);
    let image = req.body.image;
    let email = req.body.email;
    let imageBuffer = Buffer.from(
        image.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
    )
    const type = image.split(';')[0].split('/')[1];
    AWS.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: 'ap-northeast-1'
    });
    const s3 = new AWS.S3();
    const params = {
        Bucket: 'maomaoimage/headshot',
        Key: `userId${decoded.userId}`,
        Body: imageBuffer,
        ContentEncoding: 'base64',
        ContentType: `image/${type}`
    };
    s3.upload(params, (err, data) => {
        if (err) {
            res.send({
                status: "error"
            })
        }
        else {
            //update database
            Update.updateHeadshot(decoded.userId);

            res.status(200).send({
                status: "success"
            })
        }


    })

})


async function isHaveHeadshot(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
}

async function isUpdateNicknameSuccess(newNickname, userId) {
    const isSuccess = await Update.updateNickname(newNickname, userId);
    return isSuccess;
}

async function isUpdateEmailSuccess(newEmail, userId) {
    const isSuccess = await Update.updateEmail(newEmail, userId);
    return isSuccess;
}

async function checkEmailAvailability(email) {
    const isAvailable = await Signup.checkEmail(email);
    return isAvailable;
}




module.exports = router;