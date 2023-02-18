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



router.use(cookieParser());


router.post("/api/get_message", async (req, res) => {
    const myId = req.body.myId;
    const friendId = req.body.friendId;
    if (req.body.isGroup) {
        const data = await Message.getGroupMessage(friendId);
        res.send({ status: "success", message: data })
    } else {
        const data = await Message.getMessage(myId, friendId);
        res.send({ message: data })
    }



})

router.get("/api/get_latest_group_message", async (req, res) => {
    const token = req.cookies.access_token;
    const userId = jwt.decode(token, secretKey).userId;
    const data = await Message.getGroupLatestMessage(userId);
    res.send({ status: "success", data: data })


})



router.get("/api/get_latest_message", (req, res) => {
    const token = req.cookies.access_token;
    const userId = jwt.decode(token, secretKey).userId;
    getLatestMsg(userId)
        .then((result) => {
            res.send(result);
        })
})



router.post("/update_message_status", (req, res) => {
    const token = req.cookies.access_token;
    const userId = jwt.decode(token, secretKey).userId;
    updateMessagegStatus(req.body.sender_id, userId)
        .then((result) => {
            if (result) {
                res.send({ status: "success" })
            }
        })
})

router.post("/update_group_message_status", async (req, res) => {
    const token = req.cookies.access_token;
    const userId = jwt.decode(token, secretKey).userId;
    await Message.updateGroupMsgStatus(req.body.groupId, userId);
    res.send({ status: "success" });
})

router.post("/get_chat_picture", async (req, res) => {
    const token = req.cookies.access_token;
    const userId = jwt.decode(token, secretKey).userId;
    const data = await Message.getChatPictureAndVideo(userId, req.body.recipientId)
    res.send({ status: "success", data: data });

})

router.post("/get_group_picture", async (req, res) => {
    const data = await Message.getGroupPictureAndVideo(req.body.groupId)
    res.send({ status: "success", data: data })
})

router.post("/upload_file", async (req, res) => {
    const token = req.cookies.access_token;
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
    console.log(req.body.type)
    console.log(req.body.dataType)
    console.log(req.body.totalTypeData)

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
    console.log(params.Key)
    s3.upload(params, (err, data) => {
        if (err) {
            res.send({
                status: "error"
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
                            status: "error"
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


})



async function getLatestMsg(myId) {
    const data = await Message.getLatestMessage(myId);
    return data;
}

async function updateMessagegStatus(sender_id, recipient_id) {
    const isSuccess = await Message.updateMsgStatus(sender_id, recipient_id);
    return isSuccess;
}

module.exports = router;