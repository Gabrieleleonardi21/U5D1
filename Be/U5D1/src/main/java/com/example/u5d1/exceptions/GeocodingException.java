package com.example.u5d1.exceptions;

// Errore che arriva da Google o dalla nostra configurazione, non dall'utente:
// va distinto dal BadRequestException per restituire uno status corretto
public class GeocodingException extends RuntimeException {
    public GeocodingException(String message) {
        super(message);
    }
}
