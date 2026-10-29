import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// Definimos la estructura de los datos que nos devuelve el backend
export interface OrdenItem {
  id: string;
  estado: string;
  fecha: string;
}

export interface OrdenesResponse {
  ordenes: OrdenItem[];
}

@Injectable({
  providedIn: 'root'
})
export class OrdenesService {
  // La URL donde corre tu backend en Java
  private apiUrl = 'http://localhost:8080/api/v1/ordenes';

  constructor(private http: HttpClient) {}

  consultarOrdenes(tipoDocumento: string, numeroDocumento: string): Observable<OrdenesResponse> {

    const params = new HttpParams()
      .set('tipoDocumento', tipoDocumento)
      .set('numeroDocumento', numeroDocumento);

    // Ejecutamos la petición GET tipada
    return this.http.get<OrdenesResponse>(this.apiUrl, {params });
  }
}
