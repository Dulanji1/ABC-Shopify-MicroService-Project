// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD1lg3PnH7UQftkH2S5KqZGojHDKJwIbL8",
  authDomain: "ctse-admin.firebaseapp.com",
  projectId: "ctse-admin",
  storageBucket: "ctse-admin.appspot.com",
  messagingSenderId: "803988022485",
  appId: "1:803988022485:web:b15be6baed2a42a310ae5c",
  measurementId: "G-VXWRYWHHN0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;
