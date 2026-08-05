// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB9VaNTctQojKx8CXvYhzn4oxaTYmZejuQ",
  authDomain: "vanguardtrust-2026.firebaseapp.com",
  projectId: "vanguardtrust-2026",
  storageBucket: "vanguardtrust-2026.firebasestorage.app",
  messagingSenderId: "7578234801",
  appId: "1:7578234801:web:7ed7f939dde9ffce345790",
  measurementId: "G-1RJSEKLX77"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);