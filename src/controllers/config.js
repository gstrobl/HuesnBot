import admin from 'firebase-admin';
import firebase from 'firebase';

require('dotenv').config();

admin.initializeApp({
  credential: admin.credential.cert({
    project_id: 'huesnbot',
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
  }),
  databaseURL: 'https://huesnbot.firebaseio.com',
});

const db = admin.firestore();

export { db, firebase };
