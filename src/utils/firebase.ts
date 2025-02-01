import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAq1posfGTpghPv-lX3M37jIr2VFcpPwqs",
  authDomain: "app-pessoal-dec8f.firebaseapp.com",
  projectId: "app-pessoal-dec8f",
  storageBucket: "app-pessoal-dec8f.appspot.com",
  messagingSenderId: "34766556610",
  appId: "1:34766556610:web:f6e28ed2b1ede83688da5b",
  measurementId: "G-WJX5HEH14F"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
