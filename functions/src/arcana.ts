import { FUNCTIONS, db } from './config';
enum NameType {
    NameKR,
    NicknameKR,
    NameJP,
    NicknameJP
}
/**
 * When an arcana is first created, add it to /search/arcana for quicker reads when user searches arcana.
 */
export const nameKROnCreate = FUNCTIONS.firestore.document('arcana/{arcanaID}/nameKR').onCreate((snap, context) => {

    const arcanaID = context.params.arcanaID;
    const nameKR = snap.data().val;

    const query = db.collection('arcana').doc(arcanaID);
    return query.get().then(snapshot => {
        if (snapshot.exists) {
            const arcana = snapshot.data();
            const nicknameKR = arcana.nicknameKR;
            const nameJP = arcana.nameJP;
            const nicknameJP = arcana.nicknameJP;
            return db.collection('search').doc(arcanaID).update({
                nameKR: nameKR,
                nicknameKR: nicknameKR,
                nameJP: nameJP,
                nicknameJP: nicknameJP
            });
        }
        else {
            return Promise.reject(`Snapshot does not exist at /arcana/${arcanaID}`);
        }
    });

});

/**
 * Helper function that updates the appropriate search key.
 */
function updateName(change, context, nameType: NameType) {

    const arcanaID = context.params.arcanaID;
    const oldName = change.before.data().val;
    const name = change.after.data().val;

    if (oldName === name) {
        return null;
    }

    let nameKey;
    switch (nameType) {
    case NameType.NameKR:
        nameKey = 'nameKR';
        break;
    case NameType.NicknameKR:
        nameKey = 'nicknameKR';
        break;
    case NameType.NameJP:
        nameKey = 'nameJP';
        break;
    case NameType.NicknameJP:
        nameKey = 'nicknameJP';
        break;

    default:
        return null;
    }

    const nameObject = {
        [nameKey]: nameKey
    };

    return db.collection('search').doc(arcanaID).update(nameObject);
}

/**
 * Update /search/arcana when an arcana's name is changed.
 */
export const nameKROnUpdate = FUNCTIONS.firestore.document('arcana/{arcanaID}/nameKR').onUpdate((change, context) => {

    return updateName(change, context, NameType.NameKR);

});

export const nicknameKROnUpdate = FUNCTIONS.firestore.document('arcana/{arcanaID}/nicknameKR').onUpdate((change, context) => {

    return updateName(change, context, NameType.NicknameKR);

});

export const nameJPOnUpdate = FUNCTIONS.firestore.document('arcana/{arcanaID}/nameJP').onUpdate((change, context) => {

    return updateName(change, context, NameType.NameJP);

});

export const nicknameJPOnUpdate = FUNCTIONS.firestore.document('arcana/{arcanaID}/nicknameJP').onUpdate((change, context) => {

    return updateName(change, context, NameType.NicknameJP);

});

export const nameJPOnWrite = FUNCTIONS.firestore.document('arcana/{arcanaID}/nameJP').onWrite((change, context) => {

    const oldArcana = change.before.data();

    const arcana = change.after.exists ? change.after.data() : null;

    if (arcana) {
        if (arcana.nameJP === oldArcana.nameJP) return null;
        return db.collection('search').doc(arcana.uid).set({
            nameKR: arcana.nameKR,
            nameJP: arcana.nameJP,
            iconURL: arcana.iconURL,
            imageURL: arcana.imageURL
        });
    }
    else {
        // deleted
        return db.collection('search').doc(oldArcana.uid).delete();
    }

});