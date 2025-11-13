import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, setDoc, getDocs } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Product } from '../models/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductSeedService {
  private readonly firestore = inject(Firestore);
  private readonly authService = inject(AuthService);
  private readonly productsCollection = 'products';

  async seedProducts(): Promise<void> {
    // Verificar si el usuario está autenticado
    const user = this.authService.getCurrentUser();
    if (!user) {
      throw new Error('Debes iniciar sesión para agregar productos. Por favor, inicia sesión primero.');
    }

    const productsRef = collection(this.firestore, this.productsCollection);
    const snapshot = await getDocs(productsRef);

    // Solo poblar si la colección está vacía
    if (!snapshot.empty) {
      console.log('La colección de productos ya tiene datos. Saltando seed.');
      return;
    }

    const sampleProducts: Omit<Product, 'id'>[] = [
      // BEBIDAS - GASEOSAS
      {
        nombre: 'Coca Cola',
        descripcion: 'Refresco de cola 500ml',
        precio: '1.50',
        categoria: 'BEBIDAS',
        subcategoria: 'GASEOSAS',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        creadoPor: 'SYSTEM',
        actualizadoPor: 'SYSTEM'
      },
      {
        nombre: 'Coca Cola Zero',
        descripcion: 'Coca Cola sin azúcar 500ml',
        precio: '1.50',
        categoria: 'BEBIDAS',
        subcategoria: 'GASEOSAS',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        creadoPor: 'SYSTEM',
        actualizadoPor: 'SYSTEM'
      },
      {
        nombre: 'Pepsi',
        descripcion: 'Refresco de cola 500ml',
        precio: '1.50',
        categoria: 'BEBIDAS',
        subcategoria: 'GASEOSAS',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        creadoPor: 'SYSTEM',
        actualizadoPor: 'SYSTEM'
      },
      {
        nombre: 'Fanta Naranja',
        descripcion: 'Refresco de naranja 500ml',
        precio: '1.50',
        categoria: 'BEBIDAS',
        subcategoria: 'GASEOSAS',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        creadoPor: 'SYSTEM',
        actualizadoPor: 'SYSTEM'
      },
      {
        nombre: 'Sprite',
        descripcion: 'Refresco de lima-limón 500ml',
        precio: '1.50',
        categoria: 'BEBIDAS',
        subcategoria: 'GASEOSAS',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        creadoPor: 'SYSTEM',
        actualizadoPor: 'SYSTEM'
      },
      {
        nombre: '7UP',
        descripcion: 'Refresco de lima-limón 500ml',
        precio: '1.50',
        categoria: 'BEBIDAS',
        subcategoria: 'GASEOSAS',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        creadoPor: 'SYSTEM',
        actualizadoPor: 'SYSTEM'
      },
      // BEBIDAS - JUGOS
      {
        nombre: 'Jugo de Naranja Natural',
        descripcion: 'Jugo fresco de naranja 300ml',
        precio: '2.50',
        categoria: 'BEBIDAS',
        subcategoria: 'JUGOS',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        creadoPor: 'SYSTEM',
        actualizadoPor: 'SYSTEM'
      },
      {
        nombre: 'Jugo de Manzana',
        descripcion: 'Jugo de manzana 300ml',
        precio: '2.50',
        categoria: 'BEBIDAS',
        subcategoria: 'JUGOS',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        creadoPor: 'SYSTEM',
        actualizadoPor: 'SYSTEM'
      },
      {
        nombre: 'Jugo de Piña',
        descripcion: 'Jugo natural de piña 300ml',
        precio: '2.50',
        categoria: 'BEBIDAS',
        subcategoria: 'JUGOS',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        creadoPor: 'SYSTEM',
        actualizadoPor: 'SYSTEM'
      },
      {
        nombre: 'Jugo de Mango',
        descripcion: 'Jugo natural de mango 300ml',
        precio: '2.75',
        categoria: 'BEBIDAS',
        subcategoria: 'JUGOS',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        creadoPor: 'SYSTEM',
        actualizadoPor: 'SYSTEM'
      },
      // BEBIDAS - CAFÉ
      {
        nombre: 'Café Expresso',
        descripcion: 'Café expresso italiano',
        precio: '2.00',
        categoria: 'BEBIDAS',
        subcategoria: 'CAFÉ',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        creadoPor: 'SYSTEM',
        actualizadoPor: 'SYSTEM'
      },
      {
        nombre: 'Café Americano',
        descripcion: 'Café americano grande',
        precio: '2.50',
        categoria: 'BEBIDAS',
        subcategoria: 'CAFÉ',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        creadoPor: 'SYSTEM',
        actualizadoPor: 'SYSTEM'
      },
      {
        nombre: 'Capuccino',
        descripcion: 'Capuccino con espuma de leche y canela',
        precio: '3.50',
        categoria: 'BEBIDAS',
        subcategoria: 'CAFÉ',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        creadoPor: 'SYSTEM',
        actualizadoPor: 'SYSTEM'
      },
      {
        nombre: 'Latte',
        descripcion: 'Café latte con leche vaporizada',
        precio: '3.75',
        categoria: 'BEBIDAS',
        subcategoria: 'CAFÉ',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        creadoPor: 'SYSTEM',
        actualizadoPor: 'SYSTEM'
      },
      {
        nombre: 'Mocha',
        descripcion: 'Café mocha con chocolate y crema',
        precio: '4.00',
        categoria: 'BEBIDAS',
        subcategoria: 'CAFÉ',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        creadoPor: 'SYSTEM',
        actualizadoPor: 'SYSTEM'
      },
      // PLATOS - ENTRADAS
      {
        nombre: 'Nachos con Queso',
        descripcion: 'Nachos crujientes con queso derretido y jalapeños',
        precio: '8.50',
        categoria: 'PLATOS',
        subcategoria: 'ENTRADAS',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        creadoPor: 'SYSTEM',
        actualizadoPor: 'SYSTEM'
      },
      {
        nombre: 'Aros de Cebolla',
        descripcion: 'Aros de cebolla empanizados con salsa especial',
        precio: '7.00',
        categoria: 'PLATOS',
        subcategoria: 'ENTRADAS',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        creadoPor: 'SYSTEM',
        actualizadoPor: 'SYSTEM'
      },
      {
        nombre: 'Palitos de Queso',
        descripcion: 'Palitos de queso mozzarella empanizados',
        precio: '7.50',
        categoria: 'PLATOS',
        subcategoria: 'ENTRADAS',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        creadoPor: 'SYSTEM',
        actualizadoPor: 'SYSTEM'
      },
      {
        nombre: 'Alitas de Pollo',
        descripcion: 'Alitas de pollo picantes con salsa BBQ',
        precio: '9.00',
        categoria: 'PLATOS',
        subcategoria: 'ENTRADAS',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        creadoPor: 'SYSTEM',
        actualizadoPor: 'SYSTEM'
      },
      {
        nombre: 'Dedos de Queso',
        descripcion: 'Dedos de queso mozzarella con salsa marinara',
        precio: '8.00',
        categoria: 'PLATOS',
        subcategoria: 'ENTRADAS',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        creadoPor: 'SYSTEM',
        actualizadoPor: 'SYSTEM'
      },
      {
        nombre: 'Ensalada César',
        descripcion: 'Ensalada fresca con pollo, crutones y aderezo césar',
        precio: '9.50',
        categoria: 'PLATOS',
        subcategoria: 'ENTRADAS',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        creadoPor: 'SYSTEM',
        actualizadoPor: 'SYSTEM'
      },
      // PLATOS - PRINCIPALES
      {
        nombre: 'Hamburguesa Clásica',
        descripcion: 'Hamburguesa con carne, lechuga, tomate, cebolla y papas fritas',
        precio: '12.50',
        categoria: 'PLATOS',
        subcategoria: 'PRINCIPALES',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        creadoPor: 'SYSTEM',
        actualizadoPor: 'SYSTEM'
      },
      {
        nombre: 'Hamburguesa BBQ',
        descripcion: 'Hamburguesa con salsa BBQ, bacon, cebolla caramelizada y papas',
        precio: '14.50',
        categoria: 'PLATOS',
        subcategoria: 'PRINCIPALES',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        creadoPor: 'SYSTEM',
        actualizadoPor: 'SYSTEM'
      },
      {
        nombre: 'Hamburguesa Doble Carne',
        descripcion: 'Hamburguesa con doble carne, queso, tocino y papas',
        precio: '16.00',
        categoria: 'PLATOS',
        subcategoria: 'PRINCIPALES',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        creadoPor: 'SYSTEM',
        actualizadoPor: 'SYSTEM'
      },
      {
        nombre: 'Hamburguesa Vegetariana',
        descripcion: 'Hamburguesa de vegetales con lechuga, tomate y papas',
        precio: '11.50',
        categoria: 'PLATOS',
        subcategoria: 'PRINCIPALES',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        creadoPor: 'SYSTEM',
        actualizadoPor: 'SYSTEM'
      },
      {
        nombre: 'Pizza Margherita',
        descripcion: 'Pizza clásica con tomate, mozzarella y albahaca',
        precio: '15.00',
        categoria: 'PLATOS',
        subcategoria: 'PRINCIPALES',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        creadoPor: 'SYSTEM',
        actualizadoPor: 'SYSTEM'
      },
      {
        nombre: 'Pizza Pepperoni',
        descripcion: 'Pizza con pepperoni, queso mozzarella y salsa de tomate',
        precio: '16.50',
        categoria: 'PLATOS',
        subcategoria: 'PRINCIPALES',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        creadoPor: 'SYSTEM',
        actualizadoPor: 'SYSTEM'
      },
      {
        nombre: 'Pizza Hawaiana',
        descripcion: 'Pizza con jamón, piña y queso mozzarella',
        precio: '17.00',
        categoria: 'PLATOS',
        subcategoria: 'PRINCIPALES',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        creadoPor: 'SYSTEM',
        actualizadoPor: 'SYSTEM'
      },
      {
        nombre: 'Pizza Cuatro Quesos',
        descripcion: 'Pizza con mozzarella, gorgonzola, parmesano y provolone',
        precio: '18.00',
        categoria: 'PLATOS',
        subcategoria: 'PRINCIPALES',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        creadoPor: 'SYSTEM',
        actualizadoPor: 'SYSTEM'
      },
      {
        nombre: 'Pasta Carbonara',
        descripcion: 'Pasta con salsa carbonara, bacon y queso parmesano',
        precio: '13.50',
        categoria: 'PLATOS',
        subcategoria: 'PRINCIPALES',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        creadoPor: 'SYSTEM',
        actualizadoPor: 'SYSTEM'
      },
      {
        nombre: 'Pasta Alfredo',
        descripcion: 'Pasta con salsa alfredo, pollo y champiñones',
        precio: '14.00',
        categoria: 'PLATOS',
        subcategoria: 'PRINCIPALES',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        creadoPor: 'SYSTEM',
        actualizadoPor: 'SYSTEM'
      },
      {
        nombre: 'Pasta Bolognesa',
        descripcion: 'Pasta con salsa bolognesa, carne molida y parmesano',
        precio: '14.50',
        categoria: 'PLATOS',
        subcategoria: 'PRINCIPALES',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        creadoPor: 'SYSTEM',
        actualizadoPor: 'SYSTEM'
      },
      {
        nombre: 'Lasagna',
        descripcion: 'Lasagna casera con carne, queso y salsa de tomate',
        precio: '15.50',
        categoria: 'PLATOS',
        subcategoria: 'PRINCIPALES',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        creadoPor: 'SYSTEM',
        actualizadoPor: 'SYSTEM'
      },
      {
        nombre: 'Pollo a la Parrilla',
        descripcion: 'Pechuga de pollo a la parrilla con vegetales y arroz',
        precio: '13.00',
        categoria: 'PLATOS',
        subcategoria: 'PRINCIPALES',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        creadoPor: 'SYSTEM',
        actualizadoPor: 'SYSTEM'
      },
      {
        nombre: 'Salmon a la Plancha',
        descripcion: 'Salmón fresco a la plancha con vegetales y puré',
        precio: '18.50',
        categoria: 'PLATOS',
        subcategoria: 'PRINCIPALES',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        creadoPor: 'SYSTEM',
        actualizadoPor: 'SYSTEM'
      },
      {
        nombre: 'Tacos de Carne',
        descripcion: 'Tacos de carne asada con cebolla, cilantro y salsa',
        precio: '11.00',
        categoria: 'PLATOS',
        subcategoria: 'PRINCIPALES',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        creadoPor: 'SYSTEM',
        actualizadoPor: 'SYSTEM'
      },
      {
        nombre: 'Burritos de Pollo',
        descripcion: 'Burritos grandes con pollo, frijoles, arroz y queso',
        precio: '12.00',
        categoria: 'PLATOS',
        subcategoria: 'PRINCIPALES',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        creadoPor: 'SYSTEM',
        actualizadoPor: 'SYSTEM'
      },
      // PLATOS - POSTRES
      {
        nombre: 'Brownie con Helado',
        descripcion: 'Brownie caliente con helado de vainilla y chocolate',
        precio: '6.50',
        categoria: 'PLATOS',
        subcategoria: 'POSTRES',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        creadoPor: 'SYSTEM',
        actualizadoPor: 'SYSTEM'
      },
      {
        nombre: 'Cheesecake',
        descripcion: 'Pastel de queso con frutos rojos',
        precio: '7.00',
        categoria: 'PLATOS',
        subcategoria: 'POSTRES',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        creadoPor: 'SYSTEM',
        actualizadoPor: 'SYSTEM'
      },
      {
        nombre: 'Flan Casero',
        descripcion: 'Flan casero con caramelo',
        precio: '5.50',
        categoria: 'PLATOS',
        subcategoria: 'POSTRES',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        creadoPor: 'SYSTEM',
        actualizadoPor: 'SYSTEM'
      },
      {
        nombre: 'Tres Leches',
        descripcion: 'Pastel tres leches con crema batida',
        precio: '6.00',
        categoria: 'PLATOS',
        subcategoria: 'POSTRES',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        creadoPor: 'SYSTEM',
        actualizadoPor: 'SYSTEM'
      },
      {
        nombre: 'Helado de Vainilla',
        descripcion: 'Helado de vainilla con toppings',
        precio: '4.50',
        categoria: 'PLATOS',
        subcategoria: 'POSTRES',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        creadoPor: 'SYSTEM',
        actualizadoPor: 'SYSTEM'
      },
      {
        nombre: 'Helado de Chocolate',
        descripcion: 'Helado de chocolate con nueces',
        precio: '4.50',
        categoria: 'PLATOS',
        subcategoria: 'POSTRES',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        creadoPor: 'SYSTEM',
        actualizadoPor: 'SYSTEM'
      },
      {
        nombre: 'Tarta de Manzana',
        descripcion: 'Tarta de manzana casera con canela',
        precio: '6.00',
        categoria: 'PLATOS',
        subcategoria: 'POSTRES',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        creadoPor: 'SYSTEM',
        actualizadoPor: 'SYSTEM'
      },
      {
        nombre: 'Mousse de Chocolate',
        descripcion: 'Mousse de chocolate oscuro con crema',
        precio: '5.75',
        categoria: 'PLATOS',
        subcategoria: 'POSTRES',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        creadoPor: 'SYSTEM',
        actualizadoPor: 'SYSTEM'
      }
    ];

    try {
      for (const product of sampleProducts) {
        const productRef = doc(productsRef);
        await setDoc(productRef, {
          ...product,
          id: productRef.id
        });
      }
      console.log(`✅ Se agregaron ${sampleProducts.length} productos a Firestore`);
    } catch (error) {
      console.error('Error al poblar productos:', error);
      throw error;
    }
  }
}

