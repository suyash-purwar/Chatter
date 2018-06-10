// Function which returns random callers
returnCaller = () => {
   const callerArray = ["Babes", "Hotness", "Cutyy", "Sweety"];

   return callerArray[Math.trunc(Math.random() * callerArray.length++)];
}

// Function for opening the Sign Up box on page load
$('#userBox').modal('show');

// This is the object of user
// This is created or using user data at different places
let currentUser;

// Make Connection
const socket = io.connect("http://localhost:3000");

function verifyUser() {
   socket.emit('verify_user', {
      userData: {
         userName: document.querySelector("input[name=user_name]").value,
         userPassword: document.querySelector("input[name=user_password").value
      }
   });

   socket.on("Authorised user", (data) => {
      // Hides the Popup box if the user is authorized
      $('#userBox').modal('hide');

      // Assigning data of user to currentUser
      currentUser = data.user_data;

      // Setting text to be printed on success alert
      let userCaller; let randomTip;
      if (data.user_data.isAdmin == false) {
         userCaller = data.user_data.user_name;
      } else {
         userCaller = "Sir";
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

      document.querySelector('#heroSuccessMessage').textContent = `Welcome ${userCaller}`;
      if (data.user_data.user_name == "Indu Malik") {
         randomTip = induTips[Math.trunc(Math.random() * induTips.length++)];
      } else if (data.user_data.user_name == "Simran Dhama") {
         randomTip = simranTips[Math.trunc(Math.random() * simranTips.length++)];
      } else if (data.user_data.user_name == "Suyash Purwar") {
         randomTip = "";
         document.querySelector("#tip-head").style.display = "none";
      }
      document.querySelector('#tipsForYou').textContent = randomTip;
      $('#successAlertPopup').modal('show');
   });

   socket.on("Unauthorized user", (data) => {
      $("#msgForUnauthUsers").css('display', 'block');
   });
}

function sendNewMessage() {
   let msg = document.querySelector("#msg_box").value;

   const data = {
      author: currentUser.user_name,
      msg: msg
   };

   if (msg.trim() != "") {
      socket.emit("send-message", {data});
   } else {
      if (!currentUser.isAdmin) {
         document.querySelector("#writeSomethingMessage").textContent = `${returnCaller()}.... Write something!! Don't be lazy`;
      } else {
         document.querySelector("#writeSomethingMessage").textContent = "Sir, please type something";
      }

      $("#writeSomethingPopup").modal("show");
      setTimeout(() => {
         $("#writeSomethingPopup").modal("hide");
      }, 4000);
   }
}

// Catches the message
// Updates the DOM
socket.on("send-message", (data) => {
   console.log(data);
   
});