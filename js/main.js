
// Obtener preguntas del json
const URL = "./db/data.json"

let preguntas = []

function obtenerPreguntas() {
fetch(URL)
.then(response => response.json())
.then(data => {
  preguntas = data
  mostrarPreguntas(data)
  actualizarContador()
})
.catch(err => console.log("Hubo un error", err))
.finally(() => console.log("Petición finalizada."))

}

// Busca el elemento cuyo id sea preguntas-container
const preguntasContainer = document.getElementById("preguntas-container")

// Crea cards con las preguntas del json
function mostrarPreguntas(listaPreguntas) {
    const resultados = obtenerResultados()

  listaPreguntas.forEach((interrogante, indice) => {
    const card = document.createElement("div")
    card.classList.add("card")
    card.id = indice

    let opcionesHTML = ""

    interrogante.opciones.forEach(opcion => {
      opcionesHTML += `
        <button class="opcion-btn" indice="${indice}" opcion="${opcion}">
          ${opcion}
        </button>
      `
    })

    card.innerHTML = `
      <h2>${interrogante.pregunta}</h2>
      <div class="opciones-container">
        ${opcionesHTML}
      </div>
      <p class="solucion"></p>
    `

    preguntasContainer.appendChild(card)

     if (resultados[indice]) {
      const botonesCard = card.querySelectorAll(".opcion-btn")
      botonesCard.forEach(btn => btn.disabled = true)
    }
  })

  activarOpciones()
}
obtenerPreguntas()

// mostrarPreguntas(preguntas)

// actualizarContador()

// Asigna un evento a los botones
function activarOpciones() {
  const botones = document.querySelectorAll(".opcion-btn")
  botones.forEach(boton => {
    boton.addEventListener("click", manejarRespuesta)
  })
}

// Obtener y guardar resultados en un array en el storage
function obtenerResultados() {
  const guardados = JSON.parse(localStorage.getItem("resultados"))
  if (guardados) return guardados

  if (preguntas[0] === undefined) return []

  const resultados = []
  for (const _pregunta of preguntas) {
    resultados.push(null)
  }
  return resultados
}

// Guarda resultados en storage
function guardarResultados(array) {
  localStorage.setItem("resultados", JSON.stringify(array))
}


function manejarRespuesta(e) {
  const indice = e.currentTarget.getAttribute("indice")
  const respuestaElegida = e.currentTarget.getAttribute("opcion")

  const pregunta = preguntas[indice]
  const correcta = pregunta.respuesta

  const card = document.getElementById(indice)
  const solucion = card.querySelector(".solucion")

  const resultados = obtenerResultados()

  if (respuestaElegida === correcta) {
    resultados[indice] = "bien"
    solucion.textContent = "✅ ¡Correcto!"
    e.currentTarget.classList.add("verde")
  } else {
    resultados[indice] = "mal"
    solucion.textContent = "❌ Incorrecto. La correcta era: " + correcta
    e.currentTarget.classList.add("roja")
  }

    guardarResultados(resultados)

  const botonesCard = card.querySelectorAll(".opcion-btn")
  botonesCard.forEach(btn => btn.disabled = true)

  actualizarContador()
}

// Actualiza el contador con localStorage
function actualizarContador() {
 const resultados = obtenerResultados()

   const correctas = resultados.filter(resultado => resultado === "bien").length
  const incorrectas = resultados.filter(resultado => resultado === "mal").length

  document.getElementById("contador-aciertos").textContent =
    `Aciertos: ${correctas} / ${preguntas.length}`
  document.getElementById("contador-erroneas").textContent =
    `Errores: ${incorrectas} / ${preguntas.length}`

  if (correctas + incorrectas === preguntas.length) {
    mostrarMensajeFinal(correctas, incorrectas)
  }

  const ultimo = localStorage.getItem("ultimoPuntaje")
if (ultimo !== null) {
  document.getElementById("ultimo-puntaje").textContent = `Último puntaje: ${ultimo}`
}
}


// Muestra el mensaje final con el resumen
// function mostrarMensajeFinal(correctas, incorrectas) {
//    const resultados = JSON.parse(localStorage.getItem("resultados")) || []

//    const respuestasBien = resultados.filter(r => r === "bien").length

//   if(respuestasBien >= 5){
//       mensajeExtra = "¡Sos un verdadero héroe de Azeroth!"}
//     else {mensajeExtra = "Tu conocimiento del WoW fue absorbido por un murloc."}

//   const mensajeFinal = document.getElementById("mensaje")
//   mensajeFinal.textContent = `Bien! Terminaste la Trivia.
//   De ${preguntas.length} preguntas, respondiste ${correctas} bien y ${incorrectas} mal. ${mensajeExtra}`

//   localStorage.setItem("ultimoPuntaje", correctas)

//   // Llama a la función para crear y agregar el botón
//   crearBotonVolver(mensajeFinal)
  
// }

// Guardar Ranking
function guardarRanking(nombre, puntaje) {
  const ranking = JSON.parse(localStorage.getItem("ranking")) || []

  ranking.push({
    nombre: nombre,
    puntaje: puntaje,
    fecha: new Date().toLocaleDateString()
  })

  // Ordena de mayor a menor
  ranking.sort((a, b) => b.puntaje - a.puntaje)

  localStorage.setItem("ranking", JSON.stringify(ranking))
}

// Alerta con resultados
function mostrarMensajeFinal(correctas, incorrectas) {
  const resultados = obtenerResultados()
  const respuestasBien = resultados.filter(r => r === "bien").length

  let mensajeExtra =
    respuestasBien >= 5
      ? "¡Sos un verdadero héroe de Azeroth!"
      : "Tu conocimiento del WoW fue absorbido por un murloc."

  const mensaje = `
    <p>Bien! Terminaste la Trivia.</p>
    <p>De ${preguntas.length} preguntas, respondiste:</p>
    <p>✅ ${correctas} bien</p>
    <p>❌ ${incorrectas} mal</p>
    <p>${mensajeExtra}</p>
    <br></br>
    <strong>Ingresá tu nombre para guardarlo en el ranking:</strong>
  `

  // Guardar puntaje final
  localStorage.setItem("ultimoPuntaje", correctas)
  // guardarRanking(correctas)

  Swal.fire({
    title: 'Resultado final',
    html: mensaje,
    input: "text",
    inputPlaceholder: "Tu nombre",
     inputAttributes: {
    maxlength: 8
  },
    confirmButtonText: 'Guardar',
    allowOutsideClick: false,
    allowEscapeKey: false,
    inputValidator: value => {
      if (!value.trim()) {return "Tenés que ingresar un nombre."}
      if (value.trim().length > 8) {
    return "Máximo 8 caracteres."}
    },
    customClass: {
      popup: "wow-popup",
      confirmButton: "wow-button"
    }
  }).then(result => {
    if (result.isConfirmed) {

      const nombre = result.value.trim()

      guardarRanking(nombre, correctas)
      localStorage.setItem("ultimoPuntaje", correctas)

   Swal.fire({
        title: "Guardado!",
        text: "Tu puntaje fue agregado al ranking.",
        icon: "success",
        confirmButtonText: "Aceptar",
        customClass: {
          popup: "wow-popup",
          confirmButton: "wow-button"
        }
  }).then(() => {
    // Resetear
    resetearTrivia()
  })
}
  })
}

function resetearTrivia() {
  localStorage.removeItem("resultados")

    preguntasContainer.innerHTML = ""
    document.getElementById("mensaje").innerHTML = ""

    mostrarPreguntas(preguntas)
    actualizarContador()
}