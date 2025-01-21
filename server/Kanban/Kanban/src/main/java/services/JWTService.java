package services;

import java.security.Key;

public interface JWTService {
    String generateToken(String email);
    String generateRefreshToken(String email);
    Key getKey();
    String extractEmail(String token);
    Long extractUserId(String token);
    boolean validateToken(String token);
}
