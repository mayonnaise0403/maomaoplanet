
const emailInput = document.querySelector("#floatingInput");
const passwordInput = document.querySelector("#floatingPassword");
const loginBtn = document.querySelector(".login-btn");
const needsignupBtn = document.querySelector(".signup-btn");
const loginContainer = document.querySelector("#login-container");
const signupContainer = document.querySelector("#signup-container");
const hadAccount = document.querySelector(".had-account-btn");
const signupBtn = document.querySelector("#signup-btn");
const signupNameErrorMsg = document.querySelector("#signup-name-error-msg");
const signupEmailErrorMsg = document.querySelector("#signup-email-error-msg");
const signupPasswordErrorMsg = document.querySelector("#signup-password-error-msg");
const userEmail = document.querySelector(".user-email");
const emailVerificationBtn = document.querySelector("#email-verification-btn");
const emailVerification = document.querySelector("#email-verification-container");
const emailCodeInput = document.querySelector("#code-input");
const verificationEmailErrorMsg = document.querySelector(".verification-error-msg");
const emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
const signupPopupMsg = document.querySelector(".signup-popup-error-msg");
const signupPopup = document.querySelector(".sign-successful-popup");
const signupPopupBtn = document.querySelector(".signup-popup-btn");
const loginErrorMsg = document.querySelector(".login-error-msg");


let signupName = document.querySelector("#signupName");
let signupEmail = document.querySelector("#signupEmail");
let signupPassword = document.querySelector("#signupPassword");

let confirmPassword = document.querySelector("#confirm-password");


// 取出 token
// const token = Cookies.get('access_token');
//移除token
//Cookies.remove('access_token');


loginBtn.addEventListener("click", () => {
    fetch("/login", {
        method: "POST",
        body: JSON.stringify({
            "email": emailInput.value,
            "password": passwordInput.value
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
                window.location.href = "/member";
            } else {
                loginErrorMsg.style.display = "block";
            }
        })


})

needsignupBtn.addEventListener("click", () => {
    loginContainer.style.display = "none";
    signupContainer.style.display = "block";
    initErrorMsg();
})

hadAccount.addEventListener("click", () => {
    loginContainer.style.display = "block";
    signupContainer.style.display = "none";
    initErrorMsg();
})

signupBtn.addEventListener("click", () => {
    if (checkSignupData()) {
        uploadDatabase();
    }
})



async function uploadDatabase() {
    let response = await fetch("/signup", {
        method: 'POST',
        body: JSON.stringify({
            'nickname': signupName,
            "email": signupEmail,
            "password": signupPassword
        })
        , headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    });
    let data = await response.json();

    if (data.status === "success") {
        signupContainer.style.display = "none";
        emailVerification.style.display = "block";
        fetch("/send_email", {
            method: "POST",
            body: JSON.stringify({
                'nickname': signupName,
                "email": signupEmail,
                "password": signupPassword
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
                    let code = data.code;
                    emailVerificationBtn.addEventListener("click", () => {
                        if (emailCodeInput.value === code) {
                            fetch("/confirm_signup", {
                                method: "POST",
                                body: JSON.stringify({
                                    'nickname': signupName,
                                    "email": signupEmail,
                                    "password": signupPassword
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
                                        const backgroundDarker = document.querySelector(".darker");
                                        backgroundDarker.style.display = "block";
                                        signupPopup.style.display = "block";
                                        signupPopupMsg.innerHTML = "✅註冊成功";
                                        signupPopupMsg.style.color = "rgb(12, 194, 12)";
                                    } else {

                                        //////////////////////////////////////////
                                    }
                                })

                        } else {
                            verificationEmailErrorMsg.innerHTML = "驗證碼輸入錯誤";
                        }
                    })
                }

            })

    } else {
        if (data.status === "error" && data.message === "email已被註冊過了") {
            signupEmailErrorMsg.innerHTML = "⚠信箱已經被註冊過了";
        }
    }
}

signupPopupBtn.addEventListener("click", () => {
    window.location.href = "/";
})

function checkSignupData() {
    signupName = document.querySelector("#signupName").value;
    signupEmail = document.querySelector("#signupEmail").value;
    signupPassword = document.querySelector("#signupPassword").value;
    confirmPassword = document.querySelector("#confirm-password").value;
    initErrorMsg();
    if (!signupName || !signupEmail || !signupPassword || !confirmPassword) {
        if (signupName === "") {
            signupNameErrorMsg.innerHTML = "⚠姓名不可為空";
            return false;
        } else if (signupEmail === "") {
            signupEmailErrorMsg.innerHTML = "⚠信箱不可為空";
            return false;
        } else if (signupPassword === "" || confirmPassword === "") {
            signupPasswordErrorMsg.innerHTML = "⚠密碼不可為空";
            return false;
        }
    }
    if (signupPassword != confirmPassword) {
        signupPasswordErrorMsg.innerHTML = "⚠密碼不相同";
        return false;
    } else if (signupEmail.search(emailRule) === -1) {
        signupPasswordErrorMsg.innerHTML = "⚠信箱格式錯誤";
        return false;
    } else if (signupPassword.length < 5) {
        signupPasswordErrorMsg.innerHTML = "⚠密碼長度需大於五";
        return false;
    }
    return true;

}

function initErrorMsg() {
    signupNameErrorMsg.innerHTML = "";
    signupEmailErrorMsg.innerHTML = "";
    signupPasswordErrorMsg.innerHTML = "";
}