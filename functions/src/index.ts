import * as functions from 'firebase-functions';
import axios from 'axios';

export const syncFirestoreToSheets = functions.firestore
  .document('{collectionId}/{docId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    const collectionId = context.params.collectionId;

    // List the collections you want to sync
    const targetCollections = ['roleResponse', 'serviceRequest'];

    if (targetCollections.includes(collectionId)) {
      // Use the Web App URL from your successful deployment
      const webAppUrl = 'https://script.google.com/macros/s/AKfycbytVe9uMe8fZ5VzlgnUS4EUMTEts4z4KnQTOJbetCsmc8BjFUSLlAHA7g5kCzsf2WqM/exec';

      try {
        await axios.post(webAppUrl, {
          collection: collectionId,
          fields: data
        });
        console.log(`Successfully synced ${collectionId} document to Sheets.`);
      } catch (error) {
        console.error("Error pushing to sheets:", error);
      }
    }
  });
