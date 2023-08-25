import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-storage.js";

// Initialize Firebase
const firebaseConfig = {
  // Your Firebase configuration here...
  apiKey: "AIzaSyDA7RhoJKxjg8BOQ3dw-682Wfi5nyxc3gU",
    authDomain: "saylanihackathonblogapp.firebaseapp.com",
    projectId: "saylanihackathonblogapp",
    storageBucket: "saylanihackathonblogapp.appspot.com",
    messagingSenderId: "636598514109",
    appId: "1:636598514109:web:d834cb87ecc479fdeba2d4",
    measurementId: "G-N4LDDRXL17"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const Signup_btn = document.getElementById('Signup_btn');
const Signup_Email = document.getElementById('Signup_Email');
const Signup_FirstName = document.getElementById('Signup_FirstName');
const Signup_LastName = document.getElementById('Signup_LastName');
const password = document.getElementById('Signup_Password');
const confirmpass = document.getElementById('Signup_RepeatPassword');
const Signup_Img = document.getElementById('Signup_Img');
const loader=document.getElementById('loader')
const content=document.getElementById('content')
Signup_btn.addEventListener('click', Signup_User);
const myForm = document.getElementById('myForm'); 

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



async function Signup_User(e) {
  if (!myForm.checkValidity()) {
    e.preventDefault(); 
    myForm.reportValidity(); 
  } else {
    
    
      if (password.value !== confirmpass.value) {
        Swal.fire({
          icon: 'error',
          title: `Password is not Matching!!`,
          showConfirmButton: false,
          timer: 1000
        });
        confirmpass.value = null;
      } else {
        
        if (Signup_Email.value && Signup_FirstName.value && Signup_LastName.value && password.value && confirmpass.value && Signup_Img.value) {
          e.preventDefault();
          try {
            loader.style.display='flex'
            content.style.display='none'
            const userCredential = await createUserWithEmailAndPassword(auth, Signup_Email.value, password.value);
            const user = userCredential.user;
            const img_Url = await GetImgUrl(user);
            await StoreUserData(user, img_Url);
            window.location.href = "index.html";
          } catch (error) { 
            console.log(error.message);
            Swal.fire({
              
              icon: 'error',
              title: `${error.message}!!`,
              showConfirmButton: false,
                  timer: 1000
                });
            loader.style.display='none'
            content.style.display='block'
      
          }
       
        }
        else{
          Swal.fire({
              
            icon: 'error',
            title: `Fill The Form First!!`,
            showConfirmButton: false,
                timer: 1000
              });
        }
      }
  }
}

async function StoreUserData(user, img_Url) {
  const firstName = Signup_FirstName.value;
  const lastName = Signup_LastName.value;
  await setDoc(doc(db, "users", user.uid), {
    fname: capitalize(firstName),
    lname: capitalize(lastName),
    password: password.value,
    email: Signup_Email.value,
    img_Url,
    uid: user.uid,
  });
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

async function GetImgUrl(user) {
  const imgRef = ref(storage, 'users/' + user.uid);
  const snapshot = await uploadBytes(imgRef, Signup_Img.files[0]);
  const url = await getDownloadURL(imgRef);
  return url;
}



