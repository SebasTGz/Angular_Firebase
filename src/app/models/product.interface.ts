// //products nativos antes de modificarlos a los nuevos
// export interface Product {
//   id: string;
//   nombre: string;
//   descripcion: string;
//   precio: string;
//   categoria: string;
//   subcategoria: string;
//   fechaCreacion: string;
//   fechaActualizacion: string;
//   creadoPor: string;
//   actualizadoPor: string;
// }

// export interface CartItem {
//   product: Product;
//   quantity: number;
// }

// export interface CartDocument {
//   userId: string;
//   items: CartItem[];
//   createdAt: Date;
//   updatedAt: Date;
// }

//NUEVOS
export interface Carro {
  id: string;
  marca: string;
  modelo: string;
  color: string;
  anio: string; //puede ser string
  precio: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  creadoPor: string;
  actualizadoPor: string;
}

export interface CartItem {
  product: Carro;
  quantity: number;
}

export interface CartDocument {
  userId: string;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderStatus {
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  updatedAt: Date;
  updatedBy?: string;
}

export interface Order {
  id?: string;
  orderId: string;
  userId: string;
  userEmail: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentMethod: 'cash' | 'card' | 'online';
  deliveryAddress?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Respuesta del Lambda AWS
export interface LambdaCarros {
  id: string;
  marca: string;
  modelo: string;
  color: string;
  anio: string | number;
  precio: string | number;
  fechaCreacion: string | Date; 
  fechaActualizacion: string | Date;
  creadoPor: string;
  actualizadoPor: string;
}

export interface LambdaResponse {
  statusCode: number;
  body: {
    products?: LambdaCarros[];
    message?: string;
  };
}