const closePopup = document.querySelector(".popup-close-btn");
const searchFriendPopup = document.querySelector(".search-friend-popup");
const addFriendBtn = document.querySelector(".add-friends-btn");
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
const signOutBtn = document.querySelector(".sign-out-btn");
const errorMessage = document.querySelector(".error-message");

let newP, newHr, newDiv, newImg;


window.onbeforeunload = () => {
    socket.disconnect();
};

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
    if (chatContainer.style.display === "block" && friendChatId.innerHTML === package.group_id) {
        displayMessage(package, false);
    }


    //立即更新對方聊天列

    let historyMsg = document.querySelector(`[data-attribute-name='${package.group_id}']`);
    if (hadGroupHistoryMsg && historyMsg) {

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
        if (chatContainer.style.display === "block" && friendChatId.innerHTML === package.group_id) {

        } else {
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
        if (package.message.indexOf(S3Url) !== -1) {
            if (package.message.match(/\(([^)]+)\)/)[1] === "video") {
                historyMsg.innerHTML = '傳送了一則影片';
            } else if (package.message.match(/\(([^)]+)\)/)[1] === "audio") {
                historyMsg.innerHTML = '傳送了一則音檔';
            } else if (package.message.match(/\(([^)]+)\)/)[1] === "image") {
                historyMsg.innerHTML = '傳送了一張照片';
            } else if (package.message.match(/\(([^)]+)\)/)[1] === "application") {
                historyMsg.innerHTML = '傳送了一份檔案';
            } else if (package.message.match(/\(([^)]+)\)/)[1] === "text") {
                historyMsg.innerHTML = '傳送了一份純文本檔案';
            }
        } else {
            if (package.message.length > 20) {
                historyMsg.innerHTML = package.message.substring(0, 19);
                historyMsg.innerHTML += ".....";
            } else {
                historyMsg.innerHTML = package.message;
            }

        }


        // const package = {
        //     group_id: friendChatId.innerHTML,
        //     self_id: parseInt(selfId.innerHTML)
        // }
        // socket.emit('group-read-message', package);



    } else {


        //     // while (groupChatListContainer.firstChild) {
        //     //     console.log("remove firstChild")
        //     //     groupChatListContainer.removeChild(groupChatListContainer.firstChild);
        //     // }

        setTimeout(() => {
            fetch("/api/get_latest_group_message")
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    createLatestGroupChatList(data.data[0]);
                })
        }, 1000);

        setTimeout(() => {
            fetch("/api/get_grouplist")
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    createGroupList(data, groupList)
                })
        }, 1000);


    }

})

socket.on("receive-message", (msg) => {
    // if (chatContainer.style.display === "block" && parseInt(friendChatId.innerHTML) === parseInt(msg.user_id)) {
    //     displayMessage(msg, false);
    // }
    console.log(msg)
    if (chatContainer.style.display === "block" && parseInt(friendChatId.innerHTML) === parseInt(msg.user_id)) {
        let room = `user${friendChatId.innerHTML}`;
        socket.emit('read-message', room);
        displayMessage(msg, false);
    }
    //立即更新對方聊天列
    let historyMsg = document.querySelector(`.user${msg.user_id}-message`);
    if (hadHistoryMsg && historyMsg) {

        const firstChildren = chatListContainer.children[0];
        let historyMsgFather = historyMsg.parentNode.parentNode;


        if (chatContainer.style.display === "block" && (clickedDiv.querySelector(`.user${msg.user_id}-message`))) {

        } else {
            //顯示未讀通知
            let isHaveUnReadMst = historyMsg.parentNode
            if (!isHaveUnReadMst.querySelector(".new-message-icon")) {
                newImg = document.createElement("img");
                newImg.src = "./images/new-message.png";
                newImg.className = "new-message-icon";
                newImg.style.width = "50px";
                newImg.style.position = "absolute";
                newImg.style.right = "10px";
                newImg.style.top = "10px";
                historyMsgFather.appendChild(newImg);
            }

        }


        if (firstChildren !== historyMsgFather) {
            chatListContainer.insertBefore(historyMsgFather, chatListContainer.firstChild);
        }
        if (msg.message.indexOf(S3Url) !== -1) {
            if (msg.message.match(/\(([^)]+)\)/)[1] === "video") {
                historyMsg.innerHTML = '傳送了一則影片';
            } else if (msg.message.match(/\(([^)]+)\)/)[1] === "audio") {
                historyMsg.innerHTML = '傳送了一則音檔';
            } else if (msg.message.match(/\(([^)]+)\)/)[1] === "image") {
                historyMsg.innerHTML = '傳送了一張照片';
            } else if (msg.message.match(/\(([^)]+)\)/)[1] === "application") {
                historyMsg.innerHTML = '傳送了一份檔案';
            } else if (msg.message.match(/\(([^)]+)\)/)[1] === "text") {
                historyMsg.innerHTML = '傳送了一份純文本檔案';
            }
        } else {
            if (msg.message.length > 20) {
                historyMsg.innerHTML = msg.message.substring(0, 19);
                historyMsg.innerHTML += ".....";
            } else {
                historyMsg.innerHTML = msg.message;
            }

        }
    } else {
        setTimeout(() => {
            fetch("/api/get_latest_message")
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    createLatestChatList(data[0], chatListContainer);
                })
        }, 1000);


        // if (hadHistoryMsg) {
        //     setTimeout(() => {
        //         fetch("/api/get_latest_message")
        //             .then((response) => {
        //                 return response.json();
        //             })
        //             .then((data) => {
        //                 createChatList(data, chatListContainer);
        //             })
        //     }, 1000);
        // } else {
        //     while (chatListContainer.firstChild) {
        //         console.log("remove firstChild")
        //         chatListContainer.removeChild(chatListContainer.firstChild);
        //     }


        //     setTimeout(() => {
        //         fetch("/api/get_latest_message")
        //             .then((response) => {
        //                 return response.json();
        //             })
        //             .then((data) => {
        //                 createLatestChatList(data[0], chatListContainer);
        //             })
        //     }, 1000);
        // }



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


signOutBtn.addEventListener("click", () => {

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


signOutBtn.addEventListener("click", () => {
    fetch("/signout", {
        method: 'POST'
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            if (data.status === "success") {
                window.location = "/";
            } else {
                errorMessage.style.display = "block";
                errorMessage.innerHTML = data.message;
                setTimeout(() => {
                    errorMessage.style.display = "none";
                }, 2000)
            }
        })
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
                if (data.status === "success") {
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
                } else {
                    if (data.message === "cookie被更改") {
                        window.location = "/";
                    } else {
                        errorMessage.style.display = "block";
                        errorMessage.innerHTML = data.message;
                        setTimeout(() => {
                            errorMessage.style.display = "none";
                        }, 2000)
                    }
                }


            })
    } else if (searchContent.search(emailRule) === -1 && searchContent != null) {
        fetch(`/api/search_user?nickname=${searchContent}`)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                if (data.status === "success") {
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
                } else {
                    if (data.message === "cookie被更改") {
                        window.location = "/";
                    } else {
                        errorMessage.style.display = "block";
                        errorMessage.innerHTML = data.message;
                        setTimeout(() => {
                            errorMessage.style.display = "none";
                        }, 2000)
                    }
                }

            })
    }

})

//點擊搜尋好友按鈕
// searchFriendBton.addEventListener("click", () => {
//     if (searchFriendInput.value) {
//         fetch(`/api/search_friend?nickname=${searchFriendInput.value}`)
//             .then((response) => {
//                 return response.json();
//             })
//             .then((data) => {
//                 searchFriendResultClose.style.display = "block";
//                 searchFriendResultList.style.display = "block";
//                 createFriendList(data, searchFriendResultList);
//             })
//     }
// })

//點擊關閉搜尋好友按鈕
searchFriendResultClose.addEventListener("click", () => {
    searchFriendResultList.style.display = "none";
    searchFriendResultClose.style.display = "none";
})


friendPopupClose.addEventListener("click", () => {
    friendPopup.style.display = "none";
    groupMemberPopupAddFriend.style.display = "none";
    popupChatBtn.style.display = "block";
    friendPopupCall.style.display = "block";
});

//關閉聊天室窗
chatCloseBtn.addEventListener("click", () => {
    stickerPopup.style.visibility = "hidden";
    chatContainer.style.display = "none";
    const parentDiv = document.querySelector(".chat-message");
    while (parentDiv.firstChild) {
        parentDiv.removeChild(parentDiv.firstChild);
    }

    let groupIsReadStatus = document.querySelector(".group-read-status");
    groupIsReadStatus.innerHTML = "";
    isAddFriendPopup.style.display = "none";
    groupMemberIcon.style.display = "none";
    chatPopupSettingContainer.style.visibility = "hidden";
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
        groupMemberIcon.style.display = "block";
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

let prevSenderId;
const S3Url = "https://maomaoimage.s3.ap-northeast-1.amazonaws.com/single_chat_file/"
function displayMessage(element, isSelf, is_read = 0, is_group = false) {
    let date = new Date(element.time);
    date = date.toLocaleString();
    console.log(date)
    let message = document.querySelector(".chat-message");

    if (element.message.indexOf(S3Url) !== -1) {
        chatFile(element, date, isSelf, is_read, is_group);

        return;
    }

    if (isSelf) {
        newDiv = document.createElement("div");
        newDiv.style.display = "flex";
        newDiv.style.justifyContent = "right";
        newDiv.style.alignItems = "end";
        message.appendChild(newDiv);


        newP = document.createElement("p");
        newP.innerHTML = date.substring(10, 16);
        newDiv.appendChild(newP);

        newP = document.createElement("p");
        newP.innerHTML = element.message;
        // newP.style.marginRight = "5px";
        // newP.style.marginLeft = "auto";
        // newP.style.marginBottom = "10px";
        newP.className = "chat-message-font";

        newDiv.appendChild(newP);


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

    } else {
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

        newDiv = document.createElement("div");
        newDiv.style.display = "flex";
        newDiv.style.justifyContent = "left";
        newDiv.style.alignItems = "end";
        newDiv.style.marginBottom = "10px";
        message.appendChild(newDiv);


        newP = document.createElement("p");
        newP.innerHTML = date.substring(10, 16);
        newP.style.marginLeft = "10px";
        newDiv.appendChild(newP);

        newP = document.createElement("p");
        newP.innerHTML = element.message;
        newP.className = "chat-message-font";
        newDiv.appendChild(newP);
        newDiv.insertBefore(newP, newDiv.firstChild)
    }
    prevSenderId = element.sender_id;


}

function chatFile(element, date, isSelf, is_read = 0, is_group = false) {
    if (!isSelf && is_group) {
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
    }

    const index = element.message.indexOf("(", element.message.length - 1 - 14);
    let fileName = element.message.substring(0, index);
    fileName = fileName.replace(S3Url, "");
    const dataType = element.message.substring(index, element.message.length);
    const chatMessage = document.querySelector(".chat-message");




    if (dataType === "(video)") {  //檔案是影片時
        if (isSelf) {

            newDiv = document.createElement("div");
            newDiv.style.display = "flex";
            newDiv.style.alignItems = "end";
            newDiv.style.justifyContent = "right";
            newDiv.style.marginBottom = "10px";
            chatMessage.appendChild(newDiv);
            const div = newDiv;

            newP = document.createElement("p");
            newP.innerHTML = date.substring(10, 16);
            newP.style.marginRight = "10px";
            newDiv.appendChild(newP);

            newDiv = document.createElement("div");
            newDiv.style.maxWidth = "200px";
            newDiv.style.position = "relative";
            newDiv.style.marginRight = "5px";
            newDiv.style.cursor = "pointer";
            div.appendChild(newDiv)




        } else {

            newDiv = document.createElement("div");
            newDiv.style.display = "flex";
            newDiv.style.alignItems = "end";
            newDiv.style.justifyContent = "left";
            newDiv.style.marginBottom = "10px";
            chatMessage.appendChild(newDiv);
            const div = newDiv;


            newDiv = document.createElement("div");
            newDiv.style.maxWidth = "200PX";
            newDiv.style.position = "relative";
            newDiv.style.marginLeft = "5px";
            newDiv.style.cursor = "pointer";
            div.appendChild(newDiv)



            newP = document.createElement("p");
            newP.innerHTML = date.substring(10, 16);
            newP.style.marginLeft = "10px";
            div.appendChild(newP);

        }
        newImg = document.createElement("img");
        newImg.src = `https://maomaoimage.s3.ap-northeast-1.amazonaws.com/videoImage/${fileName}`;
        newImg.style.maxWidth = "200PX";
        newImg.style.borderRadius = "10px";
        newDiv.appendChild(newImg);
        newDiv.addEventListener("click", () => {
            window.open(`${S3Url}${fileName}${dataType}`, "影片", "width=600,height=600,top=" + (screen.height - 600) / 2 + ",left=" + (screen.width - 600) / 2);
        })


        newImg = document.createElement("img");
        newImg.src = "./images/play.png";
        newImg.style.position = "absolute";
        newImg.style.transform = "translate(-50%, -50%)";
        newImg.style.top = "50%";
        newImg.style.left = "50%";
        newImg.style.width = "100px";
        newDiv.appendChild(newImg)

    } else if (dataType === "(audio)") {
        newDiv = document.createElement("div");
        newDiv.style.display = "flex";
        newDiv.style.marginBottom = "10px";
        if (isSelf) {
            newDiv.style.justifyContent = "right";
        } else {
            newDiv.style.justifyContent = "left";
        }
        newDiv.style.alignItems = "end";

        chatMessage.appendChild(newDiv);


        newP = document.createElement("p");
        newP.innerHTML = date.substring(10, 16);
        if (isSelf) {
            newP.style.marginRight = "10px";
        } else {
            newP.style.marginLeft = "10px";
        }

        newDiv.appendChild(newP);



        let newAudio = document.createElement("audio");
        newAudio.controls = true;
        newAudio.style.display = "flex";
        newAudio.style.width = "250px";

        newAudio.src = `${S3Url}${fileName}${dataType}`;
        newDiv.appendChild(newAudio);

        if (!isSelf) {
            newDiv.insertBefore(newAudio, newDiv.firstChild)
        }
    } else if (dataType === "(image)") {
        newDiv = document.createElement("div");
        newDiv.style.display = "flex";
        newDiv.style.marginBottom = "10px";
        if (isSelf) {
            newDiv.style.justifyContent = "right";
        } else {
            newDiv.style.justifyContent = "left";
        }
        newDiv.style.alignItems = "end";

        chatMessage.appendChild(newDiv);


        newP = document.createElement("p");
        newP.innerHTML = date.substring(10, 16);
        if (isSelf) {
            newP.style.marginRight = "10px";
        } else {
            newP.style.marginLeft = "10px";
        }
        newDiv.appendChild(newP);


        newImg = document.createElement("img");
        newImg.src = `${S3Url}${fileName}${dataType}`;
        newImg.style.maxWidth = "200px";
        newImg.style.display = "block";
        newImg.style.borderRadius = "10px";
        newImg.style.cursor = "pointer";
        newImg.addEventListener("click", () => {
            newImg.src = newImg.src;
            window.open(`${S3Url}${fileName}${dataType}`, "影片", "width=600,height=600,top=" + (screen.height - 600) / 2 + ",left=" + (screen.width - 600) / 2);
        })
        newDiv.appendChild(newImg);
        if (!isSelf) {
            newDiv.insertBefore(newImg, newDiv.firstChild)
        }
    } else if (dataType === "(application)") {
        newDiv = document.createElement("div");
        newDiv.style.display = "flex";
        newDiv.style.marginBottom = "10px";
        if (isSelf) {
            newDiv.style.justifyContent = "right";
        } else {
            newDiv.style.justifyContent = "left";
        }
        newDiv.style.alignItems = "end";

        chatMessage.appendChild(newDiv);


        newP = document.createElement("p");
        newP.innerHTML = date.substring(10, 16);
        if (isSelf) {
            newP.style.marginRight = "10px";
        } else {
            newP.style.marginLeft = "10px";
        }
        newDiv.appendChild(newP);


        newImg = document.createElement("img");
        newImg.src = "./images/word-doc.png";
        newImg.style.width = "100px";
        newImg.style.display = "block";
        newImg.style.cursor = "pointer";
        newImg.addEventListener("click", () => {
            newImg.src = newImg.src;
            window.open(`${S3Url}${fileName}${dataType}`, "影片", "width=600,height=600,top=" + (screen.height - 600) / 2 + ",left=" + (screen.width - 600) / 2);
        })
        newDiv.appendChild(newImg);
        if (!isSelf) {
            newDiv.insertBefore(newImg, newDiv.firstChild)
        }
    } else if (dataType === "(text)") {
        newDiv = document.createElement("div");
        newDiv.style.display = "flex";
        newDiv.style.marginBottom = "10px";
        if (isSelf) {
            newDiv.style.justifyContent = "right";
        } else {
            newDiv.style.justifyContent = "left";
        }
        newDiv.style.alignItems = "end";

        chatMessage.appendChild(newDiv);


        newP = document.createElement("p");
        newP.innerHTML = date.substring(10, 16);
        if (isSelf) {
            newP.style.marginRight = "10px";
        } else {
            newP.style.marginLeft = "10px";
        }
        newDiv.appendChild(newP);


        newImg = document.createElement("img");
        newImg.src = "./images/txt.png";
        newImg.style.width = "100px";
        newImg.style.display = "block";
        newImg.style.cursor = "pointer";
        newImg.addEventListener("click", () => {
            newImg.src = newImg.src;
            window.open(`${S3Url}${fileName}${dataType}`, "影片", "width=600,height=600,top=" + (screen.height - 600) / 2 + ",left=" + (screen.width - 600) / 2);
        })
        newDiv.appendChild(newImg);
        if (!isSelf) {
            newDiv.insertBefore(newImg, newDiv.firstChild)
        }
    }




    //已讀狀態的顯示
    if (isSelf) {
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
            chatMessage.appendChild(newP);
        } else {
            groupMemberIcon.style.display = "block";

        }
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
                groupMemberIcon.style.display = "block";
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



async function sendMsgInSingle(fileName = "") {
    let package;
    const now = new Date();


    if (fileName) {
        package = {
            "user_id": parseInt(selfId.innerHTML),
            "friend_id": parseInt(friendChatId.innerHTML),
            "message": fileName,
            "time": now
        }

    } else {
        package = {
            "user_id": parseInt(selfId.innerHTML),
            "friend_id": parseInt(friendChatId.innerHTML),
            "message": messageInput.value,
            "time": now
        }
    }
    if (messageInput.value || fileName) {
        let room = `user${package.friend_id}`;
        await socket.emit('send-message', package, room);
        let historyMsg = document.querySelector(`.user${package.friend_id}-message`);
        if (hadHistoryMsg && historyMsg) {

            const firstChildren = chatListContainer.children[0];
            if (clickedDiv) {
                if (firstChildren !== clickedDiv) {
                    chatListContainer.insertBefore(clickedDiv, chatListContainer.firstChild);
                }
                if (package.message.indexOf(S3Url) !== -1) {
                    if (package.message.match(/\(([^)]+)\)/)[1] === "video") {
                        historyMsg.innerHTML = '傳送了一則影片';
                    } else if (package.message.match(/\(([^)]+)\)/)[1] === "audio") {
                        historyMsg.innerHTML = '傳送了一則音檔';
                    } else if (package.message.match(/\(([^)]+)\)/)[1] === "image") {
                        historyMsg.innerHTML = '傳送了一張照片';
                    } else if (package.message.match(/\(([^)]+)\)/)[1] === "application") {
                        historyMsg.innerHTML = '傳送了一份檔案';
                    } else if (package.message.match(/\(([^)]+)\)/)[1] === "text") {
                        historyMsg.innerHTML = '傳送了一份純文本檔案';
                    }
                } else {
                    if (package.message.length > 20) {
                        historyMsg.innerHTML = package.message.substring(0, 19);
                        historyMsg.innerHTML += ".....";
                    } else {
                        historyMsg.innerHTML = package.message;
                    }

                }
            } else {
                while (chatListContainer.firstChild) {
                    console.log("remove firstChild")
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
                console.log("remove firstChild")
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

async function sendMsgInGroup(fileName = "") {
    const now = new Date();
    let groupIsReadStatus = document.querySelector(".group-read-status");
    groupIsReadStatus.innerHTML = `0人已讀`;
    let selfNickname = document.querySelector(".profile-name-content").innerHTML;
    let selfHeadshot = document.querySelector(".headshot").src;
    let package;
    if (fileName) {
        package = {
            group_id: friendChatId.innerHTML,
            sender_id: parseInt(selfId.innerHTML),
            message: fileName,
            sender_headshot: selfHeadshot,
            sender_nickname: selfNickname,
            time: now
        }

    } else {
        package = {
            group_id: friendChatId.innerHTML,
            sender_id: parseInt(selfId.innerHTML),
            message: messageInput.value,
            sender_headshot: selfHeadshot,
            sender_nickname: selfNickname,
            time: now
        }
    }

    if (messageInput.value || fileName) {

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
                if (package.message.indexOf(S3Url) !== -1) {
                    if (package.message.match(/\(([^)]+)\)/)[1] === "video") {
                        groupMessage.innerHTML = '傳送了一則影片';
                    } else if (package.message.match(/\(([^)]+)\)/)[1] === "audio") {
                        groupMessage.innerHTML = '傳送了一則音檔';
                    } else if (package.message.match(/\(([^)]+)\)/)[1] === "image") {
                        groupMessage.innerHTML = '傳送了一張照片';
                    } else if (package.message.match(/\(([^)]+)\)/)[1] === "application") {
                        groupMessage.innerHTML = '傳送了一份檔案';
                    } else if (package.message.match(/\(([^)]+)\)/)[1] === "text") {
                        groupMessage.innerHTML = '傳送了一份純文本檔案';
                    }
                } else {
                    if (package.message.length > 20) {
                        groupMessage.innerHTML = package.message.substring(0, 19);
                        groupMessage.innerHTML += ".....";
                    } else {
                        groupMessage.innerHTML = package.message;
                    }

                }
            } else {
                while (groupChatListContainer.firstChild) {
                    console.log("remove firstChild")
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
                console.log("remove firstChild")
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

        displayMessage(package, true, 0, true);
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


