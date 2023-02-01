const router = require('express').Router();
const jwt = require('jsonwebtoken');
let Search = require("../models/search").Search;

Search = new Search();
const secretKey = process.env.Jwt_Secrect_Key;


router.post("/add_friend", async (req, res) => {
    const token = req.cookies.access_token;
    const decoded = jwt.decode(token, secretKey);
    const email = req.body.email;
    const friend_id = req.body.friend_id;
    try {
        if (email) {
            findfriendId(email)
                .then(async (result) => {
                    await Search.addFriend(decoded.userId, result);
                    res.status(200).send({ status: "success", message: "加好友成功" });

                })
        } else {
            await Search.addFriend(decoded.userId, friend_id);
            res.status(200).send({ status: "success", message: "加好友成功" });
        }
    } catch (err) {
        res.status(500).send({ status: "error", message: "內部伺服器出現錯誤" })
    }

})

router.get("/api/search_user", (req, res) => {  //要扣除自己
    const token = req.cookies.access_token;
    const selfId = jwt.decode(token, secretKey).userId;
    const nickname = req.query.nickname;
    const userEmail = req.query.email;
    if (userEmail) {
        useEmailGetUser(userEmail, selfId)
            .then((result) => {
                res.send({ "user": result })
            })
    }
    if (nickname) {
        userNicknameGetUser(nickname, selfId)
            .then((result) => {
                res.send({ "user": result })
            })
    }
})

router.get("/api/get_friendlist", (req, res) => {
    const token = req.cookies.access_token;
    const selfId = jwt.decode(token, secretKey).userId;

    getList(selfId)
        .then((result) => {
            res.send({ status: "success", "self_id": selfId, "friend_list": result });
        })

})


async function getList(userId) {
    const friendData = await Search.getFriendList(userId);
    return friendData;
}

async function findfriendId(email) {
    const userId = await Search.getUserId(email);
    return userId[0].user_id;
}

async function userNicknameGetUser(nickname, selfId) {
    const user = await Search.findUserWithNickname(nickname, selfId);
    return user;
}

async function useEmailGetUser(email, selfId) {
    const user = await Search.findUserWithEmail(email, selfId);
    return user;
}

module.exports = router;