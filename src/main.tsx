import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/brand.css'
import './styles/eis-brand.css'
import './styles/exhibit-panels.css'
import './styles/predict-outbreak.css' // Predict the Outbreak museum theme
import './styles/poster-tiles.css' // Museum exhibit plate styles - must be last
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
