

//  { urls: "stun:stun.services.mozilla.com" },


let creator = false;
let peerConnection, userStream;
let roomName = "";
let seconds = 0;;
let minutes = 0;
let hours = 0;
let timer;
let callSuccess = false;
const audioElement = new Audio();

const groupCallMemberData = document.querySelector(".group-call-member-data");
const groupCallAcceptBtn = document.querySelector(".group-call-accept-btn");
const groupCallRejectBtn = document.querySelector(".group-call-reject-btn");



let peerId, localStream;
const thePeers = {};

const myPeer = new Peer({
    host: "0.peerjs.com",
    port: 443,
    path: "/",
    pingInterval: 5000,
});

myPeer.on('open', (name) => {
    peerId = name;
    console.log(peerId)
});



//與群組通話 sender
friendPopupCall.addEventListener("click", () => {
    const isGroup = isNaN(friendId.innerHTML);


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
        userId: parseInt(selfId.innerHTML)
    }
    roomName = `${selfId.innerHTML}and${friendId.innerHTML}`;
    socket.emit("join", roomName, package);



    // 获取麦克风的媒体流
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            userStream = stream;

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


        })
        .catch(error => console.error(error));

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


                groupCallAcceptBtn.style.display = "none";
                socket.emit("accept-group-call", groupId);
                const myLoading = document.querySelector(`.loading${selfId.innerHTML}`);
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

    while (groupCallMemberData.firstChild) {
        groupCallMemberData.removeChild(groupCallMemberData.firstChild);
    }
    groupCallPopUp.style.display = "none";


    console.log(document.querySelectorAll('audio'))

    for (const audioElement of document.querySelectorAll('audio')) {
        console.log("hihi")
        const stream = audioElement.srcObject;
        if (stream) {
            stream.getTracks().forEach(track => {
                track.stop();
            });
            audioElement.srcObject = null;
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
    socket.emit("group-leave", peerId);
    location.reload();


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