// Firebase App is always required and must be first
// var firebase = require("firebase/app");
import firebase from '@firebase/app';
import '@firebase/storage';
import '@firebase/auth';

// Add additional services that you want to use
// require("firebase/auth");
// require("firebase/database");
import '@firebase/firestore';
// require("firebase/messaging");
import config from './firebase_conf.json';
// Comment out (or don't require) services that you don't want to use
//
// firebase.initializeApp(config);

const app = firebase.initializeApp(config);

export const auth = firebase.auth();

export const storageRef = firebase.storage().ref();

export const firestore = firebase.firestore(app);
const settings = {/* your settings... */ timestampsInSnapshots: true};
firestore.settings(settings);

export const dbRef = firestore.collection('website').doc('imgs');
