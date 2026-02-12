import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCm9dczhbfQxE7BEnzhPlhk8Yr8cU2mIww",
    authDomain: "shaun-ajoy-photography.firebaseapp.com",
    projectId: "shaun-ajoy-photography",
    storageBucket: "shaun-ajoy-photography.firebasestorage.app",
    messagingSenderId: "626081901686",
    appId: "1:626081901686:web:eaa676aa201e04f60f8357"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage };
