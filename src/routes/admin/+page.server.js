import { db } from '$lib/firebase';
import { collection, query, getDocs } from 'firebase/firestore';

export async function load() {
    try {
        const leadsRef = collection(db, "business_leads");
        // Remove orderBy from query to include documents missing the field
        const querySnapshot = await getDocs(leadsRef);

        const leads = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                // Ensure SubmittedAt is serializable (Firestore timestamps are objects)
                SubmittedAt: data.SubmittedAt?.toDate?.()?.toISOString() || data.SubmittedAt || null
            };
        });

        // Sort in memory instead (newest first)
        leads.sort((a, b) => {
            const dateA = a.SubmittedAt ? new Date(a.SubmittedAt).getTime() : 0;
            const dateB = b.SubmittedAt ? new Date(b.SubmittedAt).getTime() : 0;
            return dateB - dateA;
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
