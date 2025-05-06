import axios from "axios"
import { AuthService } from "./authService"

export interface UserData {
    firstName: string
    secondName: string
    kanbansLength: number
    email: string
    kanbanDates: string[]
    resolvedKanbans: number
}

interface UserDataResult {
    success: boolean
    message?: string
    data?: UserData
}

export class ProfileService {
    async fetchUserData(): Promise<UserDataResult> {
        try {
            const token = await AuthService.getToken()
            if(!token) {
                return {
                    success: false,
                    message: "No token found"
                }
            }

            const payload = JSON.parse(atob(token.split(".")[1]))
            const email = payload.sub

            const data = await axios.get(`api/user/get-user-data?email=${email}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            return {
                success: true,
                data: data.data
            }
        } catch(error) {
            return {
                success: false,
                message: error instanceof Error ? error.message : "An error occurred"
            }
        }
    }
    
    logOut(): { success: boolean } {
        AuthService.removeRefreshToken()
        AuthService.removeToken()
        return { success: true }
    }
}