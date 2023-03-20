const router = require('express').Router();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const dotenv = require("dotenv");
const AWS = require('aws-sdk');
const fs = require('fs');
const secretKey = process.env.Jwt_Secrect_Key;
const multer = require('multer');


let Message = require("../models/message").Message;
Message = new Message();
dotenv.config();



router.use(cookieParser(process.env.COOKIE_SECRET));


router.post("/api/message", async (req, res) => {
    try {
        const myId = req.body.myId;
        const friendId = req.body.friendId;
        if (req.body.isGroup) {
            const data = await Message.getGroupMessage(friendId);
            res.status(200).send({ status: "success", message: data })
        } else {
            const data = await Message.getMessage(myId, friendId);
            res.status(200).send({ message: data })
        }
    } catch (err) {
        res.status(500).send({ status: "error", message: "內部伺服器出現錯誤" });
    }
})

router.get("/friend_status", async (req, res) => {
    try {
        const token = req.signedCookies.access_token;
        const selfId = jwt.decode(token, secretKey).userId;
        const isFriend = await Message.isFriend(selfId, req.query.friendId);
        if (isFriend.length !== 0) {
            res.send({ status: "success" })
        } else {
            res.status(400).send({ status: "error", message: "需要雙方都為好友才能撥打" })
        }
    } catch (err) {
        res.status(500).send({ status: "error", message: "內部伺服器出現錯誤" });
    }
})

router.get("/api/latest_group_message", async (req, res) => {
    try {
        const token = req.signedCookies.access_token;
        const userId = jwt.decode(token, secretKey).userId;
        const data = await Message.getGroupLatestMessage(userId);
        res.status(200).send({ status: "success", data: data })
    } catch (err) {
        res.status(500).send({ status: "error", message: "內部伺服器出現錯誤" });
    }
})



router.get("/api/latest_message", async (req, res) => {
    try {
        const token = req.signedCookies.access_token;
        const userId = jwt.decode(token, secretKey).userId;
        const result = await Message.getLatestMessage(userId);
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send({ status: "error", message: "內部伺服器出現錯誤" });
    }
})


router.put("/message_status", async (req, res) => {
    try {
        const token = req.signedCookies.access_token;
        const userId = jwt.decode(token, secretKey).userId;
        const isSuccess = await Message.updateMsgStatus(req.body.sender_id, userId);
        if (isSuccess) {
            res.send({ status: "success" })
        }
    } catch (err) {
        res.status(500).send({ status: "error", message: "內部伺服器出現錯誤" });
    }
})

router.put("/group_message_status", async (req, res) => {
    try {
        const token = req.signedCookies.access_token;
        const userId = jwt.decode(token, secretKey).userId;
        await Message.updateGroupMsgStatus(req.body.groupId, userId);
        res.send({ status: "success" });
    } catch (err) {
        res.status(500).send({ status: "error", message: "內部伺服器出現錯誤" });
    }
})

router.post("/chat_picture", async (req, res) => {
    try {
        const token = req.signedCookies.access_token;
        const userId = jwt.decode(token, secretKey).userId;
        const data = await Message.getChatPictureAndVideo(userId, req.body.recipientId)
        res.send({ status: "success", data: data });
    } catch (err) {
        res.status(500).send({ status: "error", message: "內部伺服器出現錯誤" });
    }
})

router.get("/group_picture", async (req, res) => {
    try {
        const data = await Message.getGroupPictureAndVideo(req.query.groupId)
        res.send({ status: "success", data: data })
    } catch (err) {
        res.status(500).send({ status: "error", message: "內部伺服器出現錯誤" });
    }
})

router.post("/file", async (req, res) => {
    try {
        const token = req.signedCookies.access_token;
        const myId = jwt.decode(token, secretKey).userId;
        let file = req.body.file;
        let fileBuffer;
        if (req.body.dataType === "application") {
            fileBuffer = Buffer.from(
                file.replace(/^data:application\/\w+;base64,/, ""),
                "base64"
            )
        } else if (req.body.dataType === "image") {
            fileBuffer = Buffer.from(
                file.replace(/^data:image\/\w+;base64,/, ""),
                "base64"
            )
        } else if (req.body.dataType === "video") {
            fileBuffer = Buffer.from(
                file.replace(/^data:video\/\w+;base64,/, ""),
                "base64"
            )
        } else if (req.body.dataType === "audio") {
            fileBuffer = Buffer.from(
                file.replace(/^data:audio\/\w+;base64,/, ""),
                "base64"
            )
        } else if (req.body.dataType === "text") {
            fileBuffer = Buffer.from(
                file.replace(/^data:text\/\w+;base64,/, ""),
                "base64"
            )
        }


        AWS.config.update({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: 'ap-northeast-1'
        });
        const s3 = new AWS.S3();
        const params = {
            Bucket: process.env.S3_Single_Chat_File_Bucket,
            Key: `${req.body.fileName}-${req.body.time}(${req.body.dataType})`,
            Body: fileBuffer,
            ContentEncoding: 'base64',
            ContentType: req.body.totalTypeData
        };
        s3.upload(params, (err, data) => {
            if (err) {
                res.send({
                    status: "error",
                    message: "傳送失敗"
                })
            }
            else {
                // Message.storeMessage(myId, req.body.recipientId, `${process.env.S3_File_Url}${params.Key}`)
                if (req.body.dataType === 'video') {
                    fileBuffer = Buffer.from(
                        req.body.videoPc.replace(/^data:image\/\w+;base64,/, ""),
                        "base64"
                    )
                    const s3 = new AWS.S3();
                    const params = {
                        Bucket: process.env.S3_Video_Pc,
                        Key: `${req.body.fileName}-${req.body.time}`,
                        Body: fileBuffer,
                        ContentEncoding: 'base64',
                        ContentType: "image/png"
                    };
                    s3.upload(params, (err, data) => {
                        if (err) {
                            res.send({
                                status: "error",
                                message: "傳送失敗"
                            })
                        } else {
                            res.status(200).send({ status: "success", message: `${process.env.S3_File_Url}${req.body.fileName}-${req.body.time}(${req.body.dataType})` })
                        }
                    })


                } else {
                    res.status(200).send({ status: "success", message: `${process.env.S3_File_Url}${req.body.fileName}-${req.body.time}(${req.body.dataType})` })
                }

            }


        })
    } catch (err) {
        res.status(500).send({ status: "error", message: "內部伺服器出現錯誤" });
    }



})



module.exports = router;