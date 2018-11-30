import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
// const config = {
//     apiKey: "AIzaSyBD9eX7ABB0Xu1N6CnSdKL-bnsNF5WgLtc",
//     authDomain: "chainchronicle-ea233.firebaseapp.com",
//     databaseURL: "https://chainchronicle-ea233.firebaseio.com",
//     projectId: "chainchronicle-ea233",
//     storageBucket: "chainchronicle-ea233.appspot.com",
//     messagingSenderId: "1008757887866"
// };
const config = {
    apiKey: "AIzaSyBzl0p1jpmVi5sf8lywgJNCTWex0lAQTmw",
    databaseURL: "https://firestore-test-646f4.firebaseio.com",
    projectId: "firestore-test-646f4",
};
admin.initializeApp(config);
const db = admin.firestore();
db.settings({timestampsInSnapshots: true});

exports.rewardArcana = functions.https.onCall(async() => {

    try {
        const ref = db.collection('arcana').where('isReward', '>=', 0);
        const snapshot = await ref.get();
        const array = [];
        snapshot.forEach(doc => {
            array.push(doc.data());
        });
        return array;
    }
    catch(error) {
        return error;
    }

});

exports.festivalArcana = functions.https.onCall(async() => {

    try {
        const ref = db.collection('arcana').where('isFestival', '>=', 0);
        const snapshot = await ref.get();
        const array = [];
        snapshot.forEach(doc => {
            array.push(doc.data());
        });
        return array;
    }
    catch(error) {
        return error;
    }

});
