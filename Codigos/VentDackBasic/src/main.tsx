import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { HashRouter} from 'react-router-dom'

console.log('Main.tsx cargado');  // <-- para ver que corre


createRoot(document.getElementById('root')!).render(


  <HashRouter>
    <App />
  </HashRouter>,
)
