import { db } from '$lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';

export async function load() {
    try {
        const leadsRef = collection(db, "business_leads");
        const q = query(leadsRef, orderBy("SubmittedAt", "desc"));
        const querySnapshot = await getDocs(q);

        const leads = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                // Ensure SubmittedAt is serializable (Firestore timestamps are objects)
                SubmittedAt: data.SubmittedAt?.toDate?.()?.toISOString() || data.SubmittedAt || null
            };
        });

        return {
            leads
        };
    } catch (error) {
        console.error("Error fetching leads:", error);
        return {
            leads: [],
            error: "Failed to load leads."
        };
    }
}
