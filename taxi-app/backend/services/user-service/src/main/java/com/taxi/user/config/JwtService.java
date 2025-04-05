package com.taxi.user.config;

import com.taxi.user.entities.User;
import com.taxi.user.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.*;
import java.util.function.Function;

@Component
@RequiredArgsConstructor
public class JwtService {
    private final String SECRET_KEY = "598CCC87F435776673862D86F8B93B2B67A0C2CEA75F91CF89A285D971E7C12F";
    private final UserRepository repository;

    private final SecretKey key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());


    public Optional<User> getUserByJwt(String jwt){
        String email = getEmailFromJwt(jwt);

        return repository.findByEmail(email);
    }

    public String generateToken(Authentication authentication){
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        String roles = populateAuthorities(authorities);

        return Jwts
                .builder()
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis()+1000L * 60 * 60 * 24))
                .claim("email", authentication.getName())
                .claim("authorities", roles)
                .signWith(key)
                .compact();
    }

    public String generateRefreshToken(String email){
        return Jwts
                .builder()
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis()+1000L * 60 * 60 * 24 * 7))
                .claim("email", email)
                .signWith(key)
                .compact();
    }

    public String getEmailFromJwt(String jwt){
        Claims claims = null;

        String token = jwt.startsWith("Bearer ") ? jwt.substring(7) : jwt;

        try{
            claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
        }
        catch (JwtException e){
            e.printStackTrace();
        }

        assert claims != null;
        return String.valueOf(claims.get("email"));
    }

    public String populateAuthorities(Collection<? extends GrantedAuthority> authorities){
        Set<String> auth = new HashSet<>();

        for(GrantedAuthority authority : authorities){
            auth.add("ROLE_"+authority.getAuthority());
        }

        return String.join(",", auth);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsTFunction){
        final Claims claims = extractAllClaims(token);
        return claimsTFunction.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public boolean isTokenValid(String token, User user) {
        final String username = extractUsername(token);

        return (username.equals(user.getUsername())) && !isTokenExpired(token);

    }

    public boolean isTokenExpired(String token){
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token){
        return extractClaim(token, Claims::getExpiration);
    }

    public String extractUsername(String token){
        return extractClaim(token, claims -> claims.get("email", String.class));
    }
}
