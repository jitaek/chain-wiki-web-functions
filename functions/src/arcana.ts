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
            const imageURL = arcana.imageURL;
            const iconURL = arcana.iconURL;
            return db.collection('search').doc(arcanaID).update({
                nameKR: nameKR,
                nicknameKR: nicknameKR,
                nameJP: nameJP,
                nicknameJP: nicknameJP,
                imageURL: imageURL,
                iconURL: iconURL
            });
        }
        else {
            return Promise.reject(`Snapshot does not exist at /arcana/${arcanaID}`);
        }
    });

});

/**
 * Store same-named arcana. Possibly can remove this, and just query /arcana for nameKR === suppliedNameKR. Performance?
 */
export const updateRelatedArcanaOnCreate = FUNCTIONS.firestore.document('arcana/{arcanaID}/nameKR').onCreate((snap, context) => {

    const arcanaID = context.params.arcanaID;
    const nameKR = snap.data().val;
    
    return db.collection('nameKR').doc(nameKR).get().then(snapshot => {

        const relatedNameKR = snapshot.data();
        if (relatedNameKR) {
            // add relatedArcana to this newly created arcana.
            return db.collection('arcana').doc(arcanaID).update({
                related: relatedNameKR
            }).then(() => {
                // add this arcana to /nameKR.
                const nameObject = {
                    [arcanaID]: true
                };
                return db.collection('nameKR').doc(nameKR).update(nameObject);
            });
        }
        return null;
    });

});

export const nameKROnDelete = FUNCTIONS.firestore.document('arcana/{arcanaID}/nameKR').onDelete((snap, context) => {

    const arcanaID = context.params.arcanaID;

    const ref = db.collection('search').doc(arcanaID);
    return ref.delete();

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
