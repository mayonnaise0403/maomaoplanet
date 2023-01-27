const router = require('express').Router();
const jwt = require('jsonwebtoken');
const secretKey = process.env.Jwt_Secrect_Key;



let Message = require("../models/message").Message;
Message = new Message();




router.post("/api/get_message", (req, res) => {
    const myId = req.body.myId;
    const friendId = req.body.friendId;
    GetMsg(myId, friendId)
        .then((result) => {
            res.send({ message: result })
        })


})



async function GetMsg(myId, friendId) {
    const data = await Message.getMessage(myId, friendId);
    return data;
}
module.exports = router;