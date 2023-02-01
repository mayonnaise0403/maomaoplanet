
const chatListContainer = document.querySelector(".chat-list-container");
const isAddFriendOkBtn = document.querySelector(".is-add-friend-ok-btn");
const isAddFriendCloseBtn = document.querySelector(".is-add-friend-no-btn");
const isAddFriendPopup = document.querySelector(".is-add-friend-to-stranger");

let clickedDiv;
let hadHistoryMsg = false;



isAddFriendCloseBtn.addEventListener("click", () => {
    isAddFriendPopup.style.display = "none";
})

isAddFriendOkBtn.addEventListener("click", () => {
    let friend_id = document.querySelector(".chat-friend-user_id").innerHTML;

    fetch("/add_friend", {
        method: "POST",
        body: JSON.stringify({
            friend_id: parseInt(friend_id)
        })
        , headers: {
            'Content-type': 'application/json; charset=UTF-8',
        }
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            if (data.status === "success") {
                isAddFriendPopup.style.display = "none";
                let friendMsg = document.querySelector(`.user${friend_id}-message`).parentNode;
                let strangerIcon = friendMsg.querySelector(".stranger-icon");
                friendMsg.removeChild(strangerIcon);
                console.log(2);
                addFriendStatusPopup.style.display = "block";
                addFriendStatus.innerHTML = `✅${data.message}`;
                addFriendStatusPopup.style.animation = "slideInFromTop 0.5s ease-in-out";
                addFriendStatusPopup.addEventListener("animationend", () => {
                    setTimeout(() => {
                        addFriendStatusPopup.style.removeProperty("animation");
                        addFriendStatusPopup.style.display = "none";
                    }, 2000)

                });

            } else if (data.status === "error") {

            }
        })
        .then(() => {
            fetch("/api/get_friendlist")
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    createFreindList(data.friend_list, data.self_id);
                })
        })
})

function createChatList(data) {
    let count = 0;
    data.forEach(element => {
        hadHistoryMsg = true;
        let senderIsMe;
        if (parseInt(selfId.innerHTML) === element.sender_id) {
            senderIsMe = true;
        } else {
            senderIsMe = false;
        }
        newDiv = document.createElement("div");
        newDiv.className = "chat-list";
        chatListContainer.appendChild(newDiv);
        let chatList = document.querySelectorAll(".chat-list");

        newImg = document.createElement("img");
        if (senderIsMe) {
            newImg.src = element.recipient_headshot;
        } else {
            newImg.src = element.sender_headshot;
        }
        newImg.style.width = "100px";
        newImg.style.height = "100px";
        newImg.style.objectFit = "cover";
        newImg.style.borderRadius = "50px";
        chatList[count].appendChild(newImg);


        newDiv = document.createElement("div");
        newDiv.className = "chat-list-right";
        chatList[count].appendChild(newDiv);
        let rightChatList = document.querySelectorAll(".chat-list-right");


        newP = document.createElement("p");
        if (senderIsMe) {
            newP.innerHTML = element.recipient_nickname;
        } else {
            newP.innerHTML = element.sender_nickname;
        }

        newP.style.fontSize = "30px";
        newP.style.fontWeight = "bolder";
        newP.style.marginTop = "10px";
        newP.style.marginLeft = "10px";
        rightChatList[count].appendChild(newP);

        newP = document.createElement("p");
        newP.innerHTML = element.message;
        if (senderIsMe) {
            newP.className = `user${element.recipient_id}-message`;
        } else {
            newP.className = `user${element.sender_id}-message`;
        }

        newP.style.fontSize = "15px";
        newP.style.marginTop = "20px";
        newP.style.marginLeft = "10px";
        newP.style.fontWeight = "bolder";
        newP.style.color = "gray";
        rightChatList[count].appendChild(newP);

        if (element.is_read === 0 && !senderIsMe) {
            newImg = document.createElement("img");
            newImg.src = "./images/new-message.png";
            newImg.className = "new-message-icon";
            newImg.style.width = "50px";
            newImg.style.position = "absolute";
            newImg.style.right = "5px";
            newImg.style.top = "0px";
            rightChatList[count].appendChild(newImg);
        }

        if (parseInt(element.non_friend_id) === parseInt(selfId.innerHTML)) {
            newImg = document.createElement("img");
            newImg.src = "./images/anonymity.png";
            newImg.className = "stranger-icon";
            newImg.style.width = "50px";
            newImg.style.position = "absolute";
            newImg.style.right = "5px";
            newImg.style.bottom = "5px";
            rightChatList[count].appendChild(newImg);


        }

        chatList[count].addEventListener("click", (event) => {
            const clickedElement = event.target;
            clickedDiv = clickedElement.closest("div");
            if (clickedDiv.className === "chat-list-right") {
                clickedDiv = clickedDiv.parentNode;
            }

            //移除新訊息的icon
            let clickedDivNewMessageIcon = clickedDiv.querySelector('.new-message-icon');
            console.log(clickedDivNewMessageIcon);
            if (clickedDivNewMessageIcon) {
                clickedDivNewMessageIcon.parentNode.removeChild(clickedDivNewMessageIcon);
            }

            //跳出是否要加陌生人好友
            if (parseInt(element.non_friend_id) === parseInt(selfId.innerHTML)) {
                isAddFriendPopup.style.display = "block";
            }

            chatContainer.style.display = "block";
            if (senderIsMe) {
                chatBoxFriendName.innerHTML = element.recipient_nickname;
                friendChatId.innerHTML = element.recipient_id;
            } else {
                chatBoxFriendName.innerHTML = element.sender_nickname;
                friendChatId.innerHTML = element.sender_id;
            }
            friendPopup.style.display = "none";
            if (senderIsMe) {
                fetch("/api/get_message", {
                    method: "POST",
                    body: JSON.stringify({
                        "myId": selfId.innerHTML,
                        "friendId": element.recipient_id
                    })
                    , headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    }
                })
                    .then((response) => {
                        return response.json();
                    })
                    .then((data) => {
                        data.message.forEach(element => {
                            if (parseInt(selfId.innerHTML) === element.sender_id) {
                                displayMessage(element.message, true, element.is_read);
                            } else {
                                displayMessage(element.message, false, element.is_read);
                            }
                        })
                        let room = `user${friendChatId.innerHTML}`;
                        socket.emit('read-message', room);
                    })
                    .then(() => {
                        fetch("/update_message_status", {
                            method: "POST",
                            body: JSON.stringify({
                                sender_id: parseInt(friendChatId.innerHTML)
                            })
                            , headers: {
                                'Content-type': 'application/json; charset=UTF-8',
                            }
                        })
                            .then((response) => {
                                return response.json();
                            })
                            .then((data) => {

                            })
                    })
            } else {
                fetch("/api/get_message", {
                    method: "POST",
                    body: JSON.stringify({
                        "myId": selfId.innerHTML,
                        "friendId": element.sender_id
                    })
                    , headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    }
                })
                    .then((response) => {
                        return response.json();
                    })
                    .then((data) => {
                        data.message.forEach(element => {
                            if (parseInt(selfId.innerHTML) === element.sender_id) {
                                displayMessage(element.message, true, element.is_read);
                            } else {
                                displayMessage(element.message, false, element.is_read);
                            }

                        })
                        let room = `user${friendChatId.innerHTML}`;
                        socket.emit('read-message', room);

                    })
                    .then(() => {
                        fetch("/update_message_status", {
                            method: "POST",
                            body: JSON.stringify({
                                sender_id: parseInt(friendChatId.innerHTML)
                            })
                            , headers: {
                                'Content-type': 'application/json; charset=UTF-8',
                            }
                        })
                            .then((response) => {
                                return response.json();
                            })
                            .then((data) => {

                            })
                    })
            }

        })


        count++;





    })


}

