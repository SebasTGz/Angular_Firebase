import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Product } from '../models/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly firestore = inject(Firestore);
  private readonly productsCollection = 'products';

  getProducts(): Observable<Product[]> {
    const productsRef = collection(this.firestore, this.productsCollection);
    return collectionData(productsRef, { idField: 'id' }) as Observable<Product[]>;
  }

  getProductById(id: string): Observable<Product | undefined> {
    const productRef = doc(this.firestore, this.productsCollection, id);
    return docData(productRef, { idField: 'id' }) as Observable<Product>;
  }

  getProductsByCategory(categoria: string): Observable<Product[]> {
    const productsRef = collection(this.firestore, this.productsCollection);
    const q = query(productsRef, where('categoria', '==', categoria));
    return collectionData(q, { idField: 'id' }) as Observable<Product[]>;
  }

  getProductsBySubcategory(subcategoria: string): Observable<Product[]> {
    const productsRef = collection(this.firestore, this.productsCollection);
    const q = query(productsRef, where('subcategoria', '==', subcategoria));
    return collectionData(q, { idField: 'id' }) as Observable<Product[]>;
  }
}

