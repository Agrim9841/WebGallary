import firebase from 'firebase';

var firebaseConfig = {
	
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();

const auth = firebaseApp.auth();

var storage = firebase.storage();

export { db, auth, storage };