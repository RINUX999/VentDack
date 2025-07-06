import { Fragment, useEffect, useState } from "react";


type HeaderProps = {
  pagina: string;
};

export default function Header({ pagina }: HeaderProps) {
  const [nombreNegocio, setNombreNegocio] = useState("Sin Nombre");

  useEffect(() => {
    const cargarNombre = async () => {
      try {
        const negocio = await window.api.obtenerNegocio();
        if (negocio?.nombre) {
          setNombreNegocio(negocio.nombre);
        }
      } catch (error) {
        console.error("Error al obtener el nombre del negocio:", error);
      }
    };

    cargarNombre();
  }, []);

  return (
    <Fragment>
      <h1>{nombreNegocio}</h1>
      <h2>{pagina}</h2>
    </Fragment>
  );
}
