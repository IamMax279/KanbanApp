import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get('Authorization')
        if(!authHeader) {
            return NextResponse.json({ message: "Missing authorization." }, { status: 400 })
        }

        const body = await request.json()
        const response = await fetch(
            `${process.env.API_URL}/delete-user`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authHeader
                },
                body: JSON.stringify(body)
            }
        )

        const result = await response.json()
        return NextResponse.json(result, { status: response.status })
    } catch(error) {
        return NextResponse.json({ message: `Server error` }, { status: 500 })
    }
}