import { db } from '$lib/firebase';
import { collection, query, getDocs } from 'firebase/firestore';

export async function load() {
    try {
        const leadsRef = collection(db, "business_leads");
        // Remove orderBy from query to include documents missing the field
        const querySnapshot = await getDocs(leadsRef);

        const leads = querySnapshot.docs.map(doc => {
            const data = doc.data();
            // Create a clean serializable object
            /** @type {Record<string, any>} */
            const cleanData = {};
            for (const key in data) {
                const val = data[key];
                if (key === 'SubmittedAt' && val?.toDate) {
                    cleanData[key] = val.toDate().toISOString();
                } else if (val && typeof val === 'object' && val.toDate) {
                    // Handle other potential timestamps
                    cleanData[key] = val.toDate().toISOString();
                } else if (typeof val === 'function') {
                    // Skip functions just in case
                    continue;
                } else {
                    cleanData[key] = val;
                }
            }

            return {
                id: doc.id,
                ...cleanData,
                SubmittedAt: cleanData.SubmittedAt || data.SubmittedAt || null
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
