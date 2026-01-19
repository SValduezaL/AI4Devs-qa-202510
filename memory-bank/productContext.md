# Product Context - LTI Talent Tracking System

## Why - ¿Por qué existe este producto?

El sistema LTI existe para resolver problemas comunes en procesos de reclutamiento:

### Problemas que resuelve
1. **Dispersión de información**: CVs en emails, notas en diferentes herramientas, falta de historial
2. **Falta de trazabilidad**: No saber en qué etapa está cada candidato
3. **Colaboración ineficiente**: Múltiples entrevistadores sin sincronización
4. **Pérdida de candidatos**: Falta de seguimiento sistemático
5. **Decisiones sin datos**: No hay métricas ni scoring centralizado

### Valor propuesto
- **Centralización**: Toda la información del candidato en un solo lugar
- **Proceso estructurado**: Flujos de entrevista predefinidos y configurables
- **Visibilidad**: Dashboard tipo Kanban para ver estado del pipeline
- **Colaboración**: Múltiples entrevistadores pueden evaluar y dejar notas
- **Eficiencia**: Reduce tiempo administrativo en gestión de candidatos

## What - ¿Cómo debería funcionar a alto nivel?

### Flujo principal de uso (detectado del código)

#### 1. Configuración inicial (una vez)
```
Empresa → crea Flujos de Entrevista → define Pasos (HR, Técnica, Manager)
       → crea Posiciones → asocia Flujo de Entrevista
       → da de alta Empleados (entrevistadores)
```

#### 2. Gestión de candidatos (operación día a día)
```
Reclutador → Recibe CV de candidato
          → Crea candidato en sistema (datos personales + educación + experiencia + CV)
          → Asigna candidato a Posición (crea Application)
          → Candidato entra en primera etapa del flujo

Entrevistadores → Realizan entrevistas según etapa
                → Registran resultado, score y notas

Reclutador → Avanza/retrocede candidato entre etapas
           → Visualiza progreso en dashboard
           → Toma decisión final (contratar/descartar)
```

#### 3. Visualización y seguimiento
```
Dashboard → Muestra posiciones abiertas
          → Para cada posición: candidatos agrupados por etapa (columnas Kanban)
          → Detalle de candidato: historial completo, scores, notas de entrevistas
```

## UX/Flujos principales

### Flujo 1: Añadir nuevo candidato
**Actor**: Reclutador

**Pasos**:
1. Click en "Añadir candidato" (componente: `AddCandidateForm.js`)
2. Completa formulario:
   - Datos personales (nombre, email, teléfono, dirección)
   - Educación (institución, título, fechas) - múltiples entradas
   - Experiencia laboral (empresa, cargo, descripción, fechas) - múltiples entradas
   - Upload CV (componente: `FileUploader.js`) - solo PDF/DOCX
3. Submit → POST `/candidates`
4. Backend valida, crea registro en BD con relaciones
5. Éxito: Candidato disponible para asignar a posiciones

**Validaciones**:
- Email formato válido y único
- Nombres min 2 caracteres, solo letras
- Fechas formato YYYY-MM-DD
- CV solo PDF o DOCX, tamaño máximo UNKNOWN

### Flujo 2: Ver candidatos de una posición
**Actor**: Reclutador

**Pasos**:
1. Selecciona posición desde lista (componente: `Positions.tsx`)
2. GET `/positions/{id}/candidates`
3. Sistema muestra candidatos agrupados por etapa actual (componente: `PositionDetails.js`)
4. Vista tipo Kanban con columnas por etapa (componente: `StageColumn.js`)
5. Cada candidato muestra: nombre completo, etapa actual, score promedio

**Interacciones**:
- Click en candidato → Ver detalle (componente: `CandidateDetails.js`)
- Drag & drop entre columnas → Cambiar etapa (PUT `/candidates/{id}`)

### Flujo 3: Evaluar candidato
**Actor**: Entrevistador/Reclutador

**Pasos**:
1. Abre detalle de candidato (componente: `CandidateDetails.js`)
2. Ve información completa:
   - Datos personales
   - Historial educativo
   - Experiencia laboral
   - CV descargable
   - Aplicaciones a posiciones
   - Entrevistas realizadas (fecha, etapa, score, notas)
3. **Actualización de etapa**: Selector de nueva etapa → Submit
4. PUT `/candidates/{id}` con `{applicationId, currentInterviewStep}`
5. Backend actualiza Application.currentInterviewStep
6. Dashboard se actualiza con nueva posición del candidato

**Nota**: El registro detallado de entrevista individual (crear Interview) no se ve implementado en frontend actual.

## Casos borde / Riesgos de producto

### Casos borde identificados

#### 1. Email duplicado
**Situación**: Mismo candidato aplica dos veces  
**Comportamiento actual**: Backend rechaza con error P2002 "Email already exists"  
**Riesgo**: Candidato puede usar emails diferentes, creando duplicados  
**Mejora sugerida**: Matching fuzzy por nombre + otros campos

#### 2. Candidato en múltiples posiciones
**Situación**: Un candidato puede tener varias Applications  
**Comportamiento actual**: Soportado por modelo de datos  
**Riesgo**: No hay validación de conflictos (ej. avanzar en una puede afectar otra)  
**Estado**: FUNCIONALIDAD CORRECTA según diseño

#### 3. Cambio de etapa sin validación
**Situación**: Mover candidato a etapa sin haber completado anterior  
**Comportamiento actual**: Se permite cualquier cambio  
**Riesgo**: Proceso inconsistente, saltos de etapas  
**Mejora sugerida**: Validar orden secuencial o estados válidos

#### 4. Entrevistas sin registrar
**Situación**: Se cambia etapa pero no se crea Interview  
**Comportamiento actual**: Interview es independiente de cambio de etapa  
**Riesgo**: Historial incompleto, scores faltantes  
**Nota**: Diseño permite esto, pero puede ser confuso

#### 5. Archivos huérfanos
**Situación**: Upload de CV exitoso pero fallo al crear candidato  
**Comportamiento actual**: UNKNOWN (no hay cleanup)  
**Riesgo**: Archivos acumulados en disco sin referencia  
**Mejora sugerida**: Transacciones o cleanup en rollback

#### 6. Position no visible
**Situación**: Candidato aplicado a posición que luego se marca isVisible=false  
**Comportamiento actual**: No se valida al crear Application  
**Riesgo**: Candidatos en limbo  
**Mejora sugerida**: Validar visibilidad o manejar lógicamente

### Riesgos de UX

#### Pérdida de trabajo no guardado
- Formulario largo de candidato sin auto-save
- No hay confirmación al salir con cambios

#### Feedback insuficiente
- No hay loading states documentados
- Errores de API pueden no mostrarse claramente

#### Navegación
- No hay breadcrumbs o navegación clara entre vistas
- Volver de detalle de candidato → UNKNOWN comportamiento

#### Accesibilidad
- No se mencionan estándares WCAG
- Drag & drop puede no ser accesible con teclado

### Riesgos técnicos

#### Concurrencia
- Dos reclutadores cambian etapa simultáneamente → última escritura gana
- No hay optimistic locking

#### Integridad referencial
- Borrar Position con Applications → No hay cascade delete definido
- Borrar Employee con Interviews → Datos huérfanos

#### Escalabilidad
- GET `/positions/{id}/candidates` sin paginación
- Queries con múltiples includes pueden ser lentas

#### Seguridad
- Sin autenticación: Cualquiera puede acceder a la API
- Datos sensibles (email, teléfono, dirección) sin encriptar
- CVs accesibles sin control de acceso

## Hipótesis no validadas

Estos supuestos del producto no están validados en el código:

1. **Orden de etapas es secuencial**: El campo `orderIndex` existe pero no se valida
2. **Una entrevista = un entrevistador**: Modelo soporta 1:1, pero ¿sesiones panel?
3. **Scores son 1-5**: No hay validación de rango
4. **Solo una etapa activa por aplicación**: Modelo soporta, pero no hay validación
5. **CVs son opcionales**: Campo nullable, pero ¿realmente opcional en workflow?

## Estado deseado vs estado actual

### ✅ Implementado y funcional
- Gestión completa de candidatos (CRUD)
- Flujos de entrevista configurables
- Dashboard con visualización de candidatos por etapa
- Upload de CVs
- Tracking de etapa actual de candidato

### ⚠️ Parcialmente implementado
- Registro de entrevistas: Modelo existe, pero UI no permite crear
- Scoring: Campo existe pero no hay UI para capturar durante entrevista
- Notas: Se pueden guardar en Interview pero no hay UI dedicada

### ❌ No implementado (pero necesario)
- Autenticación de usuarios
- Permisos basados en rol
- Notificaciones de cambios de etapa
- Historial de cambios/auditoría
- Búsqueda y filtrado avanzado de candidatos
- Exportación de datos
- Reportes y métricas

## Preguntas al humano sobre producto

1. ¿Cuál es el workflow exacto para registrar una entrevista? ¿Lo hace el entrevistador o el reclutador?
2. ¿Un candidato puede retroceder de etapa? ¿Es rechazo o vuelve a evaluar?
3. ¿Qué pasa con candidatos rechazados? ¿Se borran o se mantienen?
4. ¿Cuál es el ciclo de vida de una posición? (Draft → Open → Closed → ?)
5. ¿Cómo se decide qué empleado entrevista a cada candidato en cada etapa?
6. ¿Hay límite de candidatos por posición?
7. ¿Los flujos de entrevista se pueden cambiar con Applications activas?
