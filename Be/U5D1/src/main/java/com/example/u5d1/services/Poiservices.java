package com.example.u5d1.services;

import com.example.u5d1.entieties.Poi;
import com.example.u5d1.entieties.Tipologia;
import com.example.u5d1.exceptions.BadRequestException;
import com.example.u5d1.exceptions.NotFoundException;
import com.example.u5d1.payloads.NuovoPoiDTO;
import com.example.u5d1.repository.PoiRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class Poiservices {

    private final PoiRepository poiRepository;

    // Injection da costruttore: campo final e classe testabile senza contesto Spring
    public Poiservices(PoiRepository poiRepository) {
        this.poiRepository = poiRepository;
    }

    public Poi findById(UUID id) {
        return poiRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("POI non trovato: " + id));
    }

    public List<Poi> findInViewport(BigDecimal minLat, BigDecimal maxLat, BigDecimal minLng, BigDecimal maxLng) {
        if (minLat == null || maxLat == null || minLng == null || maxLng == null) {
            return poiRepository.findAll();
        }
        return poiRepository.findByLatitudineBetweenAndLongitudineBetween(minLat, maxLat, minLng, maxLng);
    }

    public Poi create(NuovoPoiDTO dto) {
        Poi nuovo = new Poi(dto.nome(), dto.descrizione(), parseTipologia(dto.tipologia()),
                dto.latitudine(), dto.longitudine());
        return poiRepository.save(nuovo);
    }

    public Poi update(UUID id, NuovoPoiDTO dto) {
        Poi poi = this.findById(id);
        // aggiornamento tramite setter; setId non esiste, quindi
        // l'identita' dell'entita' e' intoccabile per costruzione
        poi.setNome(dto.nome());
        poi.setDescrizione(dto.descrizione());
        poi.setTipologia(parseTipologia(dto.tipologia()));
        poi.setLatitudine(dto.latitudine());
        poi.setLongitudine(dto.longitudine());
        return poiRepository.save(poi);
    }

    public void delete(UUID id) {
        poiRepository.delete(this.findById(id));
    }

    // Resta nel service: il valore ammesso dipende dall'enum di dominio, non dal formato del payload
    private Tipologia parseTipologia(String tipologia) {
        try {
            return Tipologia.valueOf(tipologia.toUpperCase());
        } catch (IllegalArgumentException | NullPointerException e) {
            // i valori ammessi si leggono dall'enum: aggiungendo una tipologia
            // il messaggio si aggiorna da solo e non puo' diventare falso
            throw new BadRequestException("Tipologia non valida: " + tipologia
                    + ". Valori ammessi: " + Arrays.toString(Tipologia.values()));
        }
    }
}
