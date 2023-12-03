document.addEventListener("DOMContentLoaded", async () => {
  axios.defaults.baseURL = "http://localhost:3000";
  let alerts = document.querySelector(".alerts");

  function createAlert(msg, type = "error") {
    let alertElement = document.createElement("div");
    let color =
      type === "error"
        ? "rose"
        : type === "success"
        ? "green"
        : type === "info"
        ? "blue"
        : "yellow";
    let className = `bg-${color}-200 ps-8 pe-4 rounded-lg border border-${color}-900 tex-${color}-900 text-xl`;
    alertElement.classList.add(...className.split(" "));
    alertElement.innerText = msg;
    let closeBtn = document.createElement("button");
    closeBtn.classList.add("ms-4");
    closeBtn.innerHTML = "<i class='fa-regular fa-circle-xmark'></i>";
    alertElement.append(closeBtn);
    alerts.append(alertElement);
    closeBtn.addEventListener("click", () => {
      alertElement.remove();
    });
    setTimeout(() => alertElement.remove(), 3_000);
  }

  let fullName = document.querySelector("#fullName");
  let phoneNumber = document.querySelector("#phoneNumber");
  let logoutBtn = document.querySelector("#logoutBtn");
  let main = document.querySelector("main");
  let searchInput = document.querySelector("#searchInput");

  let ul = document.createElement("ul");

  ul.classList.add(
    ..."grid gap-2 [&_li]:border-rose-900 [&_li:not(:first-child)]:border-t [&_li]:pt-2".split(
      " "
    )
  );

  let { data: user } = await axios.get(`/users/${userId}`);

  if (!user) {
    localStorage.removeItem("user-id");
    window.location.replace("/pages/login.html");
  }

  fullName.innerText = user.fullName;
  phoneNumber.innerText = "+" + user.phone;

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("user-id");
    createAlert("Logged out successfully", "success");
    setTimeout(() => {
      window.location.replace("/pages/login.html");
    }, 3_000);
  });

  let { data: chats } = await axios.get(`/chats`);

  chats = chats.filter((chat) => chat.members.includes(user.id));

  const rednerUser = async (user) => {
    let li = document.createElement("li");
    li.classList.add(
      "flex",
      "items-center",
      "gap-2",
      "cursor-pointer",
      "relative"
    );
    li.setAttribute("data-user-id", user.id);

    li.innerHTML = `
      <div class="w-16 h-16 bg-rose-200 rounded-full grid place-items-center text-rose-900 text-2xl">
      ${user.fullName[0]}
      </div>
      <h3 class="text-2xl">${user.fullName}</h3>
      <span class="absolute top-6.5 bg-blue-300 rounded-lg py-2 px-2 text-white end-4">New Chat</span>`;

    ul.append(li);

    li.addEventListener("click", () => {
      window.location.replace(`/pages/chat.html?userId=${user.id}`);
    });
  };

  const rednerChat = async (chat) => {
    let friendId = chat.members.find((memberId) => memberId !== user.id);
    let { data: friend } = await axios.get(`/users/${friendId}`);

    let li = document.createElement("li");
    li.classList.add("flex", "items-center", "gap-2", "cursor-pointer");
    li.setAttribute("data-friend-id", friend.id);

    li.innerHTML = `
      <div class="w-16 h-16 bg-rose-200 rounded-full grid place-items-center text-rose-900 text-2xl">
      ${friend.fullName[0]}
      </div>
      <h3 class="text-2xl">${friend.fullName}</h3>`;

    ul.append(li);

    li.addEventListener("click", () => {
      window.location.replace(`/pages/chat.html?chatId=${chat.id}`);
    });
  };

  if (chats.length === 0) {
    let h2 = document.createElement("h2");
    h2.classList.add("text-5xl", "text-blue-600", "text-center");

    h2.innerText = "You have no chats yet";

    main.append(h2);
  } else {
    main.append(ul);
    chats.forEach(rednerChat);
  }

  searchInput.addEventListener("keyup", async () => {
    let searchStr = searchInput.value;
    
    if (!searchStr) {
      if (chats.length === 0) {
        main.innerHTML = "";
        let h2 = document.createElement("h2");
        h2.classList.add("text-5xl", "text-blue-600", "text-center");

        h2.innerText = "You have no chats yet";

        main.append(h2);
      } else {
        main.append(ul);
        chats.forEach(rednerChat);
        [...ul.children].forEach((child) => child.remove());
        main.append(ul);
        chats.forEach(rednerChat);
      }
      return;
    }
    let { data: users } = await axios.get(`/users`);

    let currentUsers = user;


    let filteredUsers = users.filter(
      (user) =>
        user.id != currentUsers.id &&
        (user.phone.includes(searchStr) ||
          user.fullName.toLowerCase().includes(searchStr.toLowerCase()))
    );

    main.innerHTML = "";
    [...ul.children].forEach((child) => child.remove());
    main.append(ul);
    filteredUsers.forEach(rednerUser);
  });
});
