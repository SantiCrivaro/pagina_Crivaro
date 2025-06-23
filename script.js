document.addEventListener("DOMContentLoaded", function () {
  const diasDelMes = document.getElementById("diasDelMes");
  const botonAgregarEvento = document.getElementById("botonAgregarEvento");
  const etiquetaEvento = document.getElementById("EtiquetaEvento");
  const cerrarEtiqueta = document.getElementById("cerrarEtiqueta");
  const formEvento = document.getElementById("formEvento");
  const diaSeleccionado = document.getElementById("diaSeleccionado");
  const inicioEventoInput = document.getElementById("inicioEvento");
  const finEventoInput = document.getElementById("finEvento");

  let eventosDelCalendario = {};
  if (localStorage.getItem("eventosDelCalendario")) {
    eventosDelCalendario = JSON.parse(localStorage.getItem("eventosDelCalendario"));
  }

  function guardarEventos() {
    localStorage.setItem("eventosDelCalendario", JSON.stringify(eventosDelCalendario));
  }

  let diaActual = 1;
  let editando = false;
  let diaEditando = null;
  let indexEditando = null;

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

  botonAgregarEvento.addEventListener("click", () => {
    etiquetaEvento.classList.remove("etiqueta-oculto");
    document.getElementById("fechaEvento").value = diaActual;
    formEvento.reset();
    editando = false;
    finEventoInput.min = "";
  });

  cerrarEtiqueta.addEventListener("click", () => {
    etiquetaEvento.classList.add("etiqueta-oculto");
  });

  formEvento.addEventListener("submit", function (e) {
    e.preventDefault();
    const nombre = document.getElementById("nombreEvento").value;
    const dia = parseInt(document.getElementById("fechaEvento").value);
    const inicio = inicioEventoInput.value;
    const fin = finEventoInput.value;

    const inicioHora = new Date(`2000-01-01T${inicio}:00`);
    const finHora = new Date(`2000-01-01T${fin}:00`);

    if (finHora <= inicioHora) {
      alert("La hora de fin debe ser al menos 1 minuto posterior a la de inicio.");
      return;
    }

    if (!eventosDelCalendario[dia]) eventosDelCalendario[dia] = [];

    if (editando) {
      eventosDelCalendario[diaEditando][indexEditando] = { nombre, inicio, fin };
    } else {
      eventosDelCalendario[dia].push({ nombre, inicio, fin });
    }

    guardarEventos();

    formEvento.reset();
    etiquetaEvento.classList.add("etiqueta-oculto");
    editando = false;

    const diaElemento = [...diasDelMes.children].find(el => parseInt(el.textContent) === dia);
    if (diaElemento) diaElemento.classList.add("tiene-eventos");

    if (dia === diaActual) mostrarEventosEnBarraLateral(dia);
  });

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
          <button class="eliminar-evento" data-dia="${dia}" data-index="${index}"> X </button>
        </div>
      `;
      lista.appendChild(elemento);
    });

    contenedor.appendChild(lista);

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
        const diaElemento = [...diasDelMes.children].find(el => parseInt(el.textContent) === dia);
        if (diaElemento && eventosDelCalendario[dia] === undefined) {
          diaElemento.classList.remove("tiene-eventos");
        }
      });
    });

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
