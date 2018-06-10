// Make Connection to socket.io
const socket = io.connect("http://localhost:3000");

// Function which returns random callers
returnCaller = () => {
   const callerArray = ["Babes", "Hotness", "Cutyy", "Sweety"];
   return callerArray[Math.trunc(Math.random() * callerArray.length++)];
}

// Function for opening the Sign Up box on page load
!function openAuthorisationCheckingBox() {
   $('#userBox').modal('show');
}();

// Function for closinf the Sign Up box if the user is authorised
closeAuthorisationCheckingBox = () => {
   $('#userBox').modal('hide');
}

const induTips = [
   `Hey babes, don't forget to take medicines.`,
   `Gorgeous, go and have some milk, curd, etc. and start watching AIB.`,
   `Hotness, stay in contact with your friends, teachers and specially with those who can enhance your life and can bring opportunities. And most importantly --- "Don't dare to forget me."`,
   `Try to cook less. Focus on your goals.`
];

const simranTips = [
   `Drink lot of water babes! Vanasthali is hot`,
   `Go and have some cold drink`,
   `Don't you dare to forget me *_* `,
   `Sweety, Listen to me, Don't take too much bath! It will save you a lot of time`,
   `Why don't you text me on facebook or whatsapp...`
];

// This is the object of current user
// This is created for using user data at different places for verification purposes
let currentUser;
// function currentUser() {
//    return {
//       currentUser: null,
//       setCurrentUser(currentUser) {
//          this.currentUser = currentUser;
//       },
//       getCurrentUser() {
//          return this.currentUser;
//       }
//    }
// }

setsTipForSuccessModal = (data) => {
   let userCaller; let randomTip;
   if (data.user_data.isAdmin == false) {
      userCaller = data.user_data.user_name;
   } else {
      userCaller = "Sir";
   }

   document.querySelector('#heroSuccessMessage').textContent = `Welcome ${userCaller}`;

   // These if-else blocks shows random tips for different users
   // These tips are displayed on success popup
   if (data.user_data.user_name == "Indu Malik") {
      randomTip = induTips[Math.trunc(Math.random() * induTips.length++)];
   } else if (data.user_data.user_name == "Simran Dhama") {
      randomTip = simranTips[Math.trunc(Math.random() * simranTips.length++)];
   } else if (data.user_data.user_name == "Suyash Purwar") {
      randomTip = "";
      document.querySelector("#tip-head").style.display = "none";
   }

   // Sets the tip
   document.querySelector('#tipsForYou').textContent = randomTip;
   opensSuccessModal();
}

// Function for showing the success modal with tips according to different user, if the user is authorised
// This modal automatically gets closed after 3 seconds
opensSuccessModal = () => {
   // Opens the success alert popup
   $('#successAlertPopup').modal('show');

   // Closes the suucess alert popup
   setTimeout(() => {
      $('#successAlertPopup').modal('hide');
   }, 3000);
}

verifyUser = () => {
   // Sends the input data to app.js (server) for checking whether the users are authorised or not
   socket.emit('verify_user', {
      userData: {
         userName: document.querySelector("input[name=user_name]").value,
         userPassword: document.querySelector("input[name=user_password").value
      }
   });

   // This function executes if and only if the user is authorised
   socket.on("Authorised user", (data) => {
      // Hides the Popup box if the user is authorized
      closeAuthorisationCheckingBox();

      // Assigning data of user to currentUser
      currentUser = data.user_data;
      // Setting text to be printed on success alert
      // This function also opens the modal after setting data into it
      // This function calls the "openSuccessModal()" for opening it and closing it
      setsTipForSuccessModal(data);
      printAllOldMessages();
   });

   // Shows Unauthorized user message if the user is not in database
   socket.on("Unauthorized user", (data) => {
      $("#msgForUnauthUsers").css('display', 'block');
   });
}

function sendNewMessage() {
   let msg = document.querySelector("#msg_box").value;

   const data = {
      author: currentUser.user_name,
      message: msg
   };

   if (msg.trim() != "") {
      socket.emit("send-message", {data});
   } else {
      // Shows the alert if user tries to send empty message
      // Shows different message for admin and different for uers
      if (!currentUser.isAdmin) {
         document.querySelector("#writeSomethingMessage").textContent = `${returnCaller()}.... Write something!! Don't be lazy`;
      } else {
         document.querySelector("#writeSomethingMessage").textContent = "Sir, please type something";
      }

      // Removes the popup after 4 seconds
      $("#writeSomethingPopup").modal("show");
      setTimeout(() => {
         $("#writeSomethingPopup").modal("hide");
      }, 4000);
   }

   // Clears the input message after the message is sent
   document.querySelector("#msg_box").value = "";
}

// Catches the message
// Updates the DOM
socket.on("send-message", (data) => {
   if (data.data.author == currentUser.user_name) {
      // Prints the message sent by you on right
      printMessageOnRight(data.data);
   } else {
      // Prints the message sent by other user on left
      printMessageOnLeft(data.data);
   }
});

printMessageOnLeft = (message) => {
   let outputChamber = $("#chat-window");

   let messageTemplate = `<p class = "message-box" style = "float:left">
                              <span class = "message-sender">${message.author}:</span>
                              <span class = "msg">${message.message}</span>
                           </p>`;

   outputChamber.append(messageTemplate);
}

printMessageOnRight = (message) => {
   let outputChamber = $("#chat-window");

   let messageTemplate = ` <p class = "message-box" style = "float: right">
                              <span class = "message-sender">${message.author}:</span>
                              <span class = "msg">${message.message}</span>
                           </p>
                           `;

   outputChamber.append(messageTemplate);
}

printAllOldMessages = () => {
   data = null;
   socket.emit("fetchMessagesFromDB", {data});

   socket.on("getOldMessages", (messages_data) => {
      messages_data.messages.forEach((message) => {
         if (message.author == currentUser.user_name) {
            // Prints the message sent by you on right
            printMessageOnRight(message);
         } else {
            // Prints the message sent by other user on left
            printMessageOnLeft(message);
         }
      });
   });
}
