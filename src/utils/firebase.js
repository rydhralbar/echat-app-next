import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDAV-kZywGr0wMz1_auAdoEXmJoyEq9h70",
  authDomain: "realtime-echat.firebaseapp.com",
  projectId: "realtime-echat",
  storageBucket: "realtime-echat.appspot.com",
  messagingSenderId: "746927409049",
  appId: "1:746927409049:web:f4410601a26ce6a1163508",
  measurementId: "G-9SP8K841RJ",
  databaseURL:
    "https://realtime-echat-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const database = getDatabase(app);
const auth = getAuth();

export { database, auth };
