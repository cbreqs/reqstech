import { onDocumentCreated } from "firebase-functions/v2/firestore";
import axios from 'axios';

export const syncFirestoreToSheetsV2 = onDocumentCreated("{collectionId}/{docId}", async (event) => {
    const data = event.data?.data();
    const collectionId = event.params.collectionId;

    if (!data) return;

    const targetCollections = ['roleResponse', 'serviceRequest'];

    if (targetCollections.includes(collectionId)) {
        const webAppUrl = 'https://script.google.com/macros/s/AKfcybytVe9uMe8fZ5VzlgnUS4EUMTets4z4KnQTOJbetCsmc8BjFUSLIAHA7g5kCzsf2WqM/exec';

        try {
            await axios.post(webAppUrl, {
                collection: collectionId,
                fields: data
            });
            console.log(`Successfully synced ${collectionId} to Sheets.`);
        } catch (error) {
            console.error("Error pushing to sheets:", error);
        }
    }
});