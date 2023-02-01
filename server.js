
const express = require("express");
const path = require('path');
const db = require("./database_connect");
const signupRouter = require('./api/signup_login_api');
const searchRouter = require("./api/search_api");
const messageRouter = require("./api/message_api");
const memberRouter = require("./api/member_api");
const app = express();
const http = require('http').Server(app);

const port = 8080;
const io = require("socket.io")(http);

let Message = require("./models/message").Message;
Message = new Message();


app.use("/", memberRouter);
app.use('/', signupRouter);
app.use('/', searchRouter);
app.use("/", messageRouter);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/templates');
app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join(__dirname, 'static')));

io.on('connection', (socket) => {



    socket.on('send-message', async (msg, room) => {
        await Message.storeMessage(msg.user_id, msg.friend_id, msg.message);
        socket.to(room).emit("receive-message", msg);
    });

    socket.on('read-message', async (room) => {
        socket.to(room).emit("receive-read-message")
    })


    socket.on("join-self-room", async (room) => {
        socket.join(`user${room}`);
    });

});


app.get("/", (req, res) => {
    res.render('homepage.html');
})


app.get("/*", (req, res) => {

})



http.listen(port, (err) => {
    if (err) {
        console.log("error");
    }
    console.log("success");
})
