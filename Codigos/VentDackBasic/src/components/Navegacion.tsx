import { Link } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";

type NavegacionProps = {
    pagina:string
}

export default function Navegacion({pagina}:NavegacionProps){

    return(
        <Fragment>
            <img src="/img/logo.png" alt="" />
                    <div className="nav-paginas">
                        
                        {
                            pagina==="Inicio"? 
                            <p className="pagina-seleccionada">
                                Inicio
                            </p>:
                            <Link to="/" className="link">
                                <p>
                                    Inicio
                                </p>
                            </Link>
                        }

                        {
                            pagina==="NuevaVenta"? 
                            <p className="pagina-seleccionada">
                                Nueva Venta
                            </p>:
                         
                            <Link to="/NuevaVenta" className="link">
                                <p>
                                    Nueva Venta
                                </p>
                            </Link>
                        }
                        <p>
                            Productos
                        </p>
                        <p>
                            Ventas
                        </p>
                        <p>
                            Configuracion
                        </p>
                    </div>
        </Fragment>
    )
}
