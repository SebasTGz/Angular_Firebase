import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, catchError, map } from 'rxjs';
import { LambdaCarros, Carro } from '../models/product.interface';

@Injectable({
    providedIn: 'root'
})
export class AwsLambdaService {
    private readonly http = inject(HttpClient);

  // IMPORTANTE: Es mi endpoint de AWS Lambda
    private readonly LAMBDA_ENDPOINT = 'https://swa2041vsd.execute-api.us-east-1.amazonaws.com/default/api/coleccion';

    /** Obtiene productos desde AWS Lambda*/
    getProductsFromLambda(): Observable<Carro[]> {
    return this.http.get<any>(this.LAMBDA_ENDPOINT).pipe(
        map(response => {
            console.debug('AWS Lambda raw response:', response);

            // Normalizar distintos formatos de respuesta posibles:
            // - Array directo: [{...}, ...]
            // - { products: [...] }
            // - { body: '...json...' } o { body: { products: [...] } }
            let lambdaProducts: LambdaCarros[] = [];

            if (Array.isArray(response)) {
                lambdaProducts = response;
            } else if (response?.products) {
                lambdaProducts = response.products;
            } else if (response?.body) {
                const body = typeof response.body === 'string' ? JSON.parse(response.body) : response.body;
                if (Array.isArray(body)) {
                    lambdaProducts = body;
                } else if (body?.products) {
                    lambdaProducts = body.products;
                }
            } else if (response?.body?.products) {
                lambdaProducts = response.body.products;
            }

            return this.transformLambdaProducts(lambdaProducts || []);
        }),
        catchError(this.handleError)
    );
}

/* Obtiene un producto específico por ID */
getProductByIdFromLambda(id: string): Observable<Carro> {
    return this.http.get<any>(`${this.LAMBDA_ENDPOINT}/${id}`).pipe(
        map(response => {
            console.debug(`AWS Lambda raw response for id=${id}:`, response);

            // Manejar formatos: objeto directo, { body: '...'}, { products: [...] }
            let lambdaProduct: LambdaCarros | undefined;

            if (response && !response.body && !response.products) {
                // probable objeto directo
                lambdaProduct = response as LambdaCarros;
            } else if (response?.products && Array.isArray(response.products)) {
                lambdaProduct = response.products[0];
            } else if (response?.body) {
                const body = typeof response.body === 'string' ? JSON.parse(response.body) : response.body;
                if (body && !Array.isArray(body)) {
                    lambdaProduct = body as LambdaCarros;
                } else if (Array.isArray(body)) {
                    lambdaProduct = body[0];
                } else if (body?.products && Array.isArray(body.products)) {
                    lambdaProduct = body.products[0];
                }
            }

            if (!lambdaProduct) {
                throw new Error('Producto no encontrado en la respuesta de Lambda');
            }

            return this.transformLambdaProduct(lambdaProduct);
        }),
        catchError(this.handleError)
    );
}

/* Transforma productos de Lambda a formato de la app*/
    private transformLambdaProducts(lambdaProducts: LambdaCarros[]): Carro[] {
        return lambdaProducts.map(product => this.transformLambdaProduct(product));
}

    /* Transforma un producto individual*/
    private transformLambdaProduct(lambdaProduct: LambdaCarros): Carro {
    return {
        id: lambdaProduct.id,
        marca: lambdaProduct.marca,
        modelo: lambdaProduct.modelo,
        color: lambdaProduct.color,
        anio: typeof lambdaProduct.anio === 'number' 
        ? lambdaProduct.anio.toString() 
        : lambdaProduct.anio,
        precio: typeof lambdaProduct.precio === 'number' 
        ? lambdaProduct.precio.toString() 
        : lambdaProduct.precio,
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        creadoPor: 'AWS_LAMBDA',
        actualizadoPor: 'AWS_LAMBDA'
    };
}

/* Manejo de errores HTTP*/
private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Error desconocido al conectar con el servidor';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
        errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
        errorMessage = `Código de error: ${error.status}, Mensaje: ${error.message}`;
    }

    console.error('Error en AWS Lambda Service:', errorMessage);
    return throwError(() => new Error(errorMessage));
    }
}