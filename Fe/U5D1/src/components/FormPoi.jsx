import { useState } from "react";
import { creaPoi, modificaPoi, geocodifica, TIPOLOGIE } from "../api.js";

const FORM_VUOTO = { nome: "", descrizione: "", tipologia: "BUCA" };

// Un form solo per creazione e modifica: se "inModifica" e' valorizzato
// siamo in modifica, altrimenti in creazione. Le coordinate arrivano
// dal click sulla mappa (mai digitate a mano).
// App passa una "key" legata al POI in modifica: quando cambia, React
// rimonta il componente e i campi ripartono dai dati giusti. Cosi' non
// serve copiare le props nello stato dentro un useEffect (render a cascata)
export default function FormPoi({
  inModifica,
  coordinateForm,
  scegliPunto,
  chiudi,
  dopoSalvataggio,
}) {
  const [form, setForm] = useState(function () {
    if (!inModifica) return FORM_VUOTO;
    return {
      nome: inModifica.nome,
      descrizione: inModifica.descrizione || "",
      tipologia: inModifica.tipologia,
    };
  });
  const [errore, setErrore] = useState(null);
  const [indirizzo, setIndirizzo] = useState("");
  const [inRicerca, setInRicerca] = useState(false);
  // esito dell'ultima geocodifica: coordinate + indirizzo normalizzato da Google
  const [esitoRicerca, setEsitoRicerca] = useState(null);

  // Coordinate DERIVATE dalle props, non duplicate nello stato: l'ultimo
  // click sulla mappa vince, altrimenti restano quelle del POI in modifica.
  // Number() perche' il backend serializza BigDecimal e il valore potrebbe
  // arrivare come stringa: senza, toFixed() piu' sotto andrebbe in errore
  let latitudine = null;
  let longitudine = null;
  if (coordinateForm) {
    latitudine = coordinateForm.lat;
    longitudine = coordinateForm.lng;
  } else if (inModifica) {
    latitudine = Number(inModifica.latitudine);
    longitudine = Number(inModifica.longitudine);
  }

  // Indirizzo -> coordinate: le passa ad App, che riempie il form e
  // porta la mappa sul punto. La chiave Google sta nel backend
  async function cercaIndirizzo() {
    if (!indirizzo.trim()) {
      setErrore("Scrivi un indirizzo da cercare.");
      return;
    }
    setInRicerca(true);
    setErrore(null);
    try {
      const trovato = await geocodifica(indirizzo);
      const punto = {
        lat: Number(trovato.latitudine),
        lng: Number(trovato.longitudine),
      };
      setEsitoRicerca({ ...punto, testo: trovato.indirizzoCompleto });
      scegliPunto(punto);
    } catch (err) {
      setErrore(err.message);
    } finally {
      setInRicerca(false);
    }
  }

  async function salva() {
    if (latitudine === null || longitudine === null) {
      setErrore("Scegli il punto cliccando sulla mappa.");
      return;
    }
    try {
      const dto = { ...form, latitudine, longitudine };
      if (inModifica) {
        await modificaPoi(inModifica.id, dto);
      } else {
        await creaPoi(dto);
      }
      setForm(FORM_VUOTO);
      setErrore(null);
      chiudi();
      dopoSalvataggio();
    } catch (err) {
      setErrore(err.message);
    }
  }

  function annulla() {
    setForm(FORM_VUOTO);
    setErrore(null);
    setIndirizzo("");
    setEsitoRicerca(null);
    chiudi();
  }

  // Testi calcolati prima del JSX: piu' leggibili che in linea
  let titolo = "Nuovo POI";
  let testoConferma = "Crea POI";
  if (inModifica) {
    titolo = "Modifica POI";
    testoConferma = "Salva modifiche";
  }

  let testoCerca = "Cerca";
  if (inRicerca) testoCerca = "Cerco...";

  // L'indirizzo trovato si mostra solo finche' il punto non cambia:
  // dopo un click sulla mappa non descriverebbe piu' le coordinate attuali
  let indirizzoMostrato = null;
  if (
    esitoRicerca &&
    esitoRicerca.lat === latitudine &&
    esitoRicerca.lng === longitudine
  ) {
    indirizzoMostrato = esitoRicerca.testo;
  }

  let testoCoordinate = "Nessun punto scelto: cerca un indirizzo o clicca sulla mappa.";
  if (latitudine !== null) {
    testoCoordinate =
      "Punto scelto: " + latitudine.toFixed(5) + ", " + longitudine.toFixed(5);
  }

  return (
    <div className="form-poi">
      <h2>{titolo}</h2>
      <div className="riga">
        <label className="campo">
          <span>nome</span>
          <input
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
          />
        </label>
        <label className="campo">
          <span>tipologia</span>
          <select
            value={form.tipologia}
            onChange={(e) => setForm({ ...form, tipologia: e.target.value })}
          >
            {Object.entries(TIPOLOGIE).map(([chiave, t]) => (
              <option key={chiave} value={chiave}>
                {t.etichetta}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="riga">
        <label className="campo">
          <span>cerca indirizzo</span>
          <input
            value={indirizzo}
            placeholder="es. Via Roma 12, Milano"
            onChange={(e) => setIndirizzo(e.target.value)}
            onKeyDown={(e) => {
              // Invio cerca senza dover prendere il mouse
              if (e.key === "Enter") cercaIndirizzo();
            }}
          />
        </label>
        <button className="cerca" onClick={cercaIndirizzo} disabled={inRicerca}>
          {testoCerca}
        </button>
      </div>
      <div className="riga">
        <label className="campo">
          <span>descrizione (opzionale)</span>
          <input
            value={form.descrizione}
            onChange={(e) => setForm({ ...form, descrizione: e.target.value })}
          />
        </label>
      </div>
      <div className="coordinate">
        {testoCoordinate}
        {indirizzoMostrato && <div>{indirizzoMostrato}</div>}
      </div>
      {errore && <div className="errore">{errore}</div>}
      <div className="riga">
        <button className="primaria" onClick={salva}>
          {testoConferma}
        </button>
        <button onClick={annulla}>Annulla</button>
      </div>
    </div>
  );
}
