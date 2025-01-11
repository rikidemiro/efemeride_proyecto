const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Configuración del puerto
const PORT = process.env.PORT || 3001;

// Configuración de conexión a la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '0',
    database: 'efemerides_db',
});

// Conexión a la base de datos
db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        process.exit(1);
    } else {
        console.log('Conexión exitosa a la base de datos.');
    }
});

// Configurar CORS para permitir solicitudes desde tu frontend
app.use(cors({
    origin: 'http://localhost:5173' // Cambia esto según la URL de tu frontend
}));

// Rutas
app.get('/', (req, res) => {
    res.send('Bienvenido a la API de Efemérides');
});

app.get('/api/mensaje', (req, res) => {
  res.json({ mensaje: '¡Hola desde el backend!' });
});

// Ruta para verificar la salud del servidor
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});


// Ruta para obtener el puerto en el que está corriendo el backend
app.get('/api/port', (req, res) => {
    res.json({ port: PORT });
});


// Ruta para obtener los eventos
app.get('/events', async (req, res) => {
    try {
        const [rows] = await db.promise().query('SELECT * FROM Eventos');
        res.status(200).json(rows);
    } catch (err) {
        console.error('Error obteniendo eventos:', err);
        res.status(500).json({ error: 'Error obteniendo eventos' });
    }
});


app.post('/events', async (req, res) => {
    try {
        console.log('Cuerpo recibido en el servidor:', req.body); // Verifica que el cuerpo esté llegando correctamente

        const { titulo, descripcion, fecha, categoria_id } = req.body;

        // Validar que los campos obligatorios estén presentes
        if (!titulo || !descripcion || !fecha) {
            return res.status(400).json({ error: 'Faltan campos obligatorios: titulo, descripcion o fecha' });
        }

        console.log('Datos a insertar en la base de datos:', { titulo, descripcion, fecha, categoria_id });

        // Consulta SQL
        const query = `
            INSERT INTO Eventos (titulo, descripcion, fecha, categoria_id)
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await db.promise().query(query, [
            titulo,
            descripcion,
            fecha,
            categoria_id || null // Si `categoria_id` es indefinido, usa NULL
        ]);

        console.log('Evento insertado en la base de datos:', result); // Verifica que se inserte solo una vez
        res.status(201).json({ id: result.insertId, message: 'Evento insertado correctamente' });
    } catch (err) {
        console.error('Error al insertar evento:', err);
        res.status(500).json({ error: 'Error al insertar evento' });
    }
});


// Inicio del servidor
const server = app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});

// Manejo de errores en el servidor
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`El puerto ${PORT} ya está en uso. Intentando con el puerto ${PORT + 1}`);
        app.listen(PORT + 1, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT + 1}`);
        });
    } else {
        console.error('Error desconocido:', err);
        process.exit(1);
    }
});

