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
    const message = document.querySelectorAll(".chat-message-font");
    message.forEach(element => {
        element.parentNode.removeChild(element);
    })



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
                if (element.my_id === parseInt(selfId.innerHTML)) {
                    displayMessage(element.message, true);
                } else {
                    displayMessage(element.message, false);
                }

            })
        })

})



snedMessage.addEventListener("click", (e) => {
    const package = {
        "user_id": parseInt(selfId.innerHTML),
        "friend_id": parseInt(friendId.innerHTML),
        "message": messageInput.value
    }
    e.preventDefault();

    if (messageInput.value) {
        let room = `user${package.friend_id}`;
        socket.emit('send-message', package, room);
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
                    "friend_id": parseInt(friendId.innerHTML),
                    "message": messageInput.value
                }
                e.preventDefault();

                if (messageInput.value) {
                    let room = `user${package.friend_id}`;
                    socket.emit('send-message', package, room);
                    displayMessage(package.message, true);
                    messageInput.value = '';
                }
            }



        }
        if (englishWord) {
            if (messageInput.value.length === englishWord.length) {
                const package = {
                    "user_id": parseInt(selfId.innerHTML),
                    "friend_id": parseInt(friendId.innerHTML),
                    "message": messageInput.value
                }
                e.preventDefault();

                if (messageInput.value) {
                    let room = `user${package.friend_id}`;
                    socket.emit('send-message', package, room);
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
                "friend_id": parseInt(friendId.innerHTML),
                "message": messageInput.value
            }
            e.preventDefault();

            if (messageInput.value) {
                let room = `user${package.friend_id}`;
                socket.emit('send-message', package, room);
                displayMessage(package.message, true);
                messageInput.value = '';
            }
        }
    })
})


socket.on("receive-message", (msg) => {
    displayMessage(msg.message, false);
    console.log(msg);
});



fetch("/api/get_friendlist")
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        createFreindList(data.friend_list, data.self_id);
        socket.emit("join-self-room", data.self_id);
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
        newImg.src = "./images/user.png";
        newImg.id = "friend-headshot";
        friend[count].appendChild(newImg);

        newP = document.createElement("p");
        newP.innerHTML = element.nickname;
        friend[count].appendChild(newP);

        friend[count].addEventListener("click", () => {
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

        newP = document.createElement("p");
        newP.innerHTML = element.nickname;
        searchResult[count].appendChild(newP);

        newP = document.createElement("p");
        newP.innerHTML = element.email;
        searchResult[count].appendChild(newP);

        newImg = document.createElement("img");
        newImg.src = "./images/add-friend-btn.png";
        newImg.id = "add-friend-btn";
        newImg.addEventListener("click", (event) => {

            const parent = event.target.parentNode;
            fetch("/add_friend", {
                method: "POST",
                body: JSON.stringify({
                    "email": element.email
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


function displayMessage(content, isSelf) {
    let message = document.querySelector(".chat-message");

    newP = document.createElement("p");
    newP.innerHTML = content;
    if (isSelf) {
        newP.style.marginRight = "5px";
        newP.style.marginLeft = "auto";
    }
    newP.className = "chat-message-font";
    message.appendChild(newP);

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


