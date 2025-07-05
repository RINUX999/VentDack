import { Fragment } from "react/jsx-runtime";
import type { ProductoNuevo } from "../types/models_types";

type TarjetaProductoVentaProps = {
    nombre: string
    precio: number
    cantidad: number
    productosTicket: ProductoNuevo[]
    setProductosTicket: React.Dispatch<React.SetStateAction<ProductoNuevo[]>>;
}

export default function TarjetaProductoVenta({
    nombre, precio, cantidad, productosTicket, setProductosTicket
}: TarjetaProductoVentaProps) {

    const retirarProducto = () => {
        const productosTN = productosTicket.filter( producto => producto.nombre!==nombre)
        setProductosTicket([...productosTN])
    }

    return (
        <Fragment>
            <div className="tarjeta-producto">
                <div className="tarjeta-arriba">
                    <p>
                        {nombre}
                    </p>
                    <img src="/img/icono_remover.png" onClick={()=> retirarProducto()} alt="" />
                </div>
                <div className="tarjeta-abajo">
                    <p>
                        ${precio}
                    </p>
                    <p>
                        Cantidad: {cantidad}
                    </p>
                    <p>
                        Subtotal: ${precio * cantidad}
                    </p>
                </div>
            </div>
        </Fragment>
    )

}
