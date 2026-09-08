package com.example.u5d1.services;

import com.example.u5d1.exceptions.BadRequestException;
import com.example.u5d1.exceptions.GeocodingException;
import com.example.u5d1.exceptions.NotFoundException;
import com.example.u5d1.payloads.CoordinateDTO;
import com.example.u5d1.payloads.GoogleGeocodingResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

@Service
public class GeocodingService {

    private final RestClient restClient;
    private final String apiKey;

    // La chiave arriva da env.local (fuori da git): default vuoto cosi' l'app parte
    // anche senza, e l'errore lo diamo alla prima chiamata invece che all'avvio.
    // base-url e' una property per poterlo puntare a un server finto durante i test
    public GeocodingService(RestClient.Builder builder,
                            @Value("${google.geocoding.api-key:}") String apiKey,
                            @Value("${google.geocoding.base-url:https://geocode.googleapis.com}") String baseUrl) {
        this.restClient = builder.baseUrl(baseUrl).build();
        this.apiKey = apiKey;
    }

    public CoordinateDTO geocodifica(String indirizzo) {
        if (indirizzo == null || indirizzo.isBlank()) {
            throw new BadRequestException("L'indirizzo da cercare e' obbligatorio");
        }
        if (apiKey.isBlank()) {
            throw new GeocodingException("Chiave Google non configurata: manca GOOGLE_API_KEY in env.local");
        }

        GoogleGeocodingResponse risposta = chiama(indirizzo);

        // In v4 un indirizzo non trovato e' un 200 con corpo vuoto: results resta
        // null, quindi il controllo sul null non e' ridondante
        if (risposta == null || risposta.results() == null || risposta.results().isEmpty()) {
            throw new NotFoundException("Nessun risultato per l'indirizzo: " + indirizzo);
        }

        GoogleGeocodingResponse.Result primo = risposta.results().get(0);
        return new CoordinateDTO(
                primo.location().latitude(),
                primo.location().longitude(),
                primo.formattedAddress());
    }

    private GoogleGeocodingResponse chiama(String indirizzo) {
        try {
            return restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/v4/geocode/address/{indirizzo}") // in v4 l'indirizzo sta nel path
                            .queryParam("regionCode", "IT")
                            .queryParam("languageCode", "it")
                            .build(indirizzo)) // come variabile di path viene codificato correttamente
                    // la chiave va nell'header, non in query string: cosi' non finisce
                    // negli access log dei proxy attraversati dalla richiesta
                    .header("X-Goog-Api-Key", apiKey)
                    .retrieve()
                    .body(GoogleGeocodingResponse.class);
        } catch (RestClientException e) {
            // chiave non valida, API non abilitata, quota finita, rete giu', timeout:
            // in v4 arrivano tutti come status HTTP di errore, non nel corpo
            throw new GeocodingException("Errore dal servizio di geocoding: " + e.getMessage());
        }
    }
}
