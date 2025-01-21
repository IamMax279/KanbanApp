package controllers;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.lang.reflect.Array;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@RestController
public class StripeController {
    @Value("${stripe.api.key}")
    private String stripeApiKey;

    @PostMapping("/create-payment-intent")
    public ResponseEntity<Map<String, String>> createCheckoutSession(@RequestBody Map<String, String> request) {
        Stripe.apiKey = stripeApiKey;

        Map<String, Object> params = new HashMap<>();

        Long amount = Long.valueOf(request.get("amount"))*100;
        params.put("amount", amount);
        params.put("currency", "usd");
        //params.put("payment_method_types", Arrays.asList("card", "google_pay", "apple_pay"));
        params.put("automatic_payment_methods", Map.of("enabled", true));

        try {
            PaymentIntent paymentIntent = PaymentIntent.create(params);
            Map<String, String> responseData = new HashMap<>();
            responseData.put("client_secret", paymentIntent.getClientSecret());
            return ResponseEntity.ok(responseData);
        } catch(StripeException e) {
            System.out.println(e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}