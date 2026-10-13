# Fortnite Stats Tracker

Una aplicación web interactiva desarrollada con **Vanilla JavaScript** para consultar y guardar estadísticas de jugadores de Fortnite Battle Royale en tiempo real.

Proyecto final desarrollado como parte del programa de formación de **Academos** en colaboración con el programa de **Cisco Networking Academy** en los cursos JavaScript Essentials 1 & 2.


## Características

- **Consulta en tiempo real:** Conexión con la API pública de Fortnite (`Fortnite-API.com`) para obtener estadísticas generales.
- **Avatares dinámicos:** Selección aleatoria de skins de cosméticos mediante llamadas asíncronas concurrentes.
- **Lista de favoritos persistente:** Guardado y eliminación de jugadores en `localStorage` con renderizado reactivo en cuadrícula responsive.
- **POO con JavaScript moderno:** Modelado de datos a través de la clase `FornitePlayer` con métodos auxiliares para formateo de fechas locales y cálculo de horas jugadas.


## Tecnologías Utilizadas

- **JavaScript (ES6+)**: Clases, `async/await`, `fetch`, `Promise.all` y manipulación del DOM.
- **HTML5 & CSS3**: Estructura semántica, diseño con CSS Grid y transiciones.
- **Google Material Symbols**: Iconografía interactiva con soporte para estados variables (`bookmark`).
- **API Externa**: [Fortnite-API.com](https://fortnite-api.com/).


## Configuración e Instalación
No requiere herramientas de compilación ni dependencias externas.

### 1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/DaniDevGS/fortnite-stats-tracker.git
   cd fortnite-stats-tracker
   ```
---


### 2. **Obtener tu API Key:**
   - Ingresa a [Fortnite-API.com](https://fortnite-api.com/) e inicia sesión o regístrate gratis para generar tu API Key personal.
---

### 3. **Configurar las credenciales:**
   - Duplica o renombra el archivo `JS/config.example.js` como `JS/config.js`.
   - Abre `JS/config.js` y reemplaza `"TU_API_KEY_AQUI"` por tu clave:
     ```javascript
     const CONFIG = {
         FORTNITE_API_KEY: "TU_API_KEY_AQUI"
     };
     ```
---

### 4. **Ejecutar la aplicación:**
   Abre el archivo `index.html` en tu navegador o mediante la extensión **Live Server** en Visual Studio Code.

---