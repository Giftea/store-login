const userToken = localStorage.getItem("token");
console.log(userToken);
if (userToken === null || userToken === undefined || userToken === "undefined") {
  window.location.replace("./index.html");
}

function logOut() {
  localStorage.removeItem("token");
  window.location.replace("./index.html");
}

const addSuggestion = async (data) => {
  toggleLoader("load");
  try {
    const suggestion = await fetch("https://jsminnastore.herokuapp.com/suggest", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(data),
    });

    suggestion.text().then((resData) => {
      setTimeout(() => {
        toggleLoader();
        const res = JSON.parse(resData);
        if (!res.success) {
          showModal("Oops!", res.message);
        }
      }, 1200);
    });
  } catch (err) {
    console.log(err);
    showModal("Oops!", err.message);
  }
};

const getSuggestions = async (url = "https://jsminnastore.herokuapp.com/suggested") => {
  tableToggle("load");
  let data = [];
  try {
    const suggestion = await fetch(url, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    suggestion
      .text()
      .then((resData) => {
        const res = JSON.parse(resData);
        data = res.payload.result;
      })
      .then(() => {
        if (data !== undefined) {
          setTimeout(() => {
            tableToggle();
            el("table-body").innerHTML = "";
            if (data.length < 1) {
              el("table-body").innerHTML = "No Data To Display";
            } else {
              data.forEach((item, index) => {
                const row = document.createElement("tr");

                row.innerHTML = `
                
              <th scope="row">${index + 1}</th>
              <td>${item.itemName}</td>
              <td>${item.itemCategory}</td>
              <td>${item.itemDescription}</td>
              <td>${item.reason}</td>
              `;

                el("table-body").append(row);
              });
            }
          }, 1200);
        }
      });
  } catch (err) {
    console.log(err);
    setTimeout(() => {
      tableToggle();
      showModal("Oops!", err.message);
    }, 1200);
  }
};

getSuggestions();

function filterSuggestions(evtr) {
  getSuggestions(evtr.target.value);
}

el("suggest").addEventListener("submit", (e) => {
  e.preventDefault();
  const elem = e.target.elements;
  const data = {
    itemName: elem.itemName.value,
    itemCategory: elem.itemCategory.value,
    itemDescription: elem.itemDescription.value,
    reason: elem.reason.value,
  };

  addSuggestion(data);
});

function el(id) {
  return document.getElementById(id);
}

function tableToggle(val) {
  if (val === "load") {
    el("center-loader").style.visibility = "visible";
    el("table-data").style.visibility = "collapse";
  } else {
    el("center-loader").style.visibility = "collapse";
    el("table-data").style.visibility = "visible";
  }
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
