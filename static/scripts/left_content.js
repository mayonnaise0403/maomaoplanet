const profilePage = document.querySelector("#profile-page");
const friendPage = document.querySelector("#friend-page");
const chatPage = document.querySelector("#chat-page");
const friendIcon = document.querySelector("#friend-icon");
const chatIcon = document.querySelector("#chat-icon");
const profileIcon = document.querySelector(".profile-btn");

profileIcon.addEventListener("click", () => {
    profilePage.style.display = "block";
    friendPage.style.display = "none";
    chatPage.style.display = "none";
});


friendIcon.addEventListener("click", () => {
    profilePage.style.display = "none";
    friendPage.style.display = "block";
    chatPage.style.display = "none";

});



chatIcon.addEventListener("click", () => {
    profilePage.style.display = "none";
    friendPage.style.display = "none";
    chatPage.style.display = "block";
});



