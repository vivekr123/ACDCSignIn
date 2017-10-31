window.onload = function() {

//document.currentScript.getAttribute('user');

//Gets username from html template

  //for private messaging
  var privField = document.getElementById('txt');

  //has name property to give receiver's name
  $('input #txt').bind("enterKey", function(e){
    var text = privField.value;
    //implement this socketid part
    socket.to(socketid).emit('privMessage', text);
  });

  $('input #txt').keyup(function(e){
    if(e.keyCode == 13){
      $(this).trigger("enterKey");
      $(this).value = "";
    }
  })




var username = document.getElementById('content').getAttribute('data-myValue');



var messages = [];
//For https
var socket = io.connect('http://localhost:8080', {secure: true});
console.log(socket.username);
var field = document.getElementById('field');
var sendButton = document.getElementById('send');
var content = document.getElementById('content');
var online = document.getElementById('online');
var createGroup = document.getElementById('createGroup');
var groupName = document.getElementById('groupName');

var chatSidebar = document.getElementById('chat-sidebar')
//var name = document.getElementById("name");   --> for textbox

socket.on('privMessage', function(username, message){
  var html = '';
  html += message;
  var receiverName = $('input #txt').name; //CHECK
  var receiverUsername;
  //have to add it to specific user chat box - pass in username and message //when you create pop up, make id unique for user, then add only to that div
})

socket.on('message', function(data){
  if(data.message){
    messages.push(data);
    var html='';
    for(var i = 0; i<messages.length;i++) {

      // Condition ?(then) value if true :(else) value if false
      html += '<b>' + (messages[i].username ? messages[i].username : 'Server') + ': </b>';
                html += messages[i].message + '<br />';
    }
    content.innerHTML = html;
  } else {
    console.log("Problem: ", data);
  }
});

socket.on('currentClients', function(data){
  var clients = data;
  //clients = data;

  var html = '';
  if(clients!=null) {

  for(var i = 0; i<clients.length; i++){
    if(clients[i]!=username && clients[i]!='' && clients[i]!=undefined){

      console.log(clients[i]);
    //For spans, clients[i] does not already exist
    html += `
    <div class = "sidebar-name" id = "${clients[i]}_remove">
    <a href = 'javascript:register_popup("${clients[i].toString()}","${clients[i].toString()}");'>
    <img width="30" height="30" src="css/userprofile.jpg">
    <span>${clients[i]}</span>
    </a>
    </div>`;
  }
    //html += "<button value='chat' style='width:25%; height:2.5em;background-color:white; margin-top:.6em'>"+clients[i]+'</button>' + '<br/>';
  }
  // += makes chatSidebar have multiple instances of same user
  chatSidebar.innerHTML = html;

}
});

//for removing div with online person
socket.on('removeClient', function(data){
  console.log('Remove action')
  var toRemove = document.getElementById(data+'_remove');
  toRemove.outerHTML = "";
  toRemove.innerHTML = "";

});

socket.on('createRoom', function(room){
  socket.join(room);
});

socket.on('joinGroup', function(room){
  socket.join(room);

})

sendButton.onclick = function() {
  /*if(name.value == "") {
    alert("Please enter name");
  }*/
    var text = field.value;
    socket.emit('send', {message: text, username: username}); //name.value
    field.value = "";

};

createGroup.onclick = function() {
  var text = groupName.value;
  socket.emit('createRoom', text);  //CHECK
  text.value = "";
}

privateChat = function(socketid, message){
  socket.to(socketid).emit('privMessage', message);
}

}
