import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdenesService, OrdenItem, OrdenesResponse } from './service/ordenes.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h2>Portal Transaccional - Consulta de Órdenes</h2>

      <!-- Formulario moderno -->
      <div class="search-box">
        <div class="form-group">
          <label>Tipo de Documento:</label>
          <select (change)="onTipoChange($event)">
            <option value="CC" [selected]="tipoDocumento() === 'CC'">Cédula de Ciudadanía (CC)</option>
            <option value="CE" [selected]="tipoDocumento() === 'CE'">Cédula de Extranjería (CE)</option>
            <option value="PAS" [selected]="tipoDocumento() === 'PAS'">Pasaporte (PAS)</option>
          </select>
        </div>

        <div class="form-group">
          <label>Número de Documento:</label>
          <input
            type="text"
            [value]="numeroDocumento()"
            (input)="onDocumentoInput($event)"
            placeholder="Ej: 123456"
          />
        </div>

        <button (click)="buscarOrdenes()" [disabled]="loading()">
          {{ loading() ? 'Consultando...' : 'Consultar Órdenes' }}
        </button>
      </div>

      <!-- Alerta de Error -->
      @if (errorMessage()) {
        <div class="error-message">
          ⚠️ {{ errorMessage() }}
        </div>
      }

      <!-- Resultados / Tabla -->
      @if (ordenes().length > 0) {
        <div class="results-container">
          <h3>Órdenes Encontradas</h3>
          <table>
            <thead>
              <tr>
                <th>ID de Orden</th>
                <th>Estado</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              @for (orden of ordenes(); track orden.id) {
                <tr>
                  <td>{{ orden.id }}</td>
                  <td><span class="badge">{{ orden.estado }}</span></td>
                  <td>{{ orden.fecha }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }

      <!-- Estado vacío -->
      @if (searched() && ordenes().length === 0 && !errorMessage()) {
        <div class="empty-message">
          No se encontraron órdenes asociadas al documento ingresado. (Prueba con la cédula: 123456)
        </div>
      }
    </div>
  `,
  styles: [`
    body { font-family: Arial, sans-serif; background-color: #f4f6f9; }
    .container { max-width: 600px; margin: 40px auto; padding: 25px; background: white; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
    h2 { color: #003366; text-align: center; margin-bottom: 25px; }
    .search-box { display: flex; flex-direction: column; gap: 15px; }
    .form-group { display: flex; flex-direction: column; gap: 5px; }
    label { font-weight: bold; color: #333; }
    select, input { padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px; }
    button { padding: 12px; background-color: #004080; color: white; border: none; border-radius: 4px; font-size: 16px; cursor: pointer; font-weight: bold; }
    button:hover { background-color: #003060; }
    button:disabled { background-color: #cccccc; cursor: not-allowed; }
    .error-message { margin-top: 20px; padding: 12px; background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; border-radius: 4px; }
    table { width: 100%; margin-top: 20px; border-collapse: collapse; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background-color: #004080; color: white; }
    .badge { background-color: #28a745; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
    .empty-message { margin-top: 20px; text-align: center; color: #666; font-style: italic; }
  `]
})
export class App {
  // Definimos el estado usando Signals de Angular moderno
  tipoDocumento = signal('CC');
  numeroDocumento = signal('123456');
  ordenes = signal<OrdenItem[]>([]);
  loading = signal(false);
  searched = signal(false);
  errorMessage = signal('');

  private readonly errorMessages: Record<number, string> = {
  400: 'Parámetros de consulta inválidos.',
  401: 'Sesión expirada o credenciales inválidas.',
  403: 'Acceso denegado: No tienes permisos para consultar este documento.',
  404: 'El recurso solicitado no fue encontrado.'
};

  constructor(private ordenesService: OrdenesService) {}

  onTipoChange(event: any) {
    this.tipoDocumento.set(event.target.value);
  }

  onDocumentoInput(event: any) {
    this.numeroDocumento.set(event.target.value);
  }

  buscarOrdenes() {
    if (!this.numeroDocumento().trim()) {
      this.errorMessage.set('El número de documento no puede estar vacío.');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');
    this.searched.set(false);
    this.ordenes.set([]);

    this.ordenesService.consultarOrdenes(this.tipoDocumento(), this.numeroDocumento()).subscribe({
      next: (response: OrdenesResponse) => {
        this.ordenes.set(response.ordenes);
        this.loading.set(false);
        this.searched.set(true);
      },
      error: (err) => {
        this.loading.set(false);
        this.searched.set(true);
        const message = this.errorMessages[err.status]
          || 'El servicio no se encuentra disponible temporalmente. Intente más tarde.';

        this.errorMessage.set(message);
      }
    });
  }
}
