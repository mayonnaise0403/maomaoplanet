const router = require('express').Router();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const secretKey = process.env.Jwt_Secrect_Key;


let Message = require("../models/message").Message;
Message = new Message();


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




async function getLatestMsg(myId) {
    const data = await Message.getLatestMessage(myId);
    return data;
}

async function updateMessagegStatus(sender_id, recipient_id) {
    const isSuccess = await Message.updateMsgStatus(sender_id, recipient_id);
    return isSuccess;
}

module.exports = router;