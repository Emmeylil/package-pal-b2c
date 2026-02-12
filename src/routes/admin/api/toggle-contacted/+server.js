import { json } from '@sveltejs/kit';
import { db } from '$lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export async function POST({ request }) {
    try {
        const { id, contacted } = await request.json();

        if (!id) {
            return json({ error: 'Missing lead ID' }, { status: 400 });
        }

        const leadRef = doc(db, "business_leads", id);
        await updateDoc(leadRef, {
            contacted: contacted
        });

        return json({ success: true });
    } catch (err) {
        const error = /** @type {Error} */ (err);
        console.error("Error updating lead status:", error);
        return json({ error: error.message }, { status: 500 });
    }
}
