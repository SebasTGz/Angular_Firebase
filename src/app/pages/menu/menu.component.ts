// //ANTIGUO
// import { Component, OnInit, signal, inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterLink } from '@angular/router';
// import { ProductService } from '../../services/product.service';
// import { CartService } from '../../services/cart.service';
// import { Product } from '../../models/product.interface';

// @Component({
//   selector: 'app-menu',
//   standalone: true,
//   imports: [CommonModule, RouterLink],
//   templateUrl: './menu.component.html',
//   styleUrl: './menu.component.css'
// })
// export class MenuComponent implements OnInit {
//   private readonly productService = inject(ProductService);
//   private readonly cartService = inject(CartService);

//   protected readonly products = signal<Product[]>([]);
//   protected readonly loading = signal(false);
//   protected readonly errorMessage = signal<string | null>(null);
//   protected readonly categories = signal<string[]>([]);
//   protected readonly selectedCategory = signal<string>('TODOS');
//   protected readonly searchTerm = signal<string>('');

//   ngOnInit(): void {
//     this.loadProducts();
//   }

//   protected loadProducts(): void {
//     this.loading.set(true);
//     this.errorMessage.set(null);

//     this.productService.getProducts().subscribe({
//       next: (products) => {
//         this.products.set(products);
//         const uniqueCategories = Array.from(new Set(products.map(p => p.categoria)));
//         this.categories.set(['TODOS', ...uniqueCategories]);
//         this.loading.set(false);
//       },
//       error: (error) => {
//         this.errorMessage.set('Error al cargar los productos. Por favor, intenta de nuevo.');
//         this.loading.set(false);
//         console.error('Error loading products:', error);
//       }
//     });
//   }

//   protected getFilteredProducts(): Product[] {
//     let filtered = this.products();

//     if (this.selectedCategory() !== 'TODOS') {
//       filtered = filtered.filter(p => p.categoria === this.selectedCategory());
//     }

//     if (this.searchTerm()) {
//       const search = this.searchTerm().toLowerCase();
//       filtered = filtered.filter(p =>
//         p.nombre.toLowerCase().includes(search) ||
//         p.descripcion.toLowerCase().includes(search)
//       );
//     }

//     return filtered;
//   }

//   protected selectCategory(category: string): void {
//     this.selectedCategory.set(category);
//   }

//   protected onSearchChange(searchTerm: string): void {
//     this.searchTerm.set(searchTerm);
//   }

//   protected async addToCart(product: Product): Promise<void> {
//     await this.cartService.addToCart(product, 1);
//   }

//   protected getCartItemCount(): number {
//     return this.cartService.getCartItemCount();
//   }

//   protected formatPrice(price: string): string {
//     return `$${parseFloat(price).toFixed(2)}`;
//   }
// }

//NUEVO
import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Carro } from '../../models/product.interface';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);

  protected readonly products = signal<Carro[]>([]);
  protected readonly loading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly categories = signal<string[]>([]);
  protected readonly selectedCategory = signal<string>('TODOS');
  protected readonly searchTerm = signal<string>('');
  protected readonly useAwsLambda = signal(true);

  ngOnInit(): void {
    // sincronizar el estado local con el servicio y luego cargar productos
    this.productService.setDataSource(this.useAwsLambda());
    this.loadProducts();
  }

  protected loadProducts(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products.set(products);
          const uniqueCategories = Array.from(new Set(products.map(p => p.marca)));
          this.categories.set(['TODOS', ...uniqueCategories]);
        this.loading.set(false);
      },
      error: (error) => {
        this.errorMessage.set('Error al cargar los productos. Por favor, intenta de nuevo.');
        this.loading.set(false);
        console.error('Error loading products:', error);
      }
    });
  }

  protected toggleDataSource(): void {
    const newValue = !this.useAwsLambda();
    this.useAwsLambda.set(newValue);
    this.productService.setDataSource(newValue);
    
    const source = newValue ? 'AWS Lambda' : 'Firestore';
    alert(`Cambiando fuente de datos a: ${source}`);
    
    this.loadProducts();
  }

  protected getFilteredProducts(): Carro[] {
    let filtered = this.products();

    if (this.selectedCategory() !== 'TODOS') {
      filtered = filtered.filter(p => p.marca === this.selectedCategory());
    }

    if (this.searchTerm()) {
      const search = this.searchTerm().toLowerCase();
      filtered = filtered.filter(p =>
        p.marca.toLowerCase().includes(search) ||
        p.anio.toLowerCase().includes(search)
      );
    }

    return filtered;
  }

  protected selectCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  protected onSearchChange(searchTerm: string): void {
    this.searchTerm.set(searchTerm);
  }

  protected async addToCart(product: Carro): Promise<void> {
    await this.cartService.addToCart(product, 1);
    alert(`✅ ${product.marca} agregado al carrito`);
  }

  protected getCartItemCount(): number {
    return this.cartService.getCartItemCount();
  }

  protected formatPrice(price: string): string {
    return `$${parseFloat(price).toFixed(2)}`;
  }

  protected getDataSourceText(): string {
    return this.useAwsLambda() ? 'AWS Lambda' : 'Firestore';
  }

  protected getDataSourceIcon(): string {
    return this.useAwsLambda() ? '☁️' : '🔥';
  }
}