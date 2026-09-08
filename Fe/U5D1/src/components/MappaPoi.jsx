import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { TIPOLOGIE, tipologiaDi } from "../api.js";

// Componente "invisibile" che vive dentro la mappa: ascolta gli eventi
// e li riporta ad App. E' il modo idiomatico di react-leaflet per
// collegare la mappa allo stato React
function EventiMappa({ onBoundsChange, onMapClick, mappaRef }) {
  const map = useMapEvents({
    // moveend copre sia lo spostamento che lo zoom: e' QUI che scatta
    // la sincronizzazione richiesta dalla consegna
    moveend: () => onBoundsChange(map.getBounds()),
    click: (e) => onMapClick(e.latlng),
  });

  // al primo render: salvo l'istanza della mappa e carico il viewport iniziale
  useEffect(() => {
    mappaRef.current = map;
    onBoundsChange(map.getBounds());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

// Marker circolare colorato per tipologia; piu' grande se selezionato
function iconaPoi(tipologia, selezionato) {
  const colore = tipologiaDi(tipologia).colore;
  return L.divIcon({
    className: "marker-poi" + (selezionato ? " selezionato" : ""),
    html: '<span class="pallino" style="background:' + colore + '"></span>',
    iconSize: selezionato ? [24, 24] : [18, 18],
    iconAnchor: selezionato ? [12, 12] : [9, 9],
  });
}

export default function Mappa({
  pois,
  selezionatoId,
  setSelezionatoId,
  onBoundsChange,
  onMapClick,
  mappaRef,
  avviaModifica,
  elimina,
}) {
  return (
    <div className="mappa-contenitore" style={{ position: "relative" }}>
      <MapContainer center={[41.9, 12.48]} zoom={14} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <EventiMappa
          onBoundsChange={onBoundsChange}
          onMapClick={onMapClick}
          mappaRef={mappaRef}
        />

        {pois.map((poi) => (
          <Marker
            key={poi.id}
            position={[poi.latitudine, poi.longitudine]}
            icon={iconaPoi(poi.tipologia, poi.id === selezionatoId)}
            eventHandlers={{
              // click sul marker: si evidenzia anche nella lista (stesso stato)
              click: () => setSelezionatoId(poi.id),
            }}
          >
            <Popup>
              <strong>{poi.nome}</strong>
              <br />
              {tipologiaDi(poi.tipologia).etichetta}
              {poi.descrizione && (
                <>
                  <br />
                  {poi.descrizione}
                </>
              )}
              <div style={{ marginTop: 6, display: "flex", gap: 6 }}>
                <button className="mini" onClick={() => avviaModifica(poi)}>
                  Modifica
                </button>
                <button className="mini pericolo" onClick={() => elimina(poi)}>
                  Elimina
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="legenda">
        {Object.entries(TIPOLOGIE).map(([chiave, t]) => (
          <div key={chiave} className="voce-legenda">
            <span
              className="quadratino"
              style={{ background: t.colore }}
            ></span>
            {t.etichetta}
          </div>
        ))}
      </div>
    </div>
  );
}
