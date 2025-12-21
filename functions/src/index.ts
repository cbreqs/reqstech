
export { contact } from "./contact";
export { handleServiceRequestCreate, handleRoleResponseCreate } from "./sheets";
export { exportexistingdata } from "./export";


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
      const webAppUrl = 'YOUR_DEPLOYED_WEB_APP_URL';

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