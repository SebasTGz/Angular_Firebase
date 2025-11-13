import { Injectable, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, User, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly auth: Auth = inject(Auth);
  private readonly router = inject(Router);

  signIn(email: string, password: string): Observable<User> {
    return from(signInWithEmailAndPassword(this.auth, email, password).then((userCredential) => {
      return userCredential.user;
    }));
  }

  signUp(email: string, password: string): Observable<User> {
    return from(createUserWithEmailAndPassword(this.auth, email, password).then((userCredential) => {
      return userCredential.user;
    }));
  }

  logout(): Observable<void> {
    return from(signOut(this.auth));
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }
}

