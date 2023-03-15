const router = require('express').Router();
const dotenv = require("dotenv");
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const uuid = require('uuid');
let Update = require("../models/update_data").Update;
let Search = require("../models/search").Search;
const AWS = require('aws-sdk');

const secretKey = process.env.Jwt_Secrect_Key;
Update = new Update();
Search = new Search();
router.use(cookieParser());
dotenv.config();

router.post("/group", async (req, res) => {
    try {
        const groupName = req.body.groupName;
        const groupMemberIdArr = req.body.groupMemberIdArr;
        const groupId = uuid.v4();
        await Update.createGroup(groupId, groupMemberIdArr);
        await Update.createGroupData(groupId, groupName)
        const groupData = await Search.getGroupMemberData(groupId);
        res.status(200).send({ status: "success", groupId: groupId, groupName: groupName, group_data: groupData });
    } catch (err) {
        res.status(500).send({ status: "error", message: "伺服器內部發生錯誤" });
    }

});

router.post("/new_group_user", async (req, res) => {
    try {
        await Update.updateGroupMember(req.body.groupId, req.body.userId);
        res.status(200).send({ status: "success" })
    } catch (err) {
        res.status(500).send({ status: "error", message: "伺服器內部發生錯誤" })
    }

})



router.put("/group_name", async (req, res) => {
    try {
        const isSuccess = await Update.updateGroupName(req.body.groupId, req.body.groupName);
        if (isSuccess) {
            res.status(200).send({ status: "success", newGroupName: req.body.groupName })
        } else {
            res.status(500).send({ status: "error" })
        }
    } catch (err) {
        res.status(500).send({ status: "error", message: "伺服器內部發生錯誤" })
    }
})



router.put("/leave_group", async (req, res) => {
    try {
        const token = req.signedCookies.access_token;
        const selfId = jwt.decode(token, secretKey).userId;
        const isSuccess = await Update.leaveGroup(req.body.groupId, selfId);
        if (isSuccess) {
            res.status(200).send({ status: "success" })
        } else {
            res.status(500).send({ status: "error" })
        }
    } catch (err) {
        res.status(500).send({ status: "error", message: "伺服器內部發生錯誤" })
    }
})



router.put("/group_headshot", async (req, res) => {
    try {

        let image = req.body.image;
        let groupId = req.body.groupId;
        let imageBuffer = Buffer.from(
            image.replace(/^data:image\/\w+;base64,/, ""),
            "base64"
        )

        const type = image.split(';')[0].split('/')[1];
        console.log(0)
        AWS.config.update({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: 'ap-northeast-1'
        });
        console.log(1)
        const s3 = new AWS.S3();
        const params = {
            Bucket: 'maomaoimage/group_headshot',
            Key: groupId,
            Body: imageBuffer,
            ContentEncoding: 'base64',
            ContentType: `image/${type}`
        };
        s3.upload(params, async (err, data) => {
            if (err) {
                console.log(err)
                res.send({
                    status: "error"
                })
            }
            else {
                console.log("here")
                //update database
                const isSuccess = await Update.updateGroupHeadshot(groupId, `${process.env.S3}group_headshot/${groupId}`);
                if (isSuccess) {
                    res.status(200).send({
                        status: "success",
                        image: `${process.env.S3}group_headshot/${groupId}`
                    })
                } else {
                    res.status(500).send({
                        status: "error", message: "更新失敗"
                    })
                }

            }


        })
    } catch (err) {
        res.status(500).send({ status: "error", message: "內部伺服器出現錯誤" });
    }

})



module.exports = router;