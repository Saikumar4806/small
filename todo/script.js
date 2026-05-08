// --- AUTH LOGIC ---

function register() {
    const user = document.getElementById('regUser').value.trim();
    const pass = document.getElementById('regPass').value.trim();

    if (!user || !pass) return alert("Please fill all fields");

    let users = JSON.parse(localStorage.getItem('users')) || {};

    if (users[user]) {
        alert("Username already exists!");
    } else {
        users[user] = { password: pass, tasks: [] };
        localStorage.setItem('users', JSON.stringify(users));
        alert("Registration Successful! Please Login.");
        window.location.href = "login.html";
    }
}

function login() {
    const user = document.getElementById('loginUser').value.trim();
    const pass = document.getElementById('loginPass').value.trim();

    let users = JSON.parse(localStorage.getItem('users')) || {};

    if (users[user] && users[user].password === pass) {
        localStorage.setItem('currentUser', user); // Set "Session"
        window.location.href = "index.html";
    } else {
        alert("Invalid Username or Password");
    }
}

// --- DASHBOARD LOGIC ---

function checkAccess() {
    const user = localStorage.getItem('currentUser');
    if (!user) {
        window.location.href = "login.html";
    } else {
        document.getElementById('welcome').innerText = user + "'s Tasks";
        renderTasks();
    }
}

function renderTasks() {
    const user = localStorage.getItem('currentUser');
    const users = JSON.parse(localStorage.getItem('users'));
    const list = document.getElementById('taskList');
    list.innerHTML = "";

    users[user].tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${task}</span> <span class="del-btn" onclick="deleteTask(${index})">&times;</span>`;
        list.appendChild(li);
    });
}

function addTask() {
    const user = localStorage.getItem('currentUser');
    const input = document.getElementById('taskInput');
    if (!input.value.trim()) return;

    let users = JSON.parse(localStorage.getItem('users'));
    users[user].tasks.push(input.value);
    localStorage.setItem('users', JSON.stringify(users));

    input.value = "";
    renderTasks();
}

function deleteTask(index) {
    const user = localStorage.getItem('currentUser');
    let users = JSON.parse(localStorage.getItem('users'));
    users[user].tasks.splice(index, 1);
    localStorage.setItem('users', JSON.stringify(users));
    renderTasks();
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = "login.html";
}