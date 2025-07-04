import { useEffect, useState } from "react";
import type { ProductoNuevo } from "../types/models_types";


export const useProduct = () => {
    const [productos, setProductos] = useState<ProductoNuevo[]>([]);
    const [productosBuscados, setProductosBuscados] = useState<ProductoNuevo[]>([]);
    const [producto, setProducto] = useState<ProductoNuevo>();

    const [formProducto, setFormProducto] = useState<Partial<ProductoNuevo>>({
        nombre: '',
        codigo: '',
        cantidad: 0,
        precio: 0,
        descripcion: '',
        url_img: ''
    });

    const cargarProductos = async () => {
        const datos = await window.api.obtenerProductos();
        setProductos(datos);
    };

    useEffect(() => {
        cargarProductos();
    }, []);

    const obtenerProducto = (nombre:string , codigo:string)  =>{
        const Producto= productos.find(producto => producto.nombre === nombre || producto.codigo===codigo)
        if(Producto){
            console.log("HOLALALAL")
            setProducto(Producto);
            console.log(producto)
        }
    }

    const obtenerProductos = (nombre:string, codigo:string)=>{
        if(codigo===""){
            const ProductosBuscados = productos.filter(producto => producto.nombre===nombre)
            if(ProductosBuscados){
                setProductosBuscados(ProductosBuscados)
            }
        }else{
            const ProductosBuscados = productos.filter(producto => producto.nombre===nombre || producto.codigo===codigo)
            if(ProductosBuscados){
                setProductosBuscados(ProductosBuscados)
            }
        }
    }

    const actualizarProducto = async()=>{
        
    }

    const crearProducto = async () => {
        
    };

    const eliminarProducto = async (id: string) => {

    };

    return{
        productos,
        producto,
        obtenerProducto, 
        obtenerProductos,
        actualizarProducto,
        crearProducto,
        eliminarProducto
    }
}
