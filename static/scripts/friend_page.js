const friendListEmpty = document.querySelector("#friend-list-empty");
const groupListEmpty = document.querySelector("#group-list-empty");



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
        group[count].appendChild(newImg);

        newP = document.createElement("p");
        newP.innerHTML = element.group_name;
        group[count].appendChild(newP);

        group[count].addEventListener("click", () => {
            let friendPopupHeadshot = document.querySelector(".friend-popup-headshot");
            // friendPopupHeadshot.src = "./images/Loading_icon.gif";
            // friendPopupHeadshot.onload = () => {
            //     friendPopupHeadshot.src = element.headshot;
            // }
            friendPopupHeadshot.src = element.headshot;
            friendPopup.style.display = "block";
            friendName.innerHTML = element.group_name;
            friendId.innerHTML = element.group_id;
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
            friendId.innerHTML = element.user_id;
        })
        count++;
    })
}