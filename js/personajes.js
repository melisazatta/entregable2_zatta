
const URL = "https://6937a5204618a71d77cd2024.mockapi.io/personajes/personajes"
const container = document.getElementById("personajes-container")

let personajes = []

// Trae personajes de MockAPI
fetch(URL)
  .then(response => response.json())
  .then(data => {
    personajes = data
    mostrarPersonajes(personajes)
  })
  .catch(err => console.error("Error al cargar personajes:", err))

// Función para renderizar cards
function mostrarPersonajes(lista) {
  container.innerHTML = ""
  lista.forEach(personaje => {
    const card = document.createElement("div")
    card.classList.add("personajes-card")

    card.innerHTML = `
      <img src="${personaje.imagen}" alt="${personaje.nombre}">
      <h3>${personaje.nombre}</h3>
      <p>${personaje.clase}</p>
    `

    container.appendChild(card)
  })
}
