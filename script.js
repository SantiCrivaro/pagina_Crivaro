document.addEventListener('DOMContentLoaded', function() {
    mostrarEventos();

    document.getElementById('eventForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const nombre = this.nombre.value;
        const fecha = this.fecha.value; 
        const hora = this.hora.value;   
        const lugar = this.lugar.value;

        const evento = { nombre, fecha, hora, lugar };
        let eventos = JSON.parse(localStorage.getItem('eventos')) || [];
        eventos.push(evento);
        localStorage.setItem('eventos', JSON.stringify(eventos));

        this.reset();
        mostrarEventos();
    });
});

function mostrarEventos() {
    
    document.querySelectorAll('.calendar__cell--appointment').forEach(cell => {
        cell.innerHTML = '';
    });

    const eventos = JSON.parse(localStorage.getItem('eventos')) || [];

    eventos.forEach(evento => {
        
        const fechaObj = new Date(evento.fecha);
        const diaSemana = fechaObj.getDay();

        
        const columnas = document.querySelectorAll('.calendar__col:not(.calendar__col--legend)');
        if (!columnas[diaSemana]) return;

        
        const horaNum = parseInt(evento.hora.split(':')[0], 10);
        const indiceHora = horaNum - 8;
        if (indiceHora < 0 || indiceHora > 15) return;

        
        const celdas = columnas[diaSemana].querySelectorAll('.calendar__cell--appointment');
        if (!celdas[indiceHora]) return;

        
        const divEvento = document.createElement('div');
        divEvento.className = 'calendar__event calendar__event--duration-60';
        divEvento.innerHTML = `
            <div class="calendar__event--time">${evento.hora}</div>
            <div class="calendar__event--title">${evento.nombre}</div>
            <div class="calendar__event--lugar">${evento.lugar}</div>
        `;

        celdas[indiceHora].appendChild(divEvento);
    });
}