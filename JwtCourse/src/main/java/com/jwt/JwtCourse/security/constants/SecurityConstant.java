package com.jwt.JwtCourse.security.constants;

public class SecurityConstant {

    //declaramos una serie de variables constantes que se usaran a lo largo de la aplicacion

    public static final long EXPIRATION_TIME = 432_000_000; // expiration time life of the token. Default its 5 days
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String JWT_TOKEN_HEADEER  = "Jwt-Token";
    public static final String TOKEN_CANNOT_BE_VIRIFIED = "The token can not be verified";
    public static final String COMPANY_NAME = "Duk's coffee LLC";
    public static final String COMPANY_ADMINISTRATION = "User Management Portal";
    public static final String AUTHORITIES = "Authorities";
    public static final String FORBIDDEN_MESSAGE = "You need to log in to access this page";
    public static final String ACCESS_DENIED_MESSAGE = "You do not have permission to access this page";
    public static final String OPTIONS_HTTP_METHOD = "OPTIONS";
    public static final String [ ] PUBLIC_URLS = { "/user/login", "/user/register", "/user/reset-password/**", "/user/image/**" };



}
