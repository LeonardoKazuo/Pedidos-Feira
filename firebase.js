import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDR9S3IB3eceUl5As0Zib2pMko6MqK_xGw",
    authDomain: "sistema-feira.firebaseapp.com",
    projectId: "sistema-feira",
    storageBucket: "sistema-feira.firebasestorage.app",
    messagingSenderId: "327933864971",
    appId: "1:327933864971:web:34d03de6ce8dce5d1fab0e",
    measurementId: "G-RHN8LG7M1F"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
