const isAddFriendOkBtn = document.querySelector(".is-add-friend-ok-btn");
const isAddFriendCloseBtn = document.querySelector(".is-add-friend-no-btn");
const isAddFriendPopup = document.querySelector(".is-add-friend-to-stranger");
const addGroupBtn = document.querySelector(".add-group-btn");
const closeGroupPopup = document.querySelector(".close-add-group-popup");
const addGroupPopup = document.querySelector(".add-group-popup");
const addGroupFriendList = document.querySelector(".search-list");
const hadAddMemberList = document.querySelector(".had-add-member-list");
const searchGroupMemberBtn = document.querySelector(".group-member-btn");
const searchGroupMemberInput = document.querySelector(".group-member-input");
const createGroupBtn = document.querySelector(".create-group-btn");
const groupNameInput = document.querySelector(".group-name-input");
const groupChatListContainer = document.querySelector(".group-chat-list-container");
const groupMemberIcon = document.querySelector(".group-member-icon");
const groupMemberPopup = document.querySelector(".group-member-popup");
const grouopMemberPopupCloseBtn = document.querySelector(".group-member-popup-close");
const groupMemberList = document.querySelector(".group-member-list");
const groupMemberPopupAddFriend = document.querySelector(".friend-popup-add-friend");
const friendPopupCall = document.querySelector(".friend-popup-call");
const friendCallHeadshot = document.querySelector(".friend-call-headshot");
const friendCallNickname = document.querySelector(".friend-call-nickname");
const friendCallAcceptBtn = document.querySelector(".friend-call-icon-container");
const friendCallRejectBtn = document.querySelector(".friend-call-hangup-icon-container");
const friendCallTimer = document.querySelectorAll(".friend-call-timer");
const recipientHangupCall = document.querySelector(".friend-call-hangup-icon");




let clickedDiv, messageData;
let hadHistoryMsg = false;
let hadGroupHistoryMsg = false;



isAddFriendCloseBtn.addEventListener("click", () => {
    isAddFriendPopup.style.display = "none";
});


//點擊建立群組的按鈕
addGroupBtn.addEventListener("click", () => {
    addGroupPopup.style.display = "block";
    getAllFriendList(true);
})

//點擊關閉建立群組的popup
closeGroupPopup.addEventListener("click", () => {
    const searchUser = document.querySelectorAll(".search-user");
    const hadAddUser = document.querySelectorAll(".had-add-user");
    searchUser.forEach(element => {
        element.remove();
    })
    hadAddUser.forEach(element => {
        element.remove();
    })
    addGroupPopup.style.display = "none";
})

//建立群組按鈕
createGroupBtn.addEventListener("click", () => {
    const hadAddUser = document.querySelectorAll(".had-add-user");
    let groupMemberIdArr = [];
    if (groupNameInput.value) {

        hadAddUser.forEach(element => {
            if (element.style.display === "flex") {
                groupMemberIdArr.push(parseInt(element.classList[1].replace("had-add-user", "")))
            }
        })
        //加上自己 
        groupMemberIdArr.push(parseInt(selfId.innerHTML))

        fetch("/create_group", {
            method: "POST",
            body: JSON.stringify({
                groupName: groupNameInput.value,
                groupMemberIdArr: groupMemberIdArr
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }

        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {

                if (data.status === "success") {
                    chatContainer.style.display = "block";
                    addGroupPopup.style.display = "none";
                    chatBoxFriendName.innerHTML = data.groupName;
                    friendChatId.innerHTML = data.groupId;
                    fetch("/api/get_grouplist")
                        .then((response) => {
                            return response.json();
                        })
                        .then((data) => {
                            createGroupList(data, groupList)
                        })
                }
            })
    }

})

grouopMemberPopupCloseBtn.addEventListener("click", () => {
    groupMemberPopup.style.display = "none";
    const groupMember = document.querySelectorAll(".group-member");
    groupMember.forEach(element => {
        element.remove();
    })
})

//通話功能///////////////////////////////////////////////////

let iceServers = {
    iceServers: [
        { urls: "stun:stun.services.mozilla.com", },
        { urls: "stun:stun.l.google.com:19302" },

    ],
};
let creator = false;
let peerConnection, userStream;
let roomName = "";
let seconds = 0;;
let minutes = 0;
let hours = 0;
let callSuccess = false;
const audioElement = new Audio();
const friendCallPopup = document.querySelector(".friend-call-popup");
const friendCallLoader = document.querySelector("#phone-call-loading");
const selfCallLoader = document.querySelector("#self-phone-call-loading");
const selfCallPopup = document.querySelector(".self-call-popup");
const selfCallHangup = document.querySelector(".self-call-hangup-icon");

//與好友通話 sender
friendPopupCall.addEventListener("click", () => {
    const selfCallNickname = document.querySelector(".self-call-popup-nickname");
    const selfCallHeadshot = document.querySelector(".self-call-popup-headshot");
    const friendPopupHeadshot = document.querySelector(".friend-popup-headshot");
    selfCallPopup.style.display = "block";
    selfCallHeadshot.src = friendPopupHeadshot.src;
    selfCallNickname.innerHTML = friendName.innerHTML;



    const package = {
        headshot: document.querySelector(".headshot").src,
        nickname: document.querySelector(".profile-name-content").innerHTML,
        userId: parseInt(selfId.innerHTML)
    }
    roomName = `${selfId.innerHTML}and${friendId.innerHTML}`;
    socket.emit("join", roomName, package);
    creator = true;
    // 获取麦克风的媒体流
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            console.log("sender", stream)
            userStream = stream;
        })
        .catch(error => console.error(error));

})



//reciver 對方接聽
socket.on("invite-join-call", (roomName, package, senderId) => {
    friendCallAcceptBtn.style.display = "block";
    roomName = roomName;
    friendCallHeadshot.src = package.headshot;
    friendCallNickname.innerHTML = package.nickname;
    friendCallPopup.style.display = "block";
    friendCallAcceptBtn.addEventListener("click", () => {
        socket.emit("recipient-join-room", roomName);
        creator = false;

        //撥打電話的計時器
        let timer = setInterval(phoneCallTimer, 1000);
        friendCallAcceptBtn.style.display = "none";
        friendCallLoader.style.display = "none";
        friendCallTimer[0].style.visibility = "visible";
        friendCallTimer[0].style.marginTop = "150px";
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then((stream) => {
                console.log("recipient", stream)
                userStream = stream;
                socket.emit("ready", roomName);
            })
            .catch(error => console.error(error));
    })


    recipientHangupCall.addEventListener("click", () => {
        if (!callSuccess) {
            friendCallPopup.style.display = "none";
            socket.emit("recipient-hangup-call", senderId)
        }
    })




})

//sender
socket.on("ready", () => {
    if (creator) {
        callSuccess = true;
        console.log(creator)
        const selfPopupHangup = document.querySelector(".self-call-hangup-icon-container");
        // selfPopupHangup.style.marginTop = "220px";
        selfCallLoader.style.display = "none";
        friendCallTimer[1].style.visibility = "visible";
        friendCallTimer[1].style.marginTop = "200px";
        let timer = setInterval(phoneCallTimer, 1000);
        peerConnection = new RTCPeerConnection(iceServers);
        peerConnection.oniceconnectionstatechange = onIceConnectionStateFunction;
        peerConnection.onicecandidate = (event) => {
            if (!event.candidate) {
                console.log("All ice candidates have been sent.");
                return;
            }
            onIceCandidateFunction(event, roomName);
        };
        peerConnection.ontrack = onTrackFunction;
        // peerConnection.addStream(userStream);
        userStream.getTracks().forEach((track) => {
            peerConnection.addTrack(track, userStream);
        });

        // 创建 offer
        peerConnection.createOffer()
            .then(offer => {
                peerConnection.setLocalDescription(offer);
                socket.emit("offer", offer, roomName);
            })
            .catch(error => console.error(error));

    }

})


socket.on("candidate", (candidate) => {
    let icecandidate = new RTCIceCandidate(candidate);
    peerConnection.addIceCandidate(icecandidate);
})

//reciver
socket.on("offer", (offer, roomName) => {

    if (!creator) {
        callSuccess = true;
        peerConnection = new RTCPeerConnection(iceServers);
        peerConnection.oniceconnectionstatechange = onIceConnectionStateFunction();
        peerConnection.onicecandidate = (event) => {
            if (!event.candidate) {
                console.log("All ice candidates have been sent.");
                return;
            }
            onIceCandidateFunction(event, roomName);
        };
        peerConnection.ontrack = onTrackFunction;
        // peerConnection.addStream(userStream);
        userStream.getTracks().forEach((track) => {
            peerConnection.addTrack(track, userStream);
        });

        peerConnection.setRemoteDescription(offer);
        // 创建 offer
        peerConnection.createAnswer()
            .then(answer => {
                peerConnection.setLocalDescription(answer);
                socket.emit("answer", answer, roomName);
            })
            .catch(error => console.error(error));



        //recipient掛掉電話
        const recipientHangupCall = document.querySelector(".friend-call-hangup-icon");
        recipientHangupCall.addEventListener("click", () => {
            if (callSuccess) {
                socket.emit("leave", roomName);

                if (audioElement.srcObject && userStream.getTracks().lenght != 0) {
                    console.log("sender,audio")
                    // audioElement.srcObject.getTracks().forEach(track => {
                    //     track.stop();
                    // })

                    userStream.getTracks().forEach(track => {
                        console.log("here1")
                        track.stop();
                    })
                    userStream = null;
                }
                if (peerConnection) {
                    peerConnection.ontrack = null;
                    peerConnection.onicecandidate = null;
                    peerConnection.close();
                    peerConnection = null;
                }

                friendCallPopup.style.display = "none";
                callSuccess = false;

            } else {
                friendCallPopup.style.display = "none";
            }






        })

    }
})

socket.on("hangup-call", () => {
    friendCallPopup.style.display = "none";
    selfCallPopup.style.display = "none";
    callSuccess = false;
})


recipientHangupCall.addEventListener("click", () => {
    if (!callSuccess) {
        friendCallPopup.style.display = "none";
    }
})

socket.on("answer", (answer) => {
    peerConnection.setRemoteDescription(answer);
})





function onIceCandidateFunction(event, roomName) {
    try {
        if (event.candidate) {
            socket.emit("candidate", event.candidate, roomName)
        }
    } catch (error) {
        console.error(error);
    }
}

function onTrackFunction(event) {
    console.log("here")
    try {
        if (event.track.kind === "audio") {
            console.log("success")
            audioElement.srcObject = event.streams[0];
            audioElement.onloadedmetadata = (e) => {
                audioElement.play();
            };
        } else {
            console.log("unsuccess")
        }
    } catch (error) {
        console.error(error);
    }

}

function onIceConnectionStateFunction(event) {
    console.log("Ice connection state: " + peerConnection.iceConnectionState);
    if (peerConnection.iceConnectionState === "failed") {
        console.error("ICE connection failed");
    }
}

function phoneCallTimer() {
    const friendCallTimerHour = document.querySelectorAll(".friend-call-hour");
    const friendCallTimerMinute = document.querySelectorAll(".friend-call-minute");
    const friendCallTimerSeconds = document.querySelectorAll(".friend-call-seconds");
    friendCallTimerSeconds[0].innerHTML = `&nbsp;${seconds}`;
    friendCallTimerSeconds[1].innerHTML = `&nbsp;${seconds}`;
    friendCallTimerMinute[0].innerHTML = `&nbsp;${minutes} : `;
    friendCallTimerMinute[1].innerHTML = `&nbsp;${minutes} : `;
    friendCallTimerHour[0].innerHTML = `&nbsp;${hours} : `;
    friendCallTimerHour[1].innerHTML = `&nbsp;${hours} : `;
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
    }
    if (minutes >= 60) {
        minutes = 0;
        hours++;
    }
}



//sender掛掉電話
selfCallHangup.addEventListener("click", () => {
    console.log("click")
    if (callSuccess) {

        socket.emit("leave", roomName);

        if (audioElement.srcObject && userStream.getTracks().lenght != 0) {
            console.log("sender,audio")
            // audioElement.srcObject.getTracks().forEach(track => {
            //     track.stop();
            // })

            userStream.getTracks().forEach(track => {
                console.log("here1")
                track.stop();
            })
            userStream = null;
        }
        if (peerConnection) {
            peerConnection.ontrack = null;
            peerConnection.onicecandidate = null;
            peerConnection.close();
            peerConnection = null;
        }
        seconds = 0;;
        minutes = 0;
        hours = 0;
        callSuccess = false;
        selfCallPopup.style.display = "none";
    } else {
        selfCallPopup.style.display = "none";
        socket.emit("hangup-call", roomName);
    }


})

socket.on("leave", () => {
    callSuccess = false;
    if (audioElement.srcObject) {
        console.log("recipiend,audio")
        // audioElement.srcObject.getTracks().forEach(track => {
        //     track.stop();
        // })

        userStream.getTracks().forEach(track => {
            console.log("here?")
            track.stop();
        })
        userStream = null;
    }
    if (peerConnection) {
        peerConnection.ontrack = null;
        peerConnection.onicecandidate = null;
        peerConnection.close();
        peerConnection = null;
    }
    selfCallPopup.style.display = "none";
    friendCallPopup.style.display = "none";
    seconds = 0;;
    minutes = 0;
    hours = 0;
})














//查看群組成員
groupMemberIcon.addEventListener("click", () => {
    groupMemberPopup.style.display = "block";
    fetch("/api/get_group_member", {
        method: "POST",
        body: JSON.stringify({
            groupId: friendChatId.innerHTML
        })
        , headers: {
            'Content-type': 'application/json; charset=UTF-8',
        }
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            data.data.forEach(element => {
                newDiv = document.createElement("div");
                newDiv.className = "group-member";
                groupMemberList.appendChild(newDiv);
                const groupMember = document.querySelectorAll(".group-member");

                newImg = document.createElement("img");
                newImg.src = element.headshot;
                newImg.style.width = "40px";
                newImg.style.height = "40px";
                newImg.style.borderRadius = "50px";
                newImg.style.objectFit = "cover";
                groupMember[groupMember.length - 1].appendChild(newImg);

                newP = document.createElement("p");
                newP.innerHTML = element.nickname;
                newP.style.marginLeft = "10px";
                groupMember[groupMember.length - 1].appendChild(newP);

                newDiv.addEventListener("click", () => {
                    if (element.member_id !== parseInt(selfId.innerHTML)) {
                        let friendPopupHeadshot = document.querySelector(".friend-popup-headshot");
                        friendPopupHeadshot.src = element.headshot;
                        friendPopup.style.display = "block";
                        friendName.innerHTML = element.nickname;
                        friendId.innerHTML = element.member_id;
                        if (element.is_friend === 0) {
                            groupMemberPopupAddFriend.style.display = "block";
                            popupChatBtn.style.display = "none";
                            friendPopupCall.style.display = "none";
                        } else {
                            groupMemberPopupAddFriend.style.display = "none";
                            popupChatBtn.style.display = "block";
                            friendPopupCall.style.display = "block";
                        }
                    }
                })

            })

        })
})

//點擊查看群組成員裡:加群組成員好友
groupMemberPopupAddFriend.addEventListener("click", () => {
    fetch("/add_friend", {
        method: "POST",
        body: JSON.stringify({
            friend_id: parseInt(friendId.innerHTML)
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
                groupMemberPopupAddFriend.style.display = "none";
                popupChatBtn.style.display = "block";
                friendPopupCall.style.display = "block";

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
                    createFriendList(data, friendList);
                })
        })
})

//陌生訊息裡面:是否要加好友按鈕
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
                    createFriendList(data, friendList);
                })
        })
})

function createGroupChatList(data) {
    let count = 0;
    data.forEach(element => {
        hadGroupHistoryMsg = true;

        let senderIsMe;
        if (parseInt(selfId.innerHTML) === element.sender_id) {
            senderIsMe = true;
        } else {
            senderIsMe = false;
        }
        newDiv = document.createElement("div");
        newDiv.className = "chat-group-list";
        groupChatListContainer.appendChild(newDiv);
        let chatGroupList = document.querySelectorAll(".chat-group-list");

        newImg = document.createElement("img");
        newImg.src = element.group_headshot;
        newImg.style.width = "100px";
        newImg.style.height = "100px";
        newImg.style.objectFit = "cover";
        newImg.style.borderRadius = "50px";
        chatGroupList[count].appendChild(newImg);

        newDiv = document.createElement("div");
        newDiv.className = "chat-group-list-right";
        chatGroupList[count].appendChild(newDiv);
        let rightGroupChatList = document.querySelectorAll(".chat-group-list-right");

        newP = document.createElement("p");
        newP.innerHTML = element.group_name;
        newP.style.fontSize = "30px";
        newP.style.fontWeight = "bolder";
        newP.style.marginTop = "10px";
        newP.style.marginLeft = "10px";
        rightGroupChatList[count].appendChild(newP);

        newP = document.createElement("p");
        newP.innerHTML = element.message;
        newP.dataset.attributeName = `${element.group_id}`;
        newP.className = "group-message";
        newP.style.fontSize = "15px";
        newP.style.marginTop = "20px";
        newP.style.marginLeft = "10px";
        newP.style.fontWeight = "bolder";
        newP.style.color = "gray";
        rightGroupChatList[count].appendChild(newP);


        if (element.is_read === 0 && element.sender_id !== parseInt(selfId.innerHTML)) {
            newImg = document.createElement("img");
            newImg.src = "./images/new-message.png";
            newImg.className = "new-message-icon";
            newImg.style.width = "50px";
            newImg.style.position = "absolute";
            newImg.style.right = "5px";
            newImg.style.top = "0px";
            rightGroupChatList[count].appendChild(newImg);
        }

        chatGroupList[count].addEventListener("click", (event) => {
            const clickedElement = event.target;
            clickedDiv = clickedElement.closest("div");
            if (clickedDiv.className === "chat-group-list-right") {
                clickedDiv = clickedDiv.parentNode;
            }

            //移除新訊息的icon
            let clickedDivNewMessageIcon = clickedDiv.querySelector('.new-message-icon');
            if (clickedDivNewMessageIcon) {
                clickedDivNewMessageIcon.parentNode.removeChild(clickedDivNewMessageIcon);
            }

            chatContainer.style.display = "block"
            chatBoxFriendName.innerHTML = element.group_name;
            friendChatId.innerHTML = element.group_id;
            const isGroup = isNaN(friendChatId.innerHTML);

            if (isGroup) {
                groupMemberIcon.style.display = "block";
            }
            if (senderIsMe) {
                fetch("/api/get_message", {
                    method: "POST",
                    body: JSON.stringify({
                        myId: selfId.innerHTML,
                        friendId: friendChatId.innerHTML,
                        isGroup: isGroup
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
                                displayMessage(element, true, element.read_count, true);
                            } else {
                                displayMessage(element, false, element.read_count, true);
                            }
                        })


                        let groupIsReadStatus = document.querySelector(".group-read-status");
                        groupIsReadStatus.innerHTML = `${data.message[0].read_count}人已讀`;
                        const package = {
                            group_id: friendChatId.innerHTML,
                            self_id: parseInt(selfId.innerHTML)
                        }
                        messageData = data;
                        //如果是自己傳的就不需要更新已讀狀態
                        if (!(data.message[data.message.length - 1].sender_id === parseInt(selfId.innerHTML))) {

                            fetch("/update_group_message_status", {
                                method: "POST",
                                body: JSON.stringify({
                                    groupId: friendChatId.innerHTML,
                                    isReadMemberId: parseInt(selfId.innerHTML)
                                })
                                , headers: {
                                    'Content-type': 'application/json; charset=UTF-8',
                                }
                            })
                                .then((response) => {
                                    return response.json();
                                })
                                .then((data) => {
                                    socket.emit('group-read-message', package);
                                })
                        }


                    })
            } else {
                fetch("/api/get_message", {
                    method: "POST",
                    body: JSON.stringify({
                        myId: selfId.innerHTML,
                        friendId: friendChatId.innerHTML,
                        isGroup: isGroup
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
                                displayMessage(element, true, element.is_read, true);
                            } else {
                                displayMessage(element, false, element.is_read, true);
                            }

                        })

                        const package = {
                            group_id: friendChatId.innerHTML,
                            self_id: parseInt(selfId.innerHTML)
                        }


                        let groupIsReadStatus = document.querySelector(".group-read-status");
                        groupIsReadStatus.innerHTML = `${data.message[0].read_count}人已讀`;
                        if (!(data.message[data.message.length - 1].sender_id === parseInt(selfId.innerHTML))) {
                            fetch("/update_group_message_status", {
                                method: "POST",
                                body: JSON.stringify({
                                    groupId: friendChatId.innerHTML,
                                    isReadMemberId: parseInt(selfId.innerHTML)
                                })
                                , headers: {
                                    'Content-type': 'application/json; charset=UTF-8',
                                }
                            })
                                .then((response) => {
                                    return response.json();
                                })
                                .then((data) => {
                                    socket.emit('group-read-message', package);
                                })
                        }


                    })
            }

        })


        count++;
    })
}


function createChatList(data, container) {
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
        container.appendChild(newDiv);
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
            if (clickedDivNewMessageIcon) {
                clickedDivNewMessageIcon.parentNode.removeChild(clickedDivNewMessageIcon);
            }

            //跳出是否要加陌生人好友
            if (clickedDiv.querySelector(".stranger-icon") || event.target.className === "stranger-icon") {
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
            const isGroup = isNaN(friendChatId.innerHTML);
            if (senderIsMe) {
                fetch("/api/get_message", {
                    method: "POST",
                    body: JSON.stringify({
                        "myId": selfId.innerHTML,
                        "friendId": element.recipient_id,
                        isGroup: isGroup
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
                                displayMessage(element, true, element.is_read);
                            } else {
                                displayMessage(element, false, element.is_read);
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
                        "friendId": element.sender_id,
                        isGroup: isGroup
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
                                displayMessage(element, true, element.is_read);
                            } else {
                                displayMessage(element, false, element.is_read);
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

function getAllFriendList(isAddMemberContainer) {
    fetch("/api/get_friendlist")
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            if (data.status === "success") {
                let count = 0;
                data.friend_list.forEach(element => {
                    newDiv = document.createElement("div");
                    newDiv.classList.add("search-user", `search-user${element.user_id}`);
                    addGroupFriendList.appendChild(newDiv);
                    let searchUser = document.querySelectorAll(".search-user");

                    newImg = document.createElement("img");
                    newImg.src = element.headshot;
                    newImg.style.width = "40px";
                    newImg.style.height = "40px";
                    newImg.style.objectFit = "cover";
                    newImg.style.borderRadius = "50px";
                    searchUser[count].appendChild(newImg);

                    newP = document.createElement("p");
                    newP.innerHTML = element.nickname;
                    newP.className = "search-user-name";
                    searchUser[count].appendChild(newP);

                    newImg = document.createElement("img");
                    newImg.src = "./images/add-button.png";
                    newImg.className = "add-member-btn";
                    searchUser[count].appendChild(newImg);
                    newImg.addEventListener("click", () => {
                        let searchUser = document.querySelector(`.search-user${element.user_id}`);
                        searchUser.style.display = "none";
                        let groupMember = document.querySelector(`.had-add-user${element.user_id}`);
                        groupMember.style.display = "block";
                        groupMember.style.display = "flex";
                    })

                    //////////////////////////////////////////////
                    if (isAddMemberContainer) {
                        newDiv = document.createElement("div");
                        newDiv.classList.add("had-add-user", `had-add-user${element.user_id}`);
                        newDiv.style.display = "none";
                        hadAddMemberList.appendChild(newDiv);
                        let hadAddUser = document.querySelectorAll(".had-add-user");

                        newImg = document.createElement("img");
                        newImg.src = element.headshot;
                        newImg.style.width = "40px";
                        newImg.style.height = "40px";
                        newImg.style.objectFit = "cover";
                        newImg.style.borderRadius = "50px";
                        hadAddUser[count].appendChild(newImg);

                        newP = document.createElement("p");
                        newP.innerHTML = element.nickname;
                        newP.className = "search-user-name";
                        hadAddUser[count].appendChild(newP);

                        newImg = document.createElement("img");
                        newImg.src = "./images/remove.png";
                        newImg.className = "remove-member-btn";
                        hadAddUser[count].appendChild(newImg);
                        newImg.addEventListener("click", () => {
                            let groupMember = document.querySelector(`.had-add-user${element.user_id}`);
                            groupMember.style.display = "none";
                            let searchUser = document.querySelector(`.search-user${element.user_id}`);
                            searchUser.style.display = "block";
                            searchUser.style.display = "flex";
                        })
                    }



                    count++;
                })
            }
        })
}
