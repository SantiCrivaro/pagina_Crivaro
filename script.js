document.addEventListener('DOMContentLoaded', function () {
    const añoActual = 2025;
    const mesActual = 5; 
    const nombreDelMes = 'junio';
    
    let diaActualmenteSeleccionado = 1;
    let eventosDelCalendario = {}; 
    
    const contenedorDiasDelMes = document.getElementById('diasDelMes');
    const elementoDiaSeleccionado = document.getElementById('diaSeleccionado');
    
    function generarCalendario() {
        contenedorDiasDelMes.innerHTML = '';
        
        const primerDiaDelMes = new Date(añoActual, mesActual, 1);
        const ultimoDiaDelMes = new Date(añoActual, mesActual + 1, 0);
        const cantidadDiasEnMes = ultimoDiaDelMes.getDate();
        const primerDiaDeLaSemana = primerDiaDelMes.getDay(); 
        
        for (let i = 0; i < primerDiaDeLaSemana; i++) {
            const diaVacio = document.createElement('div');
            diaVacio.className = 'dia vacio';
            contenedorDiasDelMes.appendChild(diaVacio);
        }
        
        for (let numeroDia = 1; numeroDia <= cantidadDiasEnMes; numeroDia++) {
            const elementoDelDia = document.createElement('div');
            elementoDelDia.className = 'dia';
            elementoDelDia.textContent = numeroDia;
            
            if (numeroDia === diaActualmenteSeleccionado) {
                elementoDelDia.classList.add('seleccionado');
            }
            
            if (eventosDelCalendario[numeroDia] && eventosDelCalendario[numeroDia].length > 0) {
                elementoDelDia.classList.add('tiene-eventos');
            }
            
            elementoDelDia.addEventListener('click', function() {
                document.querySelectorAll('.dia.seleccionado').forEach(elemento => {
                    elemento.classList.remove('seleccionado');
                });
                
                elementoDelDia.classList.add('seleccionado');
                diaActualmenteSeleccionado = numeroDia;
                
                actualizarVistaBarraLateral(numeroDia);
            });
            
            contenedorDiasDelMes.appendChild(elementoDelDia);
        }
    }
    
    function actualizarVistaBarraLateral(dia) {
        elementoDiaSeleccionado.textContent = dia;
        
        const listaEventosAnterior = document.querySelector('.lista-eventos');
        if (listaEventosAnterior) {
            listaEventosAnterior.remove();
        }
        
        if (eventosDelCalendario[dia] && eventosDelCalendario[dia].length > 0) {
            mostrarEventosEnBarraLateral(dia);
        }
    }
    
    function mostrarEventosEnBarraLateral(dia) {
        const eventos = eventosDelCalendario[dia];
        
        const contenedorEventos = document.createElement('div');
        contenedorEventos.className = 'lista-eventos';
        
        eventos.forEach((evento, index) => {
            const elementoEvento = document.createElement('div');
            elementoEvento.className = 'evento-item';
            elementoEvento.innerHTML = `
                <div class="evento-punto">•</div>
                <div class="evento-detalles">
                    <div class="evento-nombre">${evento.nombre}</div>
                    <div class="evento-horario">${evento.inicio} - ${evento.fin}</div>
                </div>
                <button class="eliminar-evento" data-dia="${dia}" data-index="${index}">✖</button>
            `;
            contenedorEventos.appendChild(elementoEvento);
        });
        
        const fechaSeleccionada = document.querySelector('.fecha-seleccionada');
        fechaSeleccionada.appendChild(contenedorEventos);
    }
    
    generarCalendario();
    
    const botonAgregarEvento = document.getElementById('botonAgregarEvento');
    const etiquetaEvento = document.getElementById('EtiquetaEvento');
    const cerrarEtiqueta = document.getElementById('cerrarEtiqueta');

    botonAgregarEvento.addEventListener('click', () => {
        document.getElementById('fechaEvento').value = diaActualmenteSeleccionado;
        etiquetaEvento.classList.remove('etiqueta-oculto');
    });

    cerrarEtiqueta.addEventListener('click', () => {
        etiquetaEvento.classList.add('etiqueta-oculto');
    });
    
    const formEvento = document.getElementById('formEvento');
    formEvento.addEventListener('submit', function(evento) {
        evento.preventDefault();
        
        const nombreEvento = document.getElementById('nombreEvento').value;
        const diaEvento = parseInt(document.getElementById('fechaEvento').value);
        const inicioEvento = document.getElementById('inicioEvento').value;
        const finEvento = document.getElementById('finEvento').value;
        
        if (diaEvento < 1 || diaEvento > 30) {
            alert('Por favor ingresa un día válido (1-30)');
            return;
        }
        
        if (!eventosDelCalendario[diaEvento]) {
            eventosDelCalendario[diaEvento] = [];
        }
        
        eventosDelCalendario[diaEvento].push({
            nombre: nombreEvento,
            inicio: inicioEvento,
            fin: finEvento
        });
        
        etiquetaEvento.classList.add('etiqueta-oculto');
        
        formEvento.reset();
        
        generarCalendario();
        
        if (diaEvento === diaActualmenteSeleccionado) {
            actualizarVistaBarraLateral(diaEvento);
        }
    });

    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('eliminar-evento')) {
            const dia = parseInt(e.target.getAttribute('data-dia'));
            const index = parseInt(e.target.getAttribute('data-index'));
            
            eventosDelCalendario[dia].splice(index, 1);
            
            if (eventosDelCalendario[dia].length === 0) {
                delete eventosDelCalendario[dia];
            }
            
            actualizarVistaBarraLateral(dia);
            generarCalendario();
        }
    });
});