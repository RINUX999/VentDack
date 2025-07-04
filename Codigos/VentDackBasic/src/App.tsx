import { Routes, Route } from "react-router-dom"


import './App.css'
//Mis Rutas
import Inicio from "./pages/Inicio"
import NuevaVenta from "./pages/NuevaVenta"
import Productos from "./pages/Productos"
import Ventas from "./pages/Ventas"
import Configuracion from "./pages/Configuracion"
import Producto from "./pages/Producto"
import Venta from "./pages/Venta"

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={ <Inicio /> } />
        <Route path="/NuevaVenta" element={ <NuevaVenta/> } />
        <Route path="/Productos" element={ <Productos/> } />
        <Route path="/Producto" element={ <Producto/> } />
        <Route path="/Ventas" element={ <Ventas/> } />
        <Route path="/Venta" element={ <Venta/> } />
        <Route path="/Configuracion" element={ <Configuracion/> } />
      </Routes>
    </div>
  )
}

export default App
