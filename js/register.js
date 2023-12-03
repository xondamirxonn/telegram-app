document.addEventListener("DOMContentLoaded", async function () {
  axios.defaults.baseURL = "http://localhost:3000";
  let alerts = document.querySelector(".alerts");
  let form = document.querySelector("form");
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
    closeBtn.innerHTML = `<i class="fa-regular fa-circle-xmark"></i>`;
    alertElement.append(closeBtn);
    alerts.append(alertElement);
    closeBtn.addEventListener("click", () => {
      alertElement.remove();
    });
    setTimeout(() => alertElement.remove(), 3_000);
  }
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    let fullName = form[0].value.trim();
    let phone = form[1].value.trim();
    let password = form[2].value.trim();
    let confirmPassword = form[3].value.trim();

    if (!fullName || !phone || !password || !confirmPassword)
      return createAlert("All fields are required! ");

    if (fullName.length < 9)
      return createAlert("Full Name must be at least 9 characters long");

    if (phone.length !== 13 && !phone.startsWith("+998"))
      return createAlert("Phone format must be +998xxxxxxxxx");

    if (password.length < 4)
      return createAlert("Password must be at least 4 character long");

    if (password !== confirmPassword)
      return createAlert("Password don't match");

    phone = phone.slice(1);

    let {
      data: [user],
    } = await axios.get(`/users?phone=${phone}`);
    if (user) {
      return createAlert("User ochilgan");
    }

    let newUserData = {
      fullName,
      phone,
      password,
    };

    let { data: newUser } = await axios.post("/users", newUserData);

    localStorage.setItem("user-id", newUser.id);

    createAlert("Signed up successfully", "success");

    setTimeout(() => {
      window.location.replace("/");
    }, 3_500);
  });
});
