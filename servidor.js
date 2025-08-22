const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { probarConexion } = require('./configuracion/baseDatos');
const {
    obtenertodosLosvideojuegos,
    obtenerVideojuegoPorId,
    crearVideojuego,
    actualizarvideojuego,
    /*eliminarvideojuego*/
} = require('./controladores/videojuegoscontrolador');

const app = express();
const puerto = process.env.PORT || 3000;

// Middleware para CORS y JSON
app.use(cors());
app.use(express.json()); // Asegura que req.body funcione

// Rutas
app.get('/', (req, res) => {
    res.send('API de videojuegos funcionando');
});

app.get('/appi/videojuegos', obtenertodosLosvideojuegos);
app.get('/appi/videojuegos/:id', obtenerVideojuegoPorId);
app.post('/appi/videojuegos', crearVideojuego);
app.put('/appi/videojuegos/:id', actualizarvideojuego);
/*app.delete('/appi/videojuegos/:id', eliminarvideojuego);*/

// Iniciar servidor y probar conexión
const iniciarServidor = async () => {
    try {
        await probarConexion();
        app.listen(puerto, () => {
            console.log(`Servidor ejecutándose en http://localhost:${puerto}`);
        });
    } catch (error) {
        console.error('Error al iniciar', error.message);
    }
};

iniciarServidor();
