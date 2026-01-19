# LTI - Talent Tracking System  | EN

This project is a full-stack application with a React frontend and an Express backend using Prisma as an ORM. The frontend is initiated with Create React App, and the backend is written in TypeScript.

## Directory and File Explanation

- `backend/`: Contains the server-side code written in Node.js.
  - `src/`: Contains the source code for the backend.
    - `index.ts`: The entry point for the backend server.
    - `application/`: Contains the application logic.
    - `domain/`: Contains the business logic.
    - `infrastructure/`: Contains code that communicates with the database.
    - `presentation/`: Contains code related to the presentation layer (such as controllers).
    - `routes/`: Contains the route definitions for the API.
    - `tests/`: Contains test files.
  - `prisma/`: Contains the Prisma schema file for ORM.
  - `tsconfig.json`: TypeScript configuration file.
- `frontend/`: Contains the client-side code written in React.
  - `src/`: Contains the source code for the frontend.
  - `public/`: Contains static files such as the HTML file and images.
  - `build/`: Contains the production-ready build of the frontend.
- `.env`: Contains the environment variables.
- `docker-compose.yml`: Contains the Docker Compose configuration to manage your application's services.
- `README.md`: This file contains information about the project and instructions on how to run it.

## Project Structure

The project is divided into two main directories: `frontend` and `backend`.

### Frontend

The frontend is a React application, and its main files are located in the `src` directory. The `public` directory contains static assets, and the build directory contains the production `build` of the application.

### Backend

The backend is an Express application written in TypeScript. The `src` directory contains the source code, divided into several subdirectories:

- `application`:Contains the application logic.
- `domain`: Contains the domain models.
- `infrastructure`: Contains code related to the infrastructure.
- `presentation`: Contains code related to the presentation layer.
- `routes`: Contains the application's routes.
- `tests`: Contains the application's tests.

The `prisma` directory contains the Prisma schema.

You can find more information about good practices in the [good practices guide](./backend/ManifestoBuenasPracticas.md).

The specifications for all API endpoints are in [api-spec.yaml](./backend/api-spec.yaml).

The description and diagram of the data model are in [ModeloDatos.md](./backend/ModeloDatos.md).

## First steps

To get started with this project, follow these steps:

### Prerequisites

- Node.js v16 or higher
- pnpm (install with `npm install -g pnpm`)
- Docker and Docker Compose

### 1. Clone the repository

```sh
git clone <repository-url>
cd AI4Devs-qa-202510
```

### 2. Configure environment variables

Create a `.env` file in the root directory with the following content:

```env
# Database
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DB_HOST=localhost
DB_PORT=5433
DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}

# Backend
BACKEND_PORT=3010
BACKEND_HOST=localhost
NODE_ENV=development

# Frontend
FRONTEND_PORT=3000
REACT_APP_API_URL=http://localhost:3010

# CORS
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### 3. Start PostgreSQL with Docker

```sh
docker-compose up -d
```

### 4. Install dependencies

```sh
# Install frontend dependencies
cd frontend
pnpm install

# Install backend dependencies
cd ../backend
pnpm install
```

### 5. Setup database with Prisma

```sh
cd backend

# Generate Prisma client
pnpm prisma generate

# Run migrations
pnpm prisma migrate dev

# Seed database with sample data
pnpm exec tsx prisma/seed.ts
```

### 6. Build and start the backend

```sh
cd backend
pnpm run build
pnpm start
```

The backend server will be running at http://localhost:3010

### 7. Start the frontend (in a new terminal)

```sh
cd frontend
pnpm start
```

The frontend will be available at http://localhost:3000

### Alternative: Development mode with hot-reload

**Backend (in one terminal):**
```sh
cd backend
pnpm run dev
```

**Frontend (in another terminal):**
```sh
cd frontend
pnpm start
```

## Docker y PostgreSQL

This project uses Docker to run a PostgreSQL database. Here's how to get it up and running:

Install Docker on your machine if you haven't done so already. You can download it here.
Navigate to the root directory of the project in your terminal.
Run the following command to start the Docker container:
```
docker-compose up -d
```

This will start a PostgreSQL database in a Docker container. The -d flag runs the container in detached mode, meaning it runs in the background.

To access the PostgreSQL database, you can use any PostgreSQL client (like DBeaver or pgAdmin) with the connection details specified in your `.env` file:

- Host: localhost
- Port: 5433 (as configured in docker-compose.yml)
- User: value of `DB_USER` from .env
- Password: value of `DB_PASSWORD` from .env
- Database: value of `DB_NAME` from .env

To stop the Docker container, run the following command:
```
docker-compose down
```

To generate the database using Prisma, follow these steps:

1. Make sure the `.env` file exists in the root directory with the `DATABASE_URL` variable and correct connection string to your PostgreSQL database.

2. If Prisma can't find the .env file, copy it to the backend directory:
```sh
cp .env backend/.env
```

3. Open a terminal and navigate to the backend directory:
```sh
cd backend
```

4. Run the following commands to generate the Prisma client, apply migrations, and populate the database with sample data:

```sh
pnpm prisma generate
pnpm prisma migrate dev
pnpm exec tsx prisma/seed.ts
```

**Note:** We use `tsx` instead of `ts-node` for better TypeScript compatibility. If you encounter issues with `prisma generate` due to OneDrive syncing files in `node_modules`, the client is likely already generated and you can proceed with the migrations.

Once you have completed all the steps, you should be able to save new candidates, both via the web and API, view them in the database, and retrieve them via GET by ID.

```
POST http://localhost:3010/candidates
{
    "firstName": "Albert",
    "lastName": "Saelices",
    "email": "albert.saelices@gmail.com",
    "phone": "656874937",
    "address": "Calle Sant Dalmir 2, 5ºB. Barcelona",
    "educations": [
        {
            "institution": "UC3M",
            "title": "Computer Science",
            "startDate": "2006-12-31",
            "endDate": "2010-12-26"
        }
    ],
    "workExperiences": [
        {
            "company": "Coca Cola",
            "position": "SWE",
            "description": "",
            "startDate": "2011-01-13",
            "endDate": "2013-01-17"
        }
    ],
    "cv": {
        "filePath": "uploads/1715760936750-cv.pdf",
        "fileType": "application/pdf"
    }
}
```

## Setting up EC2 and GitHub Actions

To run this project on an EC2 instance and ensure GitHub Actions works correctly, follow these steps:

### EC2 Configuration

1. **Create an EC2 Instance**:
  - Log in to the AWS console and navigate to EC2.
  - Launch a new instance using an Amazon Linux 2 or Ubuntu AMI.
  -Make sure to select an appropriate instance type (e.g., `t2.micro` for testing).

2.**Configure the Security Group**:
  - Ensure that the security group associated with your instance allows traffic on the following ports:
    - **22**: For SSH (remote access).
    - **80**: For HTTP (if you are using Nginx or a web server).
    - **8080**: For the backend (port where your application runs).
  - You can add inbound rules in the security group to allow access from any IP (0.0.0.0/0) for development purposes, but consider restricting it in production.

3. **Install Dependencies on EC2**:
  - Connect to your EC2 instance via SSH:
    ```
    ssh -i your-key.pem ec2-user@your-ec2-public-ip
    ```
  - Install Node.js, npm, and pnpm:
    ```
    curl -sL https://rpm.nodesource.com/setup_16.x | sudo bash -
    sudo yum install -y nodejs
    sudo npm install -g pnpm
    ```
  - Install PM2 to manage your application:
    ```
    sudo npm install -g pm2
    ```
  - Install Nginx if you need it:
    ```
    sudo yum install -y nginx
    ```

4.**Configure Environment Variables**:
  - Create a `.env` file in the backend root directory with the following variables:
    ```
    DATABASE_URL=postgresql://user:password@localhost:5432/mydatabase
    ```
  - Make sure to replace `user`, `password`, and `mydatabase` with the correct values.

### Variables in GitHub Actions

For the GitHub Actions workflow to work correctly, you must set the following variables in your repository's secrets:

1. **AWS_ACCESS_ID**: Your AWS access key ID.
2. **AWS_ACCESS_KEY**: Your AWS secret access key.
3. **EC2_INSTANCE**: The public IP address or DNS name of your EC2 instance.
### ⚠️ IMPORTANT: Development Workflow

**Before creating a Pull Request, you should make sure that everything works correctly in your fork:**

1. **Work on your fork of the repository**
   - Fork this repository to your personal account
   - Clone your fork locally
   - Make all changes and development in your personal repository

2. **Set your own environment variables**
   - Configure GitHub Secrets on your fork for your AWS credentials
   - Make sure your CI/CD pipeline works with your own variables
   - Fully test the deployment in your personal environment

3. **Validate that everything works before the PR**
   - Run all tests locally
   - Verify that the build works correctly
   - Confirm that the deployment to your AWS works without errors
   - Check that GitHub Actions run successfully on your fork

4. **Only then, create the Pull Request**
   - Once everything is working on your fork, create the PR to the main repository
   - In the PR, include evidence that your pipeline is working (screenshots of successful GitHub Actions, links to your deployment, etc.)
   - Describe the changes you made and how you tested that they work.

### 🔒 Security Considerations

- **NEVER** include credentials or secrets in your code
- Use GitHub Secrets for all sensitive variables
- Set up your own AWS resources for testing
- Do not share credentials between students

### ✅ Checklist before Pull Request

- [ ] The application builds without errors on my fork
- [ ] All tests pass successfully
- [ ] The CI/CD pipeline runs without errors in GitHub Actions
- [ ] The application is deployed successfully on my AWS
- [ ] I have documented the changes made
- [ ] I have included evidence that everything works (screenshots, links)

**Remember**: The goal is to demonstrate that you can build and maintain a functional CI/CD pipeline. Validation on your own fork is critical before requesting instructor review.

# LTI - Sistema de Seguimiento de Talento  | ES

Este proyecto es una aplicación full-stack con un frontend en React y un backend en Express usando Prisma como un ORM. El frontend se inicia con Create React App y el backend está escrito en TypeScript.

## Explicación de Directorios y Archivos

- `backend/`: Contiene el código del lado del servidor escrito en Node.js.
  - `src/`: Contiene el código fuente para el backend.
    - `index.ts`: El punto de entrada para el servidor backend.
    - `application/`: Contiene la lógica de aplicación.
    - `domain/`: Contiene la lógica de negocio.
    - `infrastructure/`: Contiene código que se comunica con la base de datos.
    - `presentation/`: Contiene código relacionado con la capa de presentación (como controladores).
    - `routes/`: Contiene las definiciones de rutas para la API.
    - `tests/`: Contiene archivos de prueba.
  - `prisma/`: Contiene el archivo de esquema de Prisma para ORM.
  - `tsconfig.json`: Archivo de configuración de TypeScript.
- `frontend/`: Contiene el código del lado del cliente escrito en React.
  - `src/`: Contiene el código fuente para el frontend.
  - `public/`: Contiene archivos estáticos como el archivo HTML e imágenes.
  - `build/`: Contiene la construcción lista para producción del frontend.
- `.env`: Contiene las variables de entorno.
- `docker-compose.yml`: Contiene la configuración de Docker Compose para gestionar los servicios de tu aplicación.
- `README.md`: Este archivo, contiene información sobre el proyecto e instrucciones sobre cómo ejecutarlo.

## Estructura del Proyecto

El proyecto está dividido en dos directorios principales: `frontend` y `backend`.

### Frontend

El frontend es una aplicación React y sus archivos principales están ubicados en el directorio `src`. El directorio `public` contiene activos estáticos y el directorio `build` contiene la construcción de producción de la aplicación.

### Backend

El backend es una aplicación Express escrita en TypeScript. El directorio `src` contiene el código fuente, dividido en varios subdirectorios:

- `application`: Contiene la lógica de aplicación.
- `domain`: Contiene los modelos de dominio.
- `infrastructure`: Contiene código relacionado con la infraestructura.
- `presentation`: Contiene código relacionado con la capa de presentación.
- `routes`: Contiene las rutas de la aplicación.
- `tests`: Contiene las pruebas de la aplicación.

El directorio `prisma` contiene el esquema de Prisma.

Tienes más información sobre buenas prácticas utilizadas en la [guía de buenas prácticas](./backend/ManifestoBuenasPracticas.md).

Las especificaciones de todos los endpoints de API los tienes en [api-spec.yaml](./backend/api-spec.yaml).

La descripción y diagrama del modelo de datos los tienes en [ModeloDatos.md](./backend/ModeloDatos.md).


## Primeros Pasos

Para comenzar con este proyecto, sigue estos pasos:

### Prerequisitos

- Node.js v16 o superior
- pnpm (instalar con `npm install -g pnpm`)
- Docker y Docker Compose

### 1. Clonar el repositorio

```sh
git clone <repository-url>
cd AI4Devs-qa-202510
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en el directorio raíz con el siguiente contenido:

```env
# Base de datos
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=tu_base_datos
DB_HOST=localhost
DB_PORT=5433
DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}

# Backend
BACKEND_PORT=3010
BACKEND_HOST=localhost
NODE_ENV=development

# Frontend
FRONTEND_PORT=3000
REACT_APP_API_URL=http://localhost:3010

# CORS
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### 3. Iniciar PostgreSQL con Docker

```sh
docker-compose up -d
```

### 4. Instalar dependencias

```sh
# Instalar dependencias del frontend
cd frontend
pnpm install

# Instalar dependencias del backend
cd ../backend
pnpm install
```

### 5. Configurar la base de datos con Prisma

```sh
cd backend

# Generar cliente de Prisma
pnpm prisma generate

# Ejecutar migraciones
pnpm prisma migrate dev

# Poblar base de datos con datos de ejemplo
pnpm exec tsx prisma/seed.ts
```

### 6. Compilar e iniciar el backend

```sh
cd backend
pnpm run build
pnpm start
```

El servidor backend estará corriendo en http://localhost:3010

### 7. Iniciar el frontend (en una nueva terminal)

```sh
cd frontend
pnpm start
```

El frontend estará disponible en http://localhost:3000

### Alternativa: Modo desarrollo con recarga automática

**Backend (en una terminal):**
```sh
cd backend
pnpm run dev
```

**Frontend (en otra terminal):**
```sh
cd frontend
pnpm start
```

## Docker y PostgreSQL

Este proyecto usa Docker para ejecutar una base de datos PostgreSQL. Así es cómo ponerlo en marcha:

Instala Docker en tu máquina si aún no lo has hecho. Puedes descargarlo desde aquí.
Navega al directorio raíz del proyecto en tu terminal.
Ejecuta el siguiente comando para iniciar el contenedor Docker:
```
docker-compose up -d
```
Esto iniciará una base de datos PostgreSQL en un contenedor Docker. La bandera -d corre el contenedor en modo separado, lo que significa que se ejecuta en segundo plano.

Para acceder a la base de datos PostgreSQL, puedes usar cualquier cliente PostgreSQL (como DBeaver o pgAdmin) con los detalles de conexión especificados en tu archivo `.env`:

- Host: localhost
- Port: 5433 (como está configurado en docker-compose.yml)
- User: valor de `DB_USER` del .env
- Password: valor de `DB_PASSWORD` del .env
- Database: valor de `DB_NAME` del .env

Para detener el contenedor Docker, ejecuta el siguiente comando:
```
docker-compose down
```

Para generar la base de datos utilizando Prisma, sigue estos pasos:

1. Asegúrate de que el archivo `.env` exista en el directorio raíz con la variable `DATABASE_URL` y la cadena de conexión correcta a tu base de datos PostgreSQL.

2. Si Prisma no puede encontrar el archivo .env, cópialo al directorio backend:
```sh
cp .env backend/.env
```

3. Abre una terminal y navega al directorio del backend:
```sh
cd backend
```

4. Ejecuta los siguientes comandos para generar el cliente de Prisma, aplicar migraciones y poblar la base de datos con datos de ejemplo:

```sh
pnpm prisma generate
pnpm prisma migrate dev
pnpm exec tsx prisma/seed.ts
```

**Nota:** Usamos `tsx` en lugar de `ts-node` para mejor compatibilidad con TypeScript. Si encuentras problemas con `prisma generate` debido a OneDrive sincronizando archivos en `node_modules`, es probable que el cliente ya esté generado y puedes continuar con las migraciones.

Una vez has dado todos los pasos, deberías poder guardar nuevos candidatos, tanto via web, como via API, verlos en la base de datos y obtenerlos mediante GET por id.

```
POST http://localhost:3010/candidates
{
    "firstName": "Albert",
    "lastName": "Saelices",
    "email": "albert.saelices@gmail.com",
    "phone": "656874937",
    "address": "Calle Sant Dalmir 2, 5ºB. Barcelona",
    "educations": [
        {
            "institution": "UC3M",
            "title": "Computer Science",
            "startDate": "2006-12-31",
            "endDate": "2010-12-26"
        }
    ],
    "workExperiences": [
        {
            "company": "Coca Cola",
            "position": "SWE",
            "description": "",
            "startDate": "2011-01-13",
            "endDate": "2013-01-17"
        }
    ],
    "cv": {
        "filePath": "uploads/1715760936750-cv.pdf",
        "fileType": "application/pdf"
    }
}
```


## Configuración de EC2 y GitHub Actions

Para ejecutar este proyecto en una instancia EC2 y asegurarte de que GitHub Actions funcione correctamente, sigue estos pasos:

### Configuración de EC2

1. **Crear una Instancia EC2**:
  - Inicia sesión en la consola de AWS y navega a EC2.
  - Lanza una nueva instancia utilizando una AMI de Amazon Linux 2 o Ubuntu.
  - Asegúrate de seleccionar un tipo de instancia adecuado (por ejemplo, `t2.micro` para pruebas).

2. **Configurar el Grupo de Seguridad**:
  - Asegúrate de que el grupo de seguridad asociado a tu instancia permita el tráfico en los siguientes puertos:
    - **22**: Para SSH (acceso remoto).
    - **80**: Para HTTP (si estás usando Nginx o un servidor web).
    - **8080**: Para el backend (puerto donde se ejecuta tu aplicación).
  - Puedes agregar reglas de entrada en el grupo de seguridad para permitir el acceso desde cualquier IP (0.0.0.0/0) para propósitos de desarrollo, pero considera restringirlo en producción.

3. **Instalar Dependencias en EC2**:
  - Conéctate a tu instancia EC2 a través de SSH:
    ```
    ssh -i your-key.pem ec2-user@your-ec2-public-ip
    ```
  - Instala Node.js, npm y pnpm:
    ```
    curl -sL https://rpm.nodesource.com/setup_16.x | sudo bash -
    sudo yum install -y nodejs
    sudo npm install -g pnpm
    ```
  - Instala PM2 para gestionar tu aplicación:
    ```
    sudo npm install -g pm2
    ```
  - Instala Nginx si lo necesitas:
    ```
    sudo yum install -y nginx
    ```

4. **Configurar Variables de Entorno**:
  - Crea un archivo `.env` en el directorio raíz del backend con las siguientes variables:
    ```
    DATABASE_URL=postgresql://user:password@localhost:5432/mydatabase
    ```
  - Asegúrate de reemplazar `user`, `password` y `mydatabase` con los valores correctos.

### Variables en GitHub Actions

Para que el flujo de trabajo de GitHub Actions funcione correctamente, debes configurar las siguientes variables en los secretos de tu repositorio:

1. **AWS_ACCESS_ID**: Tu ID de clave de acceso de AWS.
2. **AWS_ACCESS_KEY**: Tu clave de acceso secreta de AWS.
3. **EC2_INSTANCE**: La dirección IP pública o el nombre DNS de tu instancia EC2.
### ⚠️ IMPORTANTE: Flujo de Trabajo para el Desarrollo

**Antes de crear un Pull Request, debes asegurarte de que todo funcione correctamente en tu fork:**

1. **Trabaja en tu fork del repositorio**
   - Haz fork de este repositorio a tu cuenta personal
   - Clona tu fork localmente
   - Realiza todos los cambios y desarrollo en tu repositorio personal

2. **Configura tus propias variables de entorno**
   - Configura los GitHub Secrets en tu fork para tus credenciales de AWS
   - Asegúrate de que tu pipeline de CI/CD funcione con tus propias variables
   - Prueba completamente el despliegue en tu entorno personal

3. **Valida que todo funciona antes del PR**
   - Ejecuta todos los tests localmente
   - Verifica que el build funcione correctamente
   - Confirma que el despliegue a tu AWS funcione sin errores
   - Revisa que los GitHub Actions se ejecuten exitosamente en tu fork

4. **Solo entonces, crea el Pull Request**
   - Una vez que todo esté funcionando en tu fork, crea el PR al repositorio principal
   - En el PR, incluye evidencia de que tu pipeline funciona (screenshots de GitHub Actions exitosos, enlaces a tu despliegue, etc.)
   - Describe los cambios realizados y cómo probaste que funcionan

### 🔒 Consideraciones de Seguridad

- **NUNCA** incluyas credenciales o secrets en el código
- Usa GitHub Secrets para todas las variables sensibles
- Configura tus propios recursos de AWS para las pruebas
- No compartas credenciales entre estudiantes

### ✅ Checklist antes del Pull Request

- [ ] La aplicación se construye sin errores en mi fork
- [ ] Todos los tests pasan exitosamente
- [ ] El pipeline de CI/CD se ejecuta sin fallos en GitHub Actions
- [ ] La aplicación se despliega correctamente en mi AWS
- [ ] He documentado los cambios realizados
- [ ] He incluido evidencia de que todo funciona (capturas, enlaces)

**Recuerda**: El objetivo es demostrar que puedes crear y mantener un pipeline de CI/CD funcional. La validación en tu propio fork es fundamental antes de solicitar la revisión del instructor.
