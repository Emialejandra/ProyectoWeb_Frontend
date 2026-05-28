# Sistema Web de Control de Gastos Personales con IA - Frontend 

## Descripción del Proyecto

Sistema web inteligente desarrollado para la gestión de finanzas personales, permitiendo a los usuarios registrar ingresos y gastos, visualizar reportes y gráficos, y recibir análisis automáticos mediante Inteligencia Artificial para mejorar sus hábitos financieros.

---

## Tecnologías Utilizadas

* Node.js
* npm (Node Package Manager)
* React.js
* Vite
* JavaScript(ES6+)
* React Router DOM
* CSS3
  
##  Herramientas utilizadas 
* Git
* GitHub
* Google Chrome

---

## Estructura del Proyecto


```text
frontendAPP/
│
├── public/
├── src/
│   ├── assets/
│   │   └── dash.webp
│   │
│   ├── components/
│   │   ├── Login/
│   │   │   ├── LoginForm.jsx
│   │   │   └── LoginForm.css
│   │   ├── RegisterForm/
│   │   │   ├── RegisterForm.jsx
│   │   │   └── RegisterForm.css
│   │   └── ProtectedRoute.jsx
│   │
│   ├── pages/
│   │   ├── Auth/
│   │   │   ├── ForgotPassword.jsx
│   │   │   └── ResetPassword.jsx
│   │   ├── Dashboard/
│   │   │   └── Dashboard.jsx
│   │   ├── Home/
│   │   │   └── Home.jsx
│   │   ├── Profile/
│   │   │   └── Profile.jsx
│   │   └── Register/
│   │       └── Register.jsx
│   │
│   ├── Routes/
│   │   └── AppRoutes.jsx
│   │
│   ├── services/
│   │   ├── authService.js
│   │   ├── supabaseClient.js
│   │   └── userService.js
│   │
│   ├── styles/
│   │   ├── dashboard.css
│   │   ├── forgot-reset.css
│   │   ├── home.css
│   │   ├── profile.css
│   │   └── register.css
│   │
│   ├── utils/
│   │   └── ErrorMessages.js
│   │
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .gitignore
├── package.json
└── vite.config.js
```

---

# Configuración del Entorno 


## Variables de entorno `.env`

```env
PORT=4000

VITE_SUPABASE_URL=https://TU_PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY= TU_SUPABASE_ANON_KEY

VITE_JWT_SECRET=supersecretkey

VITE_API_URL=http://localhost:4000
```
## Dependencias instaladas 

``` bash
npm install react-router-dom
npm install @supabase/supabase-js
npm install
```

---

## Ejecutar el proyecto 

``` bash
npm run dev
```
---

# Funcionalidades implementadas 

## Autenticación 
* Registro de usuarios mediante correo electrónico
* Inicio de sesión
* Inicio de sesión con Google
* Confirmación de contraseña
* recuperación de contraseña

## Gestión de Perfil 
* Visualización de perfil
* Actualización de datpos del usuario
* Configuración personalizada

## Dashboard
* Dasboard principal
* Visualización de infirmación financiera
* Interfaz moderna e intuitiva

## Seguridad 
* Protección de rutas privadas mediante ``PortectedRoute``
* Manejo de sesiones y autenticación con Supabase
* Integración segura con APIs REST

---

# Rutas Principales del Frontend (EndPoints)

| Método | Ruta               | Descripción                 |
| ------ | ------------------ | --------------------------- |
| POST   | `/register`        | Registro de usuarios        |
| POST   | `/`                | Inicio de sesión            |
| POST   | `/forgot-password` | Recuperación de contraseña  |
| PUT    | `/update-password` | Actualización de contraseña |
| PUT    | `/profile`         | Actualización de perfil     |

---

# Diseño de Interfaces

El diseño de las interfaces fue realizado considerando principios de:

* Usabilidad
* Accesibilidad
* Experiencia de usuario (UX)

Herramienta utilizada:

* Figma

---

# Características del Sistema 

* Interfaz responsive
* Formularios dinámicos
* Manejo de errores amigables
* Integración con Supabase
* Comunicación mediante APIs REST
* Gestión segura de autenticación
* Navegación protegida
* Organización modular del proyecto

---

# Roles del Proyecto

| Integrante | Rol |
|---|---|
| Ariel Arias | Backend |
| Emilia Tana| Frontend |

---

# Próximos Módulos (Sprint 2)

- CRUD de gastos
- CRUD de ingresos
- Categorías
- Dashboard principal mejorado
- Reportes y gráficos estadistícos
- Alertas inteligentes
- Análisis con IA

---

# Autor/a

Emilia Alejandra Tana Puga 

---
