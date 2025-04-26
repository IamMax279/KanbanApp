import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { Button } from "@nextui-org/button";

import { PaymentsService } from "@/services/paymentsService";
import Loading from "./Loading";

const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [clientSecret, setClientSecret] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    
    const paymentsService = new PaymentsService();

    useEffect(() => {
        const fetchPaymentIntent = async () => {
            setLoading(true);
            const result = await paymentsService.createPaymentIntent("100");
            console.log(result)
            if (result.success && result.clientSecret) {
                setClientSecret(result.clientSecret);
            } else {
                setError(result.message || "Failed to initialize payment");
            }
            setLoading(false);
        };
        fetchPaymentIntent();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements || !clientSecret) return;

        setLoading(true);
        setError("");

        await elements.submit()

        const result = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}`,
            },
            clientSecret
        });

        if (result.error) {
            setError(result.error.message || "Payment failed");
        }
        setLoading(false);
    };

    if (loading && !clientSecret) return (
        <Loading/>
    )

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto p-4">
            {clientSecret && (
                <PaymentElement 
                    options={{
                        paymentMethodOrder: ['card'],
                        layout: 'accordion'
                    }}
                />
            )}
            {error && (
                <div className="text-red-500 mt-2 text-center">
                    {error}
                </div>
            )}
            <Button color="primary" variant='solid'
                className='text-gray-100 text-md font-semibold w-full mt-2'
                type="submit">
                {loading ? "Processing..." : "Pay $100"}
            </Button>
        </form>
    );
};

export default PaymentForm;