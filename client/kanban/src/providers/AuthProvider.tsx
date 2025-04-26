"use client"
import { useRouter, usePathname } from "next/navigation"
import { createContext, useEffect, useState } from "react"
import axios from "axios"

import NavBar from "@/components/ui/NavBar"
import Loading from "@/components/Loading"
import { AuthService } from "../services/authService"

interface AuthProviderProps {
    isAuthenticated: boolean
    userData: {
        firstName: string,
        userId: string,
        email: string
    }
}

const getAccessTokenUrl = process.env.NEXT_PUBLIC_API_URL + "/getaccesstoken?refreshToken="
const EXCLUDED = ['/login', '/signup']

const AuthContext = createContext<AuthProviderProps | undefined>(undefined)

export default function AuthProvider({ children }: { children: React.ReactNode}) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
    const [userData, setUserData] = useState({
        firstName: "",
        userId: "",
        email: ""
    })
    const [loading, setLoading] = useState<boolean>(true)

    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const validateToken = async () => {
            let token = await AuthService.getToken()
            if(!token) {
                setIsAuthenticated(false)
                
                if(!EXCLUDED.includes(pathname)) {
                    router.replace("/login")
                }
                setLoading(false)

                return
            }

            try {
                const payload = JSON.parse(atob(token.split(".")[1]))
                setUserData({
                    firstName: payload.firstName,
                    userId: payload.userId,
                    email: payload.sub
                })
                setIsAuthenticated(true)
                setLoading(false)
            } catch(e) {
                console.log("error validating token", e)
                setIsAuthenticated(false)
                setLoading(false)
            }
        }
        validateToken()
    }, [router, pathname])

    if(loading) return <Loading/>

    return (
        <AuthContext.Provider value={{ isAuthenticated, userData }}>
            {!EXCLUDED.includes(pathname) && <NavBar firstName={userData.firstName}/>}
            {children}
        </AuthContext.Provider>
    )
}