import admin from 'firebase-admin';
import firebase from 'firebase';
import serviceAccount from '../../serviceAccountKey.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://huesnbot.firebaseio.com',
});

const db = admin.firestore();

export { db, firebase };
