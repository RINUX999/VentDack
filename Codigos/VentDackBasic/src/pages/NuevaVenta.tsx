import { Fragment } from "react/jsx-runtime";
import Navegacion from "../components/Navegacion";
import Header from "../components/Header";
import { Checkbox } from "@mui/material";
//Estilos
import "../styles/NuevaVenta.css"
import TarjetaProducto from "../components/TarjetaProducto";
import TarjetaProductoVenta from "../components/TarjetaProductoVenta";

export default function NuevaVenta() {

    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

    return (
        <Fragment>
            <main>
                <aside>
                    <Navegacion
                        pagina={"NuevaVenta"}
                    />
                </aside>
                <section>
                    <Header
                        pagina="Nueva Venta"
                    />

                    <div className="generar-nueva-venta">
                        <div className="botones-elementales">
                            <div className="buscador">
                                <div className="buscar">
                                    <img src="/img/icono_search.png" alt="" />
                                </div>
                                <input type="text" title="" placeholder="Buscar" />
                            </div>
                            <div className="checkbox">
                                <p>
                                    Cantidad
                                </p>
                                <Checkbox {...label} sx={{
                                    color: 'white', // color del ícono desmarcado
                                    '&.Mui-checked': {
                                        color: 'white', // color del ícono marcado
                                    },
                                }} className="checkbox-componente" />
                            </div>
                            <div className="productos-agregados">
                                <div className="texto-productos-agregados">
                                    <p>
                                        Productos Agregados
                                    </p>
                                </div>

                                <img src="\img\icono_vacio.png" alt="" />
                            </div>
                        </div>
                        <div className="contenedores-venta">
                            <div className="contenedor-productos">
                                <TarjetaProducto/>
                            </div>
                            <div className="contenedor-venta">
                                <TarjetaProductoVenta/>
                            </div>
                        </div>
                        <div className="generar-venta">
                            <p>
                                $200
                            </p>
                            <img src="/img/icono_recibo.png" alt="" />
                        </div>
                    </div>
                </section>
            </main>
        </Fragment>
    )
}
