import React, { useState } from 'react';
import { createEvent } from '../../api'; // Asegúrate de tener esta función configurada

const EventForm = ({ onEventCreated }) => {
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        fecha: '',
        categoria_id: ''
    });

    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateFields = () => {
        const { titulo, descripcion, fecha } = formData;
        if (!titulo.trim()) return "El título es obligatorio.";
        if (!descripcion.trim()) return "La descripción es obligatoria.";
        if (!fecha.trim()) return "La fecha es obligatoria.";
        return null;
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
    
        if (isSubmitting) return;
        setIsSubmitting(true);
    
        const eventData = {
            titulo: formData.titulo,
            descripcion: formData.descripcion,
            fecha: formData.fecha,
            categoria_id: formData.categoria_id ? formData.categoria_id : null,
        };
    
        console.log('Formulario enviado. Estado de isSubmitting:', isSubmitting);
        console.log('Datos del formulario antes de enviar:', formData);
        console.log('Payload a enviar:', eventData);
    
        try {
            const createdEvent = await createEvent(eventData);
            console.log('Evento creado:', createdEvent);
    
            // Llamamos a la función pasada por prop
            if (onEventCreated) {
                onEventCreated(createdEvent);
            }
    
            // Limpiamos el formulario después de un envío exitoso
            setFormData({
                titulo: '',
                descripcion: '',
                fecha: '',
                categoria_id: ''
            });
        } catch (error) {
            console.error('Error al crear el evento:', error);
        } finally {
            setIsSubmitting(false);
        }
    };
    

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Título:</label>
                <input
                    type="text"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleChange}
                    placeholder="Escribe el título del evento"
                    required
                />
            </div>
            <div>
                <label>Descripción:</label>
                <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    placeholder="Escribe la descripción del evento"
                    required
                ></textarea>
            </div>
            <div>
                <label>Fecha:</label>
                <input
                    type="date"
                    name="fecha"
                    value={formData.fecha}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Categoría (opcional):</label>
                <input
                    type="number"
                    name="categoria_id"
                    value={formData.categoria_id}
                    onChange={handleChange}
                    placeholder="Escribe el ID de la categoría"
                />
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Enviando...' : 'Crear Evento'}
            </button>
        </form>
    );
};

export default EventForm;
