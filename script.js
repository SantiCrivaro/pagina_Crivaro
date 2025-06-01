document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.getElementById('formulario-tarea');
    const botonAgregar = document.getElementById('boton-agregar');

    // Mostrar/ocultar el formulario al hacer clic en el botón +
    botonAgregar.addEventListener('click', function() {
        formulario.classList.toggle('oculto');
    });

    formulario.addEventListener('submit', function(e) {
        e.preventDefault();

        const titulo = document.getElementById('evento').value;
        const inicio = document.getElementById('inicio').value;
        const final = document.getElementById('final').value;
        const dia = document.getElementById('dia').value;
        const lugar = document.getElementById('lugar').value;

        const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
        const horas = [
            '01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00',
            '09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00',
            '17:00','18:00','19:00','20:00','21:00','22:00','23:00'
        ];

        const colIndex = dias.indexOf(dia);
        const filaInicio = horas.indexOf(inicio);
        const filaFinal = horas.indexOf(final);

        if (colIndex === -1 || filaInicio === -1 || filaFinal === -1 || filaFinal < filaInicio) {
            alert('Día u hora no válidos');
            return;
        }

        const filas = document.querySelectorAll('.calendario .fila:not(.dias)');

        // Agrega un evento en cada celda del rango seleccionado
        for (let i = filaInicio; i <= filaFinal; i++) {
            const celda = filas[i].children[colIndex + 1];
            const eventoDiv = document.createElement('div');
            eventoDiv.className = 'evento-tarjeta';
            eventoDiv.innerHTML = `
                <span class="hora-evento">${inicio} - ${final}</span>
                <span class="titulo-evento">${titulo}</span>
                <span class="lugar-evento">${lugar}</span>
                <button class="eliminar-evento">×</button>
            `;
            celda.appendChild(eventoDiv);

            eventoDiv.querySelector('.eliminar-evento').onclick = function(e) {
                e.stopPropagation();
                eventoDiv.remove();
            };
        }

        formulario.reset();
        formulario.classList.add('oculto');
    });
});