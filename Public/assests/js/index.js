const username = document.getElementById("user-name");
const messagesList = document.getElementById("message-list");
const message = document.getElementById("message-input");
const sendButton = document.getElementById("send-message-button");
const settings = document.getElementById("settings");
const logout = document.getElementById("logout");
const adduser = document.getElementById("add-user-btn");

adduser.addEventListener("click", () => {
    Toastify({
        text: "Coming soon!",
        duration: 4000,
        gravity: "bottom",
        close: true,
    }).showToast();
});
settings.addEventListener("click", () => {
    Toastify({
        text: "Coming soon!",
        duration: 4000,
        gravity: "bottom",
        close: true,
    }).showToast();
});
logout.addEventListener("click", () => {
    Toastify({
        text: "Logged out successfully!",
        duration: 2000,
        gravity: "bottom",
        close: true,
    }).showToast();
    localStorage.clear();
    window.location.href = "../../html/login.html";
});

const API_BASE_URL = "http://localhost:3000";
const token = localStorage.getItem("token");
username.innerHTML = localStorage.getItem("userName");
document.addEventListener("DOMContentLoaded", getMessages);

const socket = io(`${API_BASE_URL}`, {
    auth: {
        token: token,
    },
});

async function sendMessage(e) {
    try {
        const messageDetails = sentMessageData();
        socket.emit("send-message", messageDetails);
        createMessage(messageDetails);
        message.value = "";
    } catch (error) {
        console.log(error);
    }
}
socket.on("receive-message", (message) => {
    createMessage(message);
    console.log("message-received");
});
async function getMessages(e) {
    try {
        e.preventDefault();
        const { data } = await axios.get(`${API_BASE_URL}/api/get-messages`, {
            headers: { Authorization: token },
        });

        data.forEach((message) => {
            createMessage(message);
        });
    } catch (error) {
        console.log(error);
    }
}
function createMessage(messageData) {
    const li = document.createElement("li");
    const p = document.createElement("p");
    const time = document.createElement("span");
    const name = document.createElement("span");
    const status = messageData.status;
    li.className = status;
    time.className = "time";
    name.className = "name";
    p.textContent = messageData.message;
    time.textContent = messageData.time;
    name.textContent = messageData.name || messageData.sender_name;

    li.appendChild(p);
    li.appendChild(time);
    time.appendChild(name);

    messagesList.appendChild(li);
}

function sentMessageData() {
    const text = message.value;

    const time = new Date();
    const currentTime = `${time.getHours()}:${time.getMinutes()}`;

    const messageDetails = {
        message: text,
        name: username.innerText,
        time: currentTime,
        status: "replied",
        token: token,
    };
    return messageDetails;
}

sendButton.addEventListener("click", sendMessage);
