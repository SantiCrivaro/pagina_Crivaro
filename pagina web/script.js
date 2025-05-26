const eventForm = document.getElementById('eventForm');
        const eventList = document.getElementById('eventList');

        let events = [];

        eventForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const nombre = eventForm.nombre.value;
            const fecha = eventForm.fecha.value;
            const hora = eventForm.hora.value;
            const lugar = eventForm.lugar.value;

            const newEvent = { nombre, fecha, hora, lugar };
            events.push(newEvent);
            mostrarEventos();
            eventForm.reset();
        });

        function mostrarEventos() {
            eventList.innerHTML = '';
            events.forEach(evento => {
                const eventItem = document.createElement('div');
                eventItem.textContent = `${evento.nombre} - ${evento.fecha} ${evento.hora} en ${evento.lugar}`;
                eventList.appendChild(eventItem);
            });
        }