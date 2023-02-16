const stickerBtn = document.querySelector(".message-sticker-icon");
const stickerPopup = document.querySelector(".sticker-popup");
const uploadFileBtn = document.querySelector(".message-picture-icon");
const uploadFileInput = document.querySelector(".chat-image-input");
const hoverFont = document.querySelector(".hover-font");
const fileUploadLoading = document.querySelector(".file-upload-loading");


stickerPopup.style.visibility = "hidden";


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
                            recipientId: friendChatId.innerHTML,
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
                                const isGroup = isNaN(friendChatId.innerHTML);
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
                        recipientId: friendChatId.innerHTML,
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
                            const isGroup = isNaN(friendChatId.innerHTML);
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
