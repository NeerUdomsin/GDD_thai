import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD4t56lOXNohiN0tMLqyX6RckQTwOag5Kk",
  authDomain: "jitniyom-2025.firebaseapp.com",
  projectId: "jitniyom-2025",
  storageBucket: "jitniyom-2025.appspot.com",
  messagingSenderId: "99545079205",
  appId: "1:99545079205:web:5738f2b311baa06272dc4c",
  measurementId: "G-78DZFRKQQW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
