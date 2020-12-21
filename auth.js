const userToken = localStorage.getItem("token");

if (userToken !== null && userToken !== "" && userToken !== undefined) {
  window.location.replace("./landingPage.html");
}

const registerUsers = async (data) => {
  toggleLoader("load");
  try {
    const user = await fetch("https://jsminnastore.herokuapp.com/auth/signup", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(data),
    });
    user.text().then((resData) => {
      setTimeout(() => {
        toggleLoader();
        const userData = JSON.parse(resData);
        if (!userData.success) {
          showModal("Oops!", userData.message);
        } else {
          localStorage.setItem("token", userData.payload.token);
          window.location.replace("./landingPage.html");
        }
      }, 1200);
    });
  } catch (err) {
    console.log(err);
    setTimeout(() => {
      toggleLoader();
      showModal("Oops!", err.message);
    }, 1200);
  }
};

const loginUsers = async (data) => {
  toggleLoader("load");
  try {
    const user = await fetch("https://jsminnastore.herokuapp.com/auth/login", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(data),
    });

    user.text().then((resData) => {
      setTimeout(() => {
        toggleLoader();
        const userData = JSON.parse(resData);
        if (!userData.success) {
          showModal("Oops!", userData.message);
        } else {
          localStorage.setItem("token", userData.payload.token);
          window.location.replace("./landingPage.html");
        }
      }, 1200);
    });
  } catch (err) {
    console.log(err);
    setTimeout(() => {
      toggleLoader();
      showModal("Oops!", err.message);
    }, 1200);
  }
};

el("signUpForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const elem = e.target.elements;
  const data = {
    fullName: elem.fullName.value,
    email: elem.email.value,
    mobileNumber: elem.mobileNumber.value,
    address: elem.address.value,
    gender: elem.gender.value,
    password: elem.password.value,
  };

  registerUsers(data);
});

el("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const elem = e.target.elements;
  const data = {
    email: elem.email.value,
    password: elem.password.value,
  };

  loginUsers(data);
});

function el(id) {
  return document.getElementById(id);
}

function toggleLoader(val) {
  if (val === "load") {
    el("loader").style.visibility = "visible";
  } else {
    el("loader").style.visibility = "collapse";
  }
}

function error(msg) {
  el("err").innerText = msg;
  setTimeout(() => {
    el("err").innerText = "";
  }, 5000);
}

function deleteModal() {
  el("modal-container").remove();
}

function showModal(title, message) {
  const div = document.createElement("div");
  div.className = "modal-frame";
  div.id = "modal-container";
  div.innerHTML = `  <div id="modal" class="modal-center">
      <p class="mb-4"> <b>${title}</b> <br>
         ${message}
      </p>
      <button onclick="deleteModal()" id="modal-close">Dissmiss</button>
  </div>
</div>`;
  document.body.append(div);
}
