
import { onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { google, sheets_v4 } from "googleapis";
import { GoogleAuth } from "google-auth-library";

try { admin.app(); } catch { admin.initializeApp(); }
const db = admin.firestore();

const SHEET_ID = "14f_ArF2k5rcpvDnxh8HbRhqkayOPR-oFKkZpbo7PoW8";

async function getGoogleSheetsClient(): Promise<sheets_v4.Sheets> {
    const auth = new GoogleAuth({
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    return google.sheets({ version: "v4", auth });
}

export const exportexistingdata = onRequest(async (req, res) => {
    const sheets = await getGoogleSheetsClient();

    // Export serviceRequest collection
    const serviceRequestSnapshot = await db.collection("serviceRequest").get();
    const serviceRequestValues = serviceRequestSnapshot.docs.map(doc => {
        const data = doc.data();
        return [
            data.createdAt.toDate(),
            data.email,
            data.link,
            data.message,
            data.name,
            data.reason,
            data.role,
            data.status,
        ];
    });

    try {
        await sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_ID,
            range: "serviceRequest!A:A",
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: serviceRequestValues,
            },
        });
    } catch (err) {
        console.error("Error exporting serviceRequest data:", err);
        res.status(500).send("Error exporting serviceRequest data");
        return;
    }

    // Export roleResponse collection
    const roleResponseSnapshot = await db.collection("roleResponse").get();
    const roleResponseValues = roleResponseSnapshot.docs.map(doc => {
        const data = doc.data();
        return [
            data.createdAt.toDate(),
            data.email,
            data.link,
            data.message,
            data.name,
            data.roleSlug,
            data.status,
        ];
    });

    try {
        await sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_ID,
            range: "roleResponse!A:A",
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: roleResponseValues,
            },
        });
    } catch (err) {
        console.error("Error exporting roleResponse data:", err);
        res.status(500).send("Error exporting roleResponse data");
        return;
    }

    res.status(200).send("Export complete!");
});
