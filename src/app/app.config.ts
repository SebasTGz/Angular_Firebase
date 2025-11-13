import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withFetch()),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(
      { 
        projectId: "rapiserv-792e0", 
        appId: "1:548840231133:web:48a71a55feb3f376570b34", 
        storageBucket: "rapiserv-792e0.firebasestorage.app", 
        apiKey: "AIzaSyB5OKbECdMCxJwndSe0EmEKQFiy_d0t8rk", 
        authDomain: "rapiserv-792e0.firebaseapp.com", 
        messagingSenderId: "548840231133", 
      })),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ]
};
