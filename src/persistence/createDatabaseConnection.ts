import admin from "firebase-admin";
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from "firebase-admin/firestore";
import { getConfig } from "../utils/configHandler.ts";

const serviceAccount = await getConfig<string>("firebase-cert", true);

export function createDatabaseConnection(): admin.firestore.Firestore {
    initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });

    const db = getFirestore();

    return db;
}

//   const db = createDatabaseConnection();
//   const snapshot = await db.collection('guilds').where('unicornio', '==', 'verde').get();

//   snapshot.forEach((doc) => {
//     console.log(doc.id, '=>', doc.data());
//   });

// const docRef = await db.collection('guilds').doc('teste2');
// console.log((await docRef.get()).data());
// docRef.set({
//   unicornio: "verde"
// });