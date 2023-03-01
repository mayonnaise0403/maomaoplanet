function createGroupList(groupData, list) {
    let count = 0;
    list.innerHTML = "";
    if (groupData.group_list.length === 0) {
        groupListEmpty.style.display = "block";
        groupListEmpty.style.display = "flex";
    } else {
        groupListEmpty.style.display = "none";
    }

    groupData.group_list.forEach(element => {
        newDiv = document.createElement("div");
        newDiv.className = "group";
        list.appendChild(newDiv);
        let group = document.querySelectorAll(".group");

        newImg = document.createElement("img");
        newImg.src = element.headshot;
        newImg.id = "group-headshot";
        newImg.className = `group-headshot-${element.group_id}`;
        group[count].appendChild(newImg);

        newP = document.createElement("p");
        newP.innerHTML = element.group_name;
        newP.className = `group-name-${element.group_id}`;
        group[count].appendChild(newP);

        group[count].addEventListener("click", () => {
            let friendPopupHeadshot = document.querySelector(".friend-popup-headshot");
            // friendPopupHeadshot.src = "./images/Loading_icon.gif";
            // friendPopupHeadshot.onload = () => {
            //     friendPopupHeadshot.src = element.headshot;
            // }
            friendPopupHeadshot.src = document.querySelector(`.group-headshot-${element.group_id}`).src;
            friendPopup.style.display = "block";
            friendName.innerHTML = document.querySelector(`.group-name-${element.group_id}`).innerHTML;
            friendId = element.group_id;
        })
        count++;
    })
}







function createUserHtml(resultArr) {

    let count = 0;
    resultArr.forEach(element => {
        newDiv = document.createElement("div");
        newDiv.className = "search-result";
        popupAddFriendResult.appendChild(newDiv);
        let searchResult = document.querySelectorAll(".search-result");

        newImg = document.createElement("img");
        newImg.src = element.headshot;
        newImg.style.width = "100px";
        newImg.style.height = "100px";
        newImg.style.objectFit = "cover";
        newImg.style.borderRadius = "10px";
        searchResult[count].appendChild(newImg);

        newP = document.createElement("p");
        newP.innerHTML = element.nickname;
        newP.style.fontWeight = "bolder";
        newP.style.fontSize = "25px";
        newP.style.marginLeft = "10px";
        searchResult[count].appendChild(newP);

        newImg = document.createElement("img");
        newImg.src = "./images/add-friend-btn.png";
        newImg.id = "add-friend-btn";
        newImg.addEventListener("click", (event) => {

            const parent = event.target.parentNode;
            fetch("/add_friend", {
                method: "POST",
                body: JSON.stringify({
                    email: element.email
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
                        addFriendStatusPopup.style.display = "block";
                        addFriendStatus.innerHTML = `✅${data.message}`;
                        addFriendStatusPopup.style.animation = "slideInFromTop 0.5s ease-in-out";
                        addFriendStatusPopup.addEventListener("animationend", () => {
                            setTimeout(() => {
                                addFriendStatusPopup.style.removeProperty("animation");
                                addFriendStatusPopup.style.display = "none";
                            }, 2000)

                        });
                        parent.remove();
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
                            console.log(data.friend_list);
                        })
                })


        })
        searchResult[count].appendChild(newImg);

        count++;

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
function createFriendList(friendData, list) {
    let imgCount = 0;
    let count = 0;
    list.innerHTML = "";
    if (friendData.friend_list.length === 0) {
        friendListEmpty.style.display = "block";
        friendListEmpty.style.display = "flex";
    } else {
        friendListEmpty.style.display = "none";
    }
    friendData.friend_list.forEach(element => {
        newDiv = document.createElement("div");
        newDiv.className = "friend";
        list.appendChild(newDiv);
        friend = document.querySelectorAll(".friend");


        let newImg = document.createElement("img");
        newImg.id = "friend-headshot";
        newImg.src = element.headshot;
        friend[count].appendChild(newImg);



        newP = document.createElement("p");
        newP.innerHTML = element.nickname;
        friend[count].appendChild(newP);

        friend[count].addEventListener("click", () => {
            let friendPopupHeadshot = document.querySelector(".friend-popup-headshot");
            // friendPopupHeadshot.src = "./images/Loading_icon.gif";
            // friendPopupHeadshot.onload = () => {
            //     friendPopupHeadshot.src = element.headshot;
            // }
            friendPopupHeadshot.src = element.headshot;
            friendPopup.style.display = "block";
            friendName.innerHTML = element.nickname;
            friendId = element.user_id;
        })
        count++;
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
