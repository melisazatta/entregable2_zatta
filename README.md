# Trivia WoW — Proyecto Final

## 🧠 Qué es este proyecto  
Este proyecto es una trivia inspirada en el universo de **World of Warcraft (WoW)**. Permite:  
- Mostrar preguntas de una base (JSON) + preguntas extra guardadas en localStorage.  
- Que el usuario responda, verifique la respuesta, obtenga feedback inmediato (correcto / incorrecto).  
- Llevar un ranking local con nombre y puntaje.  
- Agregar nuevas preguntas vía formulario (usando SweetAlert).  
- Editar o borrar preguntas extra.  
- Persistir los datos en `localStorage`, de modo que las preguntas extra persistan entre recargas.

También implementé — con un mock de personajes — una galería de personajes que se cargan desde una API externa (MockAPI), mostrando cards con imagen, nombre y clase.

---

🛠 Tecnologías usadas

HTML / CSS / JavaScript puro (vanilla JS)

fetch + Promesas para consumir JSON (preguntas base y MockAPI)

localStorage para persistencia de datos (preguntas extra + ranking)

SweetAlert para formularios modales (agregar / editar preguntas)

Diseño responsivo con CSS Grid / Flexbox

---

✅ Funcionalidades implementadas

Trivia con preguntas fijas (JSON) + preguntas personalizadas guardadas en localStorage

Validación de respuestas + feedback visual

Contador de aciertos / errores + puntaje final + ranking de jugadores

Agregar, editar y borrar preguntas extra desde la interfaz

Galería de personajes: obtiene datos desde API externa (MockAPI) y los muestra como cards con imagen, nombre y clase

Estilos responsivos — las cards se adaptan a distintos anchos de pantalla

