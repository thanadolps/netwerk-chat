
const socket = io("http://localhost:5069");

function sendMsg() {
  socket.emit("message", "hello from html");
}
const groupChatSelect = document.getElementById("group-chat-select");
const userNameSelect = document.getElementById("user-name-select");
const changeNameRadio = document.getElementById("change-name-radio");
const changeGroupNameRadio = document.getElementById("change-group-name-radio");
const currentGroupNameSpan = document.getElementById("current-group-name");
const joinLeaveBtn = document.getElementById("join-leave-btn");
const messagesDiv = document.getElementById("messages");
const chatBoxInput = document.getElementById("chat-box");
const sendBtn = document.getElementById("send-btn");
const chatWindow = document.getElementById("main-chat-window");

function getGroupsNames() {
  socket.emit("request", { "data": "group_name" });
}
socket.on('response', function (data) {
  if (data['group_name'] == 'server') setGroupChatOptions(data["data"])
  if (data['data'] == 'join_group') joinLeaveBtn.innerText = 'leave'
  if (data['data'] == 'leave_group') joinLeaveBtn.innerText = 'join'
})
socket.on('message', function (data) {
  appendMessageToChatWindow(data["sender"] + ' (' + data['group_name'] + ') : ' + data["data"])
})
socket.on('error', function (data) {
  appendMessageToChatWindow(data["sender"] + ' (' + data['group_name'] + ') : ' + data["data"])
})

function getUserNames() {
  // implementation
}
function join(groupName) {
  socket.emit("join_group", { "data": groupName });
}
function leave(groupName) {
  socket.emit("leave_group", { "data": groupName });
}
function send(name, msg) {
  socket.emit("message", { "group_name": name, "data": msg });
}
function renameGroup(oldGroupName, newGroupName) {
  // implementation
}
function renameUser(newName) {
  // implementation
  // added comment
}

function setGroupChatOptions(groupNames) {
  groupChatSelect.innerHTML = "";
  for (const groupName of groupNames) {
    const option = document.createElement("option");
    option.value = groupName;
    option.text = groupName;
    groupChatSelect.appendChild(option);
  }
  if (selectedGroupChat == null) selectedGroupChat = groupNames[0]
}

function setUserNameOptions(userNames) {
  userNameSelect.innerHTML = "";
  for (const userName of userNames) {
    const option = document.createElement("option");
    option.value = userName;
    option.text = userName;
    userNameSelect.appendChild(option);
  }
}

function appendMessageToChatWindow(message) {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  console.log(chatWindow, messageElement)
  chatWindow.appendChild(messageElement);
}
getGroupsNames()
getUserNames()

let selectedGroupChat;
let selectedUserName;
let selectedCommand;

groupChatSelect.addEventListener("change", function () {
  selectedGroupChat = this.value;
  currentGroupNameSpan.innerText = selectedGroupChat;
});

userNameSelect.addEventListener("change", function () {
  selectedUserName = this.value;
});

changeNameRadio.addEventListener("change", function () {
  selectedCommand = "change-name";
});

changeGroupNameRadio.addEventListener("change", function () {
  selectedCommand = "change-group-name";
});

joinLeaveBtn.addEventListener("click", function () {
  if (this.innerText === "Join") {
    join(selectedGroupChat)
  } else {
    leave(selectedGroupChat)
  }
});

sendBtn.addEventListener("click", function () {
  const message = chatBoxInput.value;
  console.log(selectedGroupChat, chatBoxInput.value)
  if (selectedCommand === "change-name") {
    renameUser(message);
  } else if (selectedCommand === "change-group-name") {
    renameGroup(selectedGroupChat, message);
  } else if (selectedUserName) {
    send(selectedUserName, message);
  } else if (selectedGroupChat) {
    send(selectedGroupChat, message);
  }
});
