import React, { useState, useEffect } from 'react';
import EventList from './components/EventList'; // Ajusta la ruta si es necesario
import EventForm from './components/EventForm'; // Asegúrate de que la ruta sea correcta
import { getEvents, createEvent } from '../api'; // Importa correctamente createEvent desde api.js

const App = () => {
    const [events, setEvents] = useState([]);

    // Función para obtener los eventos del backend
    const fetchEvents = async () => {
        try {
            const data = await getEvents(); // Obtiene los eventos desde el backend
            setEvents(data); // Actualiza el estado con los eventos recibidos
        } catch (error) {
            console.error('Error al obtener los eventos:', error);
        }
    };

    // Función para manejar la creación del evento
    const handleEventCreated = (createdEvent) => {
        console.log('Evento creado:', createdEvent); // Verifica si el evento se agrega correctamente
        setEvents((prevEvents) => {
            console.log('Eventos antes de agregar el nuevo:', prevEvents); // Verifica el estado antes de agregar
            const updatedEvents = [...prevEvents, createdEvent];
            console.log('Eventos después de agregar el nuevo:', updatedEvents); // Verifica el estado después de agregar
            return updatedEvents;
        });
    };

    useEffect(() => {
        fetchEvents(); // Al iniciar la aplicación, obtenemos los eventos
    }, []);

    return (
        <div>
            <h1>Gestión de Eventos</h1>
            {/* Pasamos handleEventCreated al formulario */}
            <EventForm onEventCreated={handleEventCreated} />
            {/* Mostramos la lista de eventos */}
            <EventList events={events} />
        </div>
    );
};

export default App;
