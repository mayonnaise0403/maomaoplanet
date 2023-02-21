const express = require("express");
const path = require('path');
const jwt = require('jsonwebtoken');
const db = require("./database_connect");
const cookieParser = require('cookie-parser');
const signupRouter = require('./api/signup_login_api');
const searchRouter = require("./api/search_api");
const messageRouter = require("./api/message_api");
const memberRouter = require("./api/member_api");
const updateRouter = require("./api/update_api");
const adapter = require("webrtc-adapter");
const app = express();
const http = require('http').Server(app);

const port = 8080;
const io = require("socket.io")(http);

let Message = require("./models/message").Message;
Message = new Message();
let Search = require("./models/search").Search;
Search = new Search();
const secretKey = process.env.Jwt_Secrect_Key;



app.use(cookieParser());
app.use("/", memberRouter);
app.use('/', signupRouter);
app.use('/', searchRouter);
app.use("/", messageRouter);
app.use("/", updateRouter);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/templates');
app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join(__dirname, 'static')));



io.on('connection', (socket) => {



    socket.on('send-message', async (msg, room) => {
        await Message.storeMessage(msg.user_id, msg.friend_id, msg.message);
        socket.to(room).emit("receive-message", msg);
    });

    socket.on("send-message-to-group", async (package) => {
        const cookie = socket.request.headers.cookie;
        const match = cookie.match(/access_token=([^;]+)/);
        const token = match ? match[1] : null;
        const selfId = jwt.decode(token, secretKey).userId;
        const MemberIdArr = await Search.getGroupMemberId(package.group_id);
        await Message.storeGroupMessage(package.sender_id, package.group_id, package.message);
        await Message.deleteIsReadStatus(package.group_id);

        MemberIdArr.forEach(element => {
            if (element.member_id !== parseInt(selfId)) {
                socket.to(`user${element.member_id}`).emit("receive-group-message", package);
            }
        })
    })

    socket.on('read-message', async (room) => {
        socket.to(room).emit("receive-read-message")
    })

    socket.on('group-read-message', async (package) => {
        const cookie = socket.request.headers.cookie;
        const match = cookie.match(/access_token=([^;]+)/);
        const token = match ? match[1] : null;
        const selfId = jwt.decode(token, secretKey).userId;
        const MemberIdArr = await Search.getGroupMemberId(package.group_id);
        const hadReadCount = await Message.getIsReadCount(package.group_id);


        MemberIdArr.forEach(element => {
            socket.to(`user${element.member_id}`).emit("receive-group-read-message", hadReadCount[0].readCount);
        })
        //傳給自己
        socket.emit("self-receive-group-read-message", hadReadCount[0].readCount);

    })

    //加入通話
    socket.on("join", (roomName, package) => {
        const cookie = socket.request.headers.cookie;
        const match = cookie.match(/access_token=([^;]+)/);
        const token = match ? match[1] : null;
        const senderId = jwt.decode(token, secretKey).userId;

        socket.join(roomName);
        let userId = roomName.substring(roomName.indexOf("and"));
        userId = userId.replace("and", "")
        socket.to(`user${userId}`).emit("invite-join-call", roomName, package, senderId)
    })

    socket.on("join-group-call", async (groupId, peerId) => {
        const cookie = socket.request.headers.cookie;
        const match = cookie.match(/access_token=([^;]+)/);
        const token = match ? match[1] : null;
        const selfId = jwt.decode(token, secretKey).userId;
        const MemberIdArr = await Search.getGroupMemberId(groupId);
        socket.join(groupId);
        const host = socket.id;
        console.log("host")
        console.log(host)
        MemberIdArr.forEach(element => {
            socket.to(`user${element.member_id}`).emit("invite-join-group-call", groupId, selfId, peerId);
        })

    })

    socket.on("group-accept-call-member", async (groupId) => {
        const cookie = socket.request.headers.cookie;
        const match = cookie.match(/access_token=([^;]+)/);
        const token = match ? match[1] : null;
        const selfId = jwt.decode(token, secretKey).userId;
        const MemberIdArr = await Search.getGroupMemberId(groupId);
        MemberIdArr.forEach(element => {
            socket.to(`user${element.member_id}`).emit("group-accept-call-member", selfId);
        })

    })

    socket.on("accept-group-call", (groupId) => {
        socket.join(groupId);
    })

    socket.on("group-ready", (groupId, host) => {
        socket.broadcast.to(groupId).emit("group-ready", groupId, host);
    })

    socket.on("group-offer", (offer, roomName, host) => {
        socket.broadcast.to(roomName).emit("group-offer", offer, roomName, host);
    })

    socket.on("group-answer", (answer, roomName) => {
        socket.broadcast.to(roomName).emit("group-answer", answer);
    })

    socket.on("recipient-join-room", (roomName) => {
        console.log("recipient join the room");
        socket.join(roomName);
    })

    socket.on("ready", (roomName) => {
        console.log("ready");
        socket.broadcast.to(roomName).emit("ready");
    });

    socket.on("group-leave", () => {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        const cookie = socket.request.headers.cookie;
        const match = cookie.match(/access_token=([^;]+)/);
        const token = match ? match[1] : null;
        const selfId = jwt.decode(token, secretKey).userId;
        console.log(Array.from(socket.rooms))
        Array.from(socket.rooms).forEach(room => {
            if (uuidRegex.test(room)) {
                socket.leave(room);
                socket.broadcast.to(room).emit("group-leave", selfId);
            }
        })
    })


    socket.on("candidate", (candidate, roomName) => {
        console.log("candidate")
        socket.broadcast.to(roomName).emit("candidate", candidate)
    })

    socket.on("offer", (offer, roomName) => {
        console.log("offer")
        socket.broadcast.to(roomName).emit("offer", offer, roomName);
    });

    socket.on("answer", (answer, roomName) => {
        console.log("answer")
        socket.broadcast.to(roomName).emit("answer", answer);
    })


    socket.on("join-self-room", async (room) => {
        socket.join(`user${room}`);
    });

    socket.on("hangup-call", (roomName) => {
        socket.leave(roomName);
        let userId = roomName.substring(roomName.indexOf("and"));
        userId = userId.replace("and", "")
        socket.to(`user${userId}`).emit("hangup-call")
    })

    socket.on("recipient-hangup-call", (senderId) => {
        socket.to(`user${senderId}`).emit("hangup-call")
    })


    socket.on("leave", (roomName) => {
        console.log(roomName)
        socket.leave(roomName);
        socket.broadcast.to(roomName).emit("leave");
    })

});


app.get("/", (req, res) => {
    res.render('homepage.html');
})


// app.get("/*", (req, res) => {

// })



http.listen(port, (err) => {
    if (err) {
        console.log("error");
    }
    console.log("success");
})
