'use strict';

// DOM Elements
const usernamePage = document.querySelector('#username-page');
const chatPage = document.querySelector('#chat-page');
const usernameForm = document.querySelector('#usernameForm');
const messageForm = document.querySelector('#messageForm');
const messageInput = document.querySelector('#message');
const userNameDisplay = document.querySelector('#user-name');
const chatArea = document.querySelector('#chat-messages');
const logout = document.querySelector('#logout');

// State
let stompClient = null;
let currentUser = null; 
let selectedUserId = null;

// Connect to chat
function connect(event) {
    const userId = document.querySelector('#userId').value.trim();

    if (userId) {
        fetch(`/api/users/verify/${userId}`)
            .then(response => {
                if (!response.ok) throw new Error('User not found');
                return response.json();
            })
            .then(user => {
                currentUser = user;
                usernamePage.classList.add('hidden');
                chatPage.classList.remove('hidden');
                userNameDisplay.textContent = `${user.firstName} ${user.lastName}`;

                const socket = new SockJS('/ws');
                stompClient = Stomp.over(socket);
                stompClient.connect({}, onConnected, onError);
            })
            .catch(() => {
                alert('User not found. Please enter a valid ID.');
            });
    }
    event.preventDefault();
}

function onConnected() {
    // Subscribe to private queue
    stompClient.subscribe(`/user/${currentUser.id}/queue/messages`, onMessageReceived);

    // Notify others
    stompClient.send("/app/user.connect",
        {},
        JSON.stringify({
            userId: currentUser.id,
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            status: 'ONLINE'
        })
    );

    findAndDisplayConnectedUsers();
}

// Fetch online users
async function findAndDisplayConnectedUsers() {
    const response = await fetch('/api/users/online');
    const users = await response.json();
    const userList = document.getElementById('connectedUsers');
    userList.innerHTML = '';

    users
        .filter(user => user.id !== currentUser.id)
        .forEach(user => {
            const userElement = document.createElement('li');
            userElement.id = user.id;
            userElement.innerHTML = `
                <img src="/img/user_icon.png">
                <span>${user.firstName} ${user.lastName}</span>
                <span class="nbr-msg hidden">0</span>
            `;
            userElement.addEventListener('click', () => {
                selectedUserId = user.id;
                fetchAndDisplayUserChat();
            });
            userList.appendChild(userElement);
        });
}

// Fetch chat history
async function fetchAndDisplayUserChat() {
    const response = await fetch(`/api/messages/${currentUser.id}/${selectedUserId}`);
    const messages = await response.json();

    chatArea.innerHTML = '';
    messages.forEach(msg => {
        displayMessage(msg.senderId, msg.senderName, msg.content);
    });
}

// Display messages
function displayMessage(senderId, senderName, content) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', senderId === currentUser.id ? 'sender' : 'receiver');
    messageDiv.innerHTML = `
        <strong>${senderId === currentUser.id ? 'You' : senderName}:</strong>
        <p>${content}</p>
    `;
    chatArea.appendChild(messageDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
}

// Send message
function sendMessage(event) {
    const content = messageInput.value.trim();
    if (content && selectedUserId) {
        const message = {
            senderId: currentUser.id,
            senderName: `${currentUser.firstName} ${currentUser.lastName}`,
            recipientId: selectedUserId,
            content: content,
            timestamp: new Date().toISOString()
        };
        stompClient.send("/app/chat.send", {}, JSON.stringify(message));
        displayMessage(currentUser.id, 'You', content);
        messageInput.value = '';
    }
    event.preventDefault();
}

// Handle incoming messages
function onMessageReceived(payload) {
    const message = JSON.parse(payload.body);
    if (!selectedUserId || selectedUserId === message.senderId) {
        displayMessage(message.senderId, message.senderName, message.content);
    }
}

// Error handling
function onError() {
    alert('Connection error. Please refresh the page.');
}

// Logout
function onLogout() {
    stompClient.send("/app/user.disconnect",
        {},
        JSON.stringify({ userId: currentUser.id })
    );
    window.location.reload();
}

// Event listeners
usernameForm.addEventListener('submit', connect);
messageForm.addEventListener('submit', sendMessage);
logout.addEventListener('click', onLogout);
window.onbeforeunload = onLogout;