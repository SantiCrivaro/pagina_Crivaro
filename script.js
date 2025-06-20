document.addEventListener("DOMContentLoaded", function () {
  const diasDelMes = document.getElementById("diasDelMes");
  const botonAgregarEvento = document.getElementById("botonAgregarEvento");
  const etiquetaEvento = document.getElementById("EtiquetaEvento");
  const cerrarEtiqueta = document.getElementById("cerrarEtiqueta");
  const formEvento = document.getElementById("formEvento");
  const diaSeleccionado = document.getElementById("diaSeleccionado");

  // --- Persistencia con localStorage ---
  let eventosDelCalendario = {};
  if (localStorage.getItem("eventosDelCalendario")) {
    eventosDelCalendario = JSON.parse(localStorage.getItem("eventosDelCalendario"));
  }

  let diaActual = 1;
  let editando = false;
  let diaEditando = null;
  let indexEditando = null;

  // Generar días del mes
  for (let dia = 1; dia <= 30; dia++) {
    const divDia = document.createElement("div");
    divDia.className = "dia";
    divDia.textContent = dia;

    // Marcar días con eventos al cargar
    if (eventosDelCalendario[dia] && eventosDelCalendario[dia].length > 0) {
      divDia.classList.add("tiene-eventos");
    }

    divDia.addEventListener("click", () => {
      document.querySelectorAll(".dia").forEach(d => d.classList.remove("seleccionado"));
      divDia.classList.add("seleccionado");
      diaActual = dia;
      diaSeleccionado.textContent = dia;
      mostrarEventosEnBarraLateral(dia);
    });

    diasDelMes.appendChild(divDia);
  }

  // Abrir el formulario para agregar eventos
  botonAgregarEvento.addEventListener("click", () => {
    etiquetaEvento.classList.remove("etiqueta-oculto");
    document.getElementById("fechaEvento").value = diaActual;
    formEvento.reset();
    editando = false;
  });

  // Cerrar el formulario
  cerrarEtiqueta.addEventListener("click", () => {
    etiquetaEvento.classList.add("etiqueta-oculto");
  });

  // Guardar eventos
  formEvento.addEventListener("submit", function (e) {
    e.preventDefault();
    const nombre = document.getElementById("nombreEvento").value;
    const dia = parseInt(document.getElementById("fechaEvento").value);
    const inicio = document.getElementById("inicioEvento").value;
    const fin = document.getElementById("finEvento").value;

    if (!eventosDelCalendario[dia]) eventosDelCalendario[dia] = [];

    if (editando) {
      eventosDelCalendario[diaEditando][indexEditando] = { nombre, inicio, fin };
    } else {
      eventosDelCalendario[dia].push({ nombre, inicio, fin });
    }

    // Guardar en localStorage
    localStorage.setItem("eventosDelCalendario", JSON.stringify(eventosDelCalendario));

    formEvento.reset();
    etiquetaEvento.classList.add("etiqueta-oculto");
    editando = false;

    const diaElemento = [...diasDelMes.children].find(el => parseInt(el.textContent) === dia);
    if (diaElemento) diaElemento.classList.add("tiene-eventos");

    if (dia === diaActual) mostrarEventosEnBarraLateral(dia);
  });

  // Mostrar eventos en la barra lateral
  function mostrarEventosEnBarraLateral(dia) {
    const eventos = eventosDelCalendario[dia] || [];
    const contenedor = document.getElementById("eventosDelDia");
    contenedor.innerHTML = "";

    const lista = document.createElement("div");
    lista.className = "lista-eventos";

    eventos.forEach((evento, index) => {
      const elemento = document.createElement("div");
      elemento.className = "evento-item";
      elemento.innerHTML = `
        <div class="evento-detalles">
          <div class="evento-nombre">${evento.nombre}</div>
          <div class="evento-horario">${evento.inicio} - ${evento.fin}</div>
        </div>
        <div class="d-flex gap-2">
          <button class="editar-evento" data-dia="${dia}" data-index="${index}"> EDITAR </button>
          <button class="eliminar-evento" data-dia="${dia}" data-index="${index}">✖</button>
        </div>
      `;
      lista.appendChild(elemento);
    });

    contenedor.appendChild(lista);

    // Funcionalidad para eliminar eventos
    document.querySelectorAll(".eliminar-evento").forEach(btn => {
      btn.addEventListener("click", () => {
        const dia = parseInt(btn.getAttribute("data-dia"));
        const index = parseInt(btn.getAttribute("data-index"));
        eventosDelCalendario[dia].splice(index, 1);

        if (eventosDelCalendario[dia].length === 0) {
          delete eventosDelCalendario[dia];
        }

        // Guardar en localStorage
        localStorage.setItem("eventosDelCalendario", JSON.stringify(eventosDelCalendario));

        mostrarEventosEnBarraLateral(dia);
        const diaElemento = [...diasDelMes.children].find(el => parseInt(el.textContent) === dia);
        if (diaElemento && eventosDelCalendario[dia] === undefined) {
          diaElemento.classList.remove("tiene-eventos");
        }
      });
    });

    // Funcionalidad para editar eventos
    document.querySelectorAll(".editar-evento").forEach(btn => {
      btn.addEventListener("click", () => {
        const dia = parseInt(btn.getAttribute("data-dia"));
        const index = parseInt(btn.getAttribute("data-index"));
        const evento = eventosDelCalendario[dia][index];

        document.getElementById("nombreEvento").value = evento.nombre;
        document.getElementById("fechaEvento").value = dia;
        document.getElementById("inicioEvento").value = evento.inicio;
        document.getElementById("finEvento").value = evento.fin;

        etiquetaEvento.classList.remove("etiqueta-oculto");
        editando = true;
        diaEditando = dia;
        indexEditando = index;
      });
    });
  }

  // Mostrar eventos del primer día al cargar
  mostrarEventosEnBarraLateral(diaActual);
});