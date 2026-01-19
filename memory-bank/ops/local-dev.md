# Local Development Guide

## Quick Start

```bash
# 1. Clonar y configurar .env
git clone <repo>
cd AI4Devs-qa-202510
# Crear archivos .env según techContext.md

# 2. Levantar BD
docker-compose up -d

# 3. Setup backend
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npx ts-node prisma/seed.ts
npm run dev

# 4. Setup frontend (nueva terminal)
cd frontend
npm install
npm start
```

**URLs**:
- Frontend: http://localhost:3000
- Backend: http://localhost:3010
- PostgreSQL: localhost:5432

## Comandos útiles

### Backend
```bash
npm run dev          # Hot reload
npm run build        # Compilar
npm start            # Producción
npm test             # Tests
```

### Frontend
```bash
npm start            # Desarrollo
npm run build        # Build producción
npm test             # Tests
```

### Base de datos
```bash
npx prisma studio    # UI para explorar BD
npx prisma migrate dev --name <name>  # Nueva migración
npx prisma db push   # Push schema sin migración
```

**Ver detalles completos en**: `memory-bank/techContext.md`
