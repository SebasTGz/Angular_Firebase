// //ANTIGUO CÓDIGO
// import { Component, OnInit, signal, inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Router, RouterLink } from '@angular/router';
// import { CartService } from '../../services/cart.service';
// import { CartItem } from '../../models/product.interface';

// @Component({
//   selector: 'app-cart',
//   standalone: true,
//   imports: [CommonModule, RouterLink],
//   templateUrl: './cart.component.html',
//   styleUrl: './cart.component.css'
// })
// export class CartComponent implements OnInit {
//   private readonly cartService = inject(CartService);
//   private readonly router = inject(Router);

//   protected readonly cartItems = signal<CartItem[]>([]);
//   protected readonly cartTotal = signal(0);
//   protected readonly isLoading = signal(false);

//   ngOnInit(): void {
//     this.loadCart();
//   }

//   private loadCart(): void {
//     const items = this.cartService.getCartItems()();
//     this.cartItems.set(items);
//     this.cartTotal.set(this.cartService.getCartTotal());
//   }

//   protected async updateQuantity(productId: string, quantity: number): Promise<void> {
//     await this.cartService.updateQuantity(productId, quantity);
//     this.loadCart();
//   }

//   protected async removeItem(productId: string): Promise<void> {
//     await this.cartService.removeFromCart(productId);
//     this.loadCart();
//   }

//   protected async clearCart(): Promise<void> {
//     await this.cartService.clearCart();
//     this.loadCart();
//   }

//   protected formatPrice(price: string): string {
//     return `$${parseFloat(price).toFixed(2)}`;
//   }

//   protected formatTotal(total: number): string {
//     return `$${total.toFixed(2)}`;
//   }

//   protected async checkout(): Promise<void> {
//     if (this.cartItems().length === 0) {
//       return;
//     }

//     this.isLoading.set(true);
    
//     // Aquí puedes implementar la lógica de checkout
//     // Por ejemplo, crear una orden en el backend
    
//     setTimeout(() => {
//       this.isLoading.set(false);
//       alert('¡Pedido realizado exitosamente!');
//       this.clearCart();
//       this.router.navigate(['/home']);
//     }, 2000);
//   }

//   protected getItemSubtotal(item: CartItem): number {
//     return parseFloat(item.product.precio) * item.quantity;
//   }

//   protected formatSubtotal(subtotal: number): string {
//     return `$${subtotal.toFixed(2)}`;
//   }
// }

//NUEVO CÓDIGO
import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { CartItem } from '../../models/product.interface';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly orderService = inject(OrderService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  protected readonly cartItems = signal<CartItem[]>([]);
  protected readonly cartTotal = signal(0);
  protected readonly isLoading = signal(false);
  protected readonly showCheckoutForm = signal(false);
  protected readonly orderSuccess = signal(false);
  protected readonly orderNumber = signal('');

  protected readonly checkoutForm: FormGroup;

  constructor() {
    this.checkoutForm = this.fb.group({
      paymentMethod: ['cash', Validators.required],
      deliveryAddress: ['', Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.loadCart();
  }

  private loadCart(): void {
    const items = this.cartService.getCartItems()();
    this.cartItems.set(items);
    this.cartTotal.set(this.cartService.getCartTotal());
  }

  protected async updateQuantity(productId: string, quantity: number): Promise<void> {
    await this.cartService.updateQuantity(productId, quantity);
    this.loadCart();
  }

  protected async removeItem(productId: string): Promise<void> {
    await this.cartService.removeFromCart(productId);
    this.loadCart();
  }

  protected async clearCart(): Promise<void> {
    if (!confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
      return;
    }
    
    await this.cartService.clearCart();
    this.loadCart();
  }

  protected formatPrice(price: string): string {
    return `$${parseFloat(price).toFixed(2)}`;
  }

  protected formatTotal(total: number): string {
    return `$${total.toFixed(2)}`;
  }

  protected getTax(): number {
    return this.cartTotal() * 0.16; // IVA 16%
  }

  protected getFinalTotal(): number {
    return this.cartTotal() + this.getTax();
  }

  protected toggleCheckoutForm(): void {
    this.showCheckoutForm.set(!this.showCheckoutForm());
  }

  protected async checkout(): Promise<void> {
    if (this.cartItems().length === 0) {
      alert('El carrito está vacío');
      return;
    }

    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    this.isLoading.set(true);

    try {
      const { paymentMethod, deliveryAddress, notes } = this.checkoutForm.value;

      const orderId = await this.orderService.createOrder(
        this.cartItems(),
        paymentMethod,
        deliveryAddress,
        notes
      );

      this.orderNumber.set(orderId);
      this.orderSuccess.set(true);
      
      // Limpiar carrito después de crear la orden
      await this.cartService.clearCart();
      this.loadCart();

      // Redirigir después de 3 segundos
      setTimeout(() => {
        this.router.navigate(['/home']);
      }, 3000);

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Error al crear orden:', error);
      alert(`❌ Error al procesar el pedido: ${errorMessage}`);
    } finally {
      this.isLoading.set(false);
    }
  }

  protected getItemSubtotal(item: CartItem): number {
    return parseFloat(item.product.precio) * item.quantity;
  }

  protected formatSubtotal(subtotal: number): string {
    return `$${subtotal.toFixed(2)}`;
  }

  protected getFieldError(fieldName: string): string | null {
    const field = this.checkoutForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return 'Este campo es requerido';
      }
    }
    return null;
  }
}