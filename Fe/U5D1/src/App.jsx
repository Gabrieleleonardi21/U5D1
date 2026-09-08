import { useCallback, useRef, useState } from "react";
import Mappa from "./components/MappaPoi.jsx";
import ListaPoi from "./components/ListaPoi.jsx";
import FormPoi from "./components/FormPoi.jsx";
import { fetchPoiNelViewport, eliminaPoi } from "./api.js";

// IL PRINCIPIO DEL PROGETTO: un'unica fonte di verita'.
// "pois" contiene SOLO i POI dentro il viewport corrente; mappa e
// lista si disegnano entrambe da questo array, quindi la
// sincronizzazione richiesta dalla consegna e' automatica
export default function App() {
  const [pois, setPois] = useState([]);
  const [selezionatoId, setSelezionatoId] = useState(null);
  const [inModifica, setInModifica] = useState(null); // il POI nel form (null = creazione)
  const [coordinateForm, setCoordinateForm] = useState(null); // dal click sulla mappa

  // ref e non state: i bounds correnti e l'istanza della mappa servono
  // alle funzioni ma non devono causare re-render quando cambiano
  const boundsRef = useRef(null);
  const mappaRef = useRef(null);

  // Chiamata a ogni spostamento/zoom della mappa (evento moveend)
  const caricaViewport = useCallback(async (bounds) => {
    boundsRef.current = bounds;
    try {
      const dati = await fetchPoiNelViewport(bounds);
      setPois(dati);
    } catch (err) {
      console.error(err.message);
    }
  }, []);

  // Dopo ogni creazione/modifica/cancellazione: ricarico il viewport corrente
  function ricarica() {
    if (boundsRef.current) caricaViewport(boundsRef.current);
  }

  // Click su un elemento della lista: la mappa vola sul punto
  function centraSu(poi) {
    setSelezionatoId(poi.id);
    if (mappaRef.current) {
      mappaRef.current.flyTo(
        [poi.latitudine, poi.longitudine],
        Math.max(mappaRef.current.getZoom(), 16),
      );
    }
  }

  // Punto scelto dalla ricerca per indirizzo: oltre a riempire il form,
  // porto la mappa sul punto, altrimenti il marker finirebbe fuori schermo
  function scegliPunto(punto) {
    setCoordinateForm(punto);
    if (mappaRef.current) mappaRef.current.flyTo([punto.lat, punto.lng], 17);
  }

  async function gestisciElimina(poi) {
    if (!confirm('Eliminare "' + poi.nome + '"?')) return;
    try {
      await eliminaPoi(poi.id);
      if (selezionatoId === poi.id) setSelezionatoId(null);
      ricarica();
    } catch (err) {
      alert(err.message);
    }
  }

  // key del form: cambiando, React lo rimonta con i dati del POI scelto
  let chiaveForm = "nuovo";
  if (inModifica) chiaveForm = inModifica.id;

  return (
    <div className="app">
      <header>
        <h1>Segnalazioni urbane</h1>
        <small>S5/L1 — Geolocalizzazione</small>
        <span className="suggerimento">
          Click sulla mappa per scegliere il punto di un nuovo POI
        </span>
      </header>
      <div className="contenuto">
        <Mappa
          pois={pois}
          selezionatoId={selezionatoId}
          setSelezionatoId={setSelezionatoId}
          onBoundsChange={caricaViewport}
          onMapClick={(latlng) => setCoordinateForm(latlng)}
          mappaRef={mappaRef}
          avviaModifica={setInModifica}
          elimina={gestisciElimina}
        />
        <aside className="laterale">
          <ListaPoi
            pois={pois}
            selezionatoId={selezionatoId}
            centraSu={centraSu}
            avviaModifica={setInModifica}
            elimina={gestisciElimina}
          />
          <FormPoi
            key={chiaveForm}
            inModifica={inModifica}
            coordinateForm={coordinateForm}
            scegliPunto={scegliPunto}
            chiudi={() => {
              setInModifica(null);
              setCoordinateForm(null);
            }}
            dopoSalvataggio={ricarica}
          />
        </aside>
      </div>
    </div>
  );
}
