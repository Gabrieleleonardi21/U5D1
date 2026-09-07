package com.example.u5d1.entieties;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "poi")
@Getter
@Setter
@ToString
public class Poi {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Setter(AccessLevel.NONE)
    private UUID id;

    private String nome;
    private String descrizione;

    @Enumerated(EnumType.STRING)
    private Tipologia tipologia;

    private BigDecimal latitudine;
    private BigDecimal longitudine;

    @CreationTimestamp
    @Setter(AccessLevel.NONE)
    private LocalDateTime dataCreazione;

    @UpdateTimestamp
    @Setter(AccessLevel.NONE)
    private LocalDateTime dataModifica;

    public Poi(){}

    public Poi(String nome, String descrizione, Tipologia tipologia, BigDecimal latitudine, BigDecimal longitudine) {
        this.nome = nome;
        this.descrizione = descrizione;
        this.tipologia = tipologia;
        this.latitudine = latitudine;
        this.longitudine = longitudine;
    }
}
