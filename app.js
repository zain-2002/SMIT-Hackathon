import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-analytics.js";
  import { getAuth,createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";
  import { getFirestore,  doc, setDoc } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-firestore.js";
  import { getStorage, ref,uploadBytes, getDownloadURL} from "https://www.gstatic.com/firebasejs/10.2.0/firebase-storage.js";
  
 
  
  
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
  const db = getFirestore(app);
  const storage = getStorage(app);



  const Signup_btn=document.getElementById('Signup_btn');
  const Signup_Email=document.getElementById('Signup_Email');
  

  const Signup_FirstName=document.getElementById('Signup_FirstName');
  const Signup_LastName=document.getElementById('Signup_LastName');
  const password=document.getElementById('Signup_Password')
  const confirmpass=document.getElementById('Signup_RepeatPassword');
  const Signup_Img=document.getElementById('Signup_Img');



    Signup_btn.addEventListener('click',Signup_User);

let img_Url=null;


 async function Signup_User(e){
if (password.value !==confirmpass.value) {
    Swal.fire({
        
        icon: 'error',
        title: `Password is not Matching!!`,
        showConfirmButton: false,
            timer: 1000
          });
          confirmpass.value=null
        }
        else{
            e.preventDefault();
            createUserWithEmailAndPassword(auth, Signup_Email.value, password.value)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
      
                invokeUserUrl(user);
                      
                
                 
              
               
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage);
                // ..
            });
            
           
    }
}
async function StoreUserData(user,img_Url) {
  let firstName=Signup_FirstName.value
  let lastName=Signup_LastName.value
  await setDoc(doc(db, "users", user.uid), {
    fname:firstName.charAt(0).toUpperCase()+firstName.slice(1),
    lname:lastName.charAt(0).toUpperCase()+lastName.slice(1),
    password:password.value,
    email:Signup_Email.value,
    img_Url,
    uid:user.uid,
  });
  
}
async function invokeUserUrl(user){
  img_Url=await GetImgUrl(user); // Wait for the download URL
  console.log(img_Url);
  StoreUserData(user,img_Url).then(()=>{
    window.location.href = "index.html"; 
  });
}
async function GetImgUrl(user) {
  return new Promise((resolve, reject) => {
    const imgRef = ref(storage, 'users/' + user.uid)
    uploadBytes(imgRef, Signup_Img.files[0]).then(snapshot => {
      getDownloadURL(imgRef)
        .then(url => {
          resolve(url); 
        })
        .catch(err => reject(err));
    });
  });
}
  