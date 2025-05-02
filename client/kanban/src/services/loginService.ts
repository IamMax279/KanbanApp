import axios, { AxiosError, AxiosResponse } from "axios"
import { AuthService } from "./authService"

interface LoginParams {
    email: string
    password: string
}

interface LoginResult {
    success: boolean
    message: string
    data?: {
        token: string
        refreshToken: string
    }
    errStatus?: number
}

export class LoginService {    
    async handleLogin(params: LoginParams): Promise<LoginResult> {
        try {
            const response = await axios.post("api/user/login", {
                email: params.email,
                password: params.password
            })
            
            const token = response.data.token
            if (!token) {
                throw new Error('No token received');
            }

            const refreshToken = response.data.refreshToken

            AuthService.setToken(token)
            AuthService.setRefreshToken(refreshToken)

            return {
                success: true,
                message: "Login successful",
                data: {
                    token,
                    refreshToken
                }
            }
        } catch(error) {
            console.log("error in login", error)

            if (error instanceof AxiosError) {
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