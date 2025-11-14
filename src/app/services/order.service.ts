import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, setDoc, getDocs, query, where, orderBy, Timestamp } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Order, CartItem } from '../models/product.interface';
import { Observable, from } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private readonly firestore = inject(Firestore);
    private readonly authService = inject(AuthService);
    private readonly ordersCollection = 'orders';

/*Crea una nueva orden en Firestore*/
async createOrder(
    items: CartItem[],
    paymentMethod: 'cash' | 'card' | 'online',
    deliveryAddress?: string,
    notes?: string
): Promise<string> {
    const user = this.authService.getCurrentUser();
    
    if (!user || !user.email) {
        throw new Error('Usuario no autenticado');
    }

    if (items.length === 0) {
        throw new Error('El carrito está vacío');
    }

    const ordersRef = collection(this.firestore, this.ordersCollection);
    const orderDoc = doc(ordersRef);
    
    const subtotal = items.reduce((total, item) => {
      return total + (parseFloat(item.product.precio) * item.quantity);
    }, 0);

    const tax = subtotal * 0.16; // IVA 16%
    const total = subtotal + tax;

    const now = new Date();
    const orderId = `ORD-${Date.now()}-${user.uid.slice(0, 6).toUpperCase()}`;

    const order: Order = {
        orderId,
        userId: user.uid,
        userEmail: user.email,
        items,
        subtotal,
        tax,
        total,
        status: {
            status: 'pending',
            updatedAt: now
        },
        paymentMethod,
        deliveryAddress,
        notes,
        createdAt: now,
        updatedAt: now
    };

    try {
        await setDoc(orderDoc, {
        ...order,
        id: orderDoc.id,
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now),
        'status.updatedAt': Timestamp.fromDate(now)
    });

        console.log('✅ Orden creada exitosamente:', orderId);
        return orderId;
    } catch (error) {
      console.error('❌ Error al crear orden:', error);
      // Propagar mensaje de error original para ayudar en debugging
      const originalMessage = (error && (error as any).message) ? (error as any).message : 'Error interno de Firestore';
      throw new Error(`No se pudo crear la orden. ${originalMessage}`);
    }
    }

/* Obtiene todas las órdenes de un usuario */
  async getUserOrders(): Promise<Order[]> {
    const user = this.authService.getCurrentUser();
    
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    try {
      const ordersRef = collection(this.firestore, this.ordersCollection);
      const q = query(
        ordersRef,
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const orders: Order[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        orders.push({
          id: doc.id,
          ...data,
          createdAt: data['createdAt'].toDate(),
          updatedAt: data['updatedAt'].toDate(),
          status: {
            ...data['status'],
            updatedAt: data['status'].updatedAt.toDate()
          }
        } as Order);
      });

      return orders;
    } catch (error) {
      console.error('Error al obtener órdenes:', error);
      throw new Error('No se pudieron cargar las órdenes');
    }
  }

/* Obtiene una orden específica por ID*/
  async getOrderById(orderId: string): Promise<Order | null> {
    const user = this.authService.getCurrentUser();
    
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    try {
      const ordersRef = collection(this.firestore, this.ordersCollection);
      const q = query(
        ordersRef,
        where('orderId', '==', orderId),
        where('userId', '==', user.uid)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      const data = doc.data();

      return {
        id: doc.id,
        ...data,
        createdAt: data['createdAt'].toDate(),
        updatedAt: data['updatedAt'].toDate(),
        status: {
            ...data['status'],
            updatedAt: data['status'].updatedAt.toDate()
        }
        } as Order;
    } catch (error) {
        console.error('Error al obtener orden:', error);
        throw new Error('No se pudo cargar la orden');
    }
}

/* Formatea el total de la orden*/
    formatTotal(total: number): string {
    return `$${total.toFixed(2)}`;
    }

/*Obtiene el texto del estado*/
getStatusText(status: string): string {
    const statusMap: Record<string, string> = {
        pending: 'Pendiente',
        confirmed: 'Confirmado',
        preparing: 'En preparación',
        ready: 'Listo',
        delivered: 'Entregado',
        cancelled: 'Cancelado'
    };

    return statusMap[status] || status;
    }
}
