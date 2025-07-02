import { Link } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";

type NavegacionProps = {
    pagina: string
}

export default function Navegacion({ pagina }: NavegacionProps) {

    return (
        <Fragment>
            <img src="/img/logo.png" alt="" />
            <div className="nav-paginas">

                {
                    pagina === "Inicio" ?
                        <p className="pagina-seleccionada">
                            Inicio
                        </p> :
                        <Link to="/" className="link">
                            <p>
                                Inicio
                            </p>
                        </Link>
                }
                {
                    pagina === "NuevaVenta" ?
                        <p className="pagina-seleccionada">
                            Nueva Venta
                        </p> :

                        <Link to="/NuevaVenta" className="link">
                            <p>
                                Nueva Venta
                            </p>
                        </Link>
                }
                {
                    pagina === "Productos" ?
                        <p className="pagina-seleccionada">
                            Productos
                        </p> :
                        <Link to="/Productos" className="link">
                            <p>
                                Productos
                            </p>
                        </Link>
                }
                {
                    pagina === "Ventas" ?
                        <p className="pagina-seleccionada">
                            Ventas
                        </p> :
                        <Link to="/Ventas" className="link">
                            <p>
                                Ventas
                            </p>
                        </Link>
                }
                {
                    pagina === "Configuracion" ?
                        <p className="pagina-seleccionada">
                            Configuracion
                        </p> :
                        <Link to="/Configuracion" className="link">
                            <p>
                                Configuracion
                            </p>
                        </Link>
                }
            </div>
        </Fragment>
    )
}
