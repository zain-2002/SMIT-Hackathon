import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-analytics.js";
  import { getAuth,onAuthStateChanged,signOut } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";
  import { getFirestore,collection, addDoc,getDoc,doc,query, where, getDocs,deleteDoc,updateDoc,orderBy} from "https://www.gstatic.com/firebasejs/10.2.0/firebase-firestore.js";
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
  const logout_user=document.getElementById('logout_user');
  const greetings=document.getElementById('greetings')
  const publish_blogs=document.getElementById('publish_blogs')
  const Login_User_Link=document.getElementById('Login_User_Link')
  const blog_title=document.getElementById('blog_title')
  const blog_text=document.getElementById('blog_text')
  const Blogs_info=document.getElementById('Blogs_info')
  const User_Name_Space=document.getElementById('User_Name_Space')
  const published_blogs=document.getElementById('published_blogs')
  const blogs_Cont=document.getElementById('blogs_cont')
  const loader=document.getElementById('loader')
  const content=document.getElementById('content')
  let userid=null

  window.addEventListener('load', () => {
    loader.style.display = 'flex';
  
    setTimeout(() => {
      loader.style.display = 'none'; 
      content.style.display='block'
    }, 4000);
  });

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      const uid = user.uid;
      userid=uid
      console.log(uid);
      greetings.innerText="Dashboard"
      published_blogs.style.display='flex'
      Login_User_Link.style.display='none'
      logout_user.style.display='block'
      Blogs_info.innerText='My Blogs'
      User_Name_Space.style.display='block'
     
      // loader.style.display='flex'
    getUsername();  
    getMyBlogs(uid);
      // ...
    } else {
      // User is signed out
      // ...
      // loader.style.display='flex'

      greeting();
      getAllBlogs();
      logout_user.style.display='none'
      published_blogs.style.display='none'
      Blogs_info.innerText='All Blogs'
      User_Name_Space.style.display='none'
      Login_User_Link.style.display='block'
      }
  }
);


let blogsdata=[]
async function getMyBlogs(uid){

  if (userid) {
    
    const q = query(collection(db, "usersblogs"), where("uid", "==", uid), orderBy("publishdate","desc"));

 

  
    blogs_Cont.innerHTML=null;
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      //console.log(doc.id, " => ", doc.data());
blogsdata.push(doc.data())
     const blogDiv=`
     <div class=" my-4 card p-4 shadow">
      
     <div class="row g-0 mb-3">
       <div class="col-md-3 p-2 imgContainer " >
         <img src="${doc.data().img}" class="img-fluid rounded h-100 w-75" alt="img" style="width:85% !important ">
       </div>
       <div class="col-md-9">
         <div class="card-body">
           <h5 class="card-title">${doc.data().title}</h5>
           
           <p class="card-text"><small class="text-body-secondary">${doc.data().fname} ${doc.data().lastname}-${new Date(doc.data().publishdate).toDateString()}</small></p>
         </div>
       </div>
  
  </div>
   
  <p class="blogData">${doc.data().blog}</p>
  <div class="px-4">
  <a class="navbar-brand text-dark blog_Btns" href="#" id="${doc.id}_${doc.data().publishdate}" >Edit</a>
  <a class="navbar-brand text-dark mx-2 blog_Btns" href="#" id="${doc.id}">Delete</a>
  
  
  </div>
  
  
  
  </div>
   `
  
  
  blogs_Cont.innerHTML+=blogDiv

  setTimeout(()=>{

    const edit_Blog=document.getElementById(doc.id+'_'+doc.data().publishdate)
    edit_Blog.addEventListener('click',editUserBlogs)
    const delete_Blog=document.getElementById(doc.id)
    delete_Blog.addEventListener('click',deleteUserBlogs)

  },1000)

  
    });
  }
  else{

    const q = query(collection(db, "usersblogs"), where("uid", "==", uid), orderBy("publishdate","desc"));
  
    blogs_Cont.innerHTML=null;
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      
      // doc.data() is never undefined for query doc snapshots
      //console.log(doc.id, " => ", doc.data());
      
     const blogDiv=`

     <div class="my-4 card p-4 shadow">
      
     <div class="row g-0 mb-3">
       <div class="col-md-3 p-2 imgContainer">
         <img src="${doc.data().img}" class="img-fluid rounded h-100 w-75" alt="img" style="width:85% !important ">
       </div>
       <div class="col-md-9">
         <div class="card-body">
           <h5 class="card-title">${doc.data().title}</h5>
           
           <p class="card-text"><small class="text-body-secondary">${doc.data().fname} ${doc.data().lastname}-${new Date(doc.data().publishdate).toDateString()}</small></p>
         </div>
       </div>
  
  </div>
   
  <p class="blogData">${doc.data().blog}</p>

  </div>
   `
  
  
  blogs_Cont.innerHTML+=blogDiv
  
    });


  }



}


async function deleteUserBlogs() {
  loader.style.display='flex'
  content.style.display='none'
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
    },
    buttonsStyling: false
});
swalWithBootstrapButtons.fire({
    title: "Are you sure?",
    text: "Data in database will get deleted!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Delete",
    cancelButtonText: "Cancel",
    reverseButtons: true
}).then((result) => {
    if (result.isConfirmed) {

        swalWithBootstrapButtons.fire("Deleted!", "Your changes are applied", "success");
        const documentRef = doc(db,'usersblogs',this.id);
        deleteDoc(documentRef).then(()=>{
         
          location.reload();
        })
    } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire("Cancelled", "Your changes are rejeccted!", "error");
        loader.style.display='none'
        content.style.display='block'
    };  
});

 



}

function editUserBlogs() {

  const uid=this.id.split('_')

blogsdata.forEach((val)=>{
  if (val.publishdate=== +uid[1]) {
    blog_title.value=val.title;
    blog_text.value=val.blog;
    publish_blogs.style.display='none'
    const edit_Btn_Cont=document.getElementById('edit_Btn_Cont');
    edit_Btn_Cont.innerHTML=`<input type="submit" value="Edit" class="btn rounded text-white" id="${uid[0]}">`; 
    setTimeout(()=>{
      const edit_Blog_Btn=document.getElementById(`${uid[0]}`)
edit_Blog_Btn.addEventListener('click',SaveEditedBlog)
    },1000)

  }
 
})  
  
}

function SaveEditedBlog(e) {
e.preventDefault();
loader.style.display='flex'
content.style.display='none'
  const documentRef = doc(db,'usersblogs',this.id);
  updateDoc(documentRef,{
    title:blog_title.value,
    blog:blog_text.value
  }).then(()=>{

    location.reload();
  })
  Swal.fire({
        
    icon: 'success',
    title: `Data Edited Successfully!!`,
    showConfirmButton: false,
        timer: 1000
      });

}
async function getAllBlogs(){

  const q = query(collection(db, "usersblogs"), orderBy("publishdate","desc"));
  const querySnapshot = await getDocs(q);
  blogs_Cont.innerHTML=null;
  querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots

  const blogDiv=`
  <div class="my-4 card p-4 shadow">
   
  <div class="row g-0 mb-3">
    <div class="col-md-3 p-2 imgContainer">
      <img src="${doc.data().img}" class="img-fluid rounded h-100 w-75" alt="img" style="width:85% !important ">
    </div>
    <div class="col-md-9">
      <div class="card-body">
        <h5 class="card-title">${doc.data().title}</h5>
        
        <p class="card-text"><small class="text-body-secondary">${doc.data().fname} ${doc.data().lastname}-${new Date(doc.data().publishdate).toDateString()}</small></p>
      </div>
    </div>

</div>

<p class="blogData">${doc.data().blog}</p>
<div class="blogData" >
<a class="navbar-brand text-dark blog_Btns text-wrap" href="#" id="${doc.id}_${doc.data().uid}">See all from this user.</a>

</div>

</div>
`

blogs_Cont.innerHTML+=blogDiv
setTimeout(()=>{

  const seeAll=document.getElementById(doc.id+'_'+doc.data().uid)
  seeAll.addEventListener('click',ShowAllBlogsOfSelected)
},1000)
});
}

async function ShowAllBlogsOfSelected (){
  loader.style.display='flex'
  content.style.display='none'
  const uid=this.id.split('_')
  getMyBlogs(uid[1])
  setTimeout(()=>{
    loader.style.display='none' 
  content.style.display='block'

  },2000)
  greetings.innerText="< Back to all blogs"
  greetings.style.color='#7749F8';
  greetings.style.cursor='pointer'
  greetings.addEventListener('click',()=>{
    location.reload();
  })
const docRef = doc(db, "users", uid[1]);
const docSnap = await getDoc(docRef);

if (docSnap.exists()) {

  Blogs_info.innerText="All Blogs From "+docSnap.data().fname+" "+docSnap.data().lname
} else {
  // docSnap.data() will be undefined in this case
  console.log("No such document!");
}

}

async function getUsername() {
  const docRef = doc(db, "users", userid);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {

    User_Name_Space.innerText=docSnap.data().fname+" "+docSnap.data().lname
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }
}

publish_blogs.addEventListener('click',publishUserBlog)

async function publishUserBlog(e) {




  e.preventDefault();
if (!blog_title.value || !blog_text.value) {
  
  Swal.fire({
        
    icon: 'error',
    title: `Fill Both Fields!!`,
    showConfirmButton: false,
        timer: 1000
      });
}
else{


  loader.style.display='flex'
  content.style.display='none'
  const docRef = doc(db, "users", userid);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());

    const docRef = await addDoc(collection(db, "usersblogs"), {
      title: blog_title.value,
      blog: blog_text.value,
  fname:docSnap.data().fname,
  lastname:docSnap.data().lname,
  img:docSnap.data().img_Url,
  uid:docSnap.data().uid,
  publishdate:new Date().getTime()
    });

    location.reload();

  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }
}

}



  
logout_user.addEventListener('click',Logout_User);

  function Logout_User(){
    loader.style.display='flex'
    content.style.display='none'

    signOut(auth).then(() => {
        // Sign-out successful.
        location.reload();
        console.log("signout");
      }).catch((error) => {
        // An error happened.
      });
}


function greeting() {
  const now = new Date();
  const hour = now.getHours();


  if (hour >= 5 && hour < 12) {
      greetings.innerText = "Good Morning Readers!";
  } else if (hour >= 12 && hour < 17) {
      greetings.innerText = "Good Afternoon Readers!";
  } else if (hour >= 17 && hour < 21) {
      greetings.innerText = "Good Evening Readers!";
  } else {
      greetings.innerText = "Hello Readers!";
  }


}
