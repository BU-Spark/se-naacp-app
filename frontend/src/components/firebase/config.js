import { initializeApp } from 'firebase/app';
import { getDatabase, ref } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyBs56-JElWsyrecEnTIDRntockDmXRl3zE",
    authDomain: "se-naacp-journalism-bias.firebaseapp.com",
    databaseURL: "https://se-naacp-journalism-bias-default-rtdb.firebaseio.com",
    projectId: "se-naacp-journalism-bias",
    storageBucket: "se-naacp-journalism-bias.appspot.com",
    messagingSenderId: "163164284037",
    appId: "1:163164284037:web:6e6b48b67efd93746fb5ec"
  };

const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);

export default db;