// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {
  onAuthStateChanged,
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword
} from "firebase/auth";
const { URL } = require('whatwg-url');
// import firebase from "firebase/compat/app";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { v2 as cloudinary } from 'cloudinary';
import { getFirestore, doc, setDoc, addDoc, getDoc, updateDoc, arrayUnion, arrayRemove, increment, collection, serverTimestamp } from "firebase/firestore";
// Your web app's Firebase configurationnpm
const firebaseConfig = {
  apiKey: "AIzaSyAgJGHQmBrygEfpZxJQ6t5qYGeQZ5q89fo",
  authDomain: "typerivals-a9577.firebaseapp.com",
  projectId: "typerivals-a9577",
  storageBucket: "typerivals-a9577.firebasestorage.app",
  messagingSenderId: "964299426709",
  appId: "1:964299426709:web:bcfce963db8633bb4f449c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
// detect auth state 
onAuthStateChanged(auth, user => {
  if (user != null) {
    console.log('logged in!');
  }
  else {
    console.log('no user');
  }
});



// Selecting forms and buttons only if they exist on the current page
const signupform = document.querySelector('.signupform');
const loginform = document.querySelector('.loginform');
const logoutbtn = document.querySelector('.logout');
const messageDiv = document.getElementById('message');

// Function to show messages
const showMessage = (message, type) => {
  if (messageDiv) {
    messageDiv.textContent = message;
    messageDiv.className = type; // 'success' or 'error'
    messageDiv.style.display = 'block';
    setTimeout(() => {
      messageDiv.style.display = 'none'; // Hide after 4 seconds
    }, 4000);
  }
};

// Password validation function
const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Signup logic
if (signupform) {
  signupform.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = signupform.email.value;
    const password = signupform.password.value;

    // Validate password
    if (!validatePassword(password)) {
      showMessage(
        'Password must be at least 8 characters long, include a letter, a number, and a special character.',
        'error'
      );
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((cred) => {
        console.log('User created:', cred.user);
        showMessage('Signed up successfully!', 'success');
        signupform.reset();
        // Redirect to a different webpage
        window.location.href = "signuphome.html";
      })
      .catch((err) => {
        console.log(err.message);
        // Handle specific Firebase errors
        switch (err.code) {
          case 'auth/email-already-in-use':
            showMessage('This email is already in use. Please log in.', 'error');
            break;
          case 'auth/weak-password':
            showMessage('Password is too weak. Please use a stronger password.', 'error');
            break;
          case 'auth/invalid-email':
            showMessage('Invalid email format.', 'error');
            break;
          default:
            showMessage('An error occurred. Please try again.', 'error');
        }
      });
  });
}

// Logout logic
if (logoutbtn) {
  logoutbtn.addEventListener('click', () => {
    signOut(auth)
      .then(() => {
        console.log('The user signed out');
        showMessage('Logged out successfully!', 'success');
        setTimeout(() => {
          window.location.href = "home.html";
        }, 1000); // Redirect after showing the message
      })
      .catch((err) => {
        console.log(err.message);
        showMessage('An error occurred while logging out. Please try again.', 'error');
      });
  });
}

// Login logic
if (loginform) {
  loginform.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = loginform.email.value;
    const password = loginform.password.value;

    signInWithEmailAndPassword(auth, email, password)
      .then((cred) => {
        console.log('User logged in', cred.user);
        showMessage('Logged in successfully!', 'success');
        loginform.reset();
        setTimeout(() => {
          window.location.href = "signuphome.html";
        }, 1000); // Redirect after showing the message
      })
      .catch((err) => {
        // console.log(err.message);
        switch (err.code) {
          case 'auth/wrong-password':
            showMessage('Incorrect password. Please try again.', 'error');
            break;
          case 'auth/user-not-found':
            showMessage('No user found with this email.', 'error');
            break;
          case 'auth/invalid-email':
            showMessage('Invalid email format.', 'error');
            break;
          case 'auth/invalid-credential':
            showMessage('Invalid login credentials.', 'error');
            break;
          default:
            showMessage('An error occurred. Please try again.', 'error');
        }
      });
  });
}

// Authentication state listener for pages like signuphome.html
if (window.location.pathname.includes("signuphome.html")) {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      // Redirect to login page if user is not logged in
      window.location.href = "home.html";
    }
  });
}



// const themeToggler = document.getElementById("theme-toggler");
// const themeStyle = document.getElementById("theme-style");

// // Check for saved theme in localStorage
// const savedTheme = localStorage.getItem("theme");
// if (savedTheme) {
//   themeStyle.href = savedTheme === "dark" ? "dark.css" : "light.css";
//   themeToggler.textContent = savedTheme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode";
// }

// themeToggler.addEventListener("click", () => {
//   const isDarkMode = themeStyle.href.includes("dark.css");
//   themeStyle.href = isDarkMode ? "light.css" : "dark.css";
//   themeToggler.textContent = isDarkMode ? "Switch to Dark Mode" : "Switch to Light Mode";

//   // Save theme preference to localStorage
//   localStorage.setItem("theme", isDarkMode ? "light" : "dark");
// });




// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

auth.onAuthStateChanged((user) => {
  if (user) {
    const uid = user.uid; // Get the user's UID
    console.log("User's UID:", uid);
  } else {
    console.log("No user is signed in.");
  }
});




// Ensure Firebase auth is ready before accessing currentUser
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("User is logged in", user.uid);
    loadUserProfile(); // Call loadUserProfile after auth state is ready
  } else {
    console.log("No user is signed in.");
    // Optionally, you can redirect to login page or display a message here
  }
});

// Function to load user profile when the page is loaded
function loadUserProfile() {
  const user = auth.currentUser; // Get the current logged-in user
  if (user) {
    const uid = user.uid; // Get the user's UID

    // Fetch user profile data from Firestore
    const userRef = doc(db, "users", uid); // Get reference to the user document
    getDoc(userRef).then((docSnapshot) => {
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        
        // Populate the UI with the fetched data
        document.getElementById("nameDisplay").textContent = userData.name || 'Not set';
        document.getElementById("emailDisplay").textContent = userData.email || 'Not set';
        document.getElementById("cityDisplay").textContent = userData.city || 'Not set';
        document.getElementById("stateDisplay").textContent = userData.state || 'Not set';

        // Show the profile and hide the form
        document.getElementById("userForm").style.display = 'none';
        document.getElementById("profileDisplay").style.display = 'block';
      } else {
        console.log("No user document found!");
        // If no profile exists, show the form to create a profile
        document.getElementById("userForm").style.display = 'block';
        document.getElementById("profileDisplay").style.display = 'none';
      }
    }).catch((error) => {
      console.error("Error fetching user profile:", error);
    });
  } else {
    console.log("No authenticated user.");
  }
}

// This function is called when the user submits the form
function saveUserProfile(name, email, city, state) {
  const user = auth.currentUser; // Get the current logged-in user

  if (user) {
    const uid = user.uid; // Get the user's UID

    // Save user data in Firestore
    setDoc(doc(db, "users", uid), {
      name: name,
      email: email,
      city: city,
      state: state,
    }, { merge: true })
      .then(() => {
        // console.log("User profile saved successfully!");
        alert("User profile saved successfully!");
        // Update the UI immediately after saving the profile
        document.getElementById("nameDisplay").textContent = name;
        document.getElementById("emailDisplay").textContent = email;
        document.getElementById("cityDisplay").textContent = city;
        document.getElementById("stateDisplay").textContent = state;

        // Hide the form and show the profile display
        document.getElementById("userForm").style.display = 'none';
        document.getElementById("profileDisplay").style.display = 'block';
      })
      .catch((error) => {
        console.error("Error saving user profile:", error);
      });
  } else {
    console.log("No authenticated user.");
  }
}

// Form submission event
const profileForm = document.getElementById("userForm");
profileForm.addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent form from submitting and reloading the page.

  const name = document.getElementById("inputname").value;
  const email = document.getElementById("inputEmail4").value;
  const city = document.getElementById("inputCity").value;
  const state = document.getElementById("inputState").value;

  // Save the profile information
  saveUserProfile(name, email, city, state);
});







document.addEventListener("DOMContentLoaded", async () => {
  const blogId = "unique_blog_id"; // Unique identifier for the blog
  const userId = "current_user_id"; // Unique identifier for the current user

  // Firestore references
  const blogRef = doc(db, "blogs", blogId);

  // Select DOM elements
  const likeButton = document.getElementById("like-button");
  const likeCountSpan = document.getElementById("like-count");
  const commentInput = document.getElementById("comment-input");
  const submitCommentButton = document.getElementById("submit-comment");
  const commentsList = document.getElementById("comments-list");

  // Initialize UI
  const blogDoc = await getDoc(blogRef);
  let isLiked = false;

  if (blogDoc.exists()) {
    const data = blogDoc.data();
    likeCountSpan.textContent = data.likes || 0;

    // Check if user has already liked the post
    isLiked = data.likedBy?.includes(userId) || false;
    if (isLiked) likeButton.classList.add("btn-danger");

    // Load existing comments
    data.comments?.forEach((comment) => {
      const commentElement = document.createElement("div");
      commentElement.className = "alert alert-secondary mt-2";
      commentElement.textContent = comment.text;
      commentsList.appendChild(commentElement);
    });
  } else {
    // Create initial Firestore document for the blog if it doesn't exist
    await setDoc(blogRef, { likes: 0, likedBy: [], comments: [] });
  }

  // Handle like functionality
  likeButton.addEventListener("click", async () => {
    isLiked = !isLiked;

    if (isLiked) {
      // Increment likes and add userId to likedBy array
      await updateDoc(blogRef, {
        likes: increment(1),
        likedBy: arrayUnion(userId),
      });
      likeButton.classList.add("btn-danger");
    } else {
      // Decrement likes and remove userId from likedBy array
      await updateDoc(blogRef, {
        likes: increment(-1),
        likedBy: arrayRemove(userId),
      });
      likeButton.classList.remove("btn-danger");
    }

    // Update UI
    const updatedBlog = await getDoc(blogRef);
    likeCountSpan.textContent = updatedBlog.data().likes || 0;
  });

  // Handle comment submission
  submitCommentButton.addEventListener("click", async () => {
    const commentText = commentInput.value.trim();
    if (commentText) {
      // Add comment to Firestore
      await updateDoc(blogRef, {
        comments: arrayUnion({ userId, text: commentText }),
      });

      // Append comment to UI
      const commentElement = document.createElement("div");
      commentElement.className = "alert alert-secondary mt-2";
      commentElement.textContent = commentText;
      commentsList.appendChild(commentElement);

      // Clear input field
      commentInput.value = "";
    }
  });

  // Optional: Allow pressing Enter to submit a comment
  commentInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submitCommentButton.click();
    }
  });
});






// cloudinary code for profile picture 

// (async function() {

//   // Configuration
//   cloudinary.config({ 
//       cloud_name: 'dgxkomhv3', 
//       api_key: '628994944451475', 
//       api_secret: '8aWDUM1tdViFDGsMV2DNIsw5qo4' // Click 'View API Keys' above to copy your API secret
//   });

//   // Upload an image
//    const uploadResult = await cloudinary.uploader
//      .upload(
//          'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
//              public_id: 'shoes',
//          }
//      )
//      .catch((error) => {
//          console.log(error);
//      });

//   console.log(uploadResult);
// })();



// let profilePhotoUrl = ''; // Variable to store the uploaded profile photo URL

// document.getElementById('upload-button').addEventListener('click', function () {
//   const widget = cloudinary.createUploadWidget(
//     {
//       cloudName: 'dgxkomhv3',
//       uploadPreset: 'profile_pictures',
//       folder: 'user_profile_pictures',
//       cropping: true,
//       resourceType: 'image',
//     },
//     (error, result) => {
//       if (!error && result && result.event === 'success') {
//         console.log('Upload successful:', result.info);
//         profilePhotoUrl = result.info.secure_url; // Save the uploaded photo URL
//         document.getElementById('profile-img').src = profilePhotoUrl; // Update the image preview
//       }
//     }
//   );
//   widget.open();
// });



// // // Handle profile photo upload
// // document.getElementById('upload-button').addEventListener('click', function () {
// //   const widget = cloudinary.createUploadWidget(
// //     {
// //       cloudName: 'dgxkomhv3',
// //       uploadPreset: 'profile_pictures',
// //       folder: 'user_profile_pictures',
// //       cropping: true,
// //       resourceType: 'image',
// //     },
// //     (error, result) => {
// //       if (!error && result && result.event === 'success') {
// //         console.log('Upload successful:', result.info);
// //         profilePhotoUrl = result.info.secure_url; // Update the profile photo URL
// //         document.getElementById('profile-img').src = profilePhotoUrl; // Show the new photo
// //       }
// //     }
// //   );
// //   widget.open();
// // });



// const express = require('express');
// const { TextServiceClient } = require('@google-ai/genai');

// const app1 = express();
// const port = 5500;

// // Initialize the GenAI client
// const client = new TextServiceClient({
//   project: 'typerivals-a9577', // Replace with your Google Cloud project ID
//   location: 'us-central1', // Replace with your region if different
//   vertexAi: true,
// });

// // Define the API endpoint
// app1.get('/generate', async (req, res) => {
//   const model = 'gemini-2.0-flash-exp';
//   const contents = [
//     {
//       role: 'user',
//       parts: [
//         {
//           text: 'write 3 paragraphs about any topic',
//         },
//       ],
//     },
//   ];

//   const generateContentConfig = {
//     temperature: 1,
//     topP: 0.95,
//     maxOutputTokens: 8192,
//     responseModalities: ['TEXT'],
//     safetySettings: [
//       { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'OFF' },
//       { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'OFF' },
//       { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'OFF' },
//       { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'OFF' },
//     ],
//   };

//   try {
//     const stream = client.generateTextStream({
//       model,
//       contents,
//       config: generateContentConfig,
//     });

//     let generatedText = '';
//     for await (const chunk of stream) {
//       generatedText += chunk.text || '';
//     }

//     res.json({ text: generatedText }); // Send the generated text as JSON
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });


// app.get('/generate', async (req, res) => {
//   try {
//     // Your code here
//   } catch (error) {
//     console.error('Error generating content:', error);
//     res.status(500).json({ error: error.message });
//   }
// });

// async function fetchGeneratedText() {
//   const outputDiv = document.getElementById('output');
//   outputDiv.textContent = 'Generating...';

//   try {
//     const response = await fetch('http://localhost:3000/generate');
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
//     outputDiv.textContent = data.text || 'No text generated.';
//   } catch (error) {
//     outputDiv.textContent = 'Error: ' + error.message;
//   }
// }



// Elements
const blogsList = document.getElementById('blogs-list');
const communityBlogsSection = document.getElementById('community-blogs');

// Function to load blogs from Firestore
async function loadBlogs() {
    try {
        const querySnapshot = await getDocs(collection(db, "blogs"));
        blogsList.innerHTML = ''; // Clear current blogs

        if (querySnapshot.empty) {
            // If no blogs exist, hide the "Community Blogs" section
            communityBlogsSection.style.display = 'none';
        } else {
            // If blogs exist, show the "Community Blogs" section
            communityBlogsSection.style.display = 'block';

            querySnapshot.forEach((doc) => {
                const blogData = doc.data();
                const newBlog = document.createElement('div');
                newBlog.classList.add('blog-post', 'mb-3', 'p-3', 'border', 'border-light');
                newBlog.innerHTML = `
                    <h5>${blogData.title}</h5>
                    <p><strong>By:</strong> ${blogData.authorName} from ${blogData.authorCity}</p>
                    <p>${blogData.content}</p>
                    <p><small>${new Date(blogData.timestamp.seconds * 1000).toLocaleString()}</small></p>
                    <p><strong>Likes:</strong> ${blogData.likes}</p>
                `;
                blogsList.appendChild(newBlog);
            });
        }
    } catch (error) {
        console.error("Error getting blogs: ", error);
    }
}

// Function to post a blog
async function postBlog() {
    const blogText = document.getElementById('blog-input').value.trim();
    const title = document.getElementById('blog-title').value.trim();
    const authorName = document.getElementById('author-name').value.trim();
    const authorCity = document.getElementById('author-city').value.trim();

    if (blogText && title && authorName && authorCity) {
        const timestamp = serverTimestamp();
        const likes = 0;

        try {
            // Add new blog post to Firestore
            await addDoc(collection(db, "blogs"), {
                authorName: authorName,
                authorCity: authorCity,
                title: title,
                content: blogText,
                timestamp: timestamp,
                likes: likes
            });

            // Clear the input fields after posting
            document.getElementById('author-name').value = '';
            document.getElementById('author-city').value = '';
            document.getElementById('blog-title').value = '';
            document.getElementById('blog-input').value = '';

            // Reload blogs after posting
            loadBlogs();
        } catch (error) {
            console.error("Error adding blog: ", error);
        }
    } else {
        alert("Please provide a title, content, name, and city before posting.");
    }
}

// Event listener for the "Post Blog" button
document.getElementById('post-blog-button').addEventListener('click', postBlog);

// Optional: Allow users to press Enter to post the blog
document.getElementById('blog-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        postBlog();
    }
});

// Load blogs when the page loads
window.onload = loadBlogs;