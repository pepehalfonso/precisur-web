# Proyecto — PRECISUR

## En una frase

Precisur es una iniciativa tecnológica uruguaya orientada al desarrollo de herramientas para agricultura de precisión mediante la integración de simulación física, meteorología, sistemas geoespaciales, drones, sensores e inteligencia computacional.

---

# Problema que aborda

Las decisiones agrícolas relacionadas con aplicaciones aéreas y terrestres dependen de múltiples variables dinámicas:

* velocidad del viento
* dirección del viento
* ráfagas
* temperatura
* humedad
* tamaño de gota
* altura de aplicación
* velocidad de operación
* caudal
* geometría del lote
* presencia de zonas sensibles
* características de la aplicación

Estas variables interactúan entre sí.

Una decisión aparentemente simple puede producir consecuencias fuera del área objetivo.

La deriva de productos fitosanitarios representa un problema técnico, ambiental y operativo que requiere herramientas capaces de analizar escenarios antes de realizar una aplicación.

---

# Hipótesis central

La agricultura puede beneficiarse de sistemas que permitan pasar de decisiones basadas principalmente en experiencia aislada a decisiones asistidas por:

* datos
* modelos físicos
* simulación
* geografía
* meteorología
* optimización computacional

Precisur busca construir herramientas para avanzar hacia ese modelo.

---

# Componentes tecnológicos

## Simulación de deriva

Sistema de simulación de partículas y gotas que incorpora:

* gravedad
* velocidad terminal
* arrastre aerodinámico
* evaporación
* turbulencia
* perfiles verticales de viento
* ráfagas interpoladas
* deposición
* concentración espacial
* incertidumbre

El motor principal utiliza un timestep fijo y arquitectura orientada a reproducibilidad.

---

## Smart Spray

Sistema experimental de optimización orientado a evaluar alternativas de aplicación.

Considera:

* geometría del lote
* bordes sensibles
* buffers
* cobertura
* solapamiento
* exposición potencial
* deriva
* incertidumbre
* tiempo operativo

El sistema puede comparar múltiples configuraciones y generar candidatos de operación.

---

## Sistemas geoespaciales

Precisur integra conceptos de:

* SIG
* polígonos
* rutas
* proyecciones
* distancia geográfica
* orientación
* análisis espacial

La geometría del lote no es únicamente un elemento visual.

Forma parte del sistema de cálculo.

---

## Meteorología

El proyecto contempla la integración de:

* sensores meteorológicos
* estaciones propias
* fuentes meteorológicas externas
* velocidad del viento
* dirección
* ráfagas
* temperatura
* humedad
* presión

La visión es utilizar información meteorológica como entrada dinámica para los sistemas de análisis.

---

## Drones

Precisur trabaja conceptualmente en la integración de tecnologías relacionadas con:

* drones agrícolas
* planificación de rutas
* aplicaciones aéreas
* análisis previo a operación
* monitoreo
* agricultura de precisión

---

# Principio tecnológico

Precisur no se plantea como una única aplicación.

La visión es construir un ecosistema.

```text
                 METEOROLOGÍA
                       │
                       ▼
SENSORES ───────► DATOS AMBIENTALES
                       │
                       ▼
SATÉLITES ──────► CAPA GEOESPACIAL
                       │
                       ▼
                 PRECISUR CORE
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
      SIMULACIÓN    ANÁLISIS     OPTIMIZACIÓN
          │            │            │
          └────────────┼────────────┘
                       ▼
                  DECISIONES
                       │
                       ▼
                    DRONES
```

---

# Visión

La visión de Precisur es contribuir al desarrollo de capacidades tecnológicas propias para la agricultura de precisión.

El proyecto busca explorar cómo Uruguay puede combinar:

* ingeniería
* software
* electrónica
* ciencia de datos
* teledetección
* sistemas geográficos
* automatización
* robótica agrícola

para construir herramientas adaptadas al contexto regional.

---

# Estado actual

Precisur se encuentra en una etapa de desarrollo tecnológico.

Existen componentes implementados y validados mediante pruebas de software.

Sin embargo, determinados modelos requieren validación experimental y comparación con datos reales de campo.

Esta distinción debe mantenerse siempre visible en la comunicación institucional.
