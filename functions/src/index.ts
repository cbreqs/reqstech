import { onDocumentCreated } from "firebase-functions/v2/firestore";
import axios from 'axios';

export const syncFirestoreToSheetsV2 = onDocumentCreated("{collectionId}/{docId}", async (event) => {
    // In v2, we pull data and params from the event object
    const data = event.data?.data();
    const collectionId = event.params.collectionId;

    if (!data) {
        console.log("No data found in document.");
        return;
    }

    const targetCollections = ['roleResponse', 'serviceRequest'];

    if (targetCollections.includes(collectionId)) {
        // Use your successful Web App URL
        const webAppUrl = 'https://script.google.com/macros/s/AKfcybytVe9uMe8fZ5VzlgnUS4EUMTets4z4KnQTOJbetCsmc8BjFUSLIAHA7g5kCzsf2WqM/exec';

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