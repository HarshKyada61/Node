const socket = io();

//Elements
const $messageForm = document.querySelector("#message-form")
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $message = document.querySelector('#messages')

//Template
const messageTemplate = document.querySelector("#message-template").innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//Options
const { username, room } = Qs.parse(location.search, {ignoreQueryPrefix: true})

const autoscroll = () => {
    //New message elemnt
    const $newMessage = $message.lastElementChild

    //Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    //Visible height
    const visibleHeight = $message.offsetHeight

    //Height of messages container
    const containerHeight = $message.scrollHeight

    //How far have I scrolled?
    const scrolloffset = $message.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrolloffset){
        $message.scrollTop = $message.scrollHeight
    }
}

socket.on("message", (message) => {
    console.log(message)
  const html = Mustache.render(messageTemplate, {
    message: message.text,
    createdAt: moment(message.createdAt).format('h:mm a'),
    username: message.username
  })
  $message.insertAdjacentHTML('beforeend', html)
  autoscroll()
});

socket.on('locationMessage', (locationMessage) => {
    console.log(locationMessage);
    const html = Mustache.render(locationTemplate, {
        locationURL : locationMessage.text,
        createdAt: moment(locationMessage.createdAt).format('h:mm a'),
        username: locationMessage.username
    })
    $message.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('roomData', ({room, users}) => {
   const html = Mustache.render(sidebarTemplate,{ 
    room,
    users
   })
   document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();

  $messageFormButton.setAttribute("disabled", "disabled")
  const messageData = e.target.elements.message.value;
  socket.emit("sendMessage", messageData, (error) => {
    $messageFormButton.removeAttribute("disabled")
    $messageFormInput.value = ''
    $messageFormInput.focus()

    if (error) {
      return console.log(error);
    }

    console.log("message delivered!");
  });
});

$sendLocationButton.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser.");
  }

  $sendLocationButton.setAttribute("disabled","disabled")

  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit("sendLocation", {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
    } , () => {
        $sendLocationButton.removeAttribute("disabled")
        console.log("location delivered");
    });
  });
});

socket.emit('join', {username, room}, (error) => {
    if(error){
        alert(error)
        location.href = '/'
    }
})
