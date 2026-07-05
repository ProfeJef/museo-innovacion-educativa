# 🏛️ Museo Virtual de Innovación Educativa

Museo 3D interactivo construido con **A-Frame (Three.js)** que presenta 10 casos
reales de innovación pedagógica, divididos en dos galerías: Nacional (Colombia)
e Internacional (referentes mundiales).

## 🎮 Demo en vivo
👉 https://profejef.github.io/museo-innovacion-educativa/

## 🕹️ Controles
- **WASD / Flechas** — caminar
- **Mouse** — mirar alrededor
- **Clic en los cuadros** — abrir ficha completa del caso
- **Esc** — cerrar ficha

## 📂 Estructura del proyecto
| Archivo | Función |
|---|---|
| `index.html` | Escena 3D base y contenedores de sala |
| `js/data.js` | Contenido textual e imágenes de cada estación |
| `js/components.js` | Componentes A-Frame reutilizables |
| `js/main.js` | Construcción dinámica de salas y sistema de progreso |
| `css/style.css` | Interfaz (HUD, modal, minimapa, logros) |

## 🧩 Características
- Dos salas temáticas con iluminación y paleta de color diferenciadas.
- 10 paneles interactivos con spotlight individual.
- Sistema de progreso y logros ("Estaciones visitadas: X/10").
- Minimapa en vivo con posición del jugador.
- Avatar visible sincronizado 1:1 con la cámara.

## 🚀 Cómo ejecutar localmente
```bash
git clone https://profejef.github.io/museo-innovacion-educativa/
cd museo-innovacion-educativa
python -m http.server 8080
```
Abre `http://localhost:8080` en tu navegador.

## 🌐 Publicar en GitHub Pages
1. Ve a **Settings → Pages** en tu repositorio.
2. En "Branch", selecciona `main` y carpeta `/ (root)`.
3. Guarda; en 1-2 minutos tu museo estará en `https://profejef.github.io/museo-innovacion-educativa//`.

## 📚 Fuentes de los casos nacionales
Basado en experiencias documentadas por Colombia Aprende y el Ministerio de
Educación Nacional (Escuelas STEM+, robótica educativa, aulas activas).

## 📄 Licencia
MIT — libre para uso educativo y adaptación.
