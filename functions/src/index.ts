import { onDocumentCreated } from "firebase-functions/v2/firestore";
import axios from 'axios';

const webAppUrl = 'https://script.google.com/macros/s/AKfycbxLtCSC9kHZPFCpQpfNQWrpVJwRAO6zsY6_uA1BicGQ6211V66oHCtlGInAAenecVD8/exec';

export const syncFirestoreToSheetsV2 = onDocumentCreated({
  document: "{collectionId}/{docId}",
  memory: "256MiB",
  timeoutSeconds: 60
}, async (event) => {
  console.log("Function triggered for document:", event.params.docId, "in collection:", event.params.collectionId);

  const { collectionId, docId } = event.params;
  const data = event.data?.data();

  if (!data) {
    console.log("No data associated with the event. Exiting function.");
    return;
  }
  
  console.log("Document data:", JSON.stringify(data, null, 2));

  const targetCollections = ['roleResponse', 'serviceRequest'];

  if (targetCollections.includes(collectionId)) {
    console.log(`Document is in a target collection ('${collectionId}'). Preparing to sync.`);
    const payload = {
      collection: collectionId,
      fields: data
    };
    console.log("Sending payload to Google Apps Script:", JSON.stringify(payload, null, 2));
    try {
      await axios.post(webAppUrl, payload);
      console.log(`Successfully synced document ${docId} from ${collectionId} to Sheets.`);
    } catch (error) {
      console.error("Error pushing to sheets:", error);
      if (axios.isAxiosError(error) && error.response) {
        console.error("Axios response data:", error.response.data);
        console.error("Axios response status:", error.response.status);
        console.error("Axios response headers:", error.response.headers);
      }
    }
  } else {
    console.log(`Document collection ('${collectionId}') is not a target collection. Exiting function.`);
  }
});
