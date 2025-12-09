// Obtener preguntas
const URL = "./db/data.json"

let preguntasBase = []
let preguntasExtras = []
let preguntas = []

function obtenerPreguntas() {
  preguntasExtras = JSON.parse(localStorage.getItem("preguntasExtras")) || []

    fetch(URL)
      .then((response) => response.json())
      .then((data) => {
        preguntasBase = data

        preguntas = [...preguntasBase, ...preguntasExtras]

        mostrarPreguntas(preguntas)
        actualizarContador()
      })
      .catch((err) => console.log("Hubo un error", err))
      .finally(() => console.log("Petición finalizada."))
}

// Busca el elemento cuyo id sea preguntas-container
const preguntasContainer = document.getElementById("preguntas-container")
obtenerPreguntas()

// Crea cards con las preguntas del json
function mostrarPreguntas(listaPreguntas) {
  const resultados = obtenerResultados()
  preguntasContainer.innerHTML = ""

  listaPreguntas.forEach((interrogante, indice) => {
    const card = document.createElement("div")
    card.classList.add("card")
    card.id = indice

    let opcionesHTML = ""

    const esBase = indice < preguntasBase.length
    const esExtra = !esBase

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

      <div class="acciones-pregunta">
        <button class="btn-editar" data-indice="${indice}">✏️</button>
        ${
          esExtra
            ? `<button class="btn-borrar" data-indice="${indice}">🗑️</button>`
            : ""
        }
      </div>
    `

    preguntasContainer.appendChild(card)

    if (resultados[indice]) {
      const botonesCard = card.querySelectorAll(".opcion-btn")
      botonesCard.forEach((btn) => (btn.disabled = true))
    }
  })

  activarOpciones()
  activarBotonesEdicion()
}

// Asigna un evento a los botones
function activarOpciones() {
  const botones = document.querySelectorAll(".opcion-btn")
  botones.forEach((boton) => {
    boton.addEventListener("click", manejarRespuesta)
  })
}

// Obtener y guardar resultados en un array en el storage
function obtenerResultados() {
  const guardados = JSON.parse(localStorage.getItem("resultados"))

  // Si no existe nada, crear un array nuevo
  if (!guardados) {
    const nuevo = []
    for (const _pregunta of preguntas) {
      nuevo.push(null)
    }
    localStorage.setItem("resultados", JSON.stringify(nuevo))
    return nuevo
  }

  // Si el largo cambió, ajustar
  if (guardados.length !== preguntas.length) {
    const ajustado = []
    let i = 0

    for (const _pregunta of preguntas) {
      ajustado.push(guardados[i] !== undefined ? guardados[i] : null)
      i++
    }

    localStorage.setItem("resultados", JSON.stringify(ajustado))
    return ajustado
  }
  return guardados
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
  botonesCard.forEach((btn) => (btn.disabled = true))

  actualizarContador()
}

// Actualiza el contador con localStorage
function actualizarContador() {
  const resultados = obtenerResultados()

  const correctas = resultados.filter(
    (resultado) => resultado === "bien"
  ).length
  const incorrectas = resultados.filter(
    (resultado) => resultado === "mal"
  ).length

  document.getElementById(
    "contador-aciertos"
  ).textContent = `Aciertos: ${correctas} / ${preguntas.length}`
  document.getElementById(
    "contador-erroneas"
  ).textContent = `Errores: ${incorrectas} / ${preguntas.length}`

  if (correctas + incorrectas === preguntas.length) {
    mostrarMensajeFinal(correctas, incorrectas)
  }

  const ultimo = localStorage.getItem("ultimoPuntaje");
  if (ultimo !== null) {
    document.getElementById(
      "ultimo-puntaje"
    ).textContent = `Último puntaje: ${ultimo}`
  }
}
//Actualizar
function refrescarUI() {
  mostrarPreguntas(preguntas)
  actualizarContador()
}

// Guardar Ranking
function guardarRanking(nombre, puntaje) {
  const ranking = JSON.parse(localStorage.getItem("ranking")) || []

  ranking.push({
    nombre: nombre,
    puntaje: puntaje,
    fecha: new Date().toLocaleDateString(),
  })

  // Ordena de mayor a menor
  ranking.sort((a, b) => b.puntaje - a.puntaje)

  localStorage.setItem("ranking", JSON.stringify(ranking))
}

// Alerta con resultados
function mostrarMensajeFinal(correctas, incorrectas) {
  const resultados = obtenerResultados()
  const respuestasBien = resultados.filter((r) => r === "bien").length

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

  Swal.fire({
    title: "Resultado final",
    html: mensaje,
    input: "text",
    inputPlaceholder: "Tu nombre",
    inputAttributes: {
      maxlength: 8,
    },
    confirmButtonText: "Guardar",
    allowOutsideClick: false,
    allowEscapeKey: false,
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
    if (result.isConfirmed) {
      const nombre = result.value.trim();

      guardarRanking(nombre, correctas);
      localStorage.setItem("ultimoPuntaje", correctas);

      Swal.fire({
        title: "Guardado!",
        text: "Tu puntaje fue agregado al ranking.",
        icon: "success",
        confirmButtonText: "Aceptar",
        customClass: {
          popup: "wow-popup",
          confirmButton: "wow-button",
        },
      }).then(() => {
        // Resetear
        resetearTrivia()
      })
    }
  })
}
// Borra todas las respuestas
function resetearTrivia() {
  localStorage.removeItem("resultados")

  preguntasContainer.innerHTML = ""
  document.getElementById("mensaje").innerHTML = "";

  refrescarUI()
}

// Agregar/ Modificar Preguntas

//Obtener preguntas
function obtenerPreguntasLS() {
  return JSON.parse(localStorage.getItem("preguntasExtras")) || []
}
// Guardar
function guardarPreguntas(lista) {
  localStorage.setItem("preguntasExtras", JSON.stringify(lista))
}
// Agregar una pregunta
function agregarPregunta(nueva) {
  const lista = obtenerPreguntasLS()

  lista.push(nueva)

  guardarPreguntas(lista)
}
// Modificar
function modificarPregunta(indice, nueva) {
  const listaExtras = obtenerPreguntasLS()

 if (indice < preguntasBase.length) {
    preguntasBase[indice] = nueva;
  }
  // Si es pregunta extra (localStorage)
  else {
  const indiceExtra = indice - preguntasBase.length

  listaExtras[indiceExtra] = nueva
  guardarPreguntas(listaExtras)
  }
  
  preguntas = [...preguntasBase, ...listaExtras]

  // Vuelve a renderizar todo
  refrescarUI()
}

//Borrar
function borrarPregunta(indice) {
  const lista = obtenerPreguntasLS()

  const indiceExtra = indice - preguntasBase.length
  if (indiceExtra < 0) return   // no borrar preguntas base

  lista.splice(indiceExtra, 1)

  guardarPreguntas(lista)

  preguntas = [...preguntasBase, ...lista]
  mostrarPreguntas(preguntas)

  actualizarContador()
}

//Boton agregar pregunta
function botonAgregarPregunta() {
  const contenedor = document.getElementById("agregar-pregunta")

  if (!contenedor) return

  const btn = document.createElement("button")
  btn.textContent = "Agregar pregunta"
  btn.classList.add("btn-volver")
  btn.addEventListener("click", formAgregarPregunta)

  contenedor.appendChild(btn)
}
botonAgregarPregunta()

// Formulario para agregar con SweetAlert
function formAgregarPregunta() {
  Swal.fire({
    title: "Agregar pregunta",
    html: `
       <input id="swal-pregunta" class="swal2-input" placeholder="Pregunta"
             value="¿Quién fue el primer Lich King?">

      <input id="swal-op1" class="swal2-input" placeholder="Opción 1"
             value="Ner'zhul">
      <input id="swal-op2" class="swal2-input" placeholder="Opción 2"
             value="Arthas Menethil">
      <input id="swal-op3" class="swal2-input" placeholder="Opción 3"
             value="The Jailer">
      <input id="swal-op4" class="swal2-input" placeholder="Opción 4"
             value="Kel'Thuzad">

      <input id="swal-respuesta" class="swal2-input" placeholder="Respuesta correcta"
             value="Ner'zhul">
    `,
    focusConfirm: false,
    confirmButtonText: "Guardar",
    preConfirm: () => {
      const pregunta = document.getElementById("swal-pregunta").value.trim()
      const op1 = document.getElementById("swal-op1").value.trim()
      const op2 = document.getElementById("swal-op2").value.trim()
      const op3 = document.getElementById("swal-op3").value.trim()
      const op4 = document.getElementById("swal-op4").value.trim()
      const resp = document.getElementById("swal-respuesta").value.trim()

      if (!pregunta || !op1 || !op2 || !op3 || !op4 || !resp) {
        return Swal.showValidationMessage("Todos los campos son obligatorios")
      }

      if (![op1, op2, op3, op4].includes(resp)) {
        return Swal.showValidationMessage(
          "La respuesta debe coincidir con una de las opciones"
        )
      }

      return {
        pregunta,
        opciones: [op1, op2, op3, op4],
        respuesta: resp,
      }
    },
    customClass: {
      popup: "wow-popup",
      confirmButton: "wow-button",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      agregarPregunta(result.value)
      Swal.fire({
        title: "Guardado",
        text: "La pregunta fue agregada correctamente.",
        icon: "success",
        customClass: {
          popup: "wow-popup",
          confirmButton: "wow-button",
        },
      })
      obtenerPreguntas()
    }
  })
}

// Botones editar y borrar preguntas
function activarBotonesEdicion() {
  activarBotonesEditar();
  activarBotonesBorrar();
}

// Evento para editar
function activarBotonesEditar() {
  document.querySelectorAll(".btn-editar").forEach((btn) => {
    btn.addEventListener("click", () => {
      const indice = btn.dataset.indice
      formEditarPregunta(indice)
    })
  })
}

// Formulario Editar con SweetAlert
function formEditarPregunta(indice) {
  const listaExtras = obtenerPreguntasLS()
  let p

  if (indice < preguntasBase.length) {
    p = preguntasBase[indice]
    } else {
  const indiceExtra = indice - preguntasBase.length
    p = listaExtras[indiceExtra]
    }
  Swal.fire({
    title: "Editar pregunta",
    html: `
      <input id="swal-pregunta" class="swal2-input" value="${p.pregunta}">
      <input id="swal-op1" class="swal2-input" value="${p.opciones[0]}">
      <input id="swal-op2" class="swal2-input" value="${p.opciones[1]}">
      <input id="swal-op3" class="swal2-input" value="${p.opciones[2]}">
      <input id="swal-op4" class="swal2-input" value="${p.opciones[3]}">
      <input id="swal-respuesta" class="swal2-input" value="${p.respuesta}">
    `,
    confirmButtonText: "Guardar cambios",
    preConfirm: () => {
      const pregunta = document.getElementById("swal-pregunta").value.trim()
      const op1 = document.getElementById("swal-op1").value.trim()
      const op2 = document.getElementById("swal-op2").value.trim()
      const op3 = document.getElementById("swal-op3").value.trim()
      const op4 = document.getElementById("swal-op4").value.trim()
      const resp = document.getElementById("swal-respuesta").value.trim()

      if (!pregunta || !op1 || !op2 || !op3 || !op4 || !resp) {
        return Swal.showValidationMessage("Todos los campos son obligatorios")
      }

      if (![op1, op2, op3, op4].includes(resp)) {
        return Swal.showValidationMessage(
          "La respuesta debe estar entre las opciones"
        )
      }

      return {
        pregunta,
        opciones: [op1, op2, op3, op4],
        respuesta: resp,
      }
    },
    customClass: {
      popup: "wow-popup",
      confirmButton: "wow-button",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      modificarPregunta(indice, result.value)
      Swal.fire({
        title: "Actualizado",
        text: "La pregunta fue modificada.",
        icon: "success",
        customClass: {
          popup: "wow-popup",
          confirmButton: "wow-button",
        },
      })
    }
  })
}
// Evento para borrar
function activarBotonesBorrar() {
  document.querySelectorAll(".btn-borrar").forEach((btn) => {
btn.addEventListener("click", () => {
const indice = btn.dataset.indice;
      formEliminarPregunta(indice);
    })
  })
}
// Formulario con SweetAlert para borrar
function formEliminarPregunta(indice) {
 Swal.fire({
        title: "¿Eliminar pregunta?",
        text: "Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, borrar",
        cancelButtonText: "Cancelar",
        customClass: {
          popup: "wow-popup",
          confirmButton: "wow-button",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          borrarPregunta(indice)
          Swal.fire({
            title: "Eliminada",
            text: "La pregunta fue eliminada.",
            icon: "success",
            customClass: {
              popup: "wow-popup",
              confirmButton: "wow-button",
            },
          })
        }
      })
    }
