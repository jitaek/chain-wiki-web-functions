import { FUNCTIONS, db, realtimeDB } from './config';

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
            query = db.collection('arcana').orderBy('timestamp', 'desc').startAfter(lastArcanaIDKey).limit(limit);
        }
        else {
            // initial GET
            query = db.collection('arcana').orderBy('timestamp', 'desc').limit(limit);
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

exports.migrate = FUNCTIONS.https.onCall(async() => {

    return realtimeDB.ref('arcana').once('value', snapshot => {

        if (snapshot.exists) {

            const batch1 = db.batch();
            const batch2 = db.batch();
            const batch3 = db.batch();

            let counter = 0;
            snapshot.forEach(child => {

                const arcanaID = child.key;
                const arcana = child.val();
                const timestamp = decode(arcanaID);
                arcana.timestamp = timestamp;
                const arcanaRef = db.collection('arcana').doc(arcanaID);
                if (counter < 500) {
                    batch1.set(arcanaRef, arcana);
                }
                else if (counter < 1000) {
                    batch2.set(arcanaRef, arcana);
                }
                else{
                    batch3.set(arcanaRef, arcana);
                }
                counter++;
                return false;
            });

            return batch1.commit().then(() => {
                console.log('batch1');
                return batch2.commit().then(() => {
                    console.log('batch2');
                    return batch3.commit().then(() => {
                        console.log('batch3');
                    })
                })
            })
        }

        return null;
    });

});

function decode(pushId) {
  const id = pushId.substring(0,19);
  let timestamp = 0;
  for (let i=0; i < id.length; i++) {
    const c = id.charAt(i);
    timestamp = timestamp * 64 + pushId.indexOf(c);
  }
  return timestamp;
}
