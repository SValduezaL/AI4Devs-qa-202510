# Deployment Guide

## Estado actual

❌ **CI/CD NO implementado** - Solo documentado en README

## Setup sugerido (según README)

### EC2 Requirements
- Node.js 16+
- PM2 para gestión de procesos
- PostgreSQL (RDS o local)
- Nginx como reverse proxy

### GitHub Secrets necesarios
- `AWS_ACCESS_ID`
- `AWS_ACCESS_KEY`
- `EC2_INSTANCE`

### Workflow esperado
1. Push a fork personal
2. GitHub Actions: build + test
3. Deploy a EC2 personal
4. Validar funcionamiento
5. Pull Request con evidencia

## Archivos faltantes

- `.github/workflows/*` (NO existen)
- Scripts de deployment

**Ver README para instrucciones completas**
