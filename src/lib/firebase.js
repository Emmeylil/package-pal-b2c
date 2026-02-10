import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCODA4a-Tp4kMilVnoCCWvT7SZHQ63IuZ4",
    authDomain: "new-jumia-delivery-page.firebaseapp.com",
    projectId: "new-jumia-delivery-page",
    storageBucket: "new-jumia-delivery-page.firebasestorage.app",
    messagingSenderId: "431526468218",
    appId: "1:431526468218:web:6fa06ff75409b8248379c3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
