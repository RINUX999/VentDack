import React, { useState } from "react";

type ModalCodigoProps = {
  visible: boolean;
  onValidarCodigo: (codigoIngresado: string) => boolean;
  onCerrar?: () => void; // opcional, si quieres permitir cerrar
};

export default function ModalCodigo({ visible, onValidarCodigo }: ModalCodigoProps) {
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");

  if (!visible) return null;

  const handleSubmit = () => {
    if (onValidarCodigo(codigo)) {
      setError("");
      // El modal se cierra desde el componente padre (controlado)
    } else {
      setError("Código incorrecto, intenta de nuevo.");
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex", justifyContent: "center", alignItems: "center",
      zIndex: 9999
    }}>
      <div style={{ backgroundColor: "white", padding: 20, borderRadius: 8, minWidth: 300 }}>
        <h2>Ingresa el código de desbloqueo</h2>
        <input
          type="text"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          autoFocus
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button onClick={handleSubmit} style={{ padding: "8px 16px" }}>Validar</button>
      </div>
    </div>
  );
}
