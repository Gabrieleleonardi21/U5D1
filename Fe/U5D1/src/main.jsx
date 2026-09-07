import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// StrictMode: in sviluppo monta due volte ed esegue due volte gli effetti,
// così emergono subito effetti non idempotenti (fetch senza cleanup, ecc.).
// Non ha alcun impatto sulla build di produzione.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
