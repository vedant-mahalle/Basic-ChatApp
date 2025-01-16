// const socket =io('http://localhost:3000');
const socket = io()
const messageContainer = document.querySelector('#chat-message-container')
const nameInput = document.querySelector('#current-chat-user-name')
const messageForm = document.querySelector('#message-form')
const messageInput = document.querySelector('#message-input')
function renderClients(clientsNum) {
  const clientList = document.querySelector('#clients-list')
  clientList.innerHTML = ''
  let listHTML = ''
  for (let i = 0; i < clientsNum; i++) {
    listHTML += `
        <li id="client" class="py-2 flex items-center space-x-2">
          <i class="fas fa-user text-gray-500"></i>
          <span class="text-gray-800 text-sm font-medium">Client ${i + 1}</span>
        </li>
      `;
  }
  clientList.innerHTML = listHTML
}

socket.on('socket-id', (data) => {
  nameInput.innerHTML = data.id
})

socket.on('clients-total', (count) => {
  document.querySelector("#total-clients").innerText = `Total Clients: ${count}`
  renderClients(count)

})

socket.on('chat-message', (data) => {
  console.log(data)
  addMessageToUI(true, data)
})
function sendMessage() {
  console.log(messageInput.value)
  const data = {
    name: nameInput.innerHTML,
    message: messageInput.value,
    dateTime: new Date()
  }
  if (data.message) {
    socket.emit('message', data)
  }
  addMessageToUI(false, data)
  messageInput.value = ''
}

messageForm.addEventListener('submit', (e) => {
  e.preventDefault()
  sendMessage()
})

function addMessageToUI(isownMessage, data) {
  let element
  if (isownMessage) {
    element = `<li id="message-left" class="flex items-start space-x-2">
              <p class="bg-blue-100 text-gray-800 px-4 py-2 rounded-lg max-w-md">
              ${data.message}
                <span class="text-sm text-blue-600 block">${data.name}</span>
              </p>
            </li>`
  }
  else {
    element = `
    <li id="message-right" class="flex items-end space-x-2 justify-end">
              <p class="bg-green-100 text-gray-800 px-4 py-2 rounded-lg max-w-md">
                ${data.message}
                <span class="text-sm text-green-600 block">${data.name}</span>
              </p>
            </li>`
  }

  messageContainer.innerHTML += element
}

messageInput.addEventListener('focus', (e) => {
  socket.emit('feedback', {feedback: `${nameInput.innerHTML} is Typing...`})
})

messageInput.addEventListener('blur', (e) => {
  socket.emit('feedback', {feedback: ''})
})
messageContainer.addEventListener('keydown', (e) => { 
  socket.emit('feedback', {feedback: `${nameInput.innerHTML} is Typing...`})
  })

  socket.on('feedback', (data) => {
    clearFeedback();
    const element = `<li id="feedback" class="text-gray-500 italic text-sm">${data.feedback}</li>`;
    messageContainer.insertAdjacentHTML('beforeend', element);
  });
  
  function clearFeedback() {
    const feedbackElement = document.querySelector('li#feedback');
    if (feedbackElement) {
      feedbackElement.remove();
    }
  }
  