import axios from "axios"
import { AuthService } from "./authService"

interface PaymentResult {
    success: boolean,
    message?: string,
    clientSecret?: string
}

export class PaymentsService {
    private readonly paymentIntentUrl = process.env.NEXT_PUBLIC_API_URL + "/create-payment-intent"
    
    async createPaymentIntent(amount: string): Promise<PaymentResult> {
        const token = await AuthService.getToken()
        if(!token) {
            return {
                success: false,
                message: "Token not found"
            }
        }

        try {
            const response = await axios.post(this.paymentIntentUrl, {
                amount: amount
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
    
            const clientSecret = response.data.client_secret
            return {
                success: true,
                clientSecret: clientSecret
            }
        } catch(e) {
            return {
                success: false,
                message: e instanceof Error ? e.message : "An error occurred"
            }
        }
    }
}