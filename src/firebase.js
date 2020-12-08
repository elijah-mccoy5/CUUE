import 'firebase/auth';
import 'firebase/firestore';
import firebase from 'firebase/app'

const app = firebase.initializeApp({
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_AP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESAGGING_SENDER_ID,
    appId:  process.env.REACT_APP_APP_ID
})

export const auth = app.auth();
export const db = app.firestore();
export default app;
