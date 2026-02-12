import { json } from '@sveltejs/kit';

const CSV_URL = "https://docs.google.com/spreadsheets/d/19_ER7XMk2DSo_iTFL7RY1Hk_KRwkbuMEh6AEd5TypqM/export?format=csv&gid=0";

/** @param {string} text */
function parseCSV(text) {
    const result = [];
    const rows = [];
    let currRow = [];
    let currField = "";
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i + 1];

        if (char === '"' && inQuotes && nextChar === '"') {
            currField += '"';
            i++; // Skip next quote
        } else if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === "," && !inQuotes) {
            currRow.push(currField.trim());
            currField = "";
        } else if ((char === "\r" || char === "\n") && !inQuotes) {
            if (currField || currRow.length > 0) {
                currRow.push(currField.trim());
                rows.push(currRow);
                currRow = [];
                currField = "";
            }
            if (char === "\r" && nextChar === "\n") i++; // Handle CRLF
        } else {
            currField += char;
        }
    }

    if (currField || currRow.length > 0) {
        currRow.push(currField.trim());
        rows.push(currRow);
    }

    // Process rows (skip header)
    for (let i = 1; i < rows.length; i++) {
        const vals = rows[i];
        if (vals.length >= 10 && vals[0]) {
            result.push({
                name: vals[0],
                week: vals[1],
                weekend: vals[2],
                phone: vals[3],
                address: vals[4],
                state: vals[5],
                landmark: vals[7] || "",
                map: vals[8] || "",
                lat: parseFloat(vals[9]) || 0,
                lng: parseFloat(vals[10]) || 0,
            });
        }
    }
    return result;
}

export async function GET() {
    try {
        const res = await fetch(CSV_URL);
        if (!res.ok) throw new Error("Failed to fetch CSV from Google Sheets");

        const text = await res.text();
        const stations = parseCSV(text);

        // Return JSON with a cache-control header
        return json(stations, {
            headers: {
                'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
            }
        });
    } catch (err) {
        console.error("Backend Stations API Error:", err);
        return json({ error: "Failed to fetch stations" }, { status: 500 });
    }
}
