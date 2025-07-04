import { Routes, Route } from "react-router-dom"


import './App.css'
//Mis Rutas
import Inicio from "./pages/Inicio"
import NuevaVenta from "./pages/NuevaVenta"
import Productos from "./pages/Productos"
import Ventas from "./pages/Ventas"
import Configuracion from "./pages/Configuracion"
import Producto from "./pages/Producto"
import ProductoNuevo from "./pages/ProductoNuevo"
import Venta from "./pages/Venta"
import { Ejemplo } from "./pages/Ejemplo"

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={ <Inicio /> } />
        <Route path="/NuevaVenta" element={ <NuevaVenta/> } />
        <Route path="/Productos" element={ <Productos/> } />
        <Route path="/Producto" element={ <Producto/> } />
        <Route path="/ProductoNuevo" element={ <ProductoNuevo/> } />
        <Route path="/Ventas" element={ <Ventas/> } />
        <Route path="/Venta" element={ <Venta/> } />
        <Route path="/Configuracion" element={ <Configuracion/> } />
        <Route path="/Ejemplo" element={ <Ejemplo/> } />
      </Routes>
    </div>
  )
}

export default App
