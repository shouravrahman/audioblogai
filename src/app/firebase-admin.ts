import * as admin from 'firebase-admin';

let app: admin.app.App;
let firestore: admin.firestore.Firestore;
let auth: admin.auth.Auth;

export function getFirebaseAdmin() {
    if (app) {
        return { app, firestore, auth };
    }

    if (admin.apps.length > 0) {
        app = admin.app();
    } else {
        app = admin.initializeApp();
    }

    firestore = admin.firestore();
    auth = admin.auth();

    return { app, firestore, auth };
}
