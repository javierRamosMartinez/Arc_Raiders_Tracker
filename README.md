# 🛰️ Arc Raiders Loot & Crafting Tracker

Herramienta de planificación y rastreo de materiales para **Arc Raiders** que ayuda a los jugadores a optimizar el crafting y planificar qué objetos recolectar en el mundo del juego.

La aplicación analiza datos de la comunidad y calcula automáticamente las mejores fuentes de materiales mediante ingeniería inversa.

## 🔗 Live Demo

👉 https://arc-raiders-portfolio.vercel.app/

---

## 🚀 Características

- **Calculadora de Crafting**
  Desglose automático de todos los materiales necesarios para fabricar un objeto.

- **Loot Planner Inteligente**
  Identifica qué objetos del mundo conviene recoger para obtener los materiales deseados mediante reciclaje.

- **Reverse Material Search**
  Búsqueda inversa desde material → objeto que lo produce.

- **Sistema de Favoritos**
  Guarda objetivos de crafting usando persistencia con Context API.

- **UI Estilo Cyberpunk**
  Interfaz moderna y responsive diseñada con Tailwind CSS.

- **Datos Dinámicos**
  La aplicación consume JSON actualizados desde repositorios de la comunidad.

---

## 🧠 Problema que resuelve

En Arc Raiders, los materiales no siempre se obtienen directamente.  
Muchos provienen de **reciclar objetos del mundo**.

Esto hace difícil responder preguntas como:

- ¿Qué objetos debo recoger para fabricar este ítem?
- ¿Cuál es la forma más eficiente de conseguir un material específico?

Esta aplicación resuelve ese problema mediante un sistema de **ingeniería inversa del loot**.

---

## ⚙️ Cómo funciona

El sistema analiza estructuras de datos como:

Cuando el usuario selecciona un material, la app:

1. Recorre toda la base de datos de objetos
2. Filtra los que contienen ese material
3. Calcula las mejores fuentes
4. Ordena los resultados por eficiencia

Para optimizar el rendimiento:

- Se usa **useMemo** para evitar recalcular resultados innecesarios
- Los cálculos solo se ejecutan cuando cambian:
  - favoritos
  - dataset
  - filtros activos

Esto permite mantener una experiencia fluida incluso con grandes volúmenes de datos.

---

## 🛠️ Stack Tecnológico

**Frontend**

- React
- React Hooks
- Functional Components

**State Management**

- React Context API

**Routing**

- React Router DOM

**Estilos**

- Tailwind CSS

**Datos**

- Fetch API
- JSON dinámicos de la comunidad

---

## 📦 Instalación

Clonar el repositorio:

```bash
git clone https://github.com/javierRamosMartinez/Arc_Raiders_Tracker.git
```
