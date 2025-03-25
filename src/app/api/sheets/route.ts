import { NextResponse } from "next/server";

export async function GET() {
    const SHEET_URL =
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vQKNrotGX1-ClNcQmZsgpsKiUZI0I6DI6odcHxP0xMoWMIp6D-88OhH6tD5OrTShWUo9jAAg-21VsuK/pub?gid=0&single=true&output=csv";

    try {
        const response = await fetch(SHEET_URL);

        if (!response.ok) {
            throw new Error("Failed to fetch sheet data");
        }

        const text = await response.text();
        const rows = text.split("\n").map((row) => row.split(","));
        const [...dataRows] = rows.slice(1);

        const formattedData = dataRows.map((row) => ({
            name: row[0] || "",
            phone: row[1] || "",
            address: row[2] || "",
            specialization: row[3] || "",
            link: row[4] || "",
        }));

        return NextResponse.json(formattedData);
    } catch (error) {
        console.error("Error fetching sheet data:", error);
        return NextResponse.json(
            { error: "Failed to fetch data" },
            { status: 500 }
        );
    }
}
