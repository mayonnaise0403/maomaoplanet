const stickerBtn = document.querySelector(".message-sticker-icon");
const stickerPopup = document.querySelector(".sticker-popup");
const uploadFileBtn = document.querySelector(".message-picture-icon");
const uploadFileInput = document.querySelector(".chat-image-input");
const hoverFont = document.querySelector(".hover-font");
const fileUploadLoading = document.querySelector(".file-upload-loading");
const chatPopupHamburgerIcon = document.querySelector(".chat-page-hamburger-icon");
const chatPopupSettingContainer = document.querySelector(".chat-popup-setting");
const chatPopupPictureAndVideo = document.querySelector(".chat-popup-photo-icon");
const chatPopupFile = document.querySelector(".char-popup-file-icon");
const pictureVideoContainer = document.querySelector(".picture-video-container");
const closePcVideoContainer = document.querySelector(".close-picture-video-container");
const pictureBtn = document.querySelector(".picture-btn");
const videoBtn = document.querySelector(".video-btn");
const pictureList = document.querySelector(".picture-list");
const videoList = document.querySelector(".video-list");
const addNewUserToGroupBtn = document.querySelector(".add-new-user-btn");
const addNewUserContainer = document.querySelector(".add-user-to-group-container");
videoList.style.display = "none";


stickerPopup.style.visibility = "hidden";
chatPopupSettingContainer.style.visibility = "hidden";
addNewUserContainer.style.display = "none"

//點擊傳送貼圖
stickerBtn.addEventListener("click", () => {
    if (stickerPopup.style.visibility === "hidden") {
        stickerPopup.style.visibility = "visible";
    } else {
        stickerPopup.style.visibility = "hidden";
    }


})
stickerPopup.addEventListener("click", (event) => {
    if (event.target.tagName === 'P') {
        messageInput.value += event.target.innerHTML;
    }

})

uploadFileBtn.addEventListener("mouseenter", () => {
    hoverFont.style.display = "block";
})

uploadFileBtn.addEventListener("mouseleave", () => {
    hoverFont.style.display = "none";
})


uploadFileBtn.addEventListener("click", () => {
    uploadFileInput.click();
})

chatPopupHamburgerIcon.addEventListener("click", () => {
    if (chatPopupSettingContainer.style.visibility === "hidden") {
        chatPopupSettingContainer.style.visibility = "visible";
    } else {
        chatPopupSettingContainer.style.visibility = "hidden";
    }
})

videoBtn.addEventListener("click", () => {
    videoList.style.display = "block";
    pictureList.style.display = "none";
})

pictureBtn.addEventListener("click", () => {
    videoList.style.display = "none";
    pictureList.style.display = "block";
})

// addNewUserToGroupBtn.addEventListener("click", () => {
//     if (addNewUserContainer.style.display === "none") {
//         addNewUserContainer.style.display = "block";
//         fetch(`/api/add_user_to_group_friendlist?groupId=${friendChatId}`)
//             .then((response) => {
//                 return response.json();
//             })
//             .then((data) => {
//                 const friendList = document.querySelectorAll(".add-user-to-group-friendlist");
//                 data.friend_list.forEach(element => {
//                     newDiv = document.createElement("div");
//                     newDiv.style.display = "flex";
//                     friendList[friendList.length - 1].appendChild(newDiv);

//                     newImg = document.createElement("img");
//                     newImg.src = element.headshot;
//                     newImg.style.width = "40px";
//                     newImg.style.borderRadius = "40px";
//                     newDiv.appendChild(newImg);

//                     newP = document.createElement("p");
//                     newP.innerHTML = element.nickname;
//                     newDiv.appendChild(newP);

//                     newImg = document.createElement("img");
//                     newImg.src = "./images/add-button.png";
//                     newImg.style.width = "40px";

//                     newDiv.appendChild(newImg);
//                 })

//             })
//     } else {
//         addNewUserContainer.style.display = "none"
//     }
// })



chatPopupPictureAndVideo.addEventListener("click", () => {
    pictureVideoContainer.style.display = "block";
    const isGroup = isNaN(friendChatId);
    if (isGroup) {
        fetch("/get_group_picture", {
            method: "POST",
            body: JSON.stringify({
                groupId: friendChatId,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                pictureList.style.display = "block";
                videoList.style.display = "none";
                data.data.forEach(element => {
                    const index = element.message.indexOf("(", element.message.length - 1 - 14);
                    const dataType = element.message.substring(index, element.message.length)
                    if (dataType === "(image)" || dataType === "(video)") {
                        if (dataType === "(image)") {
                            newImg = document.createElement("img");
                            newImg.src = element.message;
                            newImg.style.width = "150px";
                            newImg.style.height = "150px";
                            newImg.style.borderRadius = "10px";
                            newImg.style.marginLeft = "10px";
                            newImg.style.objectFit = "cover";
                            newImg.style.cursor = "pointer";
                            pictureList.appendChild(newImg);

                            newImg.addEventListener("click", () => {
                                window.open(element.message, "影片", "width=600,height=600,top=" + (screen.height - 600) / 2 + ",left=" + (screen.width - 600) / 2);
                            })
                        } else {
                            let fileName = element.message.substring(0, index);
                            fileName = fileName.replace(S3Url, "");
                            newImg = document.createElement("img");
                            newImg.src = `https://maomaoimage.s3.ap-northeast-1.amazonaws.com/videoImage/${fileName}`;
                            newImg.style.width = "150px";
                            newImg.style.height = "150px";
                            newImg.style.borderRadius = "10px";
                            newImg.style.marginLeft = "10px";
                            newImg.style.objectFit = "cover";
                            newImg.style.cursor = "pointer";
                            videoList.appendChild(newImg);

                            newImg.addEventListener("click", () => {
                                window.open(element.message, "影片", "width=600,height=600,top=" + (screen.height - 600) / 2 + ",left=" + (screen.width - 600) / 2);
                            })
                        }
                    }

                })

            })
    } else {
        fetch("/get_chat_picture", {
            method: "POST",
            body: JSON.stringify({
                recipientId: friendChatId,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {

                pictureList.style.display = "block";
                videoList.style.display = "none";
                data.data.forEach(element => {
                    const index = element.message.indexOf("(", element.message.length - 1 - 14);
                    const dataType = element.message.substring(index, element.message.length)
                    if (dataType === "(image)" || dataType === "(video)") {


                        if (dataType === "(image)") {
                            newImg = document.createElement("img");
                            newImg.src = element.message;
                            newImg.style.width = "150px";
                            newImg.style.height = "150px";
                            newImg.style.borderRadius = "10px";
                            newImg.style.marginLeft = "10px";
                            newImg.style.objectFit = "cover";
                            newImg.style.cursor = "pointer";
                            pictureList.appendChild(newImg);

                            newImg.addEventListener("click", () => {
                                window.open(element.message, "影片", "width=600,height=600,top=" + (screen.height - 600) / 2 + ",left=" + (screen.width - 600) / 2);
                            })
                        } else {
                            let fileName = element.message.substring(0, index);


                            fileName = fileName.replace(S3Url, "");
                            newImg = document.createElement("img");
                            newImg.src = `https://maomaoimage.s3.ap-northeast-1.amazonaws.com/videoImage/${fileName}`;
                            newImg.style.width = "150px";
                            newImg.style.height = "150px";
                            newImg.style.borderRadius = "10px";
                            newImg.style.marginLeft = "10px";
                            newImg.style.objectFit = "cover";
                            newImg.style.cursor = "pointer";
                            videoList.appendChild(newImg);

                            newImg.addEventListener("click", () => {
                                window.open(element.message, "影片", "width=600,height=600,top=" + (screen.height - 600) / 2 + ",left=" + (screen.width - 600) / 2);
                            })

                        }
                    }
                })
            })
    }






})

closePcVideoContainer.addEventListener("click", () => {
    pictureVideoContainer.style.display = "none";


    while (pictureList.firstChild) {
        pictureList.removeChild(pictureList.firstChild);
    }
    while (videoList.firstChild) {
        videoList.removeChild(videoList.firstChild);
    }
})


uploadFileInput.addEventListener("change", () => {
    fileUploadLoading.style.display = "block";
    fileUploadLoading.style.display = "flex";

    const time = new Date().getTime();
    let file = uploadFileInput.files[0];
    if (file) {
        let fileName = file.name;
        let index = fileName.indexOf(".");
        fileName = fileName.slice(0, index);
        const type = file.type;
        const fileSize = file.size;
        const reader = new FileReader();
        console.log(bytesToSize(fileSize))
        if (type.substring(0, type.indexOf("/")) === "video") {


            const video = document.createElement("video");
            video.src = URL.createObjectURL(file);

            video.addEventListener("loadeddata", () => {
                video.pause();
                video.currentTime = 1;
            });
            video.addEventListener("seeked", () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageDataURL = canvas.toDataURL("image/png");

                reader.readAsDataURL(file);
                reader.addEventListener("load", () => {
                    file = reader.result;


                    fetch("/upload_file", {
                        method: "POST",
                        body: JSON.stringify({
                            recipientId: friendChatId,
                            file: file,
                            fileName: fileName,
                            videoPc: imageDataURL,
                            type: `${type.split(';')[0].split('/')[1]}`,
                            dataType: type.substring(0, type.indexOf("/")),
                            totalTypeData: type,
                            time: time
                        }),
                        headers: {
                            'Content-type': 'application/json; charset=UTF-8',
                        },
                    })
                        .then((response) => {
                            return response.json();
                        })
                        .then((data) => {
                            if (data.status === "success") {
                                const isGroup = isNaN(friendChatId);
                                if (!isGroup) {
                                    sendMsgInSingle(data.message);
                                } else {
                                    sendMsgInGroup(data.message);
                                    groupMemberIcon.style.display = "block";
                                }

                                fileUploadLoading.style.display = "none";
                            }
                        })
                });
            });
        } else {
            reader.readAsDataURL(file);
            reader.addEventListener("load", () => {
                file = reader.result;
                file = file.split(",")[1];
                fetch("/upload_file", {
                    method: "POST",
                    body: JSON.stringify({
                        recipientId: friendChatId,
                        file: file,
                        fileName: fileName,
                        type: `${type.split(';')[0].split('/')[1]}`,
                        dataType: type.substring(0, type.indexOf("/")),
                        totalTypeData: type,
                        time: time
                    }),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },

                })
                    .then((response) => {
                        return response.json();
                    })
                    .then((data) => {
                        if (data.status === "success") {
                            const isGroup = isNaN(friendChatId);
                            if (!isGroup) {
                                sendMsgInSingle(data.message);
                            } else {
                                sendMsgInGroup(data.message);
                                groupMemberIcon.style.display = "block";
                            }

                            fileUploadLoading.style.display = "none";



                        }
                    })

            });

        }
    }





});

function bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + sizes[i];
}
