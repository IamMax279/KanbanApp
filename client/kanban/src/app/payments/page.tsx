"use client"
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import PaymentForm from "../../components/paymentForm"

export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "")

export default function Payments() {
    return (
        <Elements stripe={stripePromise} options={{
            mode: "payment",
            amount: 10000,
            currency: "usd"
        }}>
            <PaymentForm/>
        </Elements>
    )
}