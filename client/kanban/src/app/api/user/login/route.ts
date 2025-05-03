import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        console.log("cialo:", body)
        const response = await fetch(
            `${process.env.API_URL}/login`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            }
        )

        const data = await response.json()
        return NextResponse.json(data, { status: response.status })
    } catch(error) {
        return NextResponse.json({ message: `Server error: ${error}` }, { status: 500 })
    }
}