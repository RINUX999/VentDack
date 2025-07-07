import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import './App.css';

// Mis Rutas
import Inicio from "./pages/Inicio";
import NuevaVenta from "./pages/NuevaVenta";
import Productos from "./pages/Productos";
import Ventas from "./pages/Ventas";
import Configuracion from "./pages/Configuracion";
import Producto from "./pages/Producto";
import ProductoNuevo from "./pages/ProductoNuevo";
import Venta from "./pages/Venta";
import { Ejemplo } from "./pages/Ejemplo";

import ModalCodigo from "./components/ModalCodigo";

function App() {
  const [mostrarModalCodigo, setMostrarModalCodigo] = useState(false);
  const [codigosRenta, setCodigosRenta] = useState<{ fecha: string; codigo: string }[] | null>(null);
  const [codigoValido, setCodigoValido] = useState(false);

  useEffect(() => {
    async function verificarCodigo() {
      try {
        const codigos: { fecha: string; codigo: string }[] | null = await window.api.obtenerCodigosRenta();
        if (!codigos) {
          console.error("No se encontraron códigos de renta.");
          return;
        }
        setCodigosRenta(codigos);

        // Obtener mes y año actual
        const hoy = new Date();
        const mesActual = hoy.getMonth();
        const anioActual = hoy.getFullYear();

        // Leer último mes validado del localStorage
        const ultimoMesValidado = localStorage.getItem("ultimoMesValidado");
        const ultimoAnioValidado = localStorage.getItem("ultimoAnioValidado");

        // Si ya validó este mes y año, no mostrar modal
        if (
          ultimoMesValidado !== null &&
          ultimoAnioValidado !== null &&
          Number(ultimoMesValidado) === mesActual &&
          Number(ultimoAnioValidado) === anioActual
        ) {
          setCodigoValido(true);
          setMostrarModalCodigo(false);
          return;
        }

        // Verificar si hay código activo según fecha para hoy
        const codigoActivo = codigos.find(({ fecha }) => new Date(fecha) <= hoy);
        if (codigoActivo) {
          setMostrarModalCodigo(true);
          setCodigoValido(false);
        }
      } catch (error) {
        console.error("Error al obtener códigos de renta:", error);
      }
    }
    verificarCodigo();
  }, []);

  const validarCodigo = (codigoIngresado: string): boolean => {
    if (!codigosRenta) return false;

    const hoy = new Date();
    const mesActual = hoy.getMonth();
    const anioActual = hoy.getFullYear();

    const codigoActivo = codigosRenta.find(
      ({ fecha, codigo }) =>
        new Date(fecha) <= hoy &&
        codigo === codigoIngresado.trim()
    );

    if (codigoActivo) {
      setCodigoValido(true);
      setMostrarModalCodigo(false);

      // Guardar mes y año validado en localStorage para no volver a pedir este mes
      localStorage.setItem("ultimoMesValidado", mesActual.toString());
      localStorage.setItem("ultimoAnioValidado", anioActual.toString());

      return true;
    }
    return false;
  };

  return (
    <>
      <ModalCodigo
        visible={mostrarModalCodigo && !codigoValido}
        onValidarCodigo={validarCodigo}
      />

      {!mostrarModalCodigo || codigoValido ? (
        <div className="App">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/NuevaVenta" element={<NuevaVenta />} />
            <Route path="/Productos" element={<Productos />} />
            <Route path="/Producto" element={<Producto />} />
            <Route path="/ProductoNuevo" element={<ProductoNuevo />} />
            <Route path="/Ventas" element={<Ventas />} />
            <Route path="/Venta" element={<Venta />} />
            <Route path="/Configuracion" element={<Configuracion />} />
            <Route path="/Ejemplo" element={<Ejemplo />} />
          </Routes>
        </div>
      ) : null}
    </>
  );
}

export default App;
