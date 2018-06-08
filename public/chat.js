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
      console.log(data.user_data);
   })

   socket.on("Unauthorised user", (data) => {
      console.log("Not a authorised user");
   })
}