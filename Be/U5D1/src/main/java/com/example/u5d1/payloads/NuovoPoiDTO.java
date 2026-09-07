package com.example.u5d1.payloads;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

// Le regole di validazione stanno qui: il service riceve un DTO gia' valido
public record NuovoPoiDTO(
        @NotBlank(message = "Il nome del POI e' obbligatorio")
        String nome,

        String descrizione,

        @NotBlank(message = "La tipologia e' obbligatoria")
        String tipologia,

        @NotNull(message = "La latitudine e' obbligatoria")
        @DecimalMin(value = "-90.0", message = "Latitudine non valida: deve essere tra -90 e 90")
        @DecimalMax(value = "90.0", message = "Latitudine non valida: deve essere tra -90 e 90")
        BigDecimal latitudine,

        @NotNull(message = "La longitudine e' obbligatoria")
        @DecimalMin(value = "-180.0", message = "Longitudine non valida: deve essere tra -180 e 180")
        @DecimalMax(value = "180.0", message = "Longitudine non valida: deve essere tra -180 e 180")
        BigDecimal longitudine
) {
}
