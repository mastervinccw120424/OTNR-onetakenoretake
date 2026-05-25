let db, auth;
let firebaseInitialized = false;

function ensureFirebaseInitialized() {
    if (firebaseInitialized) return;
    if (typeof firebase === 'undefined') return;
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    db = firebase.firestore();
    auth = firebase.auth();
    firebaseInitialized = true;
}

async function saveResultToFirestore(subject, score, total) {
    // Initialize Firebase only when saving results to avoid blocking page load
    ensureFirebaseInitialized();
    const user = auth?.currentUser;
    if (!user || !db) return;

    try {
        // 1. I-save sa quiz_results para sa History sa Profile
        await db.collection('quiz_results').add({
            userId: user.uid,
            userName: user.displayName || 'Student',
            category: subject,
            score: score,
            total: total,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        // 2. I-update ang Leaderboard aggregate
        const userRef = db.collection('leaderboard').doc(user.uid);
        const data = { lastUpdated: firebase.firestore.FieldValue.serverTimestamp() };
        data[subject] = firebase.firestore.FieldValue.increment(score);
        data[subject + '_total'] = firebase.firestore.FieldValue.increment(total);
        await userRef.set(data, { merge: true });
    } catch (e) { console.error("Error saving score:", e); }
}