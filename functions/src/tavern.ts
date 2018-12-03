import { FUNCTIONS, db } from './config';
const FieldValue = require('firebase-admin').firestore.FieldValue;

const TAVERNS = {
    legend: {
        fieldKey: 'isLegend',
        term: '레전드'
    },
    abyssal: {
        fieldKey: 'isAbyssal',
        term: '소용돌이'
    },
}

export const updateTavern = FUNCTIONS.firestore.document('arcana/{arcanaID}/tavern').onWrite((change, context) => {

    const arcanaID = context.params.arcanaID;
    const oldTavern = change.before.data();
    const tavern = change.after.exists ? change.after.data() : null;

    if (tavern === oldTavern) return null;

    if (oldTavern.includes(TAVERNS.legend.term)) {
        return db.collection('arcana').doc(arcanaID).update({
            isLegend: FieldValue.delete()
        }).then(() => {
            return setTavern(arcanaID, updateTavern);
        })
    }
    else if (oldTavern.includes(TAVERNS.abyssal.term)) {
        return db.collection('arcana').doc(arcanaID).update({
            isAbyssal: FieldValue.delete()
        }).then(() => {
            return setTavern(arcanaID, updateTavern);
        })
    }
    return null;
});

function setTavern(arcanaID, tavern) {
    if (tavern) {
        if (tavern.includes(TAVERNS.legend.term)) {
            return db.collection('arcana').doc(arcanaID).update({
                isLegend: true
            })
        }
        else if (tavern.includes(TAVERNS.abyssal.term)) {
            return db.collection('arcana').doc(arcanaID).update({
                isAbyssal: true
            })
        }
    }
    return null;
}