import firebase from 'firebase';

var firebaseConfig = {
	apiKey: "AIzaSyD2ZI4OGZWm1LjlgUhW6B_pitkcrscTzRo",
	authDomain: "webimagegallary.firebaseapp.com",
	databaseURL: "https://webimagegallary.firebaseio.com",
	projectId: "webimagegallary",
	storageBucket: "webimagegallary.appspot.com",
	messagingSenderId: "824109196843",
	appId: "1:824109196843:web:ced07234a46e7d6d1c2c6e",
	measurementId: "G-XKHPTHYVLS"
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();

const auth = firebaseApp.auth();

var storage = firebase.storage();

export { db, auth, storage };