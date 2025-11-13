import { Component, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  protected readonly registerForm: FormGroup;
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly successMessage = signal<string | null>(null);

  private readonly cartService = inject(CartService);

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  private passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  protected async onSubmit(): Promise<void> {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const { firstName, lastName, email, password } = this.registerForm.value;

    try {
      await firstValueFrom(this.authService.signUp(email, password));
      
      // Cargar carrito del usuario después de registrarse
      await this.cartService.onUserLogin();
      
      // Aquí puedes guardar información adicional del usuario en Firestore si lo necesitas
      this.successMessage.set('¡Registro exitoso! Redirigiendo...');
      
      setTimeout(async () => {
        await this.router.navigate(['/home']);
      }, 1500);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error al registrar';
      this.errorMessage.set(errorMessage);
    } finally {
      this.isLoading.set(false);
    }
  }

  protected getFieldError(fieldName: string): string | null {
    const field = this.registerForm.get(fieldName);
    
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return 'Este campo es requerido';
      }
      if (field.errors['email']) {
        return 'Ingresa un email válido';
      }
      if (field.errors['minlength']) {
        if (fieldName === 'password') {
          return 'La contraseña debe tener al menos 6 caracteres';
        }
        return 'Mínimo 2 caracteres';
      }
      if (field.errors['pattern']) {
        return 'Ingresa un número de teléfono válido (10-15 dígitos)';
      }
    }
    
    return null;
  }

  protected getPasswordMatchError(): string | null {
    const confirmPassword = this.registerForm.get('confirmPassword');
    if (this.registerForm.errors?.['passwordMismatch'] && confirmPassword?.touched) {
      return 'Las contraseñas no coinciden';
    }
    return null;
  }
}

