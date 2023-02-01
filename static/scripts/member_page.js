const closePopup = document.querySelector(".popup-close-btn");
const searchFriendPopup = document.querySelector(".search-friend-popup");
const addFriendBtn = document.querySelector(".add-friend-btn");
const popupAddFriendBtn = document.querySelector("#add-friend-popup-btn");
const addFriendInput = document.querySelector("#add-friend-popup-input");
const popupAddFriendResult = document.querySelector(".search-friend-popup-result");

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
const emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;

let newP, newHr, newDiv, newImg;

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

popupAddFriendBtn.addEventListener("click", () => {
    const searchContent = addFriendInput.value;
    if (searchContent.search(emailRule) !== -1 && searchContent != null) {
        fetch(`/api_search_user?email=${searchContent}`)
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





friendPopupClose.addEventListener("click", () => {
    friendPopup.style.display = "none";
});

chatCloseBtn.addEventListener("click", () => {
    chatContainer.style.display = "none";
    const parentDiv = document.querySelector(".chat-message");
    const pElements = parentDiv.querySelectorAll("p");
    for (let i = 0; i < pElements.length; i++) {
        parentDiv.removeChild(pElements[i]);
    }
    isAddFriendPopup.style.display = "none";



})

popupChatBtn.addEventListener("click", () => {
    chatContainer.style.display = "block";
    chatBoxFriendName.innerHTML = friendName.innerHTML;
    friendChatId.innerHTML = friendId.innerHTML;
    friendPopup.style.display = "none";

    fetch("/api/get_message", {
        method: "POST",
        body: JSON.stringify({
            "myId": selfId.innerHTML,
            "friendId": friendChatId.innerHTML
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
                if (element.sender_id === parseInt(selfId.innerHTML)) {
                    displayMessage(element.message, true, element.is_read);
                } else {
                    displayMessage(element.message, false, element.is_read);
                }

            })
        })

})



snedMessage.addEventListener("click", async (e) => {
    console.log("click");
    const package = {
        "user_id": parseInt(selfId.innerHTML),
        "friend_id": parseInt(friendChatId.innerHTML),
        "message": messageInput.value
    }
    e.preventDefault();

    if (messageInput.value) {
        let room = `user${package.friend_id}`;
        await socket.emit('send-message', package, room);
        if (hadHistoryMsg) {
            let historyMsg = document.querySelector(`.user${package.friend_id}-message`);
            const firstChildren = chatListContainer.children[0];
            if (clickedDiv) {
                console.log(1)
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
                            createChatList(data);
                        })
                }, 1000);

            }

        } else {
            setTimeout(() => {
                fetch("/api/get_latest_message")
                    .then((response) => {
                        return response.json();
                    })
                    .then((data) => {
                        createChatList(data);
                    })
            }, 2000);

        }

        displayMessage(package.message, true);
        messageInput.value = '';
    }

});

messageInput.addEventListener("keyup", (e) => {
    if (e.keyCode === 13) {
        let englishWord = messageInput.value.match(/[A-Za-z]/g);
        let symbolRegex = messageInput.value.match(/[^\u4e00-\u9fa5\w]/g);
        if (symbolRegex) {
            if (messageInput.value.length === symbolRegex.length) {
                const package = {
                    "user_id": parseInt(selfId.innerHTML),
                    "friend_id": parseInt(friendChatId.innerHTML),
                    "message": messageInput.value
                }
                e.preventDefault();

                if (messageInput.value) {
                    let room = `user${package.friend_id}`;
                    socket.emit('send-message', package, room);
                    if (hadHistoryMsg) {
                        let historyMsg = document.querySelector(`.user${package.friend_id}-message`);
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
                                        createChatList(data);
                                    })
                            }, 2000);

                        }

                    } else {
                        setTimeout(() => {
                            fetch("/api/get_latest_message")
                                .then((response) => {
                                    return response.json();
                                })
                                .then((data) => {
                                    createChatList(data);
                                })
                        }, 2000);

                    }
                    displayMessage(package.message, true);
                    messageInput.value = '';
                }
            }



        }
        if (englishWord) {
            if (messageInput.value.length === englishWord.length) {
                const package = {
                    "user_id": parseInt(selfId.innerHTML),
                    "friend_id": parseInt(friendChatId.innerHTML),
                    "message": messageInput.value
                }
                e.preventDefault();

                if (messageInput.value) {
                    let room = `user${package.friend_id}`;
                    socket.emit('send-message', package, room);
                    if (hadHistoryMsg) {
                        let historyMsg = document.querySelector(`.user${package.friend_id}-message`);
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
                                        createChatList(data);
                                    })
                            }, 2000);

                        }

                    } else {
                        setTimeout(() => {
                            fetch("/api/get_latest_message")
                                .then((response) => {
                                    return response.json();
                                })
                                .then((data) => {
                                    createChatList(data);
                                })
                        }, 2000);

                    }
                    displayMessage(package.message, true);
                    messageInput.value = '';
                }
            }
        }

    }
})


messageInput.addEventListener("compositionend", (e) => {
    messageInput.addEventListener("keyup", (e) => {
        if (e.keyCode === 13) {
            const package = {
                "user_id": parseInt(selfId.innerHTML),
                "friend_id": parseInt(friendChatId.innerHTML),
                "message": messageInput.value
            }
            e.preventDefault();

            if (messageInput.value) {
                let room = `user${package.friend_id}`;
                socket.emit('send-message', package, room);
                if (hadHistoryMsg) {
                    let historyMsg = document.querySelector(`.user${package.friend_id}-message`);
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
                                    createChatList(data);
                                })
                        }, 2000);

                    }

                } else {
                    setTimeout(() => {
                        fetch("/api/get_latest_message")
                            .then((response) => {
                                return response.json();
                            })
                            .then((data) => {
                                createChatList(data);
                            })
                    }, 2000);

                }
                displayMessage(package.message, true);
                messageInput.value = '';
            }
        }
    })
    snedMessage.addEventListener("click", async (e) => {
        console.log("click");
        const package = {
            "user_id": parseInt(selfId.innerHTML),
            "friend_id": parseInt(friendChatId.innerHTML),
            "message": messageInput.value
        }
        e.preventDefault();

        if (messageInput.value) {
            let room = `user${package.friend_id}`;
            await socket.emit('send-message', package, room);
            if (hadHistoryMsg) {
                let historyMsg = document.querySelector(`.user${package.friend_id}-message`);
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
                                createChatList(data);
                            })
                    }, 2000);

                }

            } else {
                setTimeout(() => {
                    fetch("/api/get_latest_message")
                        .then((response) => {
                            return response.json();
                        })
                        .then((data) => {
                            createChatList(data);
                        })
                }, 2000);

            }

            displayMessage(package.message, true);
            messageInput.value = '';
        }

    });
})


socket.on("receive-message", (msg) => {
    displayMessage(msg.message, false);
    if (chatContainer.style.display === "block" && parseInt(msg.user_id) === parseInt(friendChatId.innerHTML)) {
        let room = `user${friendChatId.innerHTML}`;
        socket.emit('read-message', room);
    }
    //立即更新對方聊天列
    if (hadHistoryMsg) {
        let historyMsg = document.querySelector(`.user${msg.user_id}-message`);
        const firstChildren = chatListContainer.children[0];
        let historyMsgFather = historyMsg.parentNode.parentNode;

        //顯示有幾封未讀通知
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
                    createChatList(data);
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



fetch("/api/get_friendlist")
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        createFreindList(data.friend_list, data.self_id);
        selfId.innerHTML = data.self_id;
        socket.emit("join-self-room", data.self_id);
    })
    .then(() => {
        fetch("/api/get_latest_message")
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                createChatList(data);
            })

    })

function createFreindList(friendData, self_id) {
    let count = 0;
    friendList.innerHTML = "";
    selfId.innerHTML = self_id;
    friendData.forEach(element => {
        newDiv = document.createElement("div");
        newDiv.className = "friend";
        friendList.appendChild(newDiv);
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
                            console.log(data);
                            createFreindList(data.friend_list, data.self_id);
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


function displayMessage(msg, isSelf, is_read = 0) {
    let message = document.querySelector(".chat-message");

    newP = document.createElement("p");
    newP.innerHTML = msg;
    if (isSelf) {
        newP.style.marginRight = "5px";
        newP.style.marginLeft = "auto";
        newP.className = "chat-message-font";
        message.appendChild(newP);
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
    }
    else {
        newP.style.marginBottom = "10px";
        newP.className = "chat-message-font";
        message.appendChild(newP);
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


