package com.jwt.JwtCourse.security.filter;

import com.jwt.JwtCourse.security.jwt.JwtUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

import static com.jwt.JwtCourse.security.constants.SecurityConstant.OPTIONS_HTTP_METHOD;
import static com.jwt.JwtCourse.security.constants.SecurityConstant.TOKEN_PREFIX;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static org.springframework.http.HttpStatus.OK;

@Component
public class JwtAuthorizationFilter extends OncePerRequestFilter {

    @Autowired
    JwtUtils jwtUtils;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        if(request.getMethod().equalsIgnoreCase(OPTIONS_HTTP_METHOD)){
            response.setStatus(OK.value());
        } else {

            String tokenHeader = request.getHeader(AUTHORIZATION);

            if (tokenHeader != null && tokenHeader.startsWith(TOKEN_PREFIX)) {
                String token = tokenHeader.substring(TOKEN_PREFIX.length());

                if (jwtUtils.isValidToken(token)) {
                    String username = jwtUtils.getSubject(token);

                    UsernamePasswordAuthenticationToken authenticationToken =
                            new UsernamePasswordAuthenticationToken(username, null, jwtUtils.getAuthorities(token));

                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                }
            }
        }
        filterChain.doFilter(request, response);
    }


}
