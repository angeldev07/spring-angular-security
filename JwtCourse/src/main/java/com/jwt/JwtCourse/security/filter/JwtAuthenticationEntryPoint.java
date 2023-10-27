package com.jwt.JwtCourse.security.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jwt.JwtCourse.http.responses.HttpResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.Http403ForbiddenEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.OutputStream;

import static com.jwt.JwtCourse.security.constants.SecurityConstant.FORBIDDEN_MESSAGE;
import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@Component
public class JwtAuthenticationEntryPoint extends Http403ForbiddenEntryPoint {
    @Override
    public void commence(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull AuthenticationException exception) throws IOException {

       //Create a instance of our HttpResponse
        HttpResponse httpResponse = new HttpResponse(FORBIDDEN.value(), FORBIDDEN, FORBIDDEN.getReasonPhrase().toUpperCase(), FORBIDDEN_MESSAGE);

        //set the response status and contentType
        response.setContentType(APPLICATION_JSON_VALUE);
        response.setStatus(FORBIDDEN.value());

        // Write the httpResponse on the response Servlet.
        OutputStream outputStream = response.getOutputStream();
        ObjectMapper mapper = new ObjectMapper();

        mapper.writeValue(outputStream, httpResponse);
        outputStream.flush();

    }
}
