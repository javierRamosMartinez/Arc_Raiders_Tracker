# 🛰️ Arc Raiders Loot & Crafting Tracker

Una herramienta avanzada de planificación y rastreo de materiales para el universo de Arc Raiders. Esta aplicación permite a los jugadores gestionar sus objetivos de fabricación y optimizar sus rutas de recolección de loot mediante ingeniería inversa de datos.

![Live Demo](https://img.shields.io/badge/Demo-En%20Vivo-blue?style=for-the-badge) 


## 🚀 Características Principales

- **Calculadora de Crafting:** Desglose automático de materiales necesarios para cualquier ítem o mejora.
- **Planificador de Loot Inteligente:** Algoritmo dinámico que identifica qué objetos del mundo (como relojes, proyectores o módulos) deben recolectarse para obtener materiales específicos mediante reciclaje.
- **Sistema de Favoritos:** Persistencia de objetivos de fabricación (Context API) para un acceso rápido.
- **Interfaz "Cyberpunk":** UI moderna, oscura y responsive construida con Tailwind CSS, enfocada en la legibilidad y la inmersión en el juego.
- **Sincronización en Tiempo Real:** Consumo de datos actualizados directamente desde repositorios de la comunidad.

## 🛠️ Stack Tecnológico

* **Frontend:** React.js (Hooks, Functional Components)
* **Estilos:** Tailwind CSS (Arquitectura basada en utilidades)
* **Gestión de Estado:** React Context API
* **Enrutado:** React Router DOM
* **Datos:** Fetch API para consumo de JSON dinámicos

## 🧠 Desafíos Técnicos Resueltos

Uno de los mayores retos fue implementar la **búsqueda inversa de materiales**. A diferencia de una base de datos tradicional, aquí el usuario marca un "Procesador" y la app debe recorrer cientos de objetos buscando en sus propiedades de reciclaje (`recyclesInto`) para mostrar las fuentes más eficientes. 

Para optimizar esto, utilicé `useMemo` para asegurar que los cálculos de filtrado y ordenamiento solo se ejecuten cuando cambian los favoritos o la base de datos, garantizando un rendimiento fluido (60fps) incluso con grandes volúmenes de datos.

## 📦 Instalación y Uso

1. Clona el repositorio:

   git clone [https://github.com/tu-usuario/arc-raiders-tracker.git](https://github.com/tu-usuario/arc-raiders-tracker.git)

2. Instala las dependencias

   npm install

3. Lanza la aplicacion en modo desarrollo

   npm run dev