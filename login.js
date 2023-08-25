
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-analytics.js";
  import { getAuth,signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries


  const firebaseConfig = {
    apiKey: "AIzaSyDA7RhoJKxjg8BOQ3dw-682Wfi5nyxc3gU",
    authDomain: "saylanihackathonblogapp.firebaseapp.com",
    projectId: "saylanihackathonblogapp",
    storageBucket: "saylanihackathonblogapp.appspot.com",
    messagingSenderId: "636598514109",
    appId: "1:636598514109:web:d834cb87ecc479fdeba2d4",
    measurementId: "G-N4LDDRXL17"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const auth = getAuth(app);



  const Login_password=document.getElementById('Login_password');
  const Login_email=document.getElementById('Login_email');
const Login_btn=document.getElementById('Login_btn');
const loader=document.getElementById('loader')
Login_btn.addEventListener('click',Login_User);

$(document).ready(function() {
  $('.toggle-password').on('click', function() {
      var input = $(this).closest('.input-group').find('input');
      if (input.attr('type') === 'password') {
          input.attr('type', 'text');
      } else {
          input.attr('type', 'password');
      }
      $(this).toggleClass('bi-eye-slash bi-eye');
  });
});


function Login_User(e){
 e.preventDefault();
 loader.style.display='flex'
    signInWithEmailAndPassword(auth, Login_email.value, Login_password.value)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      console.log(user);
      window.location.href = "index.html"; 
                // ...
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      
      const errorMessage = error.message;
      console.log(errorMessage);
      Swal.fire({
        
        icon: 'error',
        title: `${error.message}!!`,
        showConfirmButton: false,
            timer: 1000
          });
          loader.style.display='none'
    });
  
  }