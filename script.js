document.addEventListener('DOMContentLoaded', function() {
    const añoActual = 2025;
    const mesActual = 5; 
    const nombreDelMes = 'junio';
    
    let diaActualmenteSeleccionado = 1;
    
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
            
            // Marcar día seleccionado
            if (numeroDia === diaActualmenteSeleccionado) {
                elementoDelDia.classList.add('seleccionado');
            }
            
            // Agregar evento de clic
            elementoDelDia.addEventListener('click', function() {
                document.querySelectorAll('.dia.seleccionado').forEach(elemento => {
                    elemento.classList.remove('seleccionado');
                });
                
                elementoDelDia.classList.add('seleccionado');
                diaActualmenteSeleccionado = numeroDia;
                
                elementoDiaSeleccionado.textContent = numeroDia;
            });
            
            contenedorDiasDelMes.appendChild(elementoDelDia);
        }
    }
    
    generarCalendario();
    
    document.querySelector('.boton-agregar-evento').addEventListener('click', function() {
        alert('Agregar evento para el día ' + diaActualmenteSeleccionado + ' de ' + nombreDelMes + ' de ' + añoActual);
    });
});


const botonAgregarEvento = document.getElementById('botonAgregarEvento');
const etiquetaEvento = document.getElementById('EtiquetaEvento');
const cerrarEtiqueta = document.getElementById('cerrarEtiqueta');

botonAgregarEvento.addEventListener('click', () => {
    etiquetaEvento.classList.remove('etiqueta-oculto');
});


cerrarEtiqueta.addEventListener('click', () => {
    etiquetaEvento.classList.add('etiqueta-oculto');
});