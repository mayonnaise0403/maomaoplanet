const router = require('express').Router();
const jwt = require('jsonwebtoken');
let Search = require("../models/search").Search;


Search = new Search();
const secretKey = process.env.Jwt_Secrect_Key;


router.post("/friend", async (req, res) => {
    try {
        const token = req.signedCookies.access_token;
        const decoded = jwt.decode(token, secretKey);
        const email = req.body.email;
        const friend_id = req.body.friend_id;
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

router.get("/api/user", async (req, res) => {
    try {
        if (!req.signedCookies.access_token) {
            res.clearCookie('access_token');
            res.send({ status: "error", message: "cookie被更改" })

        } else {
            const token = req.signedCookies.access_token;
            const selfId = jwt.decode(token, secretKey).userId;
            const nickname = req.query.nickname;
            const userEmail = req.query.email;
            if (userEmail) {
                const user = await Search.findUserWithEmail(userEmail, selfId);
                res.status(200).send({ status: "success", user: user })
            }
            if (nickname) {
                const user = await Search.findUserWithNickname(nickname, selfId);
                res.status(200).send({ status: "success", user: user })
            }
        }
    } catch (err) {
        res.status(500).send({ status: "error", message: "內部伺服器出現錯誤" });
    }
})

router.get("/api/add_user_to_group_friendlist", async (req, res) => {
    try {
        const token = req.signedCookies.access_token;
        const selfId = jwt.decode(token, secretKey).userId;
        const groupId = req.query.groupId;
        const result = await Search.addUserToGroupFriendlist(selfId, groupId);
        res.status(200).send({ status: "success", friend_list: result });
    } catch (err) {
        res.status(500).send({ status: "error", message: "內部伺服器出現錯誤" });
    }


})


router.get("/api/friendlist", async (req, res) => {
    try {
        const token = req.signedCookies.access_token;
        const selfId = jwt.decode(token, secretKey).userId;
        const friendData = await Search.getFriendList(selfId);
        res.send({ status: "success", "self_id": selfId, "friend_list": friendData });
    } catch (err) {
        res.status(500).send({ status: "error", message: "內部伺服器發生錯誤" });
    }


})

router.get("/api/grouplist", async (req, res) => {
    try {
        const token = req.signedCookies.access_token;
        const selfId = jwt.decode(token, secretKey).userId;
        const groupData = await Search.getGroupList(selfId);
        res.send({ status: "success", "group_list": groupData })
    } catch (err) {
        res.status(500).send({ status: "error", message: "內部伺服器發生錯誤" });
    }

})

// router.get("/api/search_friend", async (req, res) => {
//     try {
//         const token = req.signedCookies.access_token;
//         const selfId = jwt.decode(token, secretKey).userId;
//         const result = await Search.searchFriend(selfId, req.query.nickname);
//         res.send({ status: "success", "self_id": selfId, "friend_list": result });
//     } catch (err) {
//         res.status(500).send({ status: "error", message: "內部伺服器發生錯誤" });
//     }

// })

router.get("/api/group_member", async (req, res) => {
    try {
        const token = req.signedCookies.access_token;
        const selfId = jwt.decode(token, secretKey).userId;
        const result = await Search.getGroupMember(selfId, req.query.groupId);
        res.send({ status: "success", data: result })
    } catch (err) {
        res.status(500).send({ status: "error", message: "內部伺服器發生錯誤" })
    }

})



async function findfriendId(email) {
    const userId = await Search.getUserId(email);
    return userId[0].user_id;
}




module.exports = router;