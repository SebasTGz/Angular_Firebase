// //Product antiguo
// import { Injectable, inject } from '@angular/core';
// import { Firestore, collection, collectionData, doc, docData, query, where } from '@angular/fire/firestore';
// import { Observable } from 'rxjs';
// import { Product } from '../models/product.interface';

// @Injectable({
//   providedIn: 'root'
// })
// export class ProductService {
//   private readonly firestore = inject(Firestore);
//   private readonly productsCollection = 'products';

//   getProducts(): Observable<Product[]> {
//     const productsRef = collection(this.firestore, this.productsCollection);
//     return collectionData(productsRef, { idField: 'id' }) as Observable<Product[]>;
//   }

//   getProductById(id: string): Observable<Product | undefined> {
//     const productRef = doc(this.firestore, this.productsCollection, id);
//     return docData(productRef, { idField: 'id' }) as Observable<Product>;
//   }

//   getProductsByCategory(categoria: string): Observable<Product[]> {
//     const productsRef = collection(this.firestore, this.productsCollection);
//     const q = query(productsRef, where('categoria', '==', categoria));
//     return collectionData(q, { idField: 'id' }) as Observable<Product[]>;
//   }

//   getProductsBySubcategory(subcategoria: string): Observable<Product[]> {
//     const productsRef = collection(this.firestore, this.productsCollection);
//     const q = query(productsRef, where('subcategoria', '==', subcategoria));
//     return collectionData(q, { idField: 'id' }) as Observable<Product[]>;
//   }
// }

//Nuevo Product como Carro
import { Injectable, inject, signal } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Carro } from '../models/product.interface';  
import { AwsLambdaService } from './aws-lambda.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly firestore = inject(Firestore);
  private readonly awsLambdaService = inject(AwsLambdaService);
  private readonly productsCollection = 'products';
  // Flag para controlar el origen de datos (por defecto usar AWS Lambda)
  private readonly useAwsLambda = signal(true);

  /* Establece si se debe usar AWS Lambda o Firestore*/
  setDataSource(useAws: boolean): void {
    this.useAwsLambda.set(useAws);
  }

  /* Obtiene productos desde el origen configurado*/
  getProducts(): Observable<Carro[]> {
    if (this.useAwsLambda()) {
      console.log('📡 Obteniendo productos desde AWS Lambda...');
      return this.awsLambdaService.getProductsFromLambda().pipe(
        catchError(error => {
          console.warn('⚠️ Error en AWS Lambda, usando Firestore como fallback');
          return this.getProductsFromFirestore();
        })
      );
    }
    
    console.log('🔥 Obteniendo productos desde Firestore...');
    return this.getProductsFromFirestore();
  }

  /**
   * Obtiene productos desde Firestore
   */
  private getProductsFromFirestore(): Observable<Carro[]> {
    const productsRef = collection(this.firestore, this.productsCollection);
    return collectionData(productsRef, { idField: 'id' }) as Observable<Carro[]>;
  }

  /**
   * Obtiene un producto por ID
   */
  getProductById(id: string): Observable<Carro | undefined> {
    if (this.useAwsLambda()) {
      return this.awsLambdaService.getProductByIdFromLambda(id).pipe(
        catchError(() => this.getProductByIdFromFirestore(id))
      );
    }
    
    return this.getProductByIdFromFirestore(id);
  }

  /**
   * Obtiene un producto desde Firestore
   */
  private getProductByIdFromFirestore(id: string): Observable<Carro | undefined> {
    const productRef = doc(this.firestore, this.productsCollection, id);
    return docData(productRef, { idField: 'id' }) as Observable<Carro>;
  }

  /**
   * Obtiene productos por categoría
   */
  getProductsByCategory(categoria: string): Observable<Carro[]> {
    return this.getProducts().pipe(
      switchMap(products => {
        const filtered = products.filter(p => p.marca === categoria);
        return of(filtered);
      })
    );
  }

  /**
   * Obtiene productos por subcategoría
   */
  getProductsBySubcategory(subcategoria: string): Observable<Carro[]> {
    return this.getProducts().pipe(
      switchMap(products => {
        const filtered = products.filter(p => p.color === subcategoria);
        return of(filtered);
      })
    );
  }

/* Busca productos por texto*/
  searchProducts(searchTerm: string): Observable<Carro[]> {
    return this.getProducts().pipe(
      switchMap(products => {
        const term = searchTerm.toLowerCase();
        const filtered = products.filter(p =>
          p.marca.toLowerCase().includes(term) ||
          p.modelo.toLowerCase().includes(term)
        );
        return of(filtered);
      })
    );
  }
}