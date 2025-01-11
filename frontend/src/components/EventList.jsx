import React, { useEffect, useState } from 'react';
import { getEvents } from '../../api'; // Ajusta la ruta si es necesario

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await getEvents(); // Llama al endpoint a través de la función getEvents
                console.log('Datos recibidos:', data); // Para verificar los datos que llegan del backend
                setEvents(data); // Actualiza el estado con los datos recibidos
            } catch (err) {
                setError('Error al cargar eventos'); // Muestra un mensaje de error en caso de fallo
                console.error('Error al obtener los eventos:', err);
            }
        };

        fetchEvents();
    }, []);

    return (
        <div>
            <h1>Lista de Eventos</h1>
            {error ? (
                <p style={{ color: 'red' }}>{error}</p> // Muestra el mensaje de error si lo hay
            ) : (
                <ul>
                    {events.map((event, index) => (
                        <li key={index}>
                            {event.titulo} - {new Date(event.fecha).toLocaleDateString()} {/* Formateamos la fecha */}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default EventList;
