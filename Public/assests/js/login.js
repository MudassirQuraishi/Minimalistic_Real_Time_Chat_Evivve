const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const signup = document.getElementById("toggle-signup");
const login = document.getElementById("toggle-login");

const facebook = document.getElementById("facebook");
const google = document.getElementById("google");
const twitter = document.getElementById("twitter");

facebook.addEventListener("click", () => {
    Toastify({
        text: "Coming soon!",
        duration: 4000,
        gravity: "bottom",
        close: true,
    }).showToast();
});
google.addEventListener("click", () => {
    Toastify({
        text: "Coming soon!",
        duration: 4000,
        gravity: "bottom",
        close: true,
    }).showToast();
});
twitter.addEventListener("click", () => {
    Toastify({
        text: "Coming soon!",
        duration: 4000,
        gravity: "bottom",
        close: true,
    }).showToast();
});
signup.addEventListener("click", toggleSignup);

login.addEventListener("click", toggleLogin);

signupForm.addEventListener("submit", createNewUser);
loginForm.addEventListener("submit", loginUser);

function toggleSignup() {
    signupForm.style.display = "block";
    loginForm.style.display = "none";
}
function toggleLogin() {
    loginForm.style.display = "block";
    signupForm.style.display = "none";
}

async function createNewUser(e) {
    try {
        e.preventDefault();
        const signupDetails = getFormDetails();
        console.log(signupDetails);
        const response = await axios.post(
            "http://localhost:3000/user/sign-up",
            signupDetails
        );
        console.log(response);
        if (response.status == 201) {
            //user created successfully
            Toastify({
                text: "User created successfully",
                duration: 3000,
                gravity: "bottom",
                close: true,
            }).showToast();
            toggleLogin();
            const email = document.getElementById("email");
            email.value = signupDetails.email;
        } else if (response.status == 409) {
            //already user exists
            Toastify({
                text: "User already exists",
                duration: 3000,
                gravity: "bottom",
                close: true,
            }).showToast();
            toggleLogin();
        } else if (400) {
            //Bad request
            Toastify({
                text: "Bad request. Check again",
                duration: 3000,
                gravity: "bottom",
                close: true,
            }).showToast();
        } else if (500) {
            //internal error
            Toastify({
                text: "Server Error. Please try again later",
                duration: 3000,
                gravity: "bottom",
                close: true,
            }).showToast();
        }
    } catch (error) {
        console.log(error);
    }
}
async function loginUser(e) {
    try {
        e.preventDefault();
        const loginDetails = getFormDetails();
        console.log(loginDetails);
        const response = await axios.post(
            "http://localhost:3000/user/log-in",
            loginDetails
        );
        console.log(response);
        if (response.status == 200) {
            //loginSucces
            //next page
            const email = document.getElementById("email");
            const password = document.getElementById("password");
            email.value = "";
            password.value = "";
            Toastify({
                text: "Logged in successfully",
                duration: 1000,
                gravity: "bottom",
                close: true,
            }).showToast();
            console.log(response);
            localStorage.setItem("token", response.data.encryptedId);
            localStorage.setItem("userName", response.data.username);
            window.location.href = "../HTML/index.html";
        } else if (400) {
            // bad request
            Toastify({
                text: "Bad request. Check again",
                duration: 3000,
                gravity: "bottom",
                close: true,
            }).showToast();
        } else if (404) {
            //not found
            //singup
            Toastify({
                text: "No user found. Please Sign up",
                duration: 3000,
                gravity: "bottom",
                close: true,
            }).showToast();
            toggleSignup();
        } else if (401) {
            // incorrect password
            Toastify({
                text: "Incorrect password",
                duration: 3000,
                gravity: "bottom",
                close: true,
            }).showToast();
            toggleSignup();
        } else if (500) {
            //server error
            Toastify({
                text: "Server Error. Please try again later",
                duration: 3000,
                gravity: "bottom",
                close: true,
            }).showToast();
        }
    } catch (error) {
        console.log(error);
    }
}

function getFormDetails() {
    if (loginForm.style.display == "block") {
        const email = document.getElementById("email");
        const password = document.getElementById("password");
        if (!emailValidation(email.value)) {
            Toastify({
                text: "Enter a valid email address",
                duration: 1000,
                gravity: "bottom",
                close: true,
            }).showToast();
            return;
        }
        if (password.value.length < 6) {
            Toastify({
                text: "Password must be at least 6 characters",
                duration: 1000,
                gravity: "bottom",
                close: true,
            }).showToast();
            return;
        }
        const formDetails = {
            email: email.value,
            password: password.value,
        };
        return formDetails;
    } else {
        const email = document.getElementById("signup-email");
        const username = document.getElementById("signup-username");
        const password = document.getElementById("signup-password");
        if (!emailValidation(email.value)) {
            Toastify({
                text: "Enter a valid email address",
                duration: 1000,
                gravity: "bottom",
                close: true,
            }).showToast();
            return;
        }
        if (password.value.length < 6) {
            Toastify({
                text: "Password must be at least 6 characters",
                duration: 1000,
                gravity: "bottom",
                close: true,
            }).showToast();
            return;
        }
        const formDetails = {
            email: email.value,
            username: username.value,
            password: password.value,
        };
        return formDetails;
    }
}
function emailValidation(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(email);
    if (isValidEmail) return true;
    return false;
}
