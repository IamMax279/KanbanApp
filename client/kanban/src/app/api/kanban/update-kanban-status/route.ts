import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
    try {
        const authHeader = request.headers.get('Authorization')
        if(!authHeader) {
            return NextResponse.json({ message: "Missing authorization" }, { status: 400 })
        }

        const body = await request.json()
        const response = await fetch(
            `${process.env.API_URL}/updatekanbanstatus`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            }
        )

        const data = response.json()
        return NextResponse.json(data, { status: response.status })
    } catch(error) {
        return NextResponse.json({ message: "Server error" }, { status: 500 })
    }
}