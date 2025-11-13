export interface Product {
  id: string;
  nombre: string;
  descripcion: string;
  precio: string;
  categoria: string;
  subcategoria: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  creadoPor: string;
  actualizadoPor: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartDocument {
  userId: string;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

