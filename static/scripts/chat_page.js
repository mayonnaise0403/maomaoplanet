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
const changeGroupHeadshotBtn = document.querySelector(".change-group-headshot-btn");
const changeGroupNameBtn = document.querySelector(".change-group-name-btn");
const leaveGroupBtn = document.querySelector(".leave-the-group-btn");
const changeGroupHeadshotPopup = document.querySelector(".change-group-headshot-popup");
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
const changeGroupNamePopup = document.querySelector(".change-group-name-popup");
const closeChangeGroupNamePopup = document.querySelector(".close-change-group-name-popup");




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
                    changeGroupHeadshotBtn.style.display = "block";
                    changeGroupNameBtn.style.display = "block";
                    leaveGroupBtn.style.display = "block";
                    addGroupPopup.style.display = "none";
                    chatBoxFriendName.innerHTML = data.groupName;
                    friendChatId = data.groupId;
                    groupNameInput.value = "群組";
                    fetch("/api/get_grouplist")
                        .then((response) => {
                            return response.json();
                        })
                        .then((data) => {
                            if (data.status === "success") {
                                createGroupList(data, groupList)
                            } else {
                                errorMessage.style.display = "block";
                                errorMessage.innerHTML = data.message;
                                setTimeout(() => {
                                    errorMessage.style.display = "none";
                                }, 3000)
                            }

                        })

                } else {
                    errorMessage.style.display = "block";
                    errorMessage.innerHTML = data.message;
                    setTimeout(() => {
                        errorMessage.style.display = "none";
                    }, 3000)
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

const groupHeadshotImage = document.querySelector(".group-headshot-image");
const groupHeadshotUploadInput = document.querySelector(".group-headshot-upload-input");
const selectGroupHeadshotBtn = document.querySelector(".select-group-headshot-btn");
const notChangeGroupHeadshot = document.querySelector(".not-change-group-headshot-btn");
const closeGroupChangeHeadshotPopup = document.querySelector(".change-group-headshot-popup-close");
const uploadGroupHeadshotBtn = document.querySelector(".upload-group-headshot-btn");
const confirmChangeGroupName = document.querySelector(".confirm-change-group-name-btn");
const changeGroupNameInput = document.querySelector(".change-group-name-input");
const confirmLeaveGroupPopup = document.querySelector(".confirm-leave-group-popup");
const confirmLeaveGroup = document.querySelector(".confirm-leave-group-btn");
const confirmNotLeaveGroup = document.querySelector(".confirm-not-leave-group-btn");
let previewGroupHeadshot, groupHeadshotFile, groupHeadshotDatatype;

//關閉群組大頭貼popup
closeGroupChangeHeadshotPopup.addEventListener("click", () => {
    changeGroupHeadshotPopup.style.display = "none";
})

//取消更改大頭貼
notChangeGroupHeadshot.addEventListener("click", () => {
    groupHeadshotImage.src = previewGroupHeadshot;
})

//點擊更換群組頭貼
changeGroupHeadshotBtn.addEventListener("click", () => {
    let groupHeadshotSrc = document.querySelector(`[data-attribute-name='${friendChatId}']`).parentNode.parentNode.querySelector("img");
    groupHeadshotImage.src = groupHeadshotSrc.src;

    changeGroupHeadshotPopup.style.display = "block";
})

//更換群組姓名
changeGroupNameBtn.addEventListener("click", () => {
    changeGroupNamePopup.style.display = "block";
})

closeChangeGroupNamePopup.addEventListener("click", () => {
    changeGroupNamePopup.style.display = "none";
})

confirmChangeGroupName.addEventListener("click", () => {
    if (changeGroupNameInput.value) {
        fetch("/update_group_name", {
            method: "POST",
            body: JSON.stringify({
                groupId: friendChatId,
                groupName: changeGroupNameInput.value
            })
            , headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },

        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                if (data.status === "success") {
                    changeGroupNamePopup.style.display = "none";
                    errorMessage.style.display = "block";
                    errorMessage.innerHTML = "✅更新成功";
                    document.querySelector(".chat-friend-name").innerHTML = data.newGroupName;
                    document.querySelector(`[data-attribute-name='${friendChatId}']`).parentNode.querySelectorAll("p")[0].innerHTML = data.newGroupName;
                    document.querySelector(`.group-name-${friendChatId}`).innerHTML = data.newGroupName;
                    changeGroupNameInput.value = "";
                    setTimeout(() => {
                        errorMessage.style.display = "none";
                    }, 2000)
                } else {
                    errorMessage.style.display = "block";
                    errorMessage.innerHTML = data.message;
                    setTimeout(() => {
                        errorMessage.style.display = "none";
                    }, 3000)
                }
            })
    }
})

//退出群組
leaveGroupBtn.addEventListener("click", () => {
    confirmLeaveGroupPopup.style.display = "block";
})

confirmNotLeaveGroup.addEventListener("click", () => {
    confirmLeaveGroupPopup.style.display = "none";
})

confirmLeaveGroup.addEventListener("click", () => {
    fetch("/leave_group", {
        method: "POST",
        body: JSON.stringify({
            groupId: friendChatId
        })
        , headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },

    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            if (data.status === "success") {
                confirmLeaveGroupPopup.style.display = "none";
                errorMessage.style.display = "block";
                errorMessage.innerHTML = "成員們會想你的~";
                setTimeout(() => {
                    errorMessage.style.display = "none";
                }, 2000)
                chatContainer.style.display = "none";
                document.querySelector(`[data-attribute-name='${friendChatId}']`).parentNode.parentNode.remove();
                document.querySelector(`.group-headshot-${friendChatId}`).parentNode.remove();
            } else {
                errorMessage.style.display = "block";
                errorMessage.innerHTML = data.message;
                setTimeout(() => {
                    errorMessage.style.display = "none";
                }, 3000)
            }
        })
})

selectGroupHeadshotBtn.addEventListener("click", () => {
    groupHeadshotUploadInput.click();
})

let imageURL;
//預覽群組頭貼
groupHeadshotUploadInput.addEventListener("change", () => {
    groupHeadshotFile = groupHeadshotUploadInput.files[0];
    imageURL = URL.createObjectURL(groupHeadshotFile);
    previewGroupHeadshot = groupHeadshotImage.src;
    groupHeadshotDatatype = groupHeadshotFile.type;
    const reader = new FileReader();

    reader.addEventListener("load", () => {
        groupHeadshotFile = reader.result;
        groupHeadshotImage.src = reader.result;
    });
    if (groupHeadshotFile) {
        reader.readAsDataURL(groupHeadshotFile);
    } else {
        previewGroupHeadshot.src = "";
    }
})

//上傳群組頭貼
uploadGroupHeadshotBtn.addEventListener("click", () => {

    if (groupHeadshotDatatype.includes("image")) {
        fetch("/upload_group_headshot", {
            method: "POST",
            body: JSON.stringify({
                groupId: friendChatId,
                image: groupHeadshotFile
            })
            , headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },

        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                if (data.status === "success") {
                    errorMessage.style.display = "block";
                    errorMessage.innerHTML = "✅更新成功";
                    setTimeout(() => {
                        errorMessage.style.display = "none";
                    }, 2000)
                    document.querySelector(`[data-attribute-name='${friendChatId}']`).parentNode.parentNode.querySelector("img").src = imageURL;
                    document.querySelector(`.group-headshot-${friendChatId}`).src = imageURL;


                } else {
                    errorMessage.style.display = "block";
                    errorMessage.innerHTML = data.message;
                    setTimeout(() => {
                        errorMessage.style.display = "none";
                    }, 3000)
                }
            })
    } else {
        errorMessage.style.display = "block";
        errorMessage.innerHTML = "只能上傳圖片檔";
        setTimeout(() => {
            errorMessage.style.display = "none";
        }, 2000)
    }

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
            if (data.status === "error") {
                errorMessage.style.display = "block";
                errorMessage.innerHTML = data.message;
                setTimeout(() => {
                    errorMessage.style.display = "none";
                }, 3000)
            } else {
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
            }
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
            } else {
                errorMessage.style.display = "block";
                errorMessage.innerHTML = data.message;
                setTimeout(() => {
                    errorMessage.style.display = "none";
                }, 3000)
            }
        })
        .then(() => {
            fetch("/api/get_friendlist")
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    if (data.status === "success") {
                        createFriendList(data, friendList);
                    } else {
                        errorMessage.style.display = "block";
                        errorMessage.innerHTML = data.message;
                        setTimeout(() => {
                            errorMessage.style.display = "none";
                        }, 3000)
                    }

                })
        })
})

//陌生訊息裡面:是否要加好友按鈕
isAddFriendOkBtn.addEventListener("click", () => {


    fetch("/add_friend", {
        method: "POST",
        body: JSON.stringify({
            friend_id: parseInt(friendChatId)
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
                let friendMsg = document.querySelector(`.user${friendChatId}-message`).parentNode;
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

            } else {
                errorMessage.style.display = "block";
                errorMessage.innerHTML = data.message;
                setTimeout(() => {
                    errorMessage.style.display = "none";
                }, 3000)
            }
        })
        .then(() => {
            fetch("/api/get_friendlist")
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    if (data.status === "success") {
                        createFriendList(data, friendList);
                    } else {
                        errorMessage.style.display = "block";
                        errorMessage.innerHTML = data.message;
                        setTimeout(() => {
                            errorMessage.style.display = "none";
                        }, 3000)
                    }

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
            changeGroupHeadshotBtn.style.display = "block";
            changeGroupNameBtn.style.display = "block";
            leaveGroupBtn.style.display = "block";
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
                                if (data.status === "error") {
                                    errorMessage.style.display = "block";
                                    errorMessage.innerHTML = data.message;
                                    setTimeout(() => {
                                        errorMessage.style.display = "none";
                                    }, 3000)
                                } else {
                                    socket.emit('group-read-message', package);
                                }

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
                                if (data.status === "error") {
                                    errorMessage.style.display = "block";
                                    errorMessage.innerHTML = data.message;
                                    setTimeout(() => {
                                        errorMessage.style.display = "none";
                                    }, 3000)
                                } else {
                                    socket.emit('group-read-message', package);
                                }
                            })
                    }


                })
        }

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
                            if (data.status === "error") {
                                errorMessage.style.display = "block";
                                errorMessage.innerHTML = data.message;
                                setTimeout(() => {
                                    errorMessage.style.display = "none";
                                }, 3000)
                            }
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
                            if (data.status === "error") {
                                errorMessage.style.display = "block";
                                errorMessage.innerHTML = data.message;
                                setTimeout(() => {
                                    errorMessage.style.display = "none";
                                }, 3000)
                            }
                        })
                })
        }

    })





}

