# Evidencia Técnica — PRECISUR Drift Simulation

## Propósito

Este documento contiene hechos técnicos que pueden utilizarse en la comunicación visual del proyecto.

IMPORTANTE:

No convertir métricas técnicas en afirmaciones científicas exageradas.

Las pruebas de software demuestran:

* consistencia del código
* comportamiento esperado
* regresiones controladas
* propiedades numéricas
* aislamiento arquitectónico

NO sustituyen validación experimental de campo.

---

# Estado del módulo

Fecha de auditoría:

2026-08-24

Proyecto:

proyecto_drones v1.0.1+2

---

# Salud del software

## Análisis estático

* 0 errores
* 0 warnings
* aproximadamente 190 observaciones informativas de estilo/deprecación

## Pruebas automatizadas

* 934 pruebas automatizadas
* 100% aprobadas

Las pruebas cubren:

* física
* convergencia
* viento
* deposición
* grids espaciales
* rendimiento
* escenarios
* Smart Spray
* causalidad
* invariantes
* red team
* reproducción determinista
* aislamiento entre motor físico y renderizado

---

# Arquitectura

El sistema utiliza una arquitectura modular.

Principales capas:

```text
INPUT
  ↓
MODELOS
  ↓
MOTOR FÍSICO
  ↓
ESTADO DE SIMULACIÓN
  ↓
DATOS DE RENDERIZADO
  ↓
VISUALIZACIÓN
```

Principio crítico:

> La física y los gráficos están separados.

La calidad visual no debe modificar el resultado físico.

---

# Motor físico

Motor principal:

CanonicalDriftEngine

Características relevantes:

* timestep fijo
* acumulador temporal
* simulación determinista mediante seed
* emisión de partículas
* dinámica de gotas
* deposición
* concentración
* incertidumbre

---

# Fenómenos modelados

## Gravedad

Las gotas experimentan aceleración gravitacional.

## Arrastre aerodinámico

Se utiliza un modelo de drag dependiente de la velocidad relativa.

## Velocidad terminal

Modelo basado en correlaciones aerodinámicas.

## Evaporación

Modelo basado en la ley d² con influencia de condiciones ambientales.

## Turbulencia

Modelo de perturbación atmosférica.

## Viento

El campo de viento contempla:

* variación vertical
* interpolación temporal
* ráfagas
* transición gradual entre estados

## Deposición

Se registra el cruce de partículas hacia el suelo.

---

# Sistemas espaciales

La simulación incluye:

* grids de concentración
* grids de deposición
* interpolación bilineal
* dimensionamiento dinámico
* geometría de lotes
* rutas de aplicación

---

# Smart Spray

Smart Spray es un módulo experimental de análisis y optimización.

Puede evaluar candidatos considerando:

* ángulo de ruta
* espaciado
* cobertura
* solapamiento
* deriva estimada
* exposición en zonas sensibles
* incertidumbre
* tiempo de vuelo

El sistema devuelve candidatos comparables.

No debe describirse como:

"piloto automático"

ni como:

"sistema autónomo certificado"

Es una herramienta de análisis y optimización en desarrollo.

---

# Validación computacional

## Convergencia

Se evalúa la sensibilidad del resultado frente al timestep.

## Determinismo

El mismo escenario y seed producen resultados reproducibles.

## Invariantes

Se verifican propiedades como:

* valores no negativos
* estabilidad numérica
* consistencia
* conservación esperada

## Causalidad

Se evalúan relaciones esperadas entre variables.

Ejemplos conceptuales:

* cambios de viento producen cambios en deriva
* cambios de tamaño de gota afectan comportamiento
* cambios de altura modifican exposición
* cambios de humedad afectan evaporación

## Red Team

Se prueban condiciones extremas:

* viento extremo
* tamaños de gota extremos
* humedad extrema
* geometrías degeneradas
* valores NaN
* valores Infinity
* cambios rápidos de estado

---

# Correcciones críticas realizadas

Durante el proceso de auditoría fueron detectados y corregidos problemas relevantes.

Entre ellos:

1. Error de coordenadas geográficas que enviaba partículas fuera del grid.
2. Signo incorrecto de gravedad que producía aceleración ascendente.
3. Estado de simulación sin grids de deposición y concentración.
4. Condición de carrera entre el optimizador y el motor principal.
5. Dependencia incorrecta de la velocidad de reproducción.
6. Error de conversión entre coordenadas absolutas y relativas en renderizado.
7. Acceso prematuro al controlador del mapa.
8. Temporización dependiente del frame rate en shader.

Esta información es importante porque demuestra un proceso de ingeniería basado en:

```text
IMPLEMENTAR
     ↓
MEDIR
     ↓
ENCONTRAR FALLOS
     ↓
CORREGIR
     ↓
CREAR REGRESIONES
     ↓
VALIDAR NUEVAMENTE
```

---

# Principio de madurez

El proyecto no debe presentarse como "terminado".

Debe presentarse como una base tecnológica que ha alcanzado un nivel significativo de madurez de software y que necesita avanzar hacia:

* validación experimental
* calibración
* comparación con datos reales
* colaboración científica
* pruebas de campo

---

# Mensaje técnico recomendado

"El sistema ha sido sometido a validación computacional mediante pruebas automatizadas, convergencia, invariantes, causalidad y escenarios extremos. Sin embargo, la validación experimental del modelo frente a mediciones reales de campo constituye una etapa futura necesaria."
