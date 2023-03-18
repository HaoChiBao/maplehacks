import { initializeApp } from 'firebase/app';
import {getFirestore} from 'firebase/firestore/lite';
import { Auth } from './auth';

const firebaseConfig = {
    apiKey: "AIzaSyAEf_E8UURl9Ot8XSn75YWI6r3qYsAX_wY",
    authDomain: "maplehacks-892df.firebaseapp.com",
    databaseURL: "https://maplehacks-892df-default-rtdb.firebaseio.com",
    projectId: "maplehacks-892df",
    storageBucket: "maplehacks-892df.appspot.com",
    messagingSenderId: "415480059369",
    appId: "1:415480059369:web:f3ec56b2f244e104482778",
    measurementId: "G-RD99J35S35"
  };

class System {
  constructor(){
    this.app = initializeApp(firebaseConfig)
    this.db = getFirestore(this.app);
    this.getAuth = new Auth();
  }
}

export {System}

