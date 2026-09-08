// Tutte le chiamate al backend passano da qui: un solo punto da
// cambiare se l'indirizzo del server cambia
const BASE = "http://localhost:3001/api";
const POI = BASE + "/poi";

// Punto unico di lettura delle risposte: restituisce il corpo se la chiamata
// e' andata bene, altrimenti lancia il messaggio dell'ErrorPayload del backend.
// Il parse sta in un try perche' non tutte le risposte hanno un corpo JSON
// (il 204 della DELETE, un 403 di Spring Security): senza, l'utente vedrebbe
// un SyntaxError incomprensibile al posto dell'errore vero
async function leggiRisposta(res, messaggioDiDefault) {
  let dati;
  try {
    dati = await res.json();
  } catch {
    dati = null;
  }
  if (!res.ok) {
    let messaggio = messaggioDiDefault;
    if (dati && dati.message) messaggio = dati.message;
    throw new Error(messaggio);
  }
  return dati;
}

// I POI dentro il rettangolo del viewport corrente
export async function fetchPoiNelViewport(bounds) {
  const parametri = new URLSearchParams({
    minLat: bounds.getSouth(),
    maxLat: bounds.getNorth(),
    minLng: bounds.getWest(),
    maxLng: bounds.getEast(),
  });
  const res = await fetch(POI + "?" + parametri.toString());
  return leggiRisposta(res, "Errore nel caricamento dei POI");
}

export async function creaPoi(dto) {
  const res = await fetch(POI, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  return leggiRisposta(res, "Errore nella creazione");
}

export async function modificaPoi(id, dto) {
  const res = await fetch(POI + "/" + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  return leggiRisposta(res, "Errore nella modifica");
}

export async function eliminaPoi(id) {
  const res = await fetch(POI + "/" + id, { method: "DELETE" });
  // il backend risponde 204 senza corpo: qui interessa solo l'eventuale errore
  await leggiRisposta(res, "Errore nell'eliminazione");
}

// Indirizzo -> coordinate. Il backend interroga Google e ci restituisce
// { latitudine, longitudine, indirizzoCompleto }
export async function geocodifica(indirizzo) {
  const parametri = new URLSearchParams({ indirizzo });
  const res = await fetch(BASE + "/geocode?" + parametri.toString());
  return leggiRisposta(res, "Indirizzo non trovato");
}

// Colori e etichette per tipologia: usati da marker, lista e legenda,
// definiti una volta sola cosi' le tre viste non possono divergere.
// Le chiavi DEVONO combaciare con l'enum Tipologia del backend
export const TIPOLOGIE = {
  BUCA: { etichetta: "Buca", colore: "#B3452F" },
  LAMPIONE: { etichetta: "Lampione", colore: "#C97E1F" },
  TOMBINO: { etichetta: "Tombino", colore: "#5C6B72" },
  INCIDENTE: { etichetta: "Incidente", colore: "#8A5A9E" },
  POLIZIA: { etichetta: "Polizia", colore: "#2E5FA3" },
};

// Fallback per tipologie sconosciute (es. una nuova voce aggiunta al
// backend prima che il frontend la conosca): evita di leggere
// .colore su undefined nei componenti
const TIPOLOGIA_SCONOSCIUTA = { etichetta: "Sconosciuta", colore: "#9AA0A6" };

export function tipologiaDi(chiave) {
  return TIPOLOGIE[chiave] || TIPOLOGIA_SCONOSCIUTA;
}
