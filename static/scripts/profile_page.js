const profileNickname = document.querySelector(".profile-name-content");
const profileEmail = document.querySelector(".profile-email-content");
const editNicknameBtn = document.querySelector(".name-edit");
const editEmailBtn = document.querySelector(".email-edit");
const nameEditOk = document.querySelector(".name-ok");
const nameEditClose = document.querySelector(".name-close");
const nameInput = document.querySelector(".name-input");
const emailEditOk = document.querySelector(".email-ok");
const emailEditClose = document.querySelector(".email-close");
const emailInput = document.querySelector(".email-input");
const uploadImageBtn = document.querySelector(".upload-image-btn");
const headshotEditBtn = document.querySelector(".headshot-edit");
const inputFile = document.querySelector(".img-file");
const headshot = document.querySelector(".headshot");
const uploadFile = document.querySelector(".upload-btn");
const uploadImageClose = document.querySelector(".upload-image-close");
const darder = document.querySelector(".darker");
const loader = document.querySelector("#loader");
const confirmEmailPopup = document.querySelector(".profile-page-confirm-email-popup");
const confirmEmailClose = document.querySelector(".profile-page-confirm-email-close");
const verifyEmailBtn = document.querySelector(".profile-page-confirm-email-btn");
const verifyEmailInput = document.querySelector(".profile-page-confirm-email-input");
const verifyEmailSuccessClose = document.querySelector(".profile-page-confirm-email-success-close");
const verifyEmailSuccessPopup = document.querySelector(".profile-page-confirm-email-success-popup");
const verifyEmailErrorMsg = document.querySelector(".profile-email-content-error-msg");
const verifyEmailSuccessFont = document.querySelector(".profile-page-confirm-email-success-font");
const loaderDarker = document.querySelector(".loader-darker");
const loaderContainer = document.querySelector(".loader-container");


let file, emailVerifyCode, verifyEmailHandler;;

//初始值
uploadImageBtn.style.display = "none";
uploadFile.style.display = "none";

fetch("/api/user_data")
    .then((data) => {
        return data.json();
    })
    .then((response) => {
        profileNickname.innerHTML = response.nickname;
        profileEmail.innerHTML = response.email;
        // headshot.src = "./images/Loading_icon.gif"
        // headshot.onload = () => {
        headshot.src = response.headshot;
        // }


    })
    .then(() => {
        darder.style.display = "none";
        loader.style.display = "none";
    })

//編輯姓名
editNicknameBtn.addEventListener("click", () => {
    nameEditOk.style.display = "block";
    nameEditClose.style.display = "block";
    nameInput.style.display = "block";
    nameInput.value = profileNickname.innerHTML;
    editNicknameBtn.style.display = "none";
    profileNickname.style.display = "none";
});

//確認編輯姓名
nameEditOk.addEventListener("click", () => {
    fetch("/update_nickname", {
        method: "POST",
        body: JSON.stringify({
            newNickname: nameInput.value
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
                nameEditOk.style.display = "none";
                nameEditClose.style.display = "none";
                nameInput.style.display = "none";
                editNicknameBtn.style.display = "block";
                profileNickname.style.display = "block";
                profileNickname.innerHTML = nameInput.value;
            } else {

            }
        })
})



//編輯email
editEmailBtn.addEventListener("click", () => {
    emailEditOk.style.display = "block";
    emailEditClose.style.display = "block";
    emailInput.style.display = "block";
    emailInput.value = profileEmail.innerHTML;
    editEmailBtn.style.display = "none";
    profileEmail.style.display = "none";
});

//確認編輯email
emailEditOk.addEventListener("click", () => {
    loaderDarker.style.display = "block";
    loaderContainer.style.display = "block";
    verifyEmailSuccessFont.innerHTML = "";
    fetch("/update_verify_email", {
        method: "POST",
        body: JSON.stringify({
            newEmail: emailInput.value
        })
        , headers: {
            'Content-type': 'application/json; charset=UTF-8',
        }
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            loaderDarker.style.display = "none";
            loaderContainer.style.display = "none";
            if (data.status === "success") {
                confirmEmailPopup.style.display = "block";
                emailVerifyCode = data.code;
                verifyEmailHandler = () => verifyEmail(emailVerifyCode);
                verifyEmailBtn.addEventListener("click", verifyEmailHandler);

            } else {
                if (data.message === "信箱已被使用過") {
                    verifyEmailErrorMsg.style.display = "block";
                }
            }


        })
})

//驗證信箱popup的叉叉按鈕
confirmEmailClose.addEventListener("click", () => {
    confirmEmailPopup.style.display = "none";
})

nameEditClose.addEventListener("click", () => {
    nameEditOk.style.display = "none";
    nameEditClose.style.display = "none";
    nameInput.style.display = "none";
    editNicknameBtn.style.display = "block";
    profileNickname.style.display = "block";
});

emailEditClose.addEventListener("click", () => {
    emailEditOk.style.display = "none";
    emailEditClose.style.display = "none";
    emailInput.style.display = "none";
    editEmailBtn.style.display = "block";
    profileEmail.style.display = "block";
    verifyEmailErrorMsg.style.display = "none";
})

//信箱驗證成功的叉叉按鈕
verifyEmailSuccessClose.addEventListener("click", () => {
    verifyEmailSuccessPopup.style.display = "none";
})

headshotEditBtn.addEventListener("click", () => {
    headshotEditBtn.style.display = "none";
    uploadImageBtn.style.display = "block";
    uploadFile.style.display = "block";
    uploadImageClose.style.display = "block";
});

uploadImageClose.addEventListener("click", () => {
    headshotEditBtn.style.display = "block";
    uploadImageBtn.style.display = "none";
    uploadFile.style.display = "none";
    uploadImageClose.style.display = "none";
})

uploadImageBtn.addEventListener("click", () => {
    inputFile.click();
})



//上傳圖片
uploadFile.addEventListener("click", () => {
    loaderDarker.style.display = "block";
    loaderContainer.style.display = "block";
    fetch("/upload_headshot", {
        method: "POST",
        body: JSON.stringify({
            email: profileEmail.innerHTML,
            image: file
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
                let Id = document.querySelector(".self-id");
                headshotEditBtn.style.display = "block";
                uploadImageBtn.style.display = "none";
                uploadFile.style.display = "none";
                uploadImageClose.style.display = "none";
                loaderDarker.style.display = "none";
                loaderContainer.style.display = "none";

            } else {

            }
        })
})

//預覽大頭貼
inputFile.addEventListener("change", e => {

    file = inputFile.files[0];
    console.log(file)
    const reader = new FileReader();

    reader.addEventListener("load", () => {
        file = reader.result;
        headshot.src = reader.result;
    });
    if (file) {
        reader.readAsDataURL(file);
    } else {
        preview.src = "";
    }

})

function verifyEmail(emailVerifyCode) {
    verifyEmailSuccessFont.innerHTML = "";
    if (verifyEmailInput.value === emailVerifyCode) {
        fetch("/update_email", {
            method: "POST",
            body: JSON.stringify({
                newEmail: emailInput.value
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
                    confirmEmailPopup.style.display = "none";
                    verifyEmailSuccessPopup.style.display = "block";
                    verifyEmailSuccessFont.innerHTML = "✅信箱驗證成功";
                    verifyEmailSuccessFont.style.color = "rgb(12, 194, 12)";
                    emailEditOk.style.display = "none";
                    emailEditClose.style.display = "none";
                    profileEmail.style.display = "block";
                    profileEmail.innerHTML = emailInput.value;
                    emailInput.style.display = "none";
                    editEmailBtn.style.display = "block";
                    verifyEmailInput.value = "";

                    verifyEmailErrorMsg.style.display = "none";
                } else {


                    //////////////////////////////////////////////////////
                }
            })
    } else {

        verifyEmailSuccessPopup.style.display = "block";
        verifyEmailSuccessFont.innerHTML = "❌驗證碼輸入錯誤";
        confirmEmailPopup.style.display = "none";
        verifyEmailSuccessFont.style.color = "red";
        emailEditOk.style.display = "none";
        emailEditClose.style.display = "none";
        profileEmail.style.display = "block";
        emailInput.style.display = "none";
        editEmailBtn.style.display = "block";
        verifyEmailInput.value = "";


    }
    verifyEmailBtn.removeEventListener("click", verifyEmailHandler);
}


