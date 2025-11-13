import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/product.interface';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);

  protected readonly cartItems = signal<CartItem[]>([]);
  protected readonly cartTotal = signal(0);
  protected readonly isLoading = signal(false);

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
    await this.cartService.clearCart();
    this.loadCart();
  }

  protected formatPrice(price: string): string {
    return `$${parseFloat(price).toFixed(2)}`;
  }

  protected formatTotal(total: number): string {
    return `$${total.toFixed(2)}`;
  }

  protected async checkout(): Promise<void> {
    if (this.cartItems().length === 0) {
      return;
    }

    this.isLoading.set(true);
    
    // Aquí puedes implementar la lógica de checkout
    // Por ejemplo, crear una orden en el backend
    
    setTimeout(() => {
      this.isLoading.set(false);
      alert('¡Pedido realizado exitosamente!');
      this.clearCart();
      this.router.navigate(['/home']);
    }, 2000);
  }

  protected getItemSubtotal(item: CartItem): number {
    return parseFloat(item.product.precio) * item.quantity;
  }

  protected formatSubtotal(subtotal: number): string {
    return `$${subtotal.toFixed(2)}`;
  }
}

