export type ProductoNuevo = {
  id: string;             // UUID o timestamp string
  nombre: string;
  codigo?: string;
  cantidad?: number;
  precio: number;
  descripcion?: string;
  url_img?: string;
  creado_en?: string;
} 