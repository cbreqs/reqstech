
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";
import { google, sheets_v4 } from "googleapis";
import { GoogleAuth } from "google-auth-library";

try { admin.app(); } catch { admin.initializeApp(); }

const SHEET_ID = "14f_ArF2k5rcpvDnxh8HbRhqkayOPR-oFKkZpbo7PoW8";

async function getGoogleSheetsClient(): Promise<sheets_v4.Sheets> {
    const auth = new GoogleAuth({
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    return google.sheets({ version: "v4", auth });
}

export const handleServiceRequestCreate = onDocumentCreated("serviceRequest/{docId}", async (event) => {
    const snap = event.data;
    if (!snap) {
        console.log("No data associated with the event");
        return;
    }
    const newRequest = snap.data();
    const sheets = await getGoogleSheetsClient();
    const values = [
        [
            newRequest.createdAt.toDate(),
            newRequest.email,
            newRequest.link,
            newRequest.message,
            newRequest.name,
            newRequest.reason,
            newRequest.role,
            newRequest.status,
        ],
    ];

    try {
        await sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_ID,
            range: "serviceRequest!A:A",
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values,
            },
        });
    } catch (err) {
        console.error("Error appending data to serviceRequest sheet:", err);
    }
});

export const handleRoleResponseCreate = onDocumentCreated("roleResponse/{docId}", async (event) => {
    const snap = event.data;
    if (!snap) {
        console.log("No data associated with the event");
        return;
    }
    const newResponse = snap.data();
    const sheets = await getGoogleSheetsClient();
    const values = [
        [
            newResponse.createdAt.toDate(),
            newResponse.email,
            newResponse.link,
            newResponse.message,
            newResponse.name,
            newResponse.roleSlug,
            newResponse.status,
        ],
    ];

    try {
        await sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_ID,
            range: "roleResponse!A:A",
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values,
            },
        });
    } catch (err) {
        console.error("Error appending data to roleResponse sheet:", err);
    }
});
