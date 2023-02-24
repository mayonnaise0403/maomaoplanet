

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
let peerId, localStream, groupMemberArr = [], groupHost, groupCallId;
let groupCallSuccess = false;
let groupRecipientCalled = false;
let thePeers = {};


let myPeer = new Peer({
    host: "0.peerjs.com",
    port: 443,
    path: "/",
    pingInterval: 5000,
});

myPeer.on('open', (name) => {
    peerId = name;
});


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

                    })
                groupCallSuccess = true;
                groupHost = true;
            }



        } else {
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
            socket.emit("join", roomName, package);
        }

        creator = true;
        // 获取麦克风的媒体流
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                userStream = stream;
                if (isGroup && peerId) {
                    myPeer.on("call", call => {
                        for (const audioElement of document.querySelectorAll('audio')) {
                            audioElement.srcObject = null;
                        }
                        call.answer(stream);

                        call.removeAllListeners("stream");
                        call.on("stream", userAudioStream => {
                            const audioElement = new Audio();
                            audioElement.className = `audio-${call.peer}`;
                            console.log("成員的stream")
                            console.log(userAudioStream)

                            console.log("成員的id")
                            console.log(call.peer)

                            connectToNewUser(call.peer, userAudioStream)

                            addAudioStream(audioElement, userAudioStream)
                        })
                    })
                }

            })
            .catch(error => console.error(error));
    } else {
        console.log("calling")
    }



})

socket.on("group-accept-call-member", (acceptMemberId) => {
    console.log(acceptMemberId)
    const acceptMemberLoading = document.querySelector(`.loading${acceptMemberId}`);
    if (acceptMemberLoading) {
        acceptMemberLoading.src = "./images/check (1).png";
        acceptMemberLoading.style.width = "40px";
    }
})

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
            })
            .then(() => {
                //接受通話
                groupCallAcceptBtn.addEventListener("click", function acceptGroupCall() {
                    groupCallSuccess = true;
                    groupRecipientCalled = false;
                    groupCallAcceptBtn.style.display = "none";
                    socket.emit("accept-group-call", groupId);
                    const myLoading = document.querySelector(`.loading${selfId}`);
                    myLoading.src = "./images/check (1).png";
                    myLoading.style.width = "40px";
                    socket.emit("group-accept-call-member", groupId);

                    navigator.mediaDevices.getUserMedia({ audio: true })
                        .then((stream) => {
                            myPeer.on("call", call => {
                                for (const audioElement of document.querySelectorAll('audio')) {
                                    audioElement.srcObject = null;
                                }

                                call.answer(stream);
                                call.removeAllListeners("stream");
                                call.on("stream", userAudioStream => {
                                    const audioElement = new Audio();
                                    audioElement.className = `audio-${call.peer}`;

                                    console.log("streamstream", call.peer)
                                    addAudioStream(audioElement, userAudioStream)
                                })
                            })
                            userStream = stream;
                            connectToNewUser(hostPeerId, stream)
                            groupCallAcceptBtn.removeEventListener("click", acceptGroupCall);
                            localStream = stream;

                        })
                        .catch(error => console.error(error));


                })
            })
    }


})


function connectToNewUser(peerId, stream) {
    const call = myPeer.call(peerId, stream);
    const audioElement = new Audio();
    audioElement.className = `audio-${peerId}`;
    call.on("stream", userAudioStream => {
        addAudioStream(audioElement, userAudioStream);
    })
    call.on('close', () => {
        audioElement.remove()
    })
    thePeers[peerId] = call
}

function addAudioStream(audio, stream) {
    audio.srcObject = stream;
    audio.onloadedmetadata = () => {
        audio.play();
    };

}


//掛掉電話
groupCallRejectBtn.addEventListener("click", () => {
    groupRecipientCalled = false;
    groupCallPopUp.style.display = "none";
    if (groupCallSuccess) {
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

        if (Object.keys(thePeers).length !== 0) {
            socket.emit("group-leave", peerId);
        } else {
            socket.emit("host-leave", friendId, groupMemberArr)
        }

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
        socket.emit("group-hangup", groupMemberArr);
        groupMemberArr = [];
    }
    while (groupCallMemberData.firstChild) {
        groupCallMemberData.removeChild(groupCallMemberData.firstChild);
    }


})

socket.on("host-leave", (groupId) => {

    groupRecipientCalled = false;
    console.log(groupCallId)
    if (groupCallId === groupId) {
        groupCallPopUp.style.display = "none";
        while (groupCallMemberData.firstChild) {
            groupCallMemberData.removeChild(groupCallMemberData.firstChild);
        }
    }


})

socket.on("group-hangup", (selfId) => {
    console.log(selfId)
    const myStatus = document.querySelector(`.loading${selfId}`);
    if (myStatus) {
        myStatus.src = "./images/cancel (1).png";
        myStatus.style.width = "40px";
    }

})

socket.on("select-new-host", (peerId) => {
    connectToNewUser(peerId, localStream);
    console.log(thePeers)
})

socket.on("group-leave", (groupId, selfId, leavePeerId) => {
    const connections = myPeer.connections[leavePeerId];
    if (connections) {
        console.log("herehere");
        connections.forEach(connection => {
            if (connection.open) {
                console.log("hihihi");
                connection.close();
                socket.emit("select-new-host", groupId, peerId);
                delete thePeers[leavePeerId];

            }
        });
    }
    console.log(thePeers)
    console.log("someone leaving")
    const myStatus = document.querySelector(`.loading${selfId}`);
    myStatus.src = "./images/cancel (1).png";
    myStatus.style.width = "40px";

})



//reciver 對方接聽
socket.on("invite-join-call", (roomName, package, senderId) => {
    if (!callSuccess && !groupCallSuccess && !groupRecipientCalled) {
        friendCallNickname.style.marginBottom = "0px";
        friendCallTime.style.display = "none";
        friendCallAcceptBtn.style.display = "block";
        friendCallLoader.style.display = "block";
        roomName = roomName;
        friendCallHeadshot.src = package.headshot;
        friendCallNickname.innerHTML = package.nickname;
        friendCallPopup.style.display = "block";
        friendCallAcceptBtn.addEventListener("click", () => {
            friendCallNickname.style.marginBottom = "100px";
            socket.emit("recipient-join-room", roomName);
            creator = false;

            friendCallAcceptBtn.style.display = "none";
            friendCallLoader.style.display = "none";
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
        if (!peerConnection) {
            peerConnection = new RTCPeerConnection(iceServers);
        }
        await waitForStableState(peerConnection);
        console.log(peerConnection.signalingState);//用來確保 RTCPeerConnection 物件狀態的合法性
        peerConnection.oniceconnectionstatechange = onIceConnectionStateFunction;
        console.log("hello")
        peerConnection.onicecandidate = (event) => {
            if (!event.candidate) {
                console.log("All ice candidates have been sent.");
                return;
            }
            console.log("here")
            onIceCandidateFunction(event, roomName);
        };
        peerConnection.ontrack = onTrackFunction;

        let hasTrack = false;
        peerConnection.getSenders().forEach((sender) => {
            let track = sender.track;
            if (track.kind === track.kind) {
                hasTrack = true;
            }
        });

        if (!hasTrack) {
            userStream.getTracks().forEach((track) => {
                peerConnection.addTrack(track, userStream);
            });
        }


        // 创建 offer
        peerConnection.createOffer()
            .then(offer => {
                peerConnection.setLocalDescription(offer)
                    .then(() => {
                        // 傳送 RTCSessionDescription 回 sender
                        socket.emit("offer", offer, roomName);
                    })
                    .catch(error => {
                        console.error(error);

                    });
            })
            .catch(error => {
                console.error(error);
            });

    }

})


socket.on("candidate", async (candidate) => {
    if (peerConnection.remoteDescription) {
        await peerConnection.addIceCandidate(candidate);
    } else {
        peerConnection.addEventListener("icecandidate", async (event) => {
            if (event.candidate) {
                console.log(event.candidate)
                await peerConnection.addIceCandidate(event.candidate);
            }
        })
    }
})

//reciver
socket.on("offer", async (offer, roomName) => {

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
        if (!peerConnection) {
            peerConnection = new RTCPeerConnection(iceServers);
        }

        await waitForStableState(peerConnection);

        console.log(peerConnection.signalingState);//用來確保 RTCPeerConnection 物件狀態的合法性
        peerConnection.setRemoteDescription(offer);
        console.log(offer)


        peerConnection.oniceconnectionstatechange = onIceConnectionStateFunction;
        peerConnection.onicecandidate = (event) => {
            if (!event.candidate) {
                console.log("All ice candidates have been sent.");
                return;
            }
            onIceCandidateFunction(event, roomName);
        };

        peerConnection.ontrack = onTrackFunction;

        let hasTrack = false;
        peerConnection.getSenders().forEach((sender) => {
            let track = sender.track;
            if (track.kind === track.kind) {
                hasTrack = true;
            }
        });

        if (!hasTrack) {
            userStream.getTracks().forEach((track) => {
                peerConnection.addTrack(track, userStream);
            });
        }




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
                if (userStream.getTracks()) {
                    userStream.getTracks().forEach(track => track.stop());

                    audioElement.srcObject = null;
                }
                if (peerConnection) {
                    console.log("hey")
                    peerConnection.ontrack = null;
                    peerConnection.onicecandidate = null;
                    peerConnection.close();
                    peerConnection = null;
                    peerConnection = new RTCPeerConnection(iceServers);
                }
                seconds = 0;
                minutes = 0;
                hours = 0;
                clearInterval(timer);
                friendCallTime.style.display = "none";
                friendCallPopup.style.display = "none";
                callSuccess = false;

            } else {
                friendCallPopup.style.display = "none";
            }
        })

    }
})

socket.on("answer", async (answer) => {
    console.log("answer")
    console.log(answer)
    peerConnection.setRemoteDescription(answer);
})


async function addIceCandidate(candidate, roomName) {
    try {
        await peerConnection.addIceCandidate(candidate);

        console.log("Ice candidate added successfully");
    } catch (error) {
        console.error("Error adding ice candidate: " + error);
    }
}

async function onIceCandidateFunction(event, roomName) {
    try {
        if (event.candidate) {
            socket.emit("candidate", event.candidate, roomName)
        }
    } catch (error) {
        console.log("onIceCandidate Error : ");
        console.error(error);
    }
}


socket.on("hangup-call", () => {
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



async function waitForStableState(peerConnection) {
    console.log("連線狀態 :::::", peerConnection.signalingState)
    while (peerConnection.signalingState !== "stable") {
        console.log("連線狀態 :::::", peerConnection.signalingState)
        await new Promise(resolve => peerConnection.oniceconnectionstatechange = resolve);
    }
    console.log("連線狀態 :::::", peerConnection.signalingState)
}




function onTrackFunction(event) {
    try {
        if (event.track.kind === "audio") {
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
    if (callSuccess) {
        console.log("掛掉")
        socket.emit("leave", roomName);

        if (userStream.getTracks()) {
            userStream.getTracks().forEach(track => track.stop());

            audioElement.srcObject = null;
        }
        if (peerConnection) {
            console.log("hey")
            peerConnection.ontrack = null;
            peerConnection.onicecandidate = null;
            peerConnection.close();
            peerConnection = null;
            peerConnection = new RTCPeerConnection(iceServers);
        }
        seconds = 0;
        minutes = 0;
        hours = 0;
        callSuccess = false;
        clearInterval(timer);

        selfCallTime.style.display = "none";
        selfCallPopup.style.display = "none";
    } else {
        selfCallPopup.style.display = "none";
        socket.emit("hangup-call", roomName);
    }


})

socket.on("leave", () => {
    clearInterval(timer);
    console.log(timer)
    selfCallTime.style.display = "none";
    friendCallTime.style.display = "none";

    callSuccess = false;
    if (userStream.getTracks()) {
        userStream.getTracks().forEach(track => track.stop());

        audioElement.srcObject = null;
    }
    if (peerConnection) {
        console.log("hey")
        peerConnection.ontrack = null;
        peerConnection.onicecandidate = null;
        peerConnection.close();
        peerConnection = null;
        peerConnection = new RTCPeerConnection(iceServers);
    }
    seconds = 0;
    minutes = 0;
    hours = 0;
    selfCallPopup.style.display = "none";
    friendCallPopup.style.display = "none";
})

const groupCallPopUp = document.querySelector(".group-call-popup");
const closeGroupCallPopup = document.querySelector(".group-call-popup-close");
const groupCallIcon = document.querySelector(".group-call-icon");
closeGroupCallPopup.addEventListener("click", () => {
    groupCallPopUp.style.display = "none";
    groupCallIcon.style.display = "block";
})

groupCallIcon.addEventListener("click", () => {
    groupCallPopUp.style.display = "block";
    groupCallIcon.style.display = "none";
})