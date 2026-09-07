package com.example.u5d1.controller;

import com.example.u5d1.entieties.Poi;
import com.example.u5d1.payloads.NuovoPoiDTO;
import com.example.u5d1.services.Poiservices;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/poi")
public class PoiController {

    private final Poiservices poiservices;

    public PoiController(Poiservices poiservices) {
        this.poiservices = poiservices;
    }

    @GetMapping
    public List<Poi> findInViewport(@RequestParam(required = false)BigDecimal minLat,
                                    @RequestParam(required = false)BigDecimal maxLat,
                                    @RequestParam(required = false)BigDecimal minLng,
                                    @RequestParam(required = false)BigDecimal maxLng){
        return poiservices.findInViewport(minLat, maxLat, minLng, maxLng);
    }

    @GetMapping("/{id}")
    public Poi findById(@PathVariable UUID id){
        return poiservices.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Poi create(@RequestBody @Valid NuovoPoiDTO dto){
        return poiservices.create(dto);
    }

    @PutMapping("/{id}")
    public Poi update(@PathVariable UUID id, @RequestBody @Valid NuovoPoiDTO dto){
        return poiservices.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id){
        poiservices.delete(id);
    }
}
