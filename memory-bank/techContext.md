# Tech Context - LTI Talent Tracking System

## Stack tecnológico

### Backend

#### Runtime y lenguaje
- **Node.js**: Versión UNKNOWN (no especificada en package.json ni README)
  - ⚠️ **Recomendación**: Especificar en `engines` de package.json
- **TypeScript**: 4.9.5
  - Target: ES5
  - Module: CommonJS
  - Strict mode: Activado

#### Framework y librerías principales
- **Express**: 4.19.2 - Framework web
- **Prisma**: 5.13.0 - ORM y cliente de BD
  - `@prisma/client`: Cliente generado
  - Binary targets: `["native", "debian-openssl-3.0.x"]` (para Docker/Linux)
- **CORS**: 2.8.5 - Manejo de CORS
- **Multer**: 1.4.5-lts.1 - Upload de archivos
- **dotenv**: 16.4.5 - Variables de entorno

#### Documentación API
- **swagger-jsdoc**: 6.2.8
- **swagger-ui-express**: 5.0.0
- OpenAPI spec: `backend/api-spec.yaml` (OpenAPI 3.0.0)

#### Testing
- **Jest**: 29.7.0 - Test runner
- **ts-jest**: 29.1.2 - TypeScript para Jest
- **@types/jest**: 29.5.12
- Config: `backend/jest.config.js`

#### Linting y formato
- **ESLint**: 9.2.0
- **Prettier**: 3.2.5
- **eslint-config-prettier**: 9.1.0
- **eslint-plugin-prettier**: 5.1.3
- ⚠️ **Nota**: No hay archivos `.eslintrc` o `.prettierrc` en repo

#### Build y desarrollo
- **ts-node**: 9.1.1 - Ejecución directa de TS
- **ts-node-dev**: 1.1.6 - Hot reload en desarrollo
- **typescript**: 4.9.5 - Compilador

### Frontend

#### Runtime y lenguaje
- **React**: 18.3.1
- **React DOM**: 18.3.1
- **TypeScript**: 4.9.5 (mismo que backend)
- **Node.js**: Versión UNKNOWN

#### Framework y tooling
- **Create React App**: 5.0.1 (react-scripts)
  - Webpack, Babel, ESLint preconfigurados
- **TypeScript**: Strict mode activado
  - Target: ES5
  - Lib: DOM, ESNext
  - JSX: react-jsx (sin necesidad de importar React)

#### Librerías de UI
- **React Bootstrap**: 2.10.2 - Componentes UI
- **Bootstrap**: 5.3.3 - Estilos base
- **React Bootstrap Icons**: 1.11.4 - Iconografía
- **React Datepicker**: 6.9.0 - Selector de fechas

#### Drag & Drop
- **React Beautiful DnD**: 13.1.1 - Kanban drag & drop
- **React DnD**: 16.0.1 - Sistema DnD genérico
- **React DnD HTML5 Backend**: 16.0.1

#### Routing
- **React Router DOM**: 6.23.1
- ⚠️ **Nota**: Instalado pero uso limitado (routing básico)

#### Testing
- **Jest**: Configurado con react-scripts
- **@testing-library/react**: 13.4.0
- **@testing-library/jest-dom**: 5.17.0
- **@testing-library/user-event**: 13.5.0
- ⚠️ **Nota**: No se detectan tests escritos en frontend

#### Otras dependencias
- **web-vitals**: 2.1.4 - Métricas de rendimiento
- **dotenv**: 16.4.5 - Variables de entorno

### Base de datos

#### Motor
- **PostgreSQL**: Versión UNKNOWN (no especificada en docker-compose.yml)
- **Puerto**: 5432 (configurable con DB_PORT)
- **Imagen Docker**: `postgres` (latest implícito)
  - ⚠️ **Riesgo**: Sin tag de versión, puede cambiar

#### ORM
- **Prisma**: 5.13.0
- **Schema**: `backend/prisma/schema.prisma`
- **Migraciones**: 4 migraciones aplicadas (ver `backend/prisma/migrations/`)
- **Seed**: `backend/prisma/seed.ts` con datos de ejemplo

### Infraestructura

#### Containerización
- **Docker**: Requerido para BD
- **Docker Compose**: 3.1
- **Servicio**: Solo PostgreSQL (backend y frontend NO containerizados)

#### Gestión de dependencias
- **npm**: Backend y frontend usan npm (no yarn/pnpm)
- **Lockfiles**: 
  - `backend/package-lock.json`: Presente
  - `frontend/package-lock.json`: Presente
  - `package-lock.json` (root): Presente (solo dotenv)

## Setup local exacto

### Prerrequisitos
```bash
# Instalar (versiones no especificadas en repo)
- Node.js (recomendado: LTS 18.x o superior)
- npm (incluido con Node.js)
- Docker Desktop o Docker Engine + Docker Compose
- Git
```

### Pasos de instalación

#### 1. Clonar repositorio
```bash
git clone <repo-url>
cd AI4Devs-qa-202510
```

#### 2. Instalar dependencias

**Root** (opcional, solo para dotenv):
```bash
npm install
```

**Backend**:
```bash
cd backend
npm install
```

**Frontend**:
```bash
cd frontend
npm install
```

#### 3. Configurar variables de entorno

**Root** (`.env`):
```env
# Variables para docker-compose
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=mydatabase
DB_PORT=5432
```

**Backend** (`.env` en `backend/`):
```env
# Connection string para Prisma
DATABASE_URL=postgresql://postgres:password@localhost:5432/mydatabase

# Puerto del backend
BACKEND_PORT=3010
BACKEND_HOST=localhost

# CORS origins (separados por coma)
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

**Frontend** (`.env` en `frontend/`):
```env
# URL del backend
REACT_APP_API_URL=http://localhost:3010
```

⚠️ **Nota**: Estos archivos `.env` NO están en el repo (.gitignore). Usuario debe crearlos manualmente.

#### 4. Levantar base de datos

Desde raíz del proyecto:
```bash
docker-compose up -d
```

Verificar que esté corriendo:
```bash
docker ps
# Debe mostrar contenedor con postgres
```

#### 5. Ejecutar migraciones y seed

Desde `backend/`:
```bash
npx prisma generate       # Genera cliente Prisma
npx prisma migrate dev    # Aplica migraciones
npx ts-node prisma/seed.ts  # Carga datos de ejemplo
```

**Datos de ejemplo cargados**:
- 1 Empresa: LTI
- 2 Posiciones: Senior Full-Stack Engineer, Data Scientist
- 3 Candidatos: John Doe, Jane Smith, Carlos García
- 2 Empleados: Alice Johnson, Bob Miller
- 2 Flujos de entrevista con 3 etapas cada uno
- 4 Aplicaciones (candidatos a posiciones)
- 3 Entrevistas registradas

#### 6. Iniciar backend

**Desarrollo** (con hot reload):
```bash
cd backend
npm run dev
```

**Producción** (compilado):
```bash
cd backend
npm run build   # Genera dist/
npm start       # Ejecuta dist/index.js
```

Backend disponible en: `http://localhost:3010`

#### 7. Iniciar frontend

**Desarrollo**:
```bash
cd frontend
npm start
```

Frontend disponible en: `http://localhost:3000`

**Producción** (build):
```bash
cd frontend
npm run build   # Genera build/
# Servir con servidor estático (nginx, serve, etc.)
```

### Verificación de instalación

#### Backend
```bash
# Health check básico
curl http://localhost:3010/
# Respuesta esperada: "Hola LTI!"

# Obtener candidato de ejemplo
curl http://localhost:3010/candidates/1
# Respuesta esperada: JSON con datos de John Doe
```

#### Frontend
- Abrir `http://localhost:3000`
- Debe mostrar dashboard de reclutador
- Debe listar 2 posiciones

#### Base de datos
```bash
# Conectar con psql
docker exec -it <container_name> psql -U postgres -d mydatabase

# Ver tablas
\dt

# Ejemplo de query
SELECT * FROM "Candidate";
```

## Config/env: Variables detectadas

### Backend

| Variable | Descripción | Obligatoria | Valor por defecto | Dónde se usa |
|----------|-------------|-------------|-------------------|--------------|
| `DATABASE_URL` | Connection string PostgreSQL | ✅ SÍ | - | Prisma |
| `BACKEND_PORT` | Puerto del servidor Express | ❌ NO | 3010 | index.ts |
| `BACKEND_HOST` | Host del servidor | ❌ NO | localhost | index.ts |
| `CORS_ORIGINS` | Orígenes permitidos (CSV) | ❌ NO | http://localhost:3000 | index.ts |

**Secretos detectados**: DB_PASSWORD en DATABASE_URL

### Frontend

| Variable | Descripción | Obligatoria | Valor por defecto | Dónde se usa |
|----------|-------------|-------------|-------------------|--------------|
| `REACT_APP_API_URL` | URL base del backend | ❌ NO | http://localhost:3010 | config/api.ts |

**Nota**: React solo expone variables con prefijo `REACT_APP_`

### Docker Compose

| Variable | Descripción | Valor por defecto | Dónde se usa |
|----------|-------------|-------------------|--------------|
| `DB_USER` | Usuario PostgreSQL | - | docker-compose.yml |
| `DB_PASSWORD` | Contraseña PostgreSQL | - | docker-compose.yml |
| `DB_NAME` | Nombre de BD | - | docker-compose.yml |
| `DB_PORT` | Puerto expuesto | - | docker-compose.yml |

## Scripts disponibles

### Backend (`backend/package.json`)

```json
{
  "start": "node dist/index.js",              // Ejecutar producción
  "dev": "ts-node-dev --respawn --transpile-only src/index.ts",  // Desarrollo
  "build": "tsc",                              // Compilar TypeScript
  "test": "jest",                              // Ejecutar tests
  "prisma:init": "npx prisma init",           // Inicializar Prisma
  "prisma:generate": "npx prisma generate",   // Generar cliente
  "start:prod": "npm run build && npm start"  // Build + start
}
```

### Frontend (`frontend/package.json`)

```json
{
  "start": "react-scripts start",    // Desarrollo (puerto 3000)
  "build": "react-scripts build",    // Build producción
  "test": "jest --config jest.config.js",  // Tests
  "eject": "react-scripts eject"     // Eyectar CRA (irreversible)
}
```

### Root (`package.json`)

```json
{
  // No tiene scripts definidos
}
```

## Restricciones y compatibilidades

### Versiones de Node.js
- **Backend**: TypeScript 4.9.5 requiere Node.js 12+
- **Frontend**: React 18 requiere Node.js 14+
- **Recomendado**: Node.js 18 LTS o superior
- ⚠️ **ISSUE**: No especificado en `engines` de package.json

### Versiones de PostgreSQL
- **Prisma 5.x**: Compatible con PostgreSQL 9.6+
- **Binaries**: Incluye target para `debian-openssl-3.0.x` (compatible con PostgreSQL 15+)
- ⚠️ **ISSUE**: Docker compose no especifica versión de imagen

### Navegadores (Frontend)
Según browserslist en `frontend/package.json`:
- **Producción**: >0.2%, not dead, not op_mini all
- **Desarrollo**: last 1 chrome, firefox, safari version

### Sistema operativo
- **Desarrollo**: Windows, macOS, Linux
- **Producción**: Linux (según binary targets de Prisma)
- **Docker**: Cualquier SO con Docker

### TypeScript
- **Versión**: 4.9.5 (no la última, actual es 5.x)
- **Razón posible**: Compatibilidad con CRA 5.0.1

## Dependencias críticas y su propósito

### Backend

#### Producción
- **express**: Framework web, routing, middleware
- **@prisma/client**: Generado por Prisma, acceso type-safe a BD
- **cors**: Permitir requests cross-origin desde frontend
- **multer**: Parsear multipart/form-data para uploads
- **dotenv**: Cargar variables de entorno desde .env
- **swagger-jsdoc + swagger-ui-express**: Documentación API interactiva

#### Desarrollo
- **prisma**: CLI y motor de migraciones
- **typescript**: Compilador y type-checking
- **ts-node-dev**: Ejecución y hot-reload en desarrollo
- **jest + ts-jest**: Testing framework
- **eslint + prettier**: Code quality

### Frontend

#### Producción
- **react + react-dom**: Librería UI
- **react-router-dom**: Routing (aunque poco usado)
- **react-bootstrap + bootstrap**: Componentes y estilos
- **react-beautiful-dnd**: Drag & drop para Kanban
- **react-datepicker**: Selector de fechas en formularios
- **dotenv**: Variables de entorno

#### Desarrollo
- **react-scripts**: Tooling de Create React App (Webpack, Babel, etc.)
- **typescript**: Type-checking
- **@testing-library/react**: Testing de componentes

## Herramientas de desarrollo

### Linting
- **Backend**: ESLint configurado pero sin archivos de config presentes
- **Frontend**: ESLint integrado en react-scripts

### Formatting
- **Backend**: Prettier configurado en package.json pero sin .prettierrc
- **Frontend**: Sin configuración explícita

### Testing
- **Backend**: Jest con ts-jest, 2 archivos de test encontrados
- **Frontend**: Jest + React Testing Library, pero sin tests escritos

### Type checking
- **Backend**: `tsc --noEmit` (no hay script dedicado)
- **Frontend**: Integrado en react-scripts

### Database tooling
- **Prisma Studio**: No mencionado, pero disponible con `npx prisma studio`
- **Migraciones**: `prisma migrate dev`, `prisma migrate deploy`
- **Introspección**: `prisma db pull`

## Limitaciones técnicas conocidas

### 1. Sin especificación de versiones de runtime
**Problema**: package.json no tiene campo `engines`  
**Impacto**: Diferentes devs pueden usar versiones incompatibles  
**Fix**:
```json
{
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
```

### 2. Docker sin version pinning
**Problema**: `image: postgres` sin tag  
**Impacto**: Puede romperse al actualizar  
**Fix**: `image: postgres:15-alpine`

### 3. Sin health checks
**Problema**: docker-compose no define healthcheck para postgres  
**Impacto**: Backend puede intentar conectar antes de que BD esté lista  

### 4. Uploads sin límite de tamaño explícito
**Problema**: Multer sin configuración de `limits`  
**Impacto**: Posible DoS con archivos grandes  

### 5. Sin hot-reload en frontend para cambios de API
**Problema**: Cambios en backend requieren restart manual de frontend a veces  

### 6. Build de producción sin optimización de BD
**Problema**: No hay script para `prisma migrate deploy`  
**Impacto**: Deploy manual de migraciones  

## Preguntas al humano sobre tech stack

1. ¿Cuál es la versión de Node.js requerida/recomendada?
2. ¿Se planea actualizar TypeScript a 5.x?
3. ¿Por qué no se usa npm workspaces para monorepo?
4. ¿Hay planes de migrar a Vite en lugar de CRA?
5. ¿Se necesita Redis para caching?
6. ¿Qué estrategia de versionado de API se usará?
7. ¿Se contempla usar Docker para backend/frontend también?
8. ¿Hay requisitos de CDN para assets del frontend?
