import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { site } from './content'
import { useAppStore } from './state/store'
import '@fontsource/inter/latin-400.css'
import '@fontsource/inter/latin-500.css'
import '@fontsource/inter/latin-600.css'
import '@fontsource/inter/latin-700.css'
import './index.css'
import './ui/theme.css'

document.title = site.name
// before the first paint, so the loading screen never flashes in the wrong mode
document.documentElement.dataset.theme = useAppStore.getState().theme

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
