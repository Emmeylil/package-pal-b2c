import { json } from '@sveltejs/kit';
import { db } from '$lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const SHEETS_URL = "https://script.google.com/macros/s/AKfycbySb7Kzbzq9BapO8z-PizM3Ahjy4Ly4NcsrHvOKruRLAoTvRpvacpV8JzoSkhiWaUtL/exec";

export async function POST({ request }) {
    try {
        const data = await request.json();

        // 1. Basic validation
        if (!data.name || !data.email || !data.phone) {
            return json({ error: 'Missing required fields' }, { status: 400 });
        }

        const dataToSave = {
            "Business Name": data.name,
            "Email Address": data.email,
            "Phone Number": data.phone,
            "Monthly Estimate": data.estimate || 'Not provided',
            SubmittedAt: new Date().toISOString()
        };

        // 2. Save to Firestore
        console.log("Backend: Saving to Firestore:", dataToSave);
        const docRef = await addDoc(collection(db, "business_leads"), {
            ...dataToSave,
            SubmittedAt: serverTimestamp(),
        });

        // 3. Sync to Google Sheets
        console.log("Backend: Syncing to Google Sheets...");
        try {
            const response = await fetch(SHEETS_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToSave),
            });

            // Note: Google Apps Script usually redirects on success. 
            // We don't necessarily need to check the body, but it's good to know if the request failed.
            if (!response.ok && response.status !== 0) {
                console.warn("Backend: Google Sheets sync might have failed with status:", response.status);
            }
        } catch (sheetErr) {
            console.error("Backend: Error syncing to Google Sheets:", sheetErr);
            // We don't fail the whole request if Google Sheets fails, as long as Firestore succeeded.
        }

        return json({ success: true, id: docRef.id });

    } catch (err) {
        console.error("Backend API Error:", err);
        return json({ error: err.message || 'Internal Server Error' }, { status: 500 });
    }
}
