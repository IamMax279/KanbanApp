import axios, { AxiosError } from "axios"
import { useRouter } from "next/navigation"

import { AuthService } from "./authService"

interface KanbanParams {
    title: string
    description: string
    label: string
    deadline: string
    status: string
}

export interface Kanban extends KanbanParams {
    label: string
    id: string
}

interface SimpleResponse {
    success: boolean
    message?: string
}

interface AddKanbanResponse {
    success: boolean
    message?: string
    errStatus?: number
}

export class AddKanbanService {
    private readonly addKanbanUrl = process.env.NEXT_PUBLIC_API_URL + "/addkanban"
    private readonly fetchKanbansUrl = process.env.NEXT_PUBLIC_API_URL + "/getmykanbans"
    private readonly deleteKanbanUrl = process.env.NEXT_PUBLIC_API_URL + "/deletekanban"
    private readonly updateKanbanStatusUrl = process.env.NEXT_PUBLIC_API_URL + "/updatekanbanstatus"

    async addNewKanban(params: KanbanParams): Promise<AddKanbanResponse> {
        try {
            const token = await AuthService.getToken()
            if(!token) {
                return {
                    success: false,
                    message: "Token not found"
                }
            }

            const payload = JSON.parse(atob(token.split(".")[1]))
            const data = {
                ...params,
                userId: payload.userId
            }

            await axios.post(this.addKanbanUrl, data, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })

            return {success: true}
        } catch(error) {
            console.log("error in addNewKanban", error)

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

    async fetchMyKanbans(): Promise<Kanban[]> {
        try {
            const token = await AuthService.getToken()
            if(!token) {
                throw new Error("Token not found")
            }

            const kanbans = await axios.get(this.fetchKanbansUrl, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })

            console.log(kanbans.data)
            return kanbans.data
        } catch(error) {
            console.log("error in fetchMyKanbans", error)
            return [];
        }
    }

    async updateKanbanStatus(id: string, status: string): Promise<SimpleResponse> {
        const token = await AuthService.getToken()
        if(!token) {
            return {
                success: false,
                message: "Token not found"
            }
        }

        const payload = JSON.parse(atob(token.split(".")[1]))
        const userId = payload.userId

        try {
            await axios.put(this.updateKanbanStatusUrl, {
                id,
                status,
                userId
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
            return {success: true}
        } catch(e) {
            console.log("error in updateKanbanStatus", e)
            return {success: false, message: "Error in updating kanban status"}
        } 
    }

    async deleteKanban(id: string): Promise<SimpleResponse> {
        const token = await AuthService.getToken()
        if(!token) {
            return {success: false, message: "Token not found"}
        }

        try {
            await axios.delete(`${this.deleteKanbanUrl}?id=${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
            return {success: true}
        } catch(e) {
            console.log("error in deleteKanban", e)
            return {success: false, message: "Error in deleting kanban"}
        }
    }
}