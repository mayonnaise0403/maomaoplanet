

//  { urls: "stun:stun.services.mozilla.com" },

let iceServers = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" }

    ],
};
let creator = false;
let peerConnection, userStream;
let roomName = "";
let seconds = 0;;
let minutes = 0;
let hours = 0;
let timer;
let callSuccess = false;
const audioElement = new Audio();

const friendCallPopup = document.querySelector(".friend-call-popup");
const friendCallLoader = document.querySelector("#phone-call-loading");
const selfCallLoader = document.querySelector("#self-phone-call-loading");
const selfCallPopup = document.querySelector(".self-call-popup");
const selfCallHangup = document.querySelector(".self-call-hangup-icon");
const groupCallMemberData = document.querySelector(".group-call-member-data");
const groupCallAcceptBtn = document.querySelector(".group-call-accept-btn");
const groupCallRejectBtn = document.querySelector(".group-call-reject-btn");
const selfCallTime = document.querySelector(".self-call-timer");
const friendCallTime = document.querySelector(".friend-call-timer");
const friendCallTimerHour = document.querySelector(".friend-call-hour");
const friendCallTimerMinute = document.querySelector(".friend-call-minute");
const friendCallTimerSeconds = document.querySelector(".friend-call-seconds");
const selfCallTimerHour = document.querySelector(".self-call-hour");
const selfCallTimerMinute = document.querySelector(".self-call-minute");
const selfCallTimerSeconds = document.querySelector(".self-call-seconds");
const selfCallNickname = document.querySelector(".self-call-popup-nickname");
const selfCallHeadshot = document.querySelector(".self-call-popup-headshot");
const friendPopupHeadshot = document.querySelector(".friend-popup-headshot");
const phoneCallIcon = document.querySelector(".phone-call-icon");
let peerId, localStream, groupMemberArr = [], groupCallId;
let groupCallSuccess = false;
let groupRecipientCalled = false;
let groupHost = false;
let thePeers = {};
// let remoteStreamArr = [];

let myPeer = new Peer({
    host: "0.peerjs.com",
    port: 443,
    path: "/",
    pingInterval: 5000,
});

myPeer.on('open', (name) => {
    peerId = name;
    console.log(peerId)
});


phoneCallIcon.addEventListener("click", () => {
    groupMemberArr = [];
    const isGroup = isNaN(friendChatId);
    if (!callSuccess && !groupCallSuccess && !groupRecipientCalled) {
        if (isGroup) {
            if (peerId) {
                groupCallPopUp.style.display = "block";
                friendPopup.style.display = "none";
                groupCallAcceptBtn.style.display = "none";
                fetch("/api/get_group_member", {
                    method: "POST",
                    body: JSON.stringify({
                        groupId: friendChatId
                    })
                    , headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    }
                })
                    .then((response) => {
                        return response.json();
                    })
                    .then((data) => {
                        if (data.status === "error") {
                            errorMessage.style.display = "block";
                            errorMessage.innerHTML = data.message;
                            setTimeout(() => {
                                errorMessage.style.display = "none";
                            }, 3000)
                        } else {
                            data.data.forEach(element => {
                                newDiv = document.createElement("div");
                                newDiv.className = "group-call-member";
                                groupCallMemberData.appendChild(newDiv);
                                let groupCallMember = document.querySelectorAll(".group-call-member");

                                newImg = document.createElement("img");
                                newImg.src = element.headshot;
                                newImg.style.width = "100px";
                                newImg.style.height = "100px";
                                newImg.style.objectFit = "cover";
                                newImg.style.borderRadius = "200px";
                                newImg.style.border = "2px solid black";
                                groupCallMember[groupCallMember.length - 1].appendChild(newImg);

                                newP = document.createElement("p");
                                newP.innerHTML = element.nickname;
                                newP.style.textAlign = "center";
                                newP.style.fontSize = "20px";
                                newP.style.fontWeight = "bolder";
                                newP.style.marginTop = "10px";
                                newP.style.width = "100%";
                                groupCallMember[groupCallMember.length - 1].appendChild(newP);

                                if (parseInt(element.member_id) !== parseInt(selfId)) {
                                    groupMemberArr.push(element.member_id);
                                }
                                newImg = document.createElement("img");
                                newImg.style.width = "40px";
                                newImg.className = `loading${element.member_id}`;
                                newImg.src = "./images/Ellipsis-1s-72px.gif";
                                groupCallMember[groupCallMember.length - 1].appendChild(newImg);

                            })
                            const myLoading = document.querySelector(`.loading${selfId}`);
                            myLoading.src = "./images/check (1).png";
                            myLoading.style.width = "40px";
                            groupId = friendChatId

                            // if (!peerConnection) {
                            //     peerConnection = new RTCPeerConnection(iceServers);
                            // }

                            socket.emit("join-group-call", groupId, peerId);
                            groupCallSuccess = true;
                            groupHost = true;
                        }
                    })

            }

            creator = true;
            groupHost = true;
            // 获取麦克风的媒体流
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    userStream = stream;
                    if (isGroup && peerId) {
                        myPeer.on("call", call => {
                            call.answer(stream);
                            call.on("stream", userAudioStream => {
                                const audioElement = new Audio();
                                audioElement.className = `audio-${call.peer}`;
                                console.log("成員的id")
                                console.log(call.peer)

                                addAudioStream(audioElement, userAudioStream);
                                // remoteStreamArr.push(audioElement);
                                socket.emit('user-connected', friendChatId, call.peer)
                            })
                            connectToNewUser(call.peer, userAudioStream)
                        })
                    }
                    localStream = stream;
                })
                .catch(error => console.error(error));

        } else {
            if (peerId) {
                fetch("check_friend_status", {
                    method: "POST",
                    body: JSON.stringify({
                        friendId: friendChatId
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
                            selfCallNickname.style.marginBottom = "0px";
                            friendPopup.style.display = "none";
                            selfCallTime.style.display = "none";
                            selfCallPopup.style.display = "block";
                            selfCallHeadshot.src = document.querySelector(`.user${friendChatId}-message`).parentNode.parentNode.querySelector("img").src;
                            selfCallNickname.innerHTML = chatBoxFriendName.innerHTML;
                            selfCallLoader.style.display = "block";
                            const package = {
                                headshot: document.querySelector(".headshot").src,
                                nickname: document.querySelector(".profile-name-content").innerHTML,
                                userId: parseInt(selfId)
                            }
                            roomName = `${selfId}and${friendChatId}`;
                            socket.emit("join", roomName, package, peerId);
                            creator = true;
                            // 获取麦克风的媒体流
                            navigator.mediaDevices.getUserMedia({ audio: true })
                                .then(stream => {
                                    userStream = stream;

                                    myPeer.on("call", call => {
                                        call.answer(stream);
                                        call.on("stream", userAudioStream => {
                                            const audioElement = new Audio();
                                            audioElement.className = `audio-${call.peer}`;

                                            addAudioStream(audioElement, userAudioStream);
                                            // remoteStreamArr.push(audioElement);

                                        })

                                    })
                                    connectToNewUser(call.peer, stream)

                                    localStream = stream;
                                })
                                .catch(error => console.error(error));

                        } else {
                            errorMessage.style.display = "block";
                            errorMessage.innerHTML = data.message;
                            setTimeout(() => {
                                errorMessage.style.display = "none";
                            }, 3000)
                        }
                    })

            }
        }

    } else {
        console.log("calling")
    }

})


//與好友通話 sender
friendPopupCall.addEventListener("click", () => {
    groupMemberArr = [];
    const isGroup = isNaN(friendId);
    if (!callSuccess && !groupCallSuccess && !groupRecipientCalled) {
        if (isGroup) {
            if (peerId) {
                groupCallPopUp.style.display = "block";
                friendPopup.style.display = "none";
                groupCallAcceptBtn.style.display = "none";
                fetch("/api/get_group_member", {
                    method: "POST",
                    body: JSON.stringify({
                        groupId: friendId
                    })
                    , headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    }
                })
                    .then((response) => {
                        return response.json();
                    })
                    .then((data) => {
                        if (data.statu === "error") {
                            errorMessage.style.display = "block";
                            errorMessage.innerHTML = data.message;
                            setTimeout(() => {
                                errorMessage.style.display = "none";
                            }, 3000)
                        } else {
                            data.data.forEach(element => {
                                newDiv = document.createElement("div");
                                newDiv.className = "group-call-member";
                                groupCallMemberData.appendChild(newDiv);
                                let groupCallMember = document.querySelectorAll(".group-call-member");


                                newImg = document.createElement("img");
                                newImg.src = element.headshot;
                                newImg.style.width = "100px";
                                newImg.style.height = "100px";
                                newImg.style.objectFit = "cover";
                                newImg.style.borderRadius = "200px";
                                newImg.style.border = "2px solid black";
                                groupCallMember[groupCallMember.length - 1].appendChild(newImg);


                                newP = document.createElement("p");
                                newP.innerHTML = element.nickname;
                                newP.style.textAlign = "center";
                                newP.style.fontSize = "20px";
                                newP.style.fontWeight = "bolder";
                                newP.style.marginTop = "10px";
                                newP.style.width = "100%";
                                groupCallMember[groupCallMember.length - 1].appendChild(newP);

                                if (parseInt(element.member_id) !== parseInt(selfId)) {
                                    groupMemberArr.push(element.member_id);
                                }
                                newImg = document.createElement("img");
                                newImg.style.width = "40px";
                                newImg.className = `loading${element.member_id}`;
                                newImg.src = "./images/Ellipsis-1s-72px.gif";
                                groupCallMember[groupCallMember.length - 1].appendChild(newImg);

                            })
                            const myLoading = document.querySelector(`.loading${selfId}`);
                            myLoading.src = "./images/check (1).png";
                            myLoading.style.width = "40px";
                            groupId = friendId

                            // if (!peerConnection) {
                            //     peerConnection = new RTCPeerConnection(iceServers);
                            // }

                            socket.emit("join-group-call", groupId, peerId);
                            groupCallSuccess = true;

                        }
                    })

            }
            groupHost = true;
            creator = true;
            // 获取麦克风的媒体流
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    userStream = stream;
                    if (isGroup && peerId) {
                        myPeer.on("call", call => {
                            call.answer(stream);
                            call.on("stream", userAudioStream => {
                                const audioElement = new Audio();
                                audioElement.className = `audio-${call.peer}`;
                                console.log("成員的id")
                                console.log(call.peer)
                                // connectToNewUser(call.peer, userAudioStream)
                                addAudioStream(audioElement, userAudioStream);
                                // remoteStreamArr.push(audioElement)
                                socket.emit('user-connected', friendId, call.peer)
                            })

                            connectToNewUser(call.peer, stream)
                        })
                    }
                    localStream = stream;
                })
                .catch(error => console.error(error));

        } else {
            if (peerId) {
                fetch("check_friend_status", {
                    method: "POST",
                    body: JSON.stringify({
                        friendId: friendId
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
                            selfCallNickname.style.marginBottom = "0px";
                            friendPopup.style.display = "none";
                            selfCallTime.style.display = "none";
                            selfCallPopup.style.display = "block";
                            selfCallHeadshot.src = friendPopupHeadshot.src;
                            selfCallNickname.innerHTML = friendName.innerHTML;
                            selfCallLoader.style.display = "block";
                            const package = {
                                headshot: document.querySelector(".headshot").src,
                                nickname: document.querySelector(".profile-name-content").innerHTML,
                                userId: parseInt(selfId)
                            }
                            roomName = `${selfId}and${friendId}`;
                            socket.emit("join", roomName, package, peerId);
                            creator = true;
                            // 获取麦克风的媒体流
                            navigator.mediaDevices.getUserMedia({
                                audio: {
                                    echoCancellation: true,
                                }
                            })
                                .then(stream => {
                                    userStream = stream;

                                    myPeer.on("call", call => {
                                        call.answer(stream);


                                        call.on("stream", userAudioStream => {
                                            const audioElement = new Audio();
                                            audioElement.className = `audio-${call.peer}`;
                                            console.log("成員的id")
                                            console.log(call.peer)
                                            addAudioStream(audioElement, userAudioStream);
                                            // remoteStreamArr.push(audioElement);
                                            userAudioStream.getAudioTracks()[0].enabled = false;
                                        })
                                        connectToNewUser(call.peer, stream)
                                    })


                                })
                                .catch(error => console.error(error));

                        } else {
                            errorMessage.style.display = "block";
                            errorMessage.innerHTML = data.message;
                            setTimeout(() => {
                                errorMessage.style.display = "none";
                            }, 3000)
                        }
                    })

            }
        }

    } else {
        console.log("calling")
    }
})



socket.on("group-accept-call-member", (acceptMemberId) => {
    const acceptMemberLoading = document.querySelector(`.loading${acceptMemberId}`);
    if (acceptMemberLoading) {
        acceptMemberLoading.src = "./images/check (1).png";
        acceptMemberLoading.style.width = "40px";
    }
})
let hostPeerId;
//群組對方接聽
socket.on("invite-join-group-call", (groupId, senderId, hostPeerId) => {
    groupMemberArr = [];
    if (!callSuccess && !groupCallSuccess && !groupRecipientCalled) {
        groupRecipientCalled = true;
        groupCallId = groupId;
        groupCallPopUp.style.display = "block";
        friendPopup.style.display = "none";
        fetch("/api/get_group_member", {
            method: "POST",
            body: JSON.stringify({
                groupId: groupId
            })
            , headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                if (data.statu === "error") {
                    errorMessage.style.display = "block";
                    errorMessage.innerHTML = data.message;
                    setTimeout(() => {
                        errorMessage.style.display = "none";
                    }, 3000)
                } else {
                    data.data.forEach(element => {
                        newDiv = document.createElement("div");
                        newDiv.className = "group-call-member";
                        groupCallMemberData.appendChild(newDiv);
                        let groupCallMember = document.querySelectorAll(".group-call-member");

                        newImg = document.createElement("img");
                        newImg.src = element.headshot;
                        newImg.style.width = "100px";
                        newImg.style.height = "100px";
                        newImg.style.objectFit = "cover";
                        newImg.style.borderRadius = "200px";
                        newImg.style.border = "2px solid black";
                        groupCallMember[groupCallMember.length - 1].appendChild(newImg);


                        newP = document.createElement("p");
                        newP.innerHTML = element.nickname;
                        newP.style.textAlign = "center";
                        newP.style.fontSize = "20px";
                        newP.style.fontWeight = "bolder";
                        newP.style.marginTop = "10px";
                        newP.style.width = "100%";
                        groupCallMember[groupCallMember.length - 1].appendChild(newP);

                        newImg = document.createElement("img");
                        if (parseInt(element.member_id) !== parseInt(selfId)) {
                            groupMemberArr.push(element.member_id);
                        }

                        if (element.member_id == senderId) {
                            newImg.src = "./images/check (1).png";
                            newImg.className = `loading${element.member_id}`;
                            newImg.style.width = "40px";
                        } else {
                            newImg.className = `loading${element.member_id}`;
                            newImg.src = "./images/Ellipsis-1s-72px.gif";
                        }
                        groupCallMember[groupCallMember.length - 1].appendChild(newImg);

                    })
                    groupCallAcceptBtn.style.display = "block";
                }
            })
            .then(() => {
                //接受通話
                socket.off('user-connected');
                groupCallAcceptBtn.addEventListener("click", function acceptGroupCall() {

                    groupCallSuccess = true;
                    groupRecipientCalled = false;
                    groupCallAcceptBtn.style.display = "none";
                    socket.emit("accept-group-call", groupId, peerId);
                    const myLoading = document.querySelector(`.loading${selfId}`);
                    myLoading.src = "./images/check (1).png";
                    myLoading.style.width = "40px";
                    socket.emit("group-accept-call-member", groupId);
                    navigator.mediaDevices.getUserMedia({ audio: true })
                        .then((stream) => {
                            myPeer.on("call", call => {
                                call.answer(stream);
                                call.on("stream", userAudioStream => {
                                    const audioElement = new Audio();
                                    audioElement.className = `audio-${call.peer}`;
                                    addAudioStream(audioElement, userAudioStream);
                                    console.log("成員的id")
                                    console.log(call.peer)
                                    // 將自己的音軌 muted
                                    // userAudioStream.getAudioTracks()[0].enabled = false;
                                })

                            })
                            userStream = stream;
                            connectToNewUser(hostPeerId, stream)
                            hostPeerId = hostPeerId;
                            localStream = stream;

                            socket.on('user-connected', userId => {
                                if (userId !== peerId && !thePeers.hasOwnProperty(userId)) {
                                    console.log(userId)
                                    connectToNewUser(userId, stream)

                                }

                            })

                        })
                        .catch(error => console.error(error));

                    groupCallAcceptBtn.removeEventListener("click", acceptGroupCall);

                })
            })
    }

})

function connectToNewUser(peerId, stream) {
    const call = myPeer.call(peerId, stream);

    call.on("stream", userAudioStream => {
        const audioElement = new Audio();
        audioElement.className = `audio-${peerId}`;
        addAudioStream(audioElement, userAudioStream);

    })
    call.on('close', () => {
        audioElement.remove()
    })
    thePeers[peerId] = call
}

function addAudioStream(audio, stream) {
    audio.srcObject = stream;
    document.body.appendChild(audio)
    audio.onloadedmetadata = () => {
        audio.play();
    };

}




//掛掉電話
groupCallRejectBtn.addEventListener("click", () => {

    groupRecipientCalled = false;
    groupCallPopUp.style.display = "none";
    if (groupCallSuccess) {
        if (Object.keys(thePeers).length === 0) {
            socket.emit("group-hangup", groupMemberArr);
            groupMemberArr = [];
        }
        // if (userStream) {
        //     if (userStream.getTracks()) {
        //         userStream.getTracks().forEach(track => track.stop());
        //         audioElement.srcObject = null;
        //         userStream = null;
        //     }
        // }

        if (localStream) {
            if (localStream.getTracks()) {
                localStream.getTracks().forEach(track => track.stop());
                audioElement.srcObject = null;
                localStream = null;
            }
        }


        // for (const peerId in thePeers) {
        //     if (thePeers.hasOwnProperty(peerId)) {
        //         const call = thePeers[peerId];
        //         if (call) {
        //             console.log("關閉連接")
        //             call.close();

        //         }
        //     }
        // }
        for (const peerId in myPeer.connections) {
            myPeer.connections[peerId].forEach(conn => conn.close());
        }



        // remoteStreamArr.forEach(element => {
        //     element.pause();
        //     element.remove();
        // })

        // remoteStreamArr.forEach(element => {
        //     const audios = document.getElementsByClassName(element.className);
        //     for (let i = 0; i < audios.length; i++) {
        //         if (audios[i].srcObject) {
        //             const tracks = audios[i].srcObject.getTracks();
        //             console.log("tracktrack")
        //             tracks.forEach((track) => track.stop());
        //         }
        //     }
        // })

        const audioElements = document.querySelectorAll("audio");
        audioElements.forEach((audioElement) => {
            if (audioElement.srcObject) {
                const tracks = audioElement.srcObject.getTracks();
                tracks.forEach((track) => track.stop());
            }
            audioElement.pause();
            audioElement.srcObject = null;
            audioElement.remove();
        });


        socket.emit("group-leave", peerId);


        // if (Object.keys(thePeers).length !== 0) {
        //     socket.emit("group-leave", peerId);
        // } else {
        //     socket.emit("host-leave", friendId, groupMemberArr)
        // }


        myPeer.destroy();
        peerId = null;
        myPeer = new Peer({
            host: "0.peerjs.com",
            port: 443,
            path: "/",
            pingInterval: 5000,
        });

        myPeer.on('open', (name) => {
            peerId = name;
            console.log(peerId)
        });
        groupCallSuccess = false;
        thePeers = {};
        groupMemberArr = [];
        groupHost = false;
    } else {
        socket.emit("group-hangup", groupMemberArr);
        groupMemberArr = [];
    }
    while (groupCallMemberData.firstChild) {
        groupCallMemberData.removeChild(groupCallMemberData.firstChild);
    }


})

// socket.on("host-leave", (groupId) => {

//     groupRecipientCalled = false;
//     if (groupCallId === groupId) {
//         groupCallPopUp.style.display = "none";
//         while (groupCallMemberData.firstChild) {
//             groupCallMemberData.removeChild(groupCallMemberData.firstChild);
//         }
//     }
// })

socket.on("group-hangup", (selfId) => {
    console.log("hihihhhi")
    const myStatus = document.querySelector(`.loading${selfId}`);
    if (myStatus) {
        myStatus.src = "./images/cancel (1).png";
        myStatus.style.width = "40px";
    }

})

// socket.on("select-new-host", (newPeerId) => {
//     if (newPeerId !== peerId) {
//         connectToNewUser(newPeerId, localStream);
//         console.log(thePeers)
//     }

// })

socket.on("group-leave", (selfId, leavePeerId) => {
    if (thePeers[leavePeerId]) thePeers[leavePeerId].close()
    // const connections = myPeer.connections[leavePeerId];
    // if (connections) {
    //     connections.forEach(connection => {
    //         if (connection.open) {
    //             connection.close();
    //             delete thePeers[leavePeerId];
    //         }
    //     });
    // }


    const myStatus = document.querySelector(`.loading${selfId}`);
    myStatus.src = "./images/cancel (1).png";
    myStatus.style.width = "40px";

})



//reciver 對方接聽
socket.on("invite-join-call", (roomName, package, senderId, peerId) => {
    if (!callSuccess && !groupCallSuccess && !groupRecipientCalled) {
        friendCallNickname.style.marginBottom = "0px";
        friendCallTime.style.display = "none";
        friendCallAcceptBtn.style.display = "block";
        friendCallLoader.style.display = "block";
        friendCallHeadshot.src = package.headshot;
        friendCallNickname.innerHTML = package.nickname;
        friendCallPopup.style.display = "block";
        friendCallAcceptBtn.addEventListener("click", function acceptSingleCall() {
            friendCallNickname.style.marginBottom = "100px";
            socket.emit("recipient-join-room", roomName);
            creator = false;
            friendCallAcceptBtn.style.display = "none";
            friendCallLoader.style.display = "none";
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then((stream) => {
                    myPeer.on("call", call => {

                        call.answer(stream);
                        call.on("stream", userAudioStream => {
                            const audioElement = new Audio();
                            audioElement.className = `audio-${call.peer}`;
                            addAudioStream(audioElement, userAudioStream)
                        })
                    })
                    userStream = stream;
                    connectToNewUser(peerId, stream)
                    friendCallAcceptBtn.removeEventListener("click", acceptSingleCall);
                    localStream = stream;
                    socket.emit("ready", roomName);
                })
                .catch(error => console.log(error));
        })

        recipientHangupCall.addEventListener("click", () => {
            if (!callSuccess) {
                friendCallPopup.style.display = "none";
                socket.emit("recipient-hangup-call", senderId)
            }
        })
    }
})

//sender
socket.on("ready", async () => {
    if (creator) {
        selfCallNickname.style.marginBottom = "100px";
        seconds = 0;
        minutes = 0;
        hours = 0;
        selfCallTimerSeconds.innerHTML = `&nbsp;${seconds}`;
        selfCallTimerMinute.innerHTML = `&nbsp;${minutes} : `;
        selfCallTimerHour.innerHTML = `&nbsp;${hours} : `;
        setTimeout(() => {
            selfCallTime.style.display = "flex";
        }, 1000)

        callSuccess = true;
        console.log(creator)
        const selfPopupHangup = document.querySelector(".self-call-hangup-icon-container");
        selfCallLoader.style.display = "none";

        clearInterval(timer);
        timer = setInterval(selfPhoneCallTimer, 1000);
        socket.emit("offer", roomName);
    }

})


//reciver
socket.on("offer", (roomName) => {
    console.log(roomName);
    if (!creator) {
        seconds = 0;
        minutes = 0;
        hours = 0;
        friendCallTimerSeconds.innerHTML = `&nbsp;${0}`;
        friendCallTimerMinute.innerHTML = `&nbsp;${0} : `;
        friendCallTimerHour.innerHTML = `&nbsp;${0} : `;
        setTimeout(() => {
            friendCallTime.style.display = "flex";
        }, 1000)

        clearInterval(timer);
        //撥打電話的計時器
        timer = setInterval(phoneCallTimer, 1000);
        callSuccess = true;


        //recipient掛掉電話
        recipientHangupCall.addEventListener("click", function recipientHangup() {
            document.querySelector(".friend-call-image-icon").style.display = "none";
            document.querySelector(".self-call-icon").style.display = "none";
            if (callSuccess) {
                socket.emit("leave", roomName, peerId);

                seconds = 0;
                minutes = 0;
                hours = 0;
                clearInterval(timer);
                friendCallTime.style.display = "none";
                friendCallPopup.style.display = "none";
                callSuccess = false;
                if (userStream) {
                    if (userStream.getTracks()) {
                        userStream.getTracks().forEach(track => track.stop());
                        audioElement.srcObject = null;
                        userStream = null;
                    }
                }

                if (localStream) {
                    if (localStream.getTracks()) {
                        localStream.getTracks().forEach(track => track.stop());
                        audioElement.srcObject = null;
                        localStream = null;
                    }
                }


                for (const peerId in thePeers) {
                    if (thePeers.hasOwnProperty(peerId)) {
                        const call = thePeers[peerId];
                        if (call) {
                            call.close();

                        }
                    }
                }

                // remoteStreamArr.forEach(element => {
                //     element.pause();
                //     element.remove();
                // })

                // remoteStreamArr.forEach(element => {
                //     const audios = document.getElementsByClassName(element.className);
                //     for (let i = 0; i < audios.length; i++) {
                //         if (audios[i].srcObject) {
                //             const tracks = audios[i].srcObject.getTracks();
                //             console.log("tracktrack")
                //             tracks.forEach((track) => track.stop());
                //         }
                //     }
                // })
                const audios = document.querySelectorAll("audio");
                console.log(audios)
                audios.forEach((audio) => {
                    audio.pause();
                });
                // roomName = "";
                myPeer.destroy();
                peerId = null;
                myPeer = new Peer({
                    host: "0.peerjs.com",
                    port: 443,
                    path: "/",
                    pingInterval: 5000,
                });

                myPeer.on('open', (name) => {
                    peerId = name;
                    console.log(peerId)
                });
                groupCallSuccess = false;
                thePeers = {};
                groupMemberArr = [];


            } else {
                friendCallPopup.style.display = "none";
            }
            recipientHangupCall.removeEventListener("click", recipientHangup)
        })
    }

})



socket.on("hangup-call", () => {
    document.querySelector(".friend-call-image-icon").style.display = "none";
    document.querySelector(".self-call-icon").style.display = "none";
    if (!callSuccess && !groupCallSuccess && !groupRecipientCalled) {
        friendCallPopup.style.display = "none";
        selfCallPopup.style.display = "none";
        callSuccess = false;
    }

})


recipientHangupCall.addEventListener("click", () => {
    if (!callSuccess) {
        friendCallPopup.style.display = "none";
    }
})





function phoneCallTimer() {

    friendCallTimerSeconds.innerHTML = `&nbsp;${seconds}`;
    friendCallTimerMinute.innerHTML = `&nbsp;${minutes} : `;
    friendCallTimerHour.innerHTML = `&nbsp;${hours} : `;
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

function selfPhoneCallTimer() {

    selfCallTimerSeconds.innerHTML = `&nbsp;${seconds}`;
    selfCallTimerMinute.innerHTML = `&nbsp;${minutes} : `;
    selfCallTimerHour.innerHTML = `&nbsp;${hours} : `;
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
    document.querySelector(".friend-call-image-icon").style.display = "none";
    document.querySelector(".self-call-icon").style.display = "none";
    if (callSuccess) {
        console.log("掛掉")
        socket.emit("leave", roomName, peerId);


        seconds = 0;
        minutes = 0;
        hours = 0;
        callSuccess = false;
        clearInterval(timer);

        selfCallTime.style.display = "none";
        selfCallPopup.style.display = "none";


        seconds = 0;
        minutes = 0;
        hours = 0;
        clearInterval(timer);
        friendCallTime.style.display = "none";
        friendCallPopup.style.display = "none";
        callSuccess = false;
        if (userStream) {
            if (userStream.getTracks()) {
                userStream.getTracks().forEach(track => track.stop());
                audioElement.srcObject = null;
                userStream = null;
            }
        }

        if (localStream) {
            if (localStream.getTracks()) {
                localStream.getTracks().forEach(track => track.stop());
                audioElement.srcObject = null;
                localStream = null;
            }
        }


        for (const peerId in thePeers) {
            if (thePeers.hasOwnProperty(peerId)) {
                const call = thePeers[peerId];
                if (call) {
                    console.log("關閉連接")
                    call.close();

                }
            }
        }

        // remoteStreamArr.forEach(element => {
        //     element.pause();
        //     element.remove();
        // })




        // remoteStreamArr.forEach(element => {
        //     const audios = document.getElementsByClassName(element.className);
        //     for (let i = 0; i < audios.length; i++) {
        //         if (audios[i].srcObject) {
        //             const tracks = audios[i].srcObject.getTracks();
        //             console.log("tracktrack")
        //             tracks.forEach((track) => track.stop());
        //         }
        //     }
        // })
        const audios = document.querySelectorAll("audio");
        console.log(audios)
        audios.forEach((audio) => {
            audio.pause();
        });

        myPeer.destroy();
        peerId = null;
        myPeer = new Peer({
            host: "0.peerjs.com",
            port: 443,
            path: "/",
            pingInterval: 5000,
        });

        myPeer.on('open', (name) => {
            peerId = name;
            console.log(peerId)
        });
        groupCallSuccess = false;
        thePeers = {};
        groupMemberArr = [];


    } else {
        selfCallPopup.style.display = "none";
        socket.emit("hangup-call", roomName);
    }


})

socket.on("leave", (peerId) => {
    // roomName = "";
    console.log("leaveleaveleave")
    document.querySelector(".friend-call-image-icon").style.display = "none";
    document.querySelector(".self-call-icon").style.display = "none";
    selfCallPopup.style.display = "none";
    friendCallPopup.style.display = "none";
    clearInterval(timer);
    console.log(timer)
    selfCallTime.style.display = "none";
    friendCallTime.style.display = "none";
    const audios = document.querySelectorAll("audio");
    console.log(audios)
    audios.forEach((audio) => {
        audio.pause();
    });
    callSuccess = false;

    const connections = myPeer.connections[peerId];
    if (connections) {
        console.log("herehere");
        connections.forEach(connection => {
            if (connection.open) {
                console.log("hihihi");
                connection.close();
                delete thePeers[peerId];

            }
        });
    }
    console.log(thePeers)
    console.log("someone leaving")

    seconds = 0;
    minutes = 0;
    hours = 0;

})

const groupCallPopUp = document.querySelector(".group-call-popup");
const closeGroupCallPopup = document.querySelector(".group-call-popup-close");
const groupCallIcon = document.querySelector(".group-call-icon");
const closeSelfCallPopup = document.querySelector(".self-call-popup-close-btn");
const closeFriendCallPopup = document.querySelector(".friend-call-popup-close");
closeGroupCallPopup.addEventListener("click", () => {
    groupCallPopUp.style.display = "none";
    groupCallIcon.style.display = "block";
})

closeSelfCallPopup.addEventListener("click", () => {
    selfCallPopup.style.display = "none";
    document.querySelector(".self-call-icon").style.display = "block";
})

closeFriendCallPopup.addEventListener("click", () => {
    console.log("click")
    friendCallPopup.style.display = "none";
    document.querySelector(".friend-call-image-icon").style.display = "block";
})

document.querySelector(".friend-call-image-icon").addEventListener("click", () => {
    friendCallPopup.style.display = "block";
    document.querySelector(".friend-call-image-icon").style.display = "none";
})

document.querySelector(".self-call-icon").addEventListener("click", () => {
    selfCallPopup.style.display = "block";
    document.querySelector(".self-call-icon").style.display = "none";
})

groupCallIcon.addEventListener("click", () => {
    groupCallPopUp.style.display = "block";
    groupCallIcon.style.display = "none";
})
