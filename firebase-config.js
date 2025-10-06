// Firebase Configuration
// Replace these values with your Firebase project configuration
const firebaseConfig = {
    // Your Firebase project configuration will go here
    // You can find these values in your Firebase Console > Project Settings > General > Your apps
    apiKey: "your-api-key-here",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Services
const db = firebase.firestore();
const auth = firebase.auth();

// Export for use in other files
window.db = db;
window.firebase = firebase;
