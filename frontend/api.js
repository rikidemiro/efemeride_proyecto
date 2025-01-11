import axios from 'axios';

// Configura axios con el puerto que corresponde
const api = axios.create({
    baseURL: 'http://localhost:3001', // Asegúrate de que esta URL coincide con la URL de tu backend
});

export const getEvents = async () => {
    try {
        // Realiza la solicitud al endpoint del backend
        const response = await api.get('/events');
        console.log("Eventos recibidos:", response.data); // Verifica los datos aquí
        return response.data; // Devuelve los datos al componente que lo llama
    } catch (error) {
        console.error('Error fetching events:', error);
        throw error;
    }
};

export const createEvent = async (eventData) => {
    console.log('Invocando createEvent con datos:', eventData); // Verifica si se invoca más de una vez       
    try {
        const response = await api.post('/events', eventData);
        console.log('Respuesta del servidor:', response.data); // Registra la respuesta del servidor
        return response.data; // Devuelve el evento recién creado
    } catch (error) {
        // Captura más detalles sobre el error para entender la causa
        if (error.response) {
            // Si hay una respuesta del servidor, mostramos los detalles del error
            console.error('Error en Axios:', error.response.data); // Mostrar el cuerpo de la respuesta del error
            console.error('Código de estado:', error.response.status); // Código de estado HTTP
            console.error('Headers:', error.response.headers); // Headers de la respuesta
        } else if (error.request) {
            // Si no hubo respuesta, mostramos el objeto de solicitud
            console.error('Error de solicitud (sin respuesta):', error.request);
        } else {
            // Si hay un error en la configuración
            console.error('Error en la configuración de la solicitud:', error.message);
        }
        throw error; // Esto permite manejar el error en el componente
    }
};

