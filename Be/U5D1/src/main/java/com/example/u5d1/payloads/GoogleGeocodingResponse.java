package com.example.u5d1.payloads;

import java.math.BigDecimal;
import java.util.List;

// Risposta della Google Geocoding API v4 (host geocode.googleapis.com).
// Differenze rispetto alla vecchia v3, tutte rilevanti qui:
// - i campi sono camelCase (formattedAddress), non snake_case: niente @JsonProperty
// - non esiste nessun campo "status": l'esito sta nello status HTTP
// - "indirizzo non trovato" e' un 200 con corpo {}, quindi results arriva null
//   e non come lista vuota
// - dentro location i campi sono latitude/longitude, in v3 erano lat/lng
public record GoogleGeocodingResponse(List<Result> results) {

    public record Result(Location location, String formattedAddress) {
    }

    public record Location(BigDecimal latitude, BigDecimal longitude) {
    }
}
