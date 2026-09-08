package com.example.u5d1.payloads;

import java.math.BigDecimal;

// Risposta del nostro endpoint di geocoding: le coordinate da mostrare sulla mappa
// piu' l'indirizzo normalizzato da Google, utile per far confermare all'utente
public record CoordinateDTO(
        BigDecimal latitudine,
        BigDecimal longitudine,
        String indirizzoCompleto
) {
}
