let currentUser = null;
let currentChat = null;
let messages = {};
let news = [];

const clients = [
  { id: "client1", name: "Client One", role: "client" },
  { id: "client2", name: "Client Two", role: "client" },
];

function login() {
  const username = document.getElementById('username').value.trim();
  if (!username) return alert("Enter a username");

  currentUser = username === "admin" ? "admin" : "client";

  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('main-app').classList.remove('hidden');

  document.getElementById('user-role').textContent = 
    currentUser === "admin" ? "👑 Admin" : `👤 ${username}`;

  if (currentUser === "admin") {
    document.getElementById('admin-panel').classList.remove('hidden');
    loadClients();
  } else {
    document.getElementById('admin-panel').classList.add('hidden');
    document.getElementById('clients-list').innerHTML = `
      <div class="p-4 text-center text-gray-400">Connected to Admin</div>`;
    openChat("admin");
  }
}

function loadClients() {
  const container = document.getElementById('clients-list');
  container.innerHTML = `<h3 class="text-sm uppercase tracking-widest text-gray-400 mb-3">Clients</h3>`;

  clients.forEach(client => {
    const div = document.createElement('div');
    div.className = `p-3 rounded-xl hover:bg-gray-800 cursor-pointer flex items-center gap-3 ${currentChat === client.id ? 'bg-gray-800' : ''}`;
    div.innerHTML = `
      <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm">👤</div>
      <div>
        <div class="font-medium">${client.name}</div>
        <div class="text-xs text-green-400">Online</div>
      </div>
    `;
    div.onclick = () => openChat(client.id);
    container.appendChild(div);
  });
}

function openChat(userId) {
  currentChat = userId;
  document.getElementById('chat-with').textContent = 
    userId === "admin" ? "Chat with Admin" : `Chat with ${clients.find(c => c.id === userId).name}`;

  if (!messages[userId]) messages[userId] = [];
  renderMessages();
  if (currentUser === "admin") loadClients();
}

function sendMessage() {
  const input = document.getElementById('message-input');
  const text = input.value.trim();
  if (!text || !currentChat) return;

  if (!messages[currentChat]) messages[currentChat] = [];

  messages[currentChat].push({
    from: currentUser,
    text: text,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });

  input.value = '';
  renderMessages();
}

function renderMessages() {
  const container = document.getElementById('messages');
  container.innerHTML = '';

  if (!messages[currentChat]) return;

  messages[currentChat].forEach(msg => {
    const div = document.createElement('div');
    div.className = `message ${msg.from === currentUser || (currentUser === 'admin' && msg.from === 'admin') ? 'admin' : 'client'}`;
    div.innerHTML = `
      <div class="text-xs opacity-75 mb-1">${msg.time}</div>
      <div>${msg.text}</div>
    `;
    container.appendChild(div);
  });

  container.scrollTop = container.scrollHeight;
}

function postNews() {
  const input = document.getElementById('news-input');
  if (!input.value.trim()) return;

  news.unshift({
    text: input.value.trim(),
    time: new Date().toLocaleDateString()
  });

  input.value = '';
  renderNews();
}

function renderNews() {
  const container = document.getElementById('news-feed');
  container.innerHTML = '';

  news.forEach(item => {
    const div = document.createElement('div');
    div.className = "bg-gray-800 p-3 rounded-xl text-sm";
    div.innerHTML = `
      <div class="text-emerald-400 text-xs">${item.time}</div>
      <div>${item.text}</div>
    `;
    container.appendChild(div);
  });
}

function logout() {
  location.reload();
}

// Initialize
renderNews();