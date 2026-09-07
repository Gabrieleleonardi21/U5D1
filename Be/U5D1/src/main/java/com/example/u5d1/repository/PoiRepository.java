package com.example.u5d1.repository;

import com.example.u5d1.entieties.Poi;
import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface PoiRepository extends JpaRepository<Poi, UUID> {

    // I parametri devono essere BigDecimal come i campi dell'entita' Poi
    List<Poi> findByLatitudineBetweenAndLongitudineBetween(
            BigDecimal minLat, BigDecimal maxLat, BigDecimal minLng, BigDecimal maxLng);
}
