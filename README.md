# Portafolio Académico ITI-621 — Actividad 1

Este repositorio contiene el desarrollo del Portafolio Académico y Profesional para el curso 

**ITI-621 Tecnologías y Sistemas Web III**. 

El proyecto implementa una arquitectura desacoplada (Headless) donde **WordPress** se encarga de la estructura y el contenido estático, mientras que **JSON Server** actúa como una API REST que provee los datos dinámicos (habilidades, intereses y proyectos) que se renderizan en el sitio mediante JavaScript.

---

## Integrantes del Grupo
*   Mariangel Artavia Rojas
*   Barbara Garay
*   Naraly Trigueros 
*   Fabricio Venegas
*   Irvin Arce


## Tecnologías y Arquitectura Utilizada

La solución separa la administración del contenido de la exposición de los datos dinámicos:

*   **WordPress (LocalWP):** Gestión de páginas, tema, menú y contenido estático. Utiliza **PHP** para registrar un plugin personalizado y los *shortcodes* que incrustan las listas dinámicas.
*   **JSON Server:** API REST local que expone los recursos (`/habilidades`, `/intereses`, `/proyectos`) en formato JSON.
*   **JavaScript (Fetch API):** Consume los endpoints de JSON Server y genera el HTML dinámicamente en el navegador, incluyendo el manejo de errores si la API no está disponible.
*   **CSS3 (Grid & Flexbox):** Diseño visual, tarjetas (cards), sistema de colores, efectos *hover* y adaptabilidad total (Responsive Design).


## Guía para Reproducir el Proyecto (Entorno Local)

Sigue estos pasos para iniciar el proyecto desde cero:

### 1. Requisitos Previos
*   [Node.js](https://nodejs.org/) (versión LTS)
*   [LocalWP](https://localwp.com/) para el entorno de WordPress
*   Git (para clonar el repositorio)

### 2. Levantar la API (JSON Server)
Abre una terminal en la carpeta `api/` del proyecto y ejecuta:
```bash
# Instalar dependencias
npm install

# Iniciar el servidor
npm run api