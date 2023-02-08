const closePopup = document.querySelector(".popup-close-btn");
const searchFriendPopup = document.querySelector(".search-friend-popup");
const addFriendBtn = document.querySelector(".add-friend-btn");
const popupAddFriendBtn = document.querySelector("#add-friend-popup-btn");
const addFriendInput = document.querySelector("#add-friend-popup-input");
const popupAddFriendResult = document.querySelector(".search-friend-popup-result");
const searchFriendBton = document.querySelector("#search-friend-btn");
const searchFriendInput = document.querySelector(".search-friend");
const friendList = document.querySelector(".friend-list");
const friendPopup = document.querySelector(".friend-popup");
const friendName = document.querySelector(".friend-nickname");
const friendPopupClose = document.querySelector(".friend-popup-close");
const popupChatBtn = document.querySelector(".friend-popup-chatbox");
const chatContainer = document.querySelector(".chat-container");
const chatBoxFriendName = document.querySelector(".chat-friend-name");
const chatCloseBtn = document.querySelector(".chat-container-close-btn");
const friendId = document.querySelector(".friend-user_id");
const friendChatId = document.querySelector(".chat-friend-user_id");
const selfId = document.querySelector(".self-id");
const socket = io();
const snedMessage = document.querySelector(".send-message");
const messageInput = document.querySelector(".message-input");
const addFriendStatus = document.querySelector(".add-friend-status");
const addFriendStatusPopup = document.querySelector(".add-friend-status-popup");
const searchEmptyImage = document.querySelector(".search-empty-image");
const searchFriendPopImage = document.querySelector(".search-friend-popup-image");
const searchFriendResultList = document.querySelector(".search-result-list");
const searchFriendResultClose = document.querySelector(".search-result-list-close");
const groupList = document.querySelector(".group-list");
const chatListContainer = document.querySelector(".chat-list-container");
const emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;

let newP, newHr, newDiv, newImg;


fetch("/api/get_friendlist")
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        createFriendList(data, friendList);
        selfId.innerHTML = data.self_id;
        socket.emit("join-self-room", data.self_id);
    })
    .then(() => {
        fetch("/api/get_latest_message")
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                createChatList(data, chatListContainer);
            })

    })


fetch("/api/get_grouplist")
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        createGroupList(data, groupList);
    })
    .then(() => {
        fetch("/api/get_latest_group_message")
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                createGroupChatList(data.data);
            })
    })



socket.on("receive-group-message", (package) => {
    displayMessage(package, false);

    //立即更新對方聊天列
    if (hadGroupHistoryMsg) {
        let historyMsg = document.querySelector(`[data-attribute-name='${package.group_id}']`);
        const firstChildren = groupChatListContainer.children[0];
        let historyMsgFather = historyMsg.parentNode.parentNode;

        if (chatContainer.style.display === "block") {
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
        if (!historyMsgFather.querySelector(".new-message-icon")) {
            //顯示未讀通知
            newImg = document.createElement("img");
            newImg.src = "./images/new-message.png";
            newImg.className = "new-message-icon";
            newImg.style.width = "50px";
            newImg.style.position = "absolute";
            newImg.style.right = "10px";
            newImg.style.top = "10px";
            historyMsgFather.appendChild(newImg);
        }


        if (firstChildren !== historyMsgFather) {
            groupChatListContainer.insertBefore(historyMsgFather, groupChatListContainer.firstChild);
        }
        historyMsg.innerHTML = package.message;

        // const package = {
        //     group_id: friendChatId.innerHTML,
        //     self_id: parseInt(selfId.innerHTML)
        // }
        // socket.emit('group-read-message', package);



    } else {
        setTimeout(() => {
            fetch("/api/get_latest_group_message")
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    createGroupChatList(data.data);
                })
        }, 2000);

    }

})

socket.on("receive-message", (msg) => {
    displayMessage(msg, false);
    if (chatContainer.style.display === "block" && parseInt(msg.user_id) === parseInt(friendChatId.innerHTML)) {
        let room = `user${friendChatId.innerHTML}`;
        socket.emit('read-message', room);
    }
    //立即更新對方聊天列
    if (hadHistoryMsg) {
        let historyMsg = document.querySelector(`.user${msg.user_id}-message`);
        const firstChildren = chatListContainer.children[0];
        let historyMsgFather = historyMsg.parentNode.parentNode;

        //顯示未讀通知
        newImg = document.createElement("img");
        newImg.src = "./images/new-message.png";
        newImg.className = "new-message-icon";
        newImg.style.width = "50px";
        newImg.style.position = "absolute";
        newImg.style.right = "10px";
        newImg.style.top = "10px";
        historyMsgFather.appendChild(newImg);

        if (firstChildren !== historyMsgFather) {
            chatListContainer.insertBefore(historyMsgFather, chatListContainer.firstChild);
        }
        historyMsg.innerHTML = msg.message;
    } else {
        setTimeout(() => {
            fetch("/api/get_latest_message")
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    createChatList(data, chatListContainer);
                })
        }, 2000);

    }

});

socket.on("receive-read-message", () => {
    let readMsgStatus = document.querySelectorAll(".read-message-status");
    readMsgStatus.forEach(element => {
        element.innerHTML = "已讀";
    })

})

socket.on("self-receive-group-read-message", (hadReadCount) => {
    let groupIsReadStatus = document.querySelector(".group-read-status");
    groupIsReadStatus.innerHTML = `${hadReadCount}人已讀`;
})

socket.on("receive-group-read-message", (hadReadCount) => {
    let groupIsReadStatus = document.querySelector(".group-read-status");
    groupIsReadStatus.innerHTML = `${hadReadCount}人已讀`;
})



closePopup.addEventListener("click", () => {
    searchFriendPopup.style.display = "none";
    searchEmptyImage.style.display = "none";
    addFriendInput.value = "";
    removeSearchList();
});

addFriendBtn.addEventListener("click", () => {
    searchFriendPopImage.style.display = "block";
    searchFriendPopup.style.display = "block";
})

//點擊搜尋使用者
popupAddFriendBtn.addEventListener("click", () => {
    removeSearchList();
    const searchContent = addFriendInput.value;
    if (searchContent.search(emailRule) !== -1 && searchContent != null) {
        fetch(`/api/search_user?email=${searchContent}`)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                if (data.user.length === 0) {
                    searchFriendPopImage.style.display = "none";
                    searchEmptyImage.style.display = "block";
                    popupAddFriendResult.style.display = "none";
                } else {
                    searchFriendPopImage.style.display = "none";
                    searchEmptyImage.style.display = "none";
                    popupAddFriendResult.style.display = "block";
                    createUserHtml(data.user);
                }

            })
    } else if (searchContent.search(emailRule) === -1 && searchContent != null) {
        fetch(`/api/search_user?nickname=${searchContent}`)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                if (data.user.length === 0) {
                    searchFriendPopImage.style.display = "none";
                    searchEmptyImage.style.display = "block";
                    popupAddFriendResult.style.display = "none";
                } else {
                    searchFriendPopImage.style.display = "none";
                    searchEmptyImage.style.display = "none";
                    popupAddFriendResult.style.display = "block";
                    createUserHtml(data.user);
                }
            })
    }

})

//點擊搜尋好友按鈕
searchFriendBton.addEventListener("click", () => {
    if (searchFriendInput.value) {
        fetch(`/api/search_friend?nickname=${searchFriendInput.value}`)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                searchFriendResultClose.style.display = "block";
                searchFriendResultList.style.display = "block";
                createFriendList(data, searchFriendResultList);
            })
    }
})

//點擊關閉搜尋好友按鈕
searchFriendResultClose.addEventListener("click", () => {
    searchFriendResultList.style.display = "none";
    searchFriendResultClose.style.display = "none";
})


friendPopupClose.addEventListener("click", () => {
    friendPopup.style.display = "none";
    groupMemberPopupAddFriend.style.display = "none";
    popupChatBtn.style.display = "block";
});

//關閉聊天室窗
chatCloseBtn.addEventListener("click", () => {
    chatContainer.style.display = "none";
    const parentDiv = document.querySelector(".chat-message");
    const groupMember = document.querySelectorAll(".group-member-headshot-nickname");
    const pElements = parentDiv.querySelectorAll("p");
    const ImgElements = parentDiv.querySelectorAll("img");
    pElements.forEach(element => {
        element.remove();
    })
    ImgElements.forEach(element => {
        element.remove();
    })
    groupMember.forEach(element => {
        element.remove();
    })
    let groupIsReadStatus = document.querySelector(".group-read-status");
    groupIsReadStatus.innerHTML = "";
    isAddFriendPopup.style.display = "none";
    groupMemberIcon.style.display = "none";
})

popupChatBtn.addEventListener("click", () => {
    if (chatContainer.style.display === "block") {
        const parentDiv = document.querySelector(".chat-message");
        const groupMember = document.querySelectorAll(".group-member-headshot-nickname");
        const pElements = parentDiv.querySelectorAll("p");
        const ImgElements = parentDiv.querySelectorAll("img");
        pElements.forEach(element => {
            element.remove();
        })
        ImgElements.forEach(element => {
            element.remove();
        })
        groupMember.forEach(element => {
            element.remove();
        })
        let groupIsReadStatus = document.querySelector(".group-read-status");
        groupIsReadStatus.innerHTML = "";
        isAddFriendPopup.style.display = "none";
        groupMemberIcon.style.display = "none";
    }
    chatPopup();

})



snedMessage.addEventListener("click", async (e) => {
    const isGroup = isNaN(friendChatId.innerHTML);
    if (!isGroup) {
        sendMsgInSingle();
    } else {
        sendMsgInGroup();
    }

})

messageInput.addEventListener("keyup", (e) => {
    const isGroup = isNaN(friendChatId.innerHTML);
    if (e.keyCode === 13) {
        let englishWord = messageInput.value.match(/[A-Za-z]/g);
        let symbolRegex = messageInput.value.match(/[^\u4e00-\u9fa5\w]/g);
        if (symbolRegex) {
            if (messageInput.value.length === symbolRegex.length) {
                if (!isGroup) {
                    sendMsgInSingle();
                } else {
                    sendMsgInGroup();
                }
            }
        }
        else if (englishWord) {
            console.log(englishWord.length)
            if (messageInput.value.length === englishWord.length) {
                if (!isGroup) {
                    sendMsgInSingle();
                } else {
                    sendMsgInGroup();
                }
            }

        }
        else if (symbolRegex && englishWord) {
            if (messageInput.value.length === (englishWord.length + symbolRegex.length)) {
                if (!isGroup) {
                    sendMsgInSingle();
                } else {
                    sendMsgInGroup();
                }
            }
        }
    }
});


messageInput.addEventListener("compositionend", (e) => {
    const isGroup = isNaN(friendChatId.innerHTML);
    messageInput.addEventListener("keyup", (e) => {
        if (e.keyCode === 13) {
            if (!isGroup) {
                sendMsgInSingle();
            } else {
                sendMsgInGroup();
            }
        }
    })
    snedMessage.addEventListener("click", async (e) => {
        if (!isGroup) {
            sendMsgInSingle();
        } else {
            sendMsgInGroup();
        }
    });
})





function createFriendList(friendData, list) {
    let count = 0;
    list.innerHTML = "";
    friendData.friend_list.forEach(element => {
        newDiv = document.createElement("div");
        newDiv.className = "friend";
        list.appendChild(newDiv);
        friend = document.querySelectorAll(".friend");

        newImg = document.createElement("img");
        newImg.src = element.headshot;
        newImg.id = "friend-headshot";
        friend[count].appendChild(newImg);

        newP = document.createElement("p");
        newP.innerHTML = element.nickname;
        friend[count].appendChild(newP);

        friend[count].addEventListener("click", () => {
            let friendPopupHeadshot = document.querySelector(".friend-popup-headshot");
            friendPopupHeadshot.src = element.headshot;
            friendPopup.style.display = "block";
            friendName.innerHTML = element.nickname;
            friendId.innerHTML = element.user_id;
        })
        count++;
    })
}

function createGroupList(groupData, list) {
    let count = 0;
    list.innerHTML = "";
    groupData.group_list.forEach(element => {
        newDiv = document.createElement("div");
        newDiv.className = "group";
        list.appendChild(newDiv);
        let group = document.querySelectorAll(".group");

        newImg = document.createElement("img");
        newImg.src = element.headshot;
        newImg.id = "group-headshot";
        group[count].appendChild(newImg);

        newP = document.createElement("p");
        newP.innerHTML = element.group_name;
        group[count].appendChild(newP);

        group[count].addEventListener("click", () => {
            let friendPopupHeadshot = document.querySelector(".friend-popup-headshot");
            friendPopupHeadshot.src = element.headshot;
            friendPopup.style.display = "block";
            friendName.innerHTML = element.group_name;
            friendId.innerHTML = element.group_id;
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



        // newP = document.createElement("p");
        // newP.innerHTML = element.email;
        // searchResult[count].appendChild(newP);

        newImg = document.createElement("img");
        newImg.src = element.headshot;
        newImg.style.width = "100px";
        newImg.style.height = "100px";
        newImg.style.marginTop = "20px";
        newImg.style.objectFit = "cover";
        newImg.style.borderRadius = "10px";
        searchResult[count].appendChild(newImg);

        newP = document.createElement("p");
        newP.innerHTML = element.nickname;
        newP.style.fontWeight = "bolder";
        newP.style.fontSize = "30px";
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
        newHr = document.createElement("hr");
        newHr.style.width = "70%";
        newHr.style.margin = "auto";
        searchResult[count].appendChild(newHr);
        count++;

    })


}

let prevSenderId;
function displayMessage(element, isSelf, is_read = 0, is_group = false) {
    let message = document.querySelector(".chat-message");


    if (isSelf) {
        newP = document.createElement("p");
        newP.innerHTML = element.message;
        newP.style.marginRight = "5px";
        newP.style.marginLeft = "auto";
        newP.style.marginBottom = "10px";
        newP.className = "chat-message-font";

        message.appendChild(newP);


        //已讀狀態的顯示
        if (!is_group) {
            groupMemberIcon.style.display = "none";
            newP = document.createElement("p");
            newP.className = "read-message-status";
            if (is_read === 1) {
                newP.innerHTML = "已讀";
            } else {
                newP.innerHTML = "";
            }
            newP.style.fontSize = "10px";
            newP.style.textAlign = "right";
            newP.style.paddingLeft = "5px";
            newP.style.marginBottom = "10px";
            newP.style.marginRight = "10px";
            message.appendChild(newP);
        } else {
            groupMemberIcon.style.display = "block";

        }

    }
    else {
        if (is_group) {
            //顯示對方大頭貼跟暱稱
            newDiv = document.createElement("div");
            newDiv.className = 'group-member-headshot-nickname';
            message.appendChild(newDiv);
            let groupMember = document.querySelectorAll(".group-member-headshot-nickname");


            if (groupMember.length === 1 || prevSenderId !== element.sender_id) {
                newImg = document.createElement("img");
                newImg.src = element.sender_headshot;
                newImg.className = "group-chat-member-headshot";
                newImg.style.width = "30px";
                newImg.style.height = "30px";
                newImg.style.borderRadius = "50px";
                newImg.style.objectFit = "cover";
                groupMember[groupMember.length - 1].appendChild(newImg);


                newP = document.createElement("p");
                newP.className = "group-chat-member-nickname";
                newP.innerHTML = element.sender_nickname;
                groupMember[groupMember.length - 1].appendChild(newP);


            }

        }
        newP = document.createElement("p");
        newP.innerHTML = element.message;
        newP.style.marginBottom = "10px";
        newP.className = "chat-message-font";
        message.appendChild(newP);
    }
    prevSenderId = element.sender_id;


}



function chatPopup() {
    chatContainer.style.display = "block";
    chatBoxFriendName.innerHTML = friendName.innerHTML;
    friendChatId.innerHTML = friendId.innerHTML;
    friendPopup.style.display = "none";
    const isGroup = isNaN(friendChatId.innerHTML);
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
            if (isGroup) {
                data.message.forEach(element => {
                    if (element.sender_id === parseInt(selfId.innerHTML)) {
                        displayMessage(element, true, element.is_read, true);
                    } else {
                        displayMessage(element, false, element.is_read, true);
                    }
                })
                let groupIsReadStatus = document.querySelector(".group-read-status");
                groupIsReadStatus.innerHTML = `${data.message[0].read_count}人已讀`;
            } else {
                data.message.forEach(element => {
                    if (element.sender_id === parseInt(selfId.innerHTML)) {
                        displayMessage(element, true, element.is_read);
                    } else {
                        displayMessage(element, false, element.is_read);
                    }

                })
            }

        })

}

async function sendMsgInSingle() {
    const package = {
        "user_id": parseInt(selfId.innerHTML),
        "friend_id": parseInt(friendChatId.innerHTML), //放陣列
        "message": messageInput.value
    }
    if (messageInput.value) {
        let room = `user${package.friend_id}`;
        await socket.emit('send-message', package, room);
        let historyMsg = document.querySelector(`.user${package.friend_id}-message`);
        if (hadHistoryMsg && historyMsg) {

            const firstChildren = chatListContainer.children[0];
            if (clickedDiv) {
                if (firstChildren !== clickedDiv) {
                    chatListContainer.insertBefore(clickedDiv, chatListContainer.firstChild);
                }
                historyMsg.innerHTML = package.message;
            } else {
                while (chatListContainer.firstChild) {
                    chatListContainer.removeChild(chatListContainer.firstChild);
                }
                setTimeout(() => {
                    fetch("/api/get_latest_message")
                        .then((response) => {
                            return response.json();
                        })
                        .then((data) => {
                            createChatList(data, chatListContainer);
                        })
                }, 1000);

            }

        } else {
            while (chatListContainer.firstChild) {
                chatListContainer.removeChild(chatListContainer.firstChild);
            }
            setTimeout(() => {
                fetch("/api/get_latest_message")
                    .then((response) => {
                        return response.json();
                    })
                    .then((data) => {
                        createChatList(data, chatListContainer);
                    })
            }, 1000);

        }

        displayMessage(package, true);
        messageInput.value = '';

    }
}

async function sendMsgInGroup() {
    let groupIsReadStatus = document.querySelector(".group-read-status");
    groupIsReadStatus.innerHTML = `0人已讀`;
    let selfNickname = document.querySelector(".profile-name-content").innerHTML;
    let selfHeadshot = document.querySelector(".headshot").src;
    let package = {
        group_id: friendChatId.innerHTML,
        sender_id: parseInt(selfId.innerHTML),
        message: messageInput.value,
        sender_headshot: selfHeadshot,
        sender_nickname: selfNickname
    }
    if (messageInput.value) {

        await socket.emit("send-message-to-group", package);
        let groupMessage = document.querySelector(`[data-attribute-name='${package.group_id}']`);
        if (hadGroupHistoryMsg && groupMessage) {


            // let attrValue = groupMessage.getAttribute(friendChatId.innerHTML);
            // console.log("groupmsg", groupMessage)
            // console.log(attrValue);
            const firstChildren = groupChatListContainer.children[0];
            if (clickedDiv) {
                if (firstChildren !== clickedDiv) {
                    groupChatListContainer.insertBefore(clickedDiv, groupChatListContainer.firstChild);
                }
                groupMessage.innerHTML = package.message;
            } else {
                while (groupChatListContainer.firstChild) {
                    console.log(groupChatListContainer.firstChild)
                    groupChatListContainer.removeChild(groupChatListContainer.firstChild);
                }
                setTimeout(() => {
                    fetch("/api/get_latest_group_message")
                        .then((response) => {
                            return response.json();
                        })
                        .then((data) => {
                            createGroupChatList(data.data);
                        })
                }, 1000);

            }

        } else {
            while (groupChatListContainer.firstChild) {
                console.log(groupChatListContainer.firstChild)
                groupChatListContainer.removeChild(groupChatListContainer.firstChild);
            }
            setTimeout(() => {
                fetch("/api/get_latest_group_message")
                    .then((response) => {
                        return response.json();
                    })
                    .then((data) => {
                        createGroupChatList(data.data);
                    })
            }, 1000);

        }

        displayMessage(package.message, true);
        messageInput.value = '';

    }


}

function removeSearchList() {
    const searchList = document.querySelectorAll(".search-result");
    searchList.forEach(element => {
        element.parentNode.removeChild(element);
    })
}

//輸入文字卷軸會自動往下
const message = document.querySelector(".chat-message");
message.scrollTop = message.scrollHeight;
const observer = new MutationObserver((mutations) => {
    message.scrollTop = message.scrollHeight;
});
observer.observe(message, { childList: true });


