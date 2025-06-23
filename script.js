document.addEventListener("DOMContentLoaded", function () {
  const diasDelMes = document.getElementById("diasDelMes");
  const botonAgregarEvento = document.getElementById("botonAgregarEvento");
  const etiquetaEvento = document.getElementById("EtiquetaEvento");
  const cerrarEtiqueta = document.getElementById("cerrarEtiqueta");
  const formEvento = document.getElementById("formEvento");
  const diaSeleccionado = document.getElementById("diaSeleccionado");
  const inicioEventoInput = document.getElementById("inicioEvento");
  const finEventoInput = document.getElementById("finEvento");

  // Carga los eventos guardados en localStorage
  let eventosDelCalendario = {};
  if (localStorage.getItem("eventosDelCalendario")) {
    eventosDelCalendario = JSON.parse(localStorage.getItem("eventosDelCalendario"));
  }

  // Guarda los eventos en localStorage
  function guardarEventos() {
    localStorage.setItem("eventosDelCalendario", JSON.stringify(eventosDelCalendario));
  }

  // Busca el elemento del DOM correspondiente a un día
  function buscarElementoDia(dia) {
    let diaElemento = null;
    for (let el of diasDelMes.children) {
      if (parseInt(el.textContent) === dia) {
        diaElemento = el;
        break;
      }
    }
    return diaElemento;
  }

  // van a servir para decir si estoy creando o editando un evento
  let diaActual = 1;
  let editando = false;
  let diaEditando = null;
  let indexEditando = null;

  // este año junio arranca un lunes asi que hay 6 días vacíos antes del 1
  for (let i = 0; i < 6; i++) {
    const emptyDiv = document.createElement("div");
    emptyDiv.className = "dia dia-vacia";
    diasDelMes.appendChild(emptyDiv);
  }

  // Crea los días del mes 
  for (let dia = 1; dia <= 30; dia++) {
    const divDia = document.createElement("div");
    divDia.className = "dia";
    divDia.textContent = dia;

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

  // abre el formulario para agregar un evento
  botonAgregarEvento.addEventListener("click", () => {
    etiquetaEvento.classList.remove("etiqueta-oculto");
    document.getElementById("fechaEvento").value = diaActual;
    formEvento.reset();
    editando = false;
    finEventoInput.min = "";
  });

  // cierra el formulario
  cerrarEtiqueta.addEventListener("click", () => {
    etiquetaEvento.classList.add("etiqueta-oculto");
  });

  // un evento no puede emepezar antes de que termine otro
  inicioEventoInput.addEventListener("input", function () {
    finEventoInput.min = inicioEventoInput.value;
    if (finEventoInput.value < inicioEventoInput.value) {
      finEventoInput.value = inicioEventoInput.value;
    }
  });

  // Maneja el envío del formulario para agregar o editar eventos
  formEvento.addEventListener("submit", function (e) {
    e.preventDefault();
    const nombre = document.getElementById("nombreEvento").value;
    const dia = parseInt(document.getElementById("fechaEvento").value);
    const inicio = inicioEventoInput.value;
    const fin = finEventoInput.value;

    if (editando) {
      // si cuando editas cambias de dia, el evento se mueve al nuevo dia que seleccionaste
      if (dia !== diaEditando) {
        eventosDelCalendario[diaEditando].splice(indexEditando, 1);
        if (eventosDelCalendario[diaEditando].length === 0) {
          delete eventosDelCalendario[diaEditando];
          const diaAnteriorElemento = buscarElementoDia(diaEditando);
          if (diaAnteriorElemento) diaAnteriorElemento.classList.remove("tiene-eventos");
        }
        if (!eventosDelCalendario[dia]) eventosDelCalendario[dia] = [];
        eventosDelCalendario[dia].push({ nombre, inicio, fin });
      } else {
        eventosDelCalendario[dia][indexEditando] = { nombre, inicio, fin };
      }
    } else {
      // Agrega un nuevo evento
      if (!eventosDelCalendario[dia]) eventosDelCalendario[dia] = [];
      eventosDelCalendario[dia].push({ nombre, inicio, fin });
    }

    guardarEventos();

    formEvento.reset();
    etiquetaEvento.classList.add("etiqueta-oculto");
    editando = false;

    const diaElemento = buscarElementoDia(dia);
    if (diaElemento) diaElemento.classList.add("tiene-eventos");

    if (dia === diaActual) mostrarEventosEnBarraLateral(dia);
    mostrarMensajeExito("Evento guardado");
  });

  // Muestra los eventos del día seleccionado en la barra lateral
  function mostrarEventosEnBarraLateral(dia) {
    const eventos = eventosDelCalendario[dia] || [];
    const contenedor = document.getElementById("eventosDelDia");
    contenedor.innerHTML = "";

    // Crea el contenedor de lista de eventos 
    const lista = document.createElement("div");
    lista.className = "lista-eventos";

    if (eventos.length === 0) {
      // si no hay eventos muestra "No hay eventos para este día"
      const aviso = document.createElement("div");
      aviso.className = "evento-item";
      aviso.textContent = "No hay eventos para este día";
      lista.appendChild(aviso);
      contenedor.appendChild(lista);
      return;
    }

    // Crea cada evento del día
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
          <button class="eliminar-evento" data-dia="${dia}" data-index="${index}"> X </button>
        </div>
      `;
      lista.appendChild(elemento);
    });

    contenedor.appendChild(lista);

    // Para eliminar eventos
    document.querySelectorAll(".eliminar-evento").forEach(btn => {
      btn.addEventListener("click", () => {
        const dia = parseInt(btn.getAttribute("data-dia"));
        const index = parseInt(btn.getAttribute("data-index"));
        eventosDelCalendario[dia].splice(index, 1);

        if (eventosDelCalendario[dia].length === 0) {
          delete eventosDelCalendario[dia];
        }

        guardarEventos();

        mostrarEventosEnBarraLateral(dia);
        const diaElemento = buscarElementoDia(dia);
        if (diaElemento && eventosDelCalendario[dia] === undefined) {
          diaElemento.classList.remove("tiene-eventos");
        }
      });
    });

    // Para editar los eventos
    document.querySelectorAll(".editar-evento").forEach(btn => {
      btn.addEventListener("click", () => {
        const dia = parseInt(btn.getAttribute("data-dia"));
        const index = parseInt(btn.getAttribute("data-index"));
        const evento = eventosDelCalendario[dia][index];

        document.getElementById("nombreEvento").value = evento.nombre;
        document.getElementById("fechaEvento").value = dia;
        inicioEventoInput.value = evento.inicio;
        finEventoInput.value = evento.fin;
        finEventoInput.min = evento.inicio;

        etiquetaEvento.classList.remove("etiqueta-oculto");
        editando = true;
        diaEditando = dia;
        indexEditando = index;
      });
    });
  }

  mostrarEventosEnBarraLateral(diaActual);
});