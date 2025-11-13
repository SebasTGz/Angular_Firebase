import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductSeedService } from '../../services/product-seed.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private readonly productSeedService = inject(ProductSeedService);

  protected readonly restaurantName = 'ToliCars';
  protected readonly tagline = 'Tu mejor opción en alquiler & compra de vehículos';
  protected readonly currentYear = new Date().getFullYear();
  protected readonly isSeeding = false;

  protected async seedProducts(): Promise<void> {
    if (this.isSeeding) {
      return;
    }

    const confirmed = confirm('¿Deseas agregar 45 productos de ejemplo a Firestore?\n\nNOTA: Debes estar autenticado para realizar esta acción.\n\nEsto solo se ejecutará si la colección está vacía.');
    
    if (!confirmed) {
      return;
    }

    try {
      await this.productSeedService.seedProducts();
      alert('✅ Productos agregados exitosamente a Firestore');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Error seeding products:', error);
      
      if (errorMessage.includes('Debes iniciar sesión')) {
        alert(`❌ ${errorMessage}\n\nPor favor, inicia sesión primero y luego intenta de nuevo.`);
      } else {
        alert(`❌ Error al agregar productos: ${errorMessage}`);
      }
    }
  }
}

