import { Link } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import type { ProductoNuevo } from "../types/models_types";


type ProductoTarjetaProps = {
    producto: ProductoNuevo
}

export default function ProductoTarjeta({producto}:ProductoTarjetaProps) {
    
    const {nombre} = producto 

    return (
        <Fragment>
            <Link 
            to="/Producto"
            state={{producto}} 
            className="link">
                <div className="contenedor-producto">
                    <p>
                        {nombre}
                    </p>
                </div>
            </Link>
        </Fragment>
    )
}
