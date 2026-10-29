# Portal Transaccional - Frontend (Angular)

Frontend corporativo desarrollado con **Angular 18+** bajo una arquitectura basada en componentes y flujos reactivos, diseñado para interactuar con la API REST de Spring Boot bajo políticas de seguridad Zero Trust y mitigación de IDOR.

## 🚀 Requisitos Técnicos

* **Node.js**: v18.x o superior
* **Angular CLI**: v18+
* **Gestor de paquetes**: npm

## ⚙️ Configuración y Ejecución Local

1. Clona el repositorio e instala las dependencias:
```bash
   npm install
   ng serve
```

Accede a la aplicación desde tu navegador en: http://localhost:4200

## Arquitectura de Seguridad y Comunicación

  Interceptores HTTP (authInterceptor): Inyecta automáticamente el token JWT Bearer (Authorization: Bearer <token>) en las cabeceras de las peticiones hacia la API protegida.

  Manejo de Sesión: Stateless, consumiendo endpoints seguros con validación de tipo y número de documento por parte del backend.
