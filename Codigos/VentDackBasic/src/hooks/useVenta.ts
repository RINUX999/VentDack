import { useState, useEffect, useCallback } from "react";
import type { Venta, DetalleVenta } from "../types/models_types";

export function useVentas() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [detalles, setDetalles] = useState<DetalleVenta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar ventas
  const cargarVentas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const ventasData = await window.api.obtenerVentas();
      setVentas(ventasData);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar todos los detalles (sin filtro)
  const cargarDetalles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const detallesData = await window.api.obtenerDetalles();
      setDetalles(detallesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    cargarVentas();
    cargarDetalles(); // Cargar detalles igual que ventas al inicio
  }, [cargarVentas, cargarDetalles]);

  // Eliminar venta y sus detalles
  const eliminarVentaConDetalles = useCallback(async (ventaId: string) => {
    setLoading(true);
    setError(null);
    try {
      const detallesData = detalles.filter(d => d.venta_id === ventaId);
      for (const detalle of detallesData) {
        await window.api.eliminarDetalleVenta(detalle.id);
      }
      await window.api.eliminarVenta(ventaId);
      await cargarVentas();
      await cargarDetalles();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [detalles, cargarVentas, cargarDetalles]);

  return {
    ventas,
    detalles,
    loading,
    error,
    cargarVentas,
    cargarDetalles,
    eliminarVentaConDetalles,
    setDetalles,
  };
}
