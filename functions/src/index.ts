import { FUNCTIONS, db } from './config';

import { nameKROnCreate, nameKROnUpdate, nicknameKROnUpdate, nameJPOnUpdate, nicknameJPOnUpdate } from './arcana';
export { nameKROnCreate, nameKROnUpdate, nicknameKROnUpdate, nameJPOnUpdate, nicknameJPOnUpdate };

import { updateTavern } from './tavern';
export { updateTavern }

exports.recentArcana = FUNCTIONS.https.onCall(async(data) => {

    try {
        const lastArcanaIDKey = data.offset
        const limit = data.limit || 30;

        let query;
        if (lastArcanaIDKey) {
            // paginated
            query = db.collection('arcana').orderBy('uid', 'desc').startAfter(lastArcanaIDKey).limit(limit);
        }
        else {
            // initial GET
            query = db.collection('arcana').orderBy('uid', 'desc').limit(limit);
        }
        const snapshot = await query.get();
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
exports.rewardArcana = FUNCTIONS.https.onCall(async() => {

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

exports.festivalArcana = FUNCTIONS.https.onCall(async() => {

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

exports.legendArcana = FUNCTIONS.https.onCall(async() => {

    try {
        const ref = db.collection('arcana').where('isLegend', '==', true);
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

exports.abyssalArcana = FUNCTIONS.https.onCall(async() => {

    try {
        const ref = db.collection('arcana').where('isAbyssal', '==', true);
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

