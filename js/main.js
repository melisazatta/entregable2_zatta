const preguntas = [
  {
    pregunta: "¿Qué raza lidera Thrall?",
    opciones: ["Tauren", "Trols", "Orcos", "No-muertos"],
    respuesta: "Orcos",
  },
  {
    pregunta: "¿Por qué los murlocs hacen 'mrglglglgl'?",
    opciones: [
      "Es su idioma oficial",
      "Porque están ofendidos",
      "Porque te quieren atacar",
      "Porque no pagaron el curso de oratoria",
    ],
    respuesta: "Es su idioma oficial",
  },
  {
    pregunta: "¿Cómo llama Sylvanas a su despertador?",
    opciones: [
      "Mi alarma del tormento",
      "Val'kyr inteligente",
      "El otro esclavo",
      "La última esperanza",      
    ],
    respuesta: "Val'kyr inteligente",
  },
  {
    pregunta: "¿Cuál es la principal habilidad secreta de los trols de Zul'Gurub?",
    opciones: [
      "Cocinar pizza voodoo",
      "Bailar reggae",
      "Hacer sacrificios dramáticos",
      "Resetearse cuando los farmean demasiado",
    ],
    respuesta: "Resetearse cuando los farmean demasiado",
  },
  {
    pregunta: "¿Qué hace un tauren cuando se cansa?",
    opciones: [
      "Se convierte en hamburguesa",
      "Muge por ayuda",
      "Se sienta en una roca filosóficamente",
      "Pide DPS pero no va",
    ],
    respuesta: "Se sienta en una roca filosóficamente",
  },
  {
    pregunta: "¿Cuál de estos personajes se convirtió en el Rey Exánime (Lich King)?",
    opciones: [
      "Illidan Stormrage",
      "Kael'thas Sunstrider",
      "Arthas Menethil",
      "Gul'dan",
    ],
    respuesta: "Arthas Menethil",
  },
  {
    pregunta: "¿De qué clase es originalmente Illidan?",
    opciones: ["Guerrero", "Cazador de demonios", "Chamán", "Mago"],
    respuesta: "Cazador de demonios",
  },
  {
    pregunta: "¿Quién lidera a los Renegados (Forsaken)?",
    opciones: ["Sylvanas Brisaveloz", "Kel'Thuzad", "Varimathras", "Nathanos"],
    respuesta: "Sylvanas Brisaveloz",
  },
  {
    pregunta: "¿Quién fue el líder de la Horda antes de Vol'jin?",
    opciones: [
      "Garrosh Hellscream",
      "Thrall",
      "Cairne Pezuña de Sangre",
      "Rexxar",
    ],
    respuesta: "Garrosh Hellscream",
  },
  {
    pregunta: "¿Qué raza es Tyrande Susurravientos?",
    opciones: ["Humana", "Draenei", "Elfa de la noche", "Alto elfa"],
    respuesta: "Elfa de la noche",
  }
]

// Busca el elemento cuyo id sea preguntas-container
let preguntasContainer = document.getElementById("preguntas-container")

// Funcion para mostrar cards con las preguntas del array
function mostrarPreguntas(arrayPreguntas) {
    const resultados = obtenerResultados()

  arrayPreguntas.forEach((interrogante, indice) => {
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

mostrarPreguntas(preguntas)

actualizarContador()

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

  const resultados = []
  for (const _pregunta of preguntas) {
    resultados.push(null)
  }
  return resultados
}

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

  const ultimo = localStorage.getItem("ultimoPuntaje") || []
if (ultimo !== null) {
  document.getElementById("ultimo-puntaje").textContent = `Último puntaje: ${ultimo}`
}
}


// Muestra el mensaje final con el resumen
function mostrarMensajeFinal(correctas, incorrectas) {
   const resultados = JSON.parse(localStorage.getItem("resultados")) || []

   const respuestasBien = resultados.filter(r => r === "bien").length

  if(respuestasBien >= 5){
      mensajeExtra = "¡Sos un verdadero héroe de Azeroth!"}
    else {mensajeExtra = "Tu conocimiento del WoW fue absorbido por un murloc."}

  const mensajeFinal = document.getElementById("mensaje")
  mensajeFinal.textContent = `Bien! Terminaste la Trivia.
  De ${preguntas.length} preguntas, respondiste ${correctas} bien y ${incorrectas} mal. ${mensajeExtra}`

  localStorage.setItem("ultimoPuntaje", correctas)

  // Llama a la función para crear y agregar el botón
  crearBotonVolver(mensajeFinal)
}


// Crea el botón "Resetear"
function crearBotonVolver(contenedor) {
  const button = document.createElement("button")
  button.classList.add("btn-volver")
  button.textContent = "Resetear"

  button.addEventListener("click", () => {
    // localStorage.clear()
    localStorage.removeItem("resultados")


    preguntasContainer.innerHTML = ""
    contenedor.innerHTML = ""
    mostrarPreguntas(preguntas)
    actualizarContador()
  })

  contenedor.appendChild(button)
}