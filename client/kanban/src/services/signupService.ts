import axios, { AxiosError, AxiosResponse } from "axios"

interface RegisterData {
    firstName: string
    secondName: string
    email: string
    password: string
}

interface SignupResponse {
    success: boolean
    message: string
    data?: AxiosResponse
    errStatus?: number
}

export class SignupService {
    private readonly signupUrl = process.env.NEXT_PUBLIC_API_URL + "/adduser"

    async handleSignup(params: RegisterData): Promise<SignupResponse> {
        try {
            const response = await axios.post(this.signupUrl, {
                firstName: params.firstName,
                secondName: params.secondName,
                email: params.email,
                password: params.password
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            })

            return {
                success: true,
                message: "User created successfully",
                data: response
            }
        } catch(error) {
            console.log("error in signup", error)

            if(error instanceof AxiosError) {
                return {
                    success: false,
                    message: error.message,
                    errStatus: error.status
                }
            }

            return {
                success: false,
                message: error instanceof Error ? error.message : "An error occurred"
            }
        }
    }
}