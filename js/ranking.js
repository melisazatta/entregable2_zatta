//Mostrar Ranking en una tabla
function mostrarRanking() {
  let lista = obtenerRanking()

  lista = limitarRanking(lista, 15)

  const contenedor = document.getElementById("ranking-container")

  if (lista.length === 0) {
    contenedor.innerHTML = "<p>No hay puntajes registrados aún.</p>"
    return
  }

  contenedor.innerHTML = `<h2>Ranking</h2>
    <table class="tabla-ranking">
      <thead>
        <tr>
          <th>Posición</th>
          <th>Nombre</th>
          <th>Puntos</th>
          <th>Fecha</th>
          <th>Acción</th>

        </tr>
      </thead>
      <tbody id="ranking-body"></tbody>
    </table>`

  const tbody = document.getElementById("ranking-body")

  lista.forEach((item, i) => {
    const fila = document.createElement("tr")
    fila.classList.add("item-ranking")

    fila.innerHTML = `
        <td><span class="medalla"></span>${i + 1}.</td> 
        <td>${item.nombre}</td>
        <td>${item.puntaje}</td> 
        <td>${item.fecha}</td>
        <td>
        <button class="btn-editar">✏️</button>
        <button class="btn-borrar">🗑️</button>
        </td>
        `

    tbody.appendChild(fila)

    const btnEditar = fila.querySelector(".btn-editar")
    const btnBorrar = fila.querySelector(".btn-borrar")

    btnEditar.addEventListener("click", () => {
      Swal.fire({
        title: "Ingresa nuevo nombre",
        input: "text",
        inputValue: item.nombre,
        confirmButtonText: "Guardar",
        showCancelButton: true,
        inputAttributes: {
          maxlength: 8,
        },
        inputValidator: (value) => {
          if (!value.trim()) {
            return "Tenés que ingresar un nombre."
          }
          if (value.trim().length > 8) {
            return "Máximo 8 caracteres."
          }
        },
        customClass: {
          popup: "wow-popup",
          confirmButton: "wow-button",
        },
      }).then((result) => {
        if (result.isConfirmed && result.value.trim()) {
          editarJugador(i, result.value.trim())
        }
      })
    })

    btnBorrar.addEventListener("click", () => {
      borrarJugada(i)
    })
  })
}
mostrarRanking()

//Obtener ranking del storage
function obtenerRanking() {
  const ranking = JSON.parse(localStorage.getItem("ranking")) || []
  return ranking
}

//Muestra hasta 15 resultados
function limitarRanking(ranking, limite) {
  return ranking.slice(0, limite)
}

// Editar nombre de jugador
function editarJugador(index, nuevoNombre) {
  const ranking = JSON.parse(localStorage.getItem("ranking")) || []

  ranking[index].nombre = nuevoNombre

  localStorage.setItem("ranking", JSON.stringify(ranking))
  mostrarRanking()
}

//Borrar una jugada del ranking
function borrarJugada(index) {
  const ranking = JSON.parse(localStorage.getItem("ranking")) || []

  ranking.splice(index, 1)

  localStorage.setItem("ranking", JSON.stringify(ranking))
  mostrarRanking()
}

// Vaciar ranking
function vaciarRanking() {
  localStorage.removeItem("ranking")
  mostrarRanking()
}

// Crea boton para vaciar el ranking
function botonVaciar() {
  const contenedor = document.getElementById("vaciar-ranking")

  if (!contenedor) return;

  const boton = document.createElement("button")
  boton.textContent = "Vaciar ranking"
  boton.classList.add("btn-vaciar")

  boton.addEventListener("click", vaciarRanking)

  contenedor.appendChild(boton)
}
botonVaciar()
