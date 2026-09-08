package com.example.u5d1.controller;

import com.example.u5d1.payloads.CoordinateDTO;
import com.example.u5d1.services.GeocodingService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/geocode")
public class GeocodingController {

    private final GeocodingService geocodingService;

    public GeocodingController(GeocodingService geocodingService) {
        this.geocodingService = geocodingService;
    }

    // GET /api/geocode?indirizzo=Via Roma 12, Milano
    // Restituisce solo le coordinate: il POI viene salvato dopo, con il POST su /api/poi
    @GetMapping
    public CoordinateDTO geocodifica(@RequestParam String indirizzo) {
        return geocodingService.geocodifica(indirizzo);
    }
}
