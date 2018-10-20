// Firebase App is always required and must be first
// var firebase = require("firebase/app");
import firebase from 'firebase/app';
import 'firebase/storage';

// Add additional services that you want to use
// require("firebase/auth");
// require("firebase/database");
// require("firebase/firestore");
// require("firebase/messaging");
import config from './fb-keys.json';
// Comment out (or don't require) services that you don't want to use
//
firebase.initializeApp(config);
