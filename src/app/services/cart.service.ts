import { Injectable, inject, signal, effect } from '@angular/core';
import { Firestore, collection, doc, setDoc, getDoc, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { CartItem, Carro, CartDocument } from '../models/product.interface';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly firestore = inject(Firestore);
  private readonly authService = inject(AuthService);
  private readonly cartItems = signal<CartItem[]>([]);
  private readonly isLoading = signal(false);
  private readonly cartCollection = 'carts';

  private saveTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    // Cargar carrito cuando el componente se inicialice si hay usuario
    const user = this.authService.getCurrentUser();
    if (user) {
      this.loadCartFromFirestore();
    }
  }

  getCartItems() {
    return this.cartItems.asReadonly();
  }

  getIsLoading() {
    return this.isLoading.asReadonly();
  }

  getCartItemCount() {
    return this.cartItems().reduce((total, item) => total + item.quantity, 0);
  }

  getCartTotal() {
    return this.cartItems().reduce((total, item) => {
      const price = parseFloat(item.product.precio);
      return total + (price * item.quantity);
    }, 0);
  }

  async addToCart(product: Carro, quantity: number = 1): Promise<void> {
    const currentItems = this.cartItems();
    const existingItem = currentItems.find(item => item.product.id === product.id);

    if (existingItem) {
      await this.updateQuantity(product.id, existingItem.quantity + quantity);
    } else {
      this.cartItems.set([...currentItems, { product, quantity }]);
      this.scheduleSave();
    }
  }

  async removeFromCart(productId: string): Promise<void> {
    this.cartItems.set(this.cartItems().filter(item => item.product.id !== productId));
    this.scheduleSave();
  }

  async updateQuantity(productId: string, quantity: number): Promise<void> {
    if (quantity <= 0) {
      await this.removeFromCart(productId);
      return;
    }

    this.cartItems.set(
      this.cartItems().map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
    this.scheduleSave();
  }

  async clearCart(): Promise<void> {
    this.cartItems.set([]);
    const user = this.authService.getCurrentUser();
    if (user) {
      await this.deleteCartFromFirestore();
    }
  }

  isCartEmpty(): boolean {
    return this.cartItems().length === 0;
  }

  private async saveCartToFirestore(): Promise<void> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      return;
    }

    try {
      this.isLoading.set(true);
      const cartRef = doc(this.firestore, this.cartCollection, user.uid);
      const cartSnap = await getDoc(cartRef);
      
      const now = new Date();
      const cartData: Partial<CartDocument> = {
        userId: user.uid,
        items: this.cartItems(),
        updatedAt: now
      };

      // Si no existe, agregar createdAt, si existe, mantener el original
      if (!cartSnap.exists()) {
        cartData.createdAt = now;
      }

      await setDoc(cartRef, cartData, { merge: true });
    } catch (error) {
      console.error('Error saving cart to Firestore:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  async loadCartFromFirestore(): Promise<void> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.cartItems.set([]);
      return;
    }

    try {
      this.isLoading.set(true);
      const cartRef = doc(this.firestore, this.cartCollection, user.uid);
      const cartSnap = await getDoc(cartRef);

      if (cartSnap.exists()) {
        const cartData = cartSnap.data();
        // Convertir las fechas de Firestore Timestamp a Date si es necesario
        const items = cartData['items'] || [];
        this.cartItems.set(items);
      } else {
        this.cartItems.set([]);
      }
    } catch (error) {
      console.error('Error loading cart from Firestore:', error);
      this.cartItems.set([]);
    } finally {
      this.isLoading.set(false);
    }
  }

  private async deleteCartFromFirestore(): Promise<void> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      return;
    }

    try {
      const cartRef = doc(this.firestore, this.cartCollection, user.uid);
      await deleteDoc(cartRef);
    } catch (error) {
      console.error('Error deleting cart from Firestore:', error);
    }
  }

  private scheduleSave(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      return;
    }

    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }

    this.saveTimeout = setTimeout(() => {
      this.saveCartToFirestore();
    }, 1000); // Guardar después de 1 segundo de inactividad
  }

  // Método público para cargar el carrito cuando el usuario se autentique
  async onUserLogin(): Promise<void> {
    await this.loadCartFromFirestore();
  }

  // Método público para limpiar el carrito cuando el usuario cierre sesión
  onUserLogout(): void {
    this.cartItems.set([]);
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
  }
}

