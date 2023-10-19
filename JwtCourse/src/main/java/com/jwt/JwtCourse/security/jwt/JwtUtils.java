package com.jwt.JwtCourse.security.jwt;


import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.jwt.JwtCourse.security.constants.SecurityConstant;
import com.jwt.JwtCourse.security.impl.UserDetailsImpl;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.List;


@Component
public class JwtUtils {

    @Value("jwt.secret.key")
    private String SECRET_KEY;

    /**
     * Create a Json Web Token with the user information
     * @param userDetails an instance of user is log in the system
     * @return a jwt.
     */
    public String createToken(UserDetailsImpl userDetails) {

        return JWT.create()
                .withIssuer(SecurityConstant.COMPANY_NAME)
                .withAudience(SecurityConstant.COMPANY_ADMINISTRATION)
                .withClaim(SecurityConstant.AUTHORITIES, getClaimsFromUser(userDetails))
                .withSubject(userDetails.getUsername())
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + SecurityConstant.EXPIRATION_TIME))
                .sign(Algorithm.HMAC256(this.SECRET_KEY));

    }

    /**
     * Return a verifier
     * @return a JWTVerifier.
     */
    private JWTVerifier getVerifier() {
        return JWT.require(Algorithm.HMAC256(SECRET_KEY))
                .withIssuer(SecurityConstant.COMPANY_NAME)
                .build();
    }


    /**
     * Verify if token is valid
     * @param token
     * @return boolean
     */
    public boolean isValidToken(String token) {

        try {
            //created a jwt verifier to confirm the token
            DecodedJWT jwt =  getVerifier().verify(token);
            return new Date().before(jwt.getExpiresAt()); //if no failed the verification, return true
        } catch (JWTVerificationException exception) {
            return false;
        }
    }

    /**
     * get the claims in the jwt. In this case, only AUTHORITIES  is return
     * @param token an jwt string
     * @return an array with the user's authorities.
     * @throws JWTVerificationException
     */
    private String[] getClaimsFromToken(String token) throws JWTVerificationException {
        return getVerifier()
                .verify(token)
                .getClaim(SecurityConstant.AUTHORITIES)
                .asArray(String.class);
    }


    private List<String> getClaimsFromUser( @NonNull UserDetailsImpl user) {
        return user.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .toList();
    }


}
