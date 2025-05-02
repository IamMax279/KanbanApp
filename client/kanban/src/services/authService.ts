import axios from "axios"

export class AuthService {
    static setToken(token: string): void {
        localStorage.setItem("jwt", token)
    }
    static async getToken(): Promise<string | null> {
        let token = localStorage.getItem("jwt")

        if(!token) {
            const refreshToken = this.getRefreshToken()
            if(refreshToken) {
                const response = await axios.get(`api/auth/get-access-token?refreshToken=${refreshToken}`, {
                    headers: {
                        "Authorization": `Bearer ${refreshToken}`
                    }
                })

                if(response.data.accessToken) {
                    token = response.data.accessToken
                    this.setToken(token!)
                }
            } else {
                return null
            }
        }

        try {
            const payload = JSON.parse(atob(token!.split(".")[1]))
            if(payload.exp * 1000 < Date.now()) {
                this.removeToken()
                return null
            }
            return token
        } catch(error) {
            console.log(error)
            this.removeToken()
            return null;
        }
    }
    static removeToken() {
        localStorage.removeItem("jwt")
    }

    static setRefreshToken(token: string): void {
        localStorage.setItem("refreshToken", token)
    }
    static getRefreshToken(): string | null {
        const token = localStorage.getItem("refreshToken")
        if(!token) {
            return null
        }

        try {
            const payload = JSON.parse(atob(token.split(".")[1]))
            if(payload.exp * 1000 < Date.now()) {
                this.removeRefreshToken()
                return null
            }
            return token
        } catch(e) {
            console.log(e)
            this.removeRefreshToken()
            return null
        }
    }
    static removeRefreshToken(): void {
        localStorage.removeItem("refreshToken")
    }
}