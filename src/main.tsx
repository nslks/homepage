import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { site } from './content'
import './index.css'

document.title = site.name

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
