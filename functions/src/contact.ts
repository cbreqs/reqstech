import * as admin from "firebase-admin";
import { onRequest, HttpsError } from "firebase-functions/v2/https";

try { admin.app(); } catch { admin.initializeApp(); }
const db = admin.firestore();

function isEmail(v: unknown): v is string {
	return typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export const contact = onRequest(
	{
		cors: [/^https?:\/\/(localhost:\d+|.*reqs\.tech)$/],
		region: "us-central1",
		maxInstances: 5,
	},
	async (req, res) => {
		try {
			if (req.method !== "POST") throw new HttpsError("invalid-argument", "Use POST.");
			const b = typeof req.body === "object" ? req.body : {};
			const name = (b.name ?? "").toString().trim();
			const email = (b.email ?? "").toString().trim();
			const reason = (b.reason ?? "").toString().trim();
			const message = (b.message ?? "").toString().trim();
			const role = (b.role ?? "").toString().trim();
			const link = (b.link ?? "").toString().trim();

			if (!name || !isEmail(email) || !reason || !message) {
				throw new HttpsError("invalid-argument", "Missing or invalid fields.");
			}

			await db.collection("requests").add({
				name, email, reason, message, role, link,
				ip: (req.headers["x-forwarded-for"] as string)?.split(",")[0] ?? req.ip ?? "",
				ua: req.get("user-agent") || "",
				createdAt: admin.firestore.Timestamp.now(),
				status: "new",
			});

			res.status(200).json({ ok: true });
		} catch (e) {
			if (e instanceof HttpsError) {
				res.status(400).json({ ok: false, error: e.message });
			} else {
				console.error(e);
				res.status(500).json({ ok: false, error: "Internal Server Error" });
			}
		}
	}
);