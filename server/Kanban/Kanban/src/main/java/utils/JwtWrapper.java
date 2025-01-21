package utils;

import lombok.Data;

@Data
public class JwtWrapper {
    private String token;
    private String refreshToken;

    public JwtWrapper(String token) {
        this.token = token;
    }
    public JwtWrapper(String token, String refreshToken) {
        this.token = token;
        this.refreshToken = refreshToken;
    }
}
