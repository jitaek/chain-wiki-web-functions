import { FUNCTIONS, db } from './config';

export const nameKROnWrite = FUNCTIONS.firestore.document('arcana/{arcanaID}/nameKR').onWrite((change, context) => {

    const oldArcana = change.before.data();

    const arcana = change.after.exists ? change.after.data() : null;

    if (arcana) {
        if (arcana.nameKR === oldArcana.nameKR) return null;
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