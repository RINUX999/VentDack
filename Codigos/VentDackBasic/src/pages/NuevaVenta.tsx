import { Fragment } from "react/jsx-runtime";
import Navegacion from "../components/Navegacion";
import Header from "../components/Header";
import { Checkbox } from "@mui/material";
//Estilos
import "../styles/NuevaVenta.css"
import TarjetaProducto from "../components/TarjetaProducto";
import TarjetaProductoVenta from "../components/TarjetaProductoVenta";
import { useProduct } from "../hooks/useProduct";
import React, { useEffect, useMemo, useState } from "react";
import type { ProductoNuevo } from "../types/models_types";

export default function NuevaVenta() {

    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

    const { productos } = useProduct()
    const [productosDisponibles, setProductosDisponibles] = useState<ProductoNuevo[]>([])
    const [productosBuscados, setProductosBuscados] = useState<ProductoNuevo[]>([])
    const [busqueda, setBusqueda] = useState('');
    const [productosTicket, setProductosTicket] = useState<ProductoNuevo[]>([])

    useEffect(() => {
        if (productos) {
            setProductosDisponibles([...productos])
            if (busqueda && busqueda !== "") {
                const productosB = productos.filter(producto => (
                    producto.nombre.toLowerCase().startsWith(busqueda.toLowerCase()) ||
                    producto.codigo?.startsWith(busqueda)
                ))
                setProductosBuscados([...productosB])
            } else {
                setProductosBuscados([...productos])
            }
        }
    }, [productos, busqueda])

    const total = useMemo(() =>
        productosTicket.reduce((total, item) =>
            total + (Number(item.cantidad ?? 0) * Number(item.precio ?? 0))
            , 0),
        [productosTicket]);



    const buscar = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBusqueda(e.target.value)
    }
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
                                <input type="text" title="" placeholder="Buscar" value={busqueda} onChange={buscar} />
                            </div>
                            <div className="checkbox">
                                {/*<p>
                                    Cantidad
                                </p>
                                <Checkbox {...label} sx={{
                                    color: 'white', // color del ícono desmarcado
                                    '&.Mui-checked': {
                                        color: 'white', // color del ícono marcado
                                    },
                                }} className="checkbox-componente" />*/}
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
                                {
                                    productosBuscados
                                        .filter(producto => (producto.cantidad ?? 0) > 0)
                                        .map(producto => (
                                            <TarjetaProducto
                                                producto={producto}
                                                productos={productos}
                                                productosTicket={productosTicket}
                                                setProductosTicket={setProductosTicket}
                                            />
                                        ))
                                }
                            </div>
                            <div className="contenedor-venta">
                                {
                                    productosTicket.map(producto =>
                                        <TarjetaProductoVenta
                                            nombre={producto.nombre}
                                            precio={producto.precio}
                                            cantidad={producto.cantidad ? producto.cantidad : 1}
                                            productosTicket={productosTicket}
                                            setProductosTicket={setProductosTicket}
                                        />
                                    )
                                }
                            </div>
                        </div>
                        <div className="generar-venta">
                            <p>
                                ${total}
                            </p>
                            <img src="/img/icono_recibo.png" alt="" />
                        </div>
                    </div>
                </section>
            </main>
        </Fragment>
    )
}
