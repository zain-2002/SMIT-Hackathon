
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-analytics.js";
  import { getAuth,onAuthStateChanged,signOut,updatePassword,reauthenticateWithCredential,EmailAuthProvider} from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";
  import { getFirestore,getDoc,doc,updateDoc} from "https://www.gstatic.com/firebasejs/10.2.0/firebase-firestore.js";
  import { getStorage, ref,uploadBytes, getDownloadURL,deleteObject} from "https://www.gstatic.com/firebasejs/10.2.0/firebase-storage.js";
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
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const auth = getAuth(app);

  let userDetail=null
  const db = getFirestore(app);
  const storage = getStorage(app);


  const Profile_Img=document.getElementById('Profile_Img')
  const Username=document.getElementById('Username')
  const Profile_OldPassword=document.getElementById('Profile_OldPassword')
  const Profile_NewPassword=document.getElementById('Profile_NewPassword')
  const Profile_RepeatPassword=document.getElementById('Profile_RepeatPassword')
  const Profile_btn=document.getElementById('Profile_btn')
const logout_user=document.getElementById('logout_user')
  const uploadIcon = document.getElementById('uploadIcon');
  const fileInput = document.getElementById('fileInput');
const Update_Name=document.getElementById('Update_Name')
const Name_Cont=document.getElementById('Name_Cont')
const Profile_FirstName=document.getElementById('Profile_FirstName')
const Profile_LastName=document.getElementById('Profile_LastName')
const SaveUpdate_btn=document.getElementById('SaveUpdate_btn')
const nameForm=document.getElementById('nameForm')
const PasswordForm=document.getElementById('PasswordForm')



const loader=document.getElementById('loader')
const content=document.getElementById('content')
window.addEventListener('load', () => {
  loader.style.display = 'flex'; 

  setTimeout(() => {
    loader.style.display = 'none';
    content.style.display='block'
  }, 5000);
});


SaveUpdate_btn.addEventListener('click',SaveUserName)

function SaveUserName(e) {
try{

    if (!nameForm.checkValidity()) {
      e.preventDefault(); 
      nameForm.reportValidity(); 
    } else {
   
        let fname=Profile_FirstName.value
        let lname=Profile_LastName.value
      Username.innerText= fname.charAt(0).toUpperCase()+fname.slice(1)+" "+lname.charAt(0).toUpperCase()+lname.slice(1) ;
      Profile_FirstName.value=""
      Profile_LastName.value=""
      Name_Cont.style.display='none'
     console.error("To Stop the form")
    }
  }
  catch(error){
    console.log(error);
  }




}

  let newimg=null
  let userid=null


Update_Name.addEventListener('click',()=>{
if (Name_Cont.style.display==='none') {
 let name=Username.innerText
 console.log(name);
  Name_Cont.style.display='block'
  let fname=name.split(' ')[0]
  let lname=name.split(' ')[1]
  Profile_FirstName.value= fname
  Profile_LastName.value=lname 
}
else if( Name_Cont.style.display==='block'){
  Name_Cont.style.display='none'
}
 

})
  uploadIcon.addEventListener('click', () => {
    fileInput.click(); // Trigger the click event on the file input
  });
  
  
  fileInput.addEventListener('change', (event) => {
    const selectedFile = event.target.files[0];


newimg=selectedFile
    if (selectedFile) {
      const imageUrl = URL.createObjectURL(selectedFile);
      console.log(imageUrl);
      Profile_Img.src = imageUrl;
    } 

  });
  
  
  logout_user.addEventListener('click',Logout_User);

  function Logout_User(){
    signOut(auth).then(() => {
        // Sign-out successful.
        console.log("signout");
      }).catch((error) => {
        // An error happened.
      });
}






  Profile_btn.addEventListener('click',updateProfile)
 async function updateProfile(e) {


  if (!PasswordForm.checkValidity()) {
    e.preventDefault(); 
    PasswordForm.reportValidity(); 
  } else {
   
    e.preventDefault();
 
        loader.style.display='flex'
        content.style.display='none'
        const docRef = doc(db, "users", userid);
        const docSnap = await getDoc(docRef);
        let password=docSnap.data().password
        let email=docSnap.data().email
        let uname=Username.innerText;
    
    
    
        if (uname.trim().split(' ')[0]===docSnap.data().fname && uname.slice(uname.trim().split(' ')[0].length).trim()===docSnap.data().lname.trim()&& !Profile_NewPassword.value && Profile_Img.src===docSnap.data().img_Url) {
      
          Swal.fire({
              
            icon: 'error',
            title: `Update Something First!!`,
            showConfirmButton: false,
                timer: 1000
              });
    
              loader.style.display='none'
              content.style.display='block'
          return;
      }

    if (Profile_OldPassword.value) {

   if (Profile_OldPassword.value!==password) {
      
      Swal.fire({
          
          icon: 'error',
          title: `Enter Correct Old Password!!`,
          showConfirmButton: false,
              timer: 1000
            });
  
            Profile_OldPassword.value=null
            
            loader.style.display='none'
            content.style.display='block'
            return 
  
  }
       
    }

if (Profile_NewPassword.value) {
  
  if (Profile_OldPassword.value===Profile_NewPassword.value) {
  
    setTimeout(()=>{
  
      Swal.fire({
          
          icon: 'error',
          title: `Old and New Password Both are Same!!`,
          showConfirmButton: false,
              timer: 1400
            });
  
  
            Profile_NewPassword.value=null
            Profile_RepeatPassword.value=null
            
            loader.style.display='none'
            content.style.display='block'
            return
    },800)
      
  }
}

if (Profile_RepeatPassword.value) {
  setTimeout(()=>{

    if (Profile_NewPassword.value!==Profile_RepeatPassword.value) {
      Swal.fire({
          
          icon: 'error',
          title: `New Password and Repeat Password Are Not Same!!`,
          showConfirmButton: false,
              timer: 1400
            });
            Profile_RepeatPassword.value=null
            
            loader.style.display='none'
            content.style.display='block'
            return
      
  }
  },800)
  password=Profile_RepeatPassword.value
}

if (newimg) {

    const desertRef = ref(storage, 'users/'+userid);

    deleteObject(desertRef).then(() => {

      const imgRef = ref(storage, 'users/' + userid)
  uploadBytes(imgRef, newimg).then(snapshot => {
    getDownloadURL(imgRef)
      .then(url => {
        Profile_Img.src=url;
        const documentRef = doc(db,'users',userid);
        updateDoc(documentRef,{
            img_Url:url,
          password, 
          fname:Username.innerText.split(" ")[0],
          lname:uname.slice(uname.trim().split(' ')[0].length).trim()
          }).then(()=>{

if (Profile_NewPassword.value) {
  
  const credentials = EmailAuthProvider.credential(email, Profile_OldPassword.value);
  
  
  reauthenticateWithCredential(auth.currentUser, credentials)
    .then(() => {
      // Re-authentication successful, you can now perform the desired action
      // such as updating email or password
  
  
      updatePassword(auth.currentUser, password).then(() => {
        // Update successful.
        Swal.fire({
          icon: 'success',
          title: 'Data Edited Successfully!!',
          showConfirmButton: false,
          timer: 1000
        });
  
        location.reload();
      }).catch((error) => {
        // An error ocurred
        console.log(error);
        // ...
      });
  
  
  
  
  
  
    })
    .catch((error) => {
      // Re-authentication failed, handle the error (e.g., show error message)
      console.error("Re-authentication error:", error);
    });
}



else{
  location.reload();
}




          


})
    


    
    
    
    
    
    
    
    
    
    
    
        })
      .catch(err => console.error(err))
  })

    }).catch((error) => {
      // Uh-oh, an error occurred!
    });
    

   
}
else{

    const documentRef = doc(db,'users',userid);
    updateDoc(documentRef,{
     
      password,
      fname:Username.innerText.split(" ")[0],
      lname:uname.slice(uname.trim().split(' ')[0].length).trim()


      }).then(()=>{


        if (Profile_NewPassword.value) {
  
          const credentials = EmailAuthProvider.credential(email, Profile_OldPassword.value);
          
          
          reauthenticateWithCredential(auth.currentUser, credentials)
            .then(() => {
             
          
          
              updatePassword(auth.currentUser, password).then(() => {
            
                Swal.fire({
                  icon: 'success',
                  title: 'Data Edited Successfully!!',
                  showConfirmButton: false,
                  timer: 1000
                });
          
                location.reload();
              }).catch((error) => {
             
                console.log(error);
          
              });
          
          
          
          
          
          
            })
            .catch((error) => {
            
              console.error("Re-authentication error:", error);
            });
        }
        
        
        
        else{
          location.reload();
        }
        
        







        
        
      })
 

}
  }



  }

  onAuthStateChanged(auth, (user) => {
    if (user) {

      const uid = user.uid;
      userid=uid
      console.log(uid);
     
      getData(uid)
      userDetail=  user;
console.log(userDetail);
    } else {
   
      }
  }
);


  async function getData(uid) {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
  
      User_Name_Space.innerText=docSnap.data().fname+" "+docSnap.data().lname
      Username.innerText=docSnap.data().fname+" "+docSnap.data().lname
Profile_Img.src=docSnap.data().img_Url;



    } else {
  
      console.log("No such document!");
    }
  }


  
  

  

  

  

  
  

  

  

  