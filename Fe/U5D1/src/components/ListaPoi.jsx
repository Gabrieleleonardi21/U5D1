import { tipologiaDi } from "../api.js";

// La lista laterale: si disegna dallo STESSO array della mappa,
// quindi mostra per costruzione solo i POI nel viewport corrente
export default function ListaPoi({
  pois,
  selezionatoId,
  centraSu,
  avviaModifica,
  elimina,
}) {
  return (
    <>
      <h2>
        POI nel viewport: <span className="conteggio">{pois.length}</span>
      </h2>
      <div className="lista">
        {pois.length === 0 && (
          <div className="vuoto">
            Nessun POI in questa zona della mappa. Spostati o creane uno
            cliccando sulla mappa.
          </div>
        )}
        {pois.map((poi) => {
          const tipo = tipologiaDi(poi.tipologia);
          return (
            <div
              key={poi.id}
              className={
                "elemento" + (poi.id === selezionatoId ? " selezionato" : "")
              }
              style={{ borderLeftColor: tipo.colore }}
              onClick={() => centraSu(poi)}
            >
              <div className="nome">{poi.nome}</div>
              <div className="tipo">{tipo.etichetta}</div>
              {poi.descrizione && (
                <div className="descrizione">{poi.descrizione}</div>
              )}
              <div className="azioni">
                <button
                  className="mini"
                  onClick={(e) => {
                    e.stopPropagation();
                    avviaModifica(poi);
                  }}
                >
                  Modifica
                </button>
                <button
                  className="mini pericolo"
                  onClick={(e) => {
                    e.stopPropagation();
                    elimina(poi);
                  }}
                >
                  Elimina
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
