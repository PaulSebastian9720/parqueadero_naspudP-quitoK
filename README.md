# Universidad Politécnica Salesiana 
![ups-icc](https://github.com/PaulSebastianNaspud/estructura-u2-pratica3/assets/131235143/d8801de9-eea7-49f5-9594-fe27f5d55528)

# Programación y Plataformas Web

### Integrantes: 
- [PaulSebastianNaspud](https://github.com/PaulSebastianNaspud)  
- Correo: pnaspudv@est.ups.edu.ec
- [KarenS22](https://github.com/KarenS22)  
- Correo: ME LLAMO KAREN Y ME GUSTA LA DANNAESPINO@GMAIL.COM

## Proyecto: Gestión de Parqueadero Público

### Descripción del Proyecto

Aplicación web para la gestión de un parqueadero público con roles diferenciados para administradores (cajeros) y usuarios (conductores), publicada en Firebase Hosting. Incluye autenticación mediante Google y una interfaz responsive optimizada para usabilidad.

---

## Funcionalidades Clave

- **Autenticación**: Ingreso con cuenta de Google usando Firebase Authentication.
- **Usuarios**: Registro, gestión y edición de perfiles.
- **Administradores**:
  - Gestión de espacios de parqueo y contratos mensuales.
  - Configuración de tarifas y horarios.
  - Administración de usuarios registrados.
- **Responsive**: Diseño adaptable para móviles y escritorio, siguiendo principios de diseño y usabilidad.

---

## Tecnologías Utilizadas

- **Angular**: Framework principal de desarrollo.
- **Tailwind CSS**: Para un diseño estilizado y responsivo.
- **Firebase**: Autenticación y Hosting.

---

## Guía de Instalación

### Requisitos Previos

- **Node.js** (última versión LTS): [Descargar Node.js](https://nodejs.org/)
- **Firebase CLI**: [Instalar Firebase CLI](https://firebase.google.com/docs/cli)

### Instalación Paso a Paso

#### 1. Clonar el Repositorio  
   ```bash
   git clone <https://github.com/PaulSebastian9720/parqueadero_naspudP-quitoK.git>
   cd <PROYECTO-INTEGRADO-PARQUADERO>
   ```
   
#### 2. Instalar Angular CLI  
   Si no tienes Angular CLI instalado globalmente, instálalo con el siguiente comando:
   ```bash
   npm install -g @angular/cli
   ```
## Paso 3: Instalar Dependencias del Proyecto

Una vez dentro de la carpeta del proyecto, instala todas las dependencias necesarias ejecutando el siguiente comando en tu terminal:

```bash
npm install
```
Este comando descargará e instalará todos los paquetes necesarios que están listados en el archivo package.json.
## Paso 4: Instalar Tailwind CSS

### 4.1 Instalar Dependencias Necesarias

   Instala las dependencias necesarias para usar Tailwind CSS e inicializar:
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init
```
 ## 4.2 Configuración de Tailwind

Abre el archivo `tailwind.config.js` y agrega la siguiente configuración para que Tailwind procese todos los archivos de tu aplicación Angular:

```js
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## 4.3 Agregar Tailwind a los Estilos Globales

Crea o abre el archivo `src/styles.css` y agrega las siguientes directivas de Tailwind:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```