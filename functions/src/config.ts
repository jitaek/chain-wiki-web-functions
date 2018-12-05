import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
const config = {
    apiKey: "AIzaSyBD9eX7ABB0Xu1N6CnSdKL-bnsNF5WgLtc",
    authDomain: "chainchronicle-ea233.firebaseapp.com",
    databaseURL: "https://chainchronicle-ea233.firebaseio.com",
    projectId: "chainchronicle-ea233",
    // storageBucket: "chainchronicle-ea233.appspot.com",
    // messagingSenderId: "1008757887866"
};
// const config = {
//     apiKey: "AIzaSyBzl0p1jpmVi5sf8lywgJNCTWex0lAQTmw",
//     databaseURL: "https://firestore-test-646f4.firebaseio.com",
//     projectId: "firestore-test-646f4",
// };
admin.initializeApp(config);
const firestore = admin.firestore();
firestore.settings({timestampsInSnapshots: true});

const realtimeDatabase = admin.database();

export const db = firestore;
export const FUNCTIONS = functions;
export const realtimeDB = realtimeDatabase;