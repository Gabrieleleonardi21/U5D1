package com.example.u5d1.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // Delega il CORS a Spring Security, che legge le regole di CorsConfig:
        // senza questo le preflight OPTIONS verrebbero bloccate prima di arrivare a Spring MVC
        http.cors(Customizer.withDefaults());

        // API senza sessione: non c'e' cookie da proteggere, quindi il token CSRF
        // servirebbe solo a far fallire POST/PUT/DELETE dal frontend
        http.csrf(csrf -> csrf.disable());
        http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        // L'app non ha ancora autenticazione: tutto aperto.
        // Quando aggiungerai utenti e login, restringi qui i singoli path
        http.authorizeHttpRequests(auth -> auth.anyRequest().permitAll());

        return http.build();
    }
}
