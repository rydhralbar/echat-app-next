import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDAV-kZywGr0wMz1_auAdoEXmJoyEq9h70",
  authDomain: process.env.NEXT_APP_AUTH_DOMAIN,
  projectId: process.env.NEXT_APP_PROJECT_ID,
  storageBucket: process.env.NEXT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_APP_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_APP_APP_ID,
  measurementId: process.env.NEXT_APP_MEASUREMENT_ID,
  databaseURL:
    "https://realtime-echat-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const database = getDatabase(app);
const auth = getAuth();

export { database, auth };
