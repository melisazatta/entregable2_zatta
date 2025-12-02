
//Mostrar Ranking en una tabla
function mostrarRanking () {

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
          <th>Puntaje</th>
          <th>Fecha</th>
        </tr>
      </thead>
      <tbody id="ranking-body"></tbody>
    </table>`

    const tbody = document.getElementById("ranking-body")

     

    lista.forEach((item, i)=> {
        const fila = document.createElement("tr")
        fila.classList.add("item-ranking")

        fila.innerHTML = `
        <td><span class="medalla"></span>${i + 1}.</td> 
        <td>${item.nombre}</td>
        <td>${item.puntaje}</td> 
        <td>${item.fecha}</td>`
       
        tbody.appendChild(fila)
    })
  }
mostrarRanking()

//Obtener ranking del storage
function obtenerRanking() {
  const ranking = JSON.parse(localStorage.getItem("ranking")) || []
return ranking
//   .sort((a, b) => b.puntaje - a.puntaje)
}

//Muestra hasta 15 resultados
function limitarRanking(ranking, limite) {
    return ranking.slice(0, limite)
}