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
const singleChatEmpty = document.querySelector("#single-chat-empty");
const groupChatEmpty = document.querySelector("#group-chat-empty");
const chatheadshot = document.querySelector(".chat-headshot-picture");




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
    groupNameInput.value = "群組";
})

//建立群組按鈕
createGroupBtn.addEventListener("click", () => {
    const searchUser = document.querySelectorAll(".search-user");
    const hadAddUser = document.querySelectorAll(".had-add-user");
    searchUser.forEach(element => {
        element.remove();
    })
    hadAddUser.forEach(element => {
        element.remove();
    })


    let groupMemberIdArr = [];
    if (groupNameInput.value) {

        hadAddUser.forEach(element => {
            if (element.style.display === "flex") {
                groupMemberIdArr.push(parseInt(element.classList[1].replace("had-add-user", "")))
            }
        })
        //加上自己 
        groupMemberIdArr.push(parseInt(selfId))

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
                    groupMemberIcon.style.display = "block";
                    addGroupPopup.style.display = "none";
                    chatBoxFriendName.innerHTML = data.groupName;
                    friendChatId = data.groupId;
                    groupNameInput.value = "群組";
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






//查看群組成員
groupMemberIcon.addEventListener("click", () => {
    groupMemberPopup.style.display = "block";
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
            console.log(data)
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

                newDiv.addEventListener("click", (event) => {
                    if (element.member_id !== parseInt(selfId)) {
                        friendPopup.style.display = "block";
                        let friendPopupHeadshot = document.querySelector(".friend-popup-headshot");
                        friendName.innerHTML = element.nickname;
                        friendId = element.member_id;
                        friendPopupHeadshot.src = element.headshot;
                        // if (event.target.tagName === "IMG") {
                        //     console.log("here1")
                        //     friendPopupHeadshot.src = event.target.src;
                        //     console.log(event.target.src)
                        // } else if (event.target.getElementsByTagName("img").length > 0) {
                        //     console.log("here2")
                        //     friendPopupHeadshot.src = event.target.getElementsByTagName("img").src;
                        // }


                        // console.log(event.target.nodeName === "IMG")
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
            friend_id: parseInt(friendId)
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

function createLatestGroupChatList(element) {
    hadGroupHistoryMsg = true;
    groupChatEmpty.style.display = "none";
    let senderIsMe;
    if (parseInt(selfId) === element.sender_id) {
        senderIsMe = true;
    } else {
        senderIsMe = false;
    }

    newDiv = document.createElement("div");
    newDiv.className = "chat-group-list";
    groupChatListContainer.insertBefore(newDiv, groupChatListContainer.firstChild);
    let chatGroupList = document.querySelector(".chat-group-list");

    //群組頭貼
    newImg = document.createElement("img");
    newImg.src = element.group_headshot;
    newImg.style.width = "100px";
    newImg.style.height = "100px";
    newImg.style.objectFit = "cover";
    newImg.style.borderRadius = "50px";
    chatGroupList.appendChild(newImg);

    newDiv = document.createElement("div");
    newDiv.className = "chat-group-list-right";
    chatGroupList.appendChild(newDiv);
    let rightGroupChatList = document.querySelector(".chat-group-list-right");

    newP = document.createElement("p");
    newP.innerHTML = element.group_name;
    newP.style.fontSize = "25px";
    newP.style.fontWeight = "bolder";
    newP.style.marginTop = "10px";
    newP.style.marginLeft = "10px";
    rightGroupChatList.appendChild(newP);


    newP = document.createElement("p");
    if (element.message.indexOf(S3Url) !== -1) {
        if (element.message.match(/\(([^)]+)\)/)[1] === "video") {
            newP.innerHTML = '傳送了一則影片';
        } else if (element.message.match(/\(([^)]+)\)/)[1] === "audio") {
            newP.innerHTML = '傳送了一則音檔';
        } else if (element.message.match(/\(([^)]+)\)/)[1] === "image") {
            newP.innerHTML = '傳送了一張照片';
        } else if (element.message.match(/\(([^)]+)\)/)[1] === "application") {
            newP.innerHTML = '傳送了一份檔案';
        } else if (element.message.match(/\(([^)]+)\)/)[1] === "text") {
            newP.innerHTML = '傳送了一份純文本檔案';
        }
    } else {
        if (element.message.length > 20) {
            newP.innerHTML = element.message.substring(0, 9);
            newP.innerHTML += ".....";
        } else {
            newP.innerHTML = element.message;
        }

    }
    newP.dataset.attributeName = `${element.group_id}`;
    newP.className = "group-message";
    newP.style.fontSize = "15px";
    newP.style.marginTop = "20px";
    newP.style.marginLeft = "10px";
    newP.style.fontWeight = "bolder";
    newP.style.color = "gray";
    rightGroupChatList.appendChild(newP);


    if (element.is_read === 0 && element.sender_id !== parseInt(selfId)) {
        newImg = document.createElement("img");
        newImg.src = "./images/new-message.png";
        newImg.className = "new-message-icon";
        newImg.style.width = "50px";
        newImg.style.position = "absolute";
        newImg.style.right = "5px";
        newImg.style.top = "0px";
        rightGroupChatList.appendChild(newImg);
    }
    chatGroupList.addEventListener("click", (event) => {
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
        friendChatId = element.group_id;
        const isGroup = isNaN(friendChatId);

        if (isGroup) {
            groupMemberIcon.style.display = "block";
        }
        if (senderIsMe) {
            fetch("/api/get_message", {
                method: "POST",
                body: JSON.stringify({
                    myId: selfId,
                    friendId: friendChatId,
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
                        if (parseInt(selfId) === element.sender_id) {
                            displayMessage(element, true, element.read_count, true);
                        } else {
                            displayMessage(element, false, element.read_count, true);
                        }
                    })


                    let groupIsReadStatus = document.querySelector(".group-read-status");
                    groupIsReadStatus.innerHTML = `${data.message[0].read_count}人已讀`;
                    const package = {
                        group_id: friendChatId,
                        self_id: parseInt(selfId)
                    }
                    messageData = data;
                    //如果是自己傳的就不需要更新已讀狀態
                    if (!(data.message[data.message.length - 1].sender_id === parseInt(selfId))) {

                        fetch("/update_group_message_status", {
                            method: "POST",
                            body: JSON.stringify({
                                groupId: friendChatId,
                                isReadMemberId: parseInt(selfId)
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
                    myId: selfId,
                    friendId: friendChatId,
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
                        if (parseInt(selfId) === element.sender_id) {
                            displayMessage(element, true, element.is_read, true);
                        } else {
                            displayMessage(element, false, element.is_read, true);
                        }

                    })

                    const package = {
                        group_id: friendChatId,
                        self_id: parseInt(selfId)
                    }


                    let groupIsReadStatus = document.querySelector(".group-read-status");
                    groupIsReadStatus.innerHTML = `${data.message[0].read_count}人已讀`;
                    if (!(data.message[data.message.length - 1].sender_id === parseInt(selfId))) {
                        fetch("/update_group_message_status", {
                            method: "POST",
                            body: JSON.stringify({
                                groupId: friendChatId,
                                isReadMemberId: parseInt(selfId)
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


}

function createGroupChatList(data) {
    let count = 0;
    if (data.length === 0) {
        groupChatEmpty.style.display = "block";
        groupChatEmpty.style.display = "flex";
    } else {
        groupChatEmpty.style.display = "none";
    }
    data.forEach(element => {
        hadGroupHistoryMsg = true;

        let senderIsMe;
        if (parseInt(selfId) === element.sender_id) {
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
        newP.style.fontSize = "25px";
        newP.style.fontWeight = "bolder";
        newP.style.marginTop = "10px";
        newP.style.marginLeft = "10px";
        rightGroupChatList[count].appendChild(newP);

        newP = document.createElement("p");
        if (element.message.indexOf(S3Url) !== -1) {
            if (element.message.match(/\(([^)]+)\)/)[1] === "video") {
                newP.innerHTML = '傳送了一則影片';
            } else if (element.message.match(/\(([^)]+)\)/)[1] === "audio") {
                newP.innerHTML = '傳送了一則音檔';
            } else if (element.message.match(/\(([^)]+)\)/)[1] === "image") {
                newP.innerHTML = '傳送了一張照片';
            } else if (element.message.match(/\(([^)]+)\)/)[1] === "application") {
                newP.innerHTML = '傳送了一份檔案';
            } else if (element.message.match(/\(([^)]+)\)/)[1] === "text") {
                newP.innerHTML = '傳送了一份純文本檔案';
            }
        } else {
            if (element.message.length > 20) {
                newP.innerHTML = element.message.substring(0, 9);
                newP.innerHTML += ".....";
            } else {
                newP.innerHTML = element.message;
            }

        }
        newP.dataset.attributeName = `${element.group_id}`;
        newP.className = "group-message";
        newP.style.fontSize = "15px";
        newP.style.marginTop = "20px";
        newP.style.marginLeft = "10px";
        newP.style.fontWeight = "bolder";
        newP.style.color = "gray";
        rightGroupChatList[count].appendChild(newP);


        if (element.is_read === 0 && element.sender_id !== parseInt(selfId)) {
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
            friendChatId = element.group_id;
            const isGroup = isNaN(friendChatId);

            if (isGroup) {
                groupMemberIcon.style.display = "block";
            }
            if (senderIsMe) {
                fetch("/api/get_message", {
                    method: "POST",
                    body: JSON.stringify({
                        myId: selfId,
                        friendId: friendChatId,
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
                            if (parseInt(selfId) === element.sender_id) {
                                displayMessage(element, true, element.read_count, true);
                            } else {
                                displayMessage(element, false, element.read_count, true);
                            }
                        })


                        let groupIsReadStatus = document.querySelector(".group-read-status");
                        groupIsReadStatus.innerHTML = `${data.message[0].read_count}人已讀`;
                        const package = {
                            group_id: friendChatId,
                            self_id: parseInt(selfId)
                        }
                        messageData = data;
                        //如果是自己傳的就不需要更新已讀狀態
                        if (!(data.message[data.message.length - 1].sender_id === parseInt(selfId))) {

                            fetch("/update_group_message_status", {
                                method: "POST",
                                body: JSON.stringify({
                                    groupId: friendChatId,
                                    isReadMemberId: parseInt(selfId)
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
                        myId: selfId,
                        friendId: friendChatId,
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
                            if (parseInt(selfId) === element.sender_id) {
                                displayMessage(element, true, element.is_read, true);
                            } else {
                                displayMessage(element, false, element.is_read, true);
                            }

                        })

                        const package = {
                            group_id: friendChatId,
                            self_id: parseInt(selfId)
                        }


                        let groupIsReadStatus = document.querySelector(".group-read-status");
                        groupIsReadStatus.innerHTML = `${data.message[0].read_count}人已讀`;
                        if (!(data.message[data.message.length - 1].sender_id === parseInt(selfId))) {
                            fetch("/update_group_message_status", {
                                method: "POST",
                                body: JSON.stringify({
                                    groupId: friendChatId,
                                    isReadMemberId: parseInt(selfId)
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


function createLatestChatList(element, container) {
    hadHistoryMsg = true;
    singleChatEmpty.style.display = "none";
    let senderIsMe;
    if (parseInt(selfId) === element.sender_id) {
        senderIsMe = true;
    } else {
        senderIsMe = false;
    }

    newDiv = document.createElement("div");
    newDiv.className = "chat-list";
    container.insertBefore(newDiv, container.firstChild);
    let chatList = document.querySelector(".chat-list");

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
    chatList.appendChild(newImg);


    newDiv = document.createElement("div");
    newDiv.className = "chat-list-right";
    chatList.appendChild(newDiv);
    let rightChatList = document.querySelector(".chat-list-right");

    newP = document.createElement("p");
    if (senderIsMe) {
        newP.innerHTML = element.recipient_nickname;
    } else {
        newP.innerHTML = element.sender_nickname;
    }

    newP.style.fontSize = "25px";
    newP.style.fontWeight = "bolder";
    newP.style.marginTop = "10px";
    newP.style.marginLeft = "10px";
    rightChatList.appendChild(newP);

    newP = document.createElement("p");
    if (element.message.indexOf(S3Url) !== -1) {
        if (element.message.match(/\(([^)]+)\)/)[1] === "video") {
            newP.innerHTML = '傳送了一則影片';
        } else if (element.message.match(/\(([^)]+)\)/)[1] === "audio") {
            newP.innerHTML = '傳送了一則音檔';
        } else if (element.message.match(/\(([^)]+)\)/)[1] === "image") {
            newP.innerHTML = '傳送了一張照片';
        } else if (element.message.match(/\(([^)]+)\)/)[1] === "application") {
            newP.innerHTML = '傳送了一份檔案';
        } else if (element.message.match(/\(([^)]+)\)/)[1] === "text") {
            newP.innerHTML = '傳送了一份純文本檔案';
        }
    } else {
        if (element.message.length > 20) {
            newP.innerHTML = element.message.substring(0, 19);
            newP.innerHTML += ".....";
        } else {
            newP.innerHTML = element.message;
        }

    }
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
    rightChatList.appendChild(newP);

    if (element.is_read === 0 && !senderIsMe) {
        newImg = document.createElement("img");
        newImg.src = "./images/new-message.png";
        newImg.className = "new-message-icon";
        newImg.style.width = "50px";
        newImg.style.position = "absolute";
        newImg.style.right = "5px";
        newImg.style.top = "0px";
        rightChatList.appendChild(newImg);
    }

    if (parseInt(element.non_friend_id) === parseInt(selfId)) {
        newImg = document.createElement("img");
        newImg.src = "./images/anonymity.png";
        newImg.className = "stranger-icon";
        newImg.style.width = "50px";
        newImg.style.position = "absolute";
        newImg.style.right = "5px";
        newImg.style.bottom = "5px";
        rightChatList.appendChild(newImg);


    }
    chatList.addEventListener("click", (event) => {
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
            friendChatId = element.recipient_id;
        } else {
            chatBoxFriendName.innerHTML = element.sender_nickname;
            friendChatId = element.sender_id;
        }
        friendPopup.style.display = "none";
        const isGroup = isNaN(friendChatId);
        if (senderIsMe) {
            fetch("/api/get_message", {
                method: "POST",
                body: JSON.stringify({
                    "myId": selfId,
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
                        if (parseInt(selfId) === element.sender_id) {
                            displayMessage(element, true, element.is_read);
                        } else {
                            displayMessage(element, false, element.is_read);
                        }
                    })
                    let room = `user${friendChatId}`;
                    socket.emit('read-message', room);
                })
                .then(() => {
                    fetch("/update_message_status", {
                        method: "POST",
                        body: JSON.stringify({
                            sender_id: parseInt(friendChatId)
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
                    "myId": selfId,
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
                        if (parseInt(selfId) === element.sender_id) {
                            displayMessage(element, true, element.is_read);
                        } else {
                            displayMessage(element, false, element.is_read);
                        }

                    })
                    let room = `user${friendChatId}`;
                    socket.emit('read-message', room);

                })
                .then(() => {
                    fetch("/update_message_status", {
                        method: "POST",
                        body: JSON.stringify({
                            sender_id: parseInt(friendChatId)
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





}

function createChatList(data, container) {
    let count = 0;
    if (data.length === 0) {
        singleChatEmpty.style.display = "block";
        singleChatEmpty.style.display = "flex";
    } else {
        singleChatEmpty.style.display = "none";
    }
    data.forEach(element => {
        hadHistoryMsg = true;
        let senderIsMe;
        if (parseInt(selfId) === element.sender_id) {
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

        newP.style.fontSize = "25px";
        newP.style.fontWeight = "bolder";
        newP.style.marginTop = "10px";
        newP.style.marginLeft = "10px";
        rightChatList[count].appendChild(newP);

        newP = document.createElement("p");
        if (element.message.indexOf(S3Url) !== -1) {
            if (element.message.match(/\(([^)]+)\)/)[1] === "video") {
                newP.innerHTML = '傳送了一則影片';
            } else if (element.message.match(/\(([^)]+)\)/)[1] === "audio") {
                newP.innerHTML = '傳送了一則音檔';
            } else if (element.message.match(/\(([^)]+)\)/)[1] === "image") {
                newP.innerHTML = '傳送了一張照片';
            } else if (element.message.match(/\(([^)]+)\)/)[1] === "application") {
                newP.innerHTML = '傳送了一份檔案';
            } else if (element.message.match(/\(([^)]+)\)/)[1] === "text") {
                newP.innerHTML = '傳送了一份純文本檔案';
            }
        } else {
            if (element.message.length > 20) {
                newP.innerHTML = element.message.substring(0, 9);
                newP.innerHTML += ".....";
            } else {
                newP.innerHTML = element.message;
            }

        }

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

        if (parseInt(element.non_friend_id) === parseInt(selfId)) {
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
                console.log("here")
                isAddFriendPopup.style.display = "block";
            }

            chatContainer.style.display = "block";
            if (senderIsMe) {
                chatBoxFriendName.innerHTML = element.recipient_nickname;
                friendChatId = element.recipient_id;
            } else {
                chatBoxFriendName.innerHTML = element.sender_nickname;
                friendChatId = element.sender_id;
            }
            friendPopup.style.display = "none";
            const isGroup = isNaN(friendChatId);
            if (senderIsMe) {
                fetch("/api/get_message", {
                    method: "POST",
                    body: JSON.stringify({
                        "myId": selfId,
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
                            if (parseInt(selfId) === element.sender_id) {
                                displayMessage(element, true, element.is_read);
                            } else {
                                displayMessage(element, false, element.is_read);
                            }
                        })
                        let room = `user${friendChatId}`;
                        socket.emit('read-message', room);
                    })
                    .then(() => {
                        fetch("/update_message_status", {
                            method: "POST",
                            body: JSON.stringify({
                                sender_id: parseInt(friendChatId)
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
                        "myId": selfId,
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
                            if (parseInt(selfId) === element.sender_id) {
                                displayMessage(element, true, element.is_read);
                            } else {
                                displayMessage(element, false, element.is_read);
                            }

                        })
                        let room = `user${friendChatId}`;
                        socket.emit('read-message', room);

                    })
                    .then(() => {
                        fetch("/update_message_status", {
                            method: "POST",
                            body: JSON.stringify({
                                sender_id: parseInt(friendChatId)
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
