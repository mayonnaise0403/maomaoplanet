const router = require('express').Router();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const uuid = require('uuid');
let Update = require("../models/update_data").Update;
let Search = require("../models/search").Search;

const secretKey = process.env.Jwt_Secrect_Key;
Update = new Update();
Search = new Search();
router.use(cookieParser());

router.post("/create_group", async (req, res) => {
    try {
        const groupName = req.body.groupName;
        const groupMemberIdArr = req.body.groupMemberIdArr;
        const groupId = uuid.v4();
        await Update.createGroup(groupId, groupName, groupMemberIdArr);
        const groupData = await Search.getGroupMemberData(groupId);
        res.status(200).send({ status: "success", groupId: groupId, groupName: groupName, group_data: groupData });
    } catch (err) {
        res.status(500).send({ status: "success", message: "伺服器內部發生錯誤" });
    }

});

router.post("/update_new_group_user", async (req, res) => {
    try {
        await Update.updateGroupMember(req.body.groupId, req.body.userId);
        res.status(200).send({ status: "success" })
    } catch (err) {
        res.status(500).send({ status: "error", message: "伺服器內部發生錯誤" })
    }

})

router.post("/update_group_name", async (req, res) => {
    try {
        const isSuccess = await Update.updateGroupName(req.body.groupId, req.body.groupName);
        if (isSuccess) {
            res.status(200).send({ status: "success", newGroupName: req.body.groupName })
        } else {

        } res.status(500).send({ status: "error" })
    } catch (err) {
        res.status(500).send({ status: "error", message: "伺服器內部發生錯誤" })
    }
})

router.post("/leave_group", async (req, res) => {
    try {
        const token = req.signedCookies.access_token;
        const selfId = jwt.decode(token, secretKey).userId;
        const isSuccess = await Update.leaveGroup(req.body.groupId, selfId);
        if (isSuccess) {
            res.status(200).send({ status: "success" })
        } else {

        } res.status(500).send({ status: "error" })
    } catch (err) {

    }
})




module.exports = router;