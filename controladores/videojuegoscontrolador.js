const { pool } = require('../configuracion/baseDatos');

// Obtener todos los videojuegos
const obtenerTodosLosVideojuegos = async (req, res) => {
    try {
        const consulta = 'SELECT * FROM videojuegos ORDER BY id ASC';
        const resultado = await pool.query(consulta);

        res.status(200).json({
            exito: true,
            datos: resultado.rows
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error al obtener los videojuegos',
            error: error.message
        });
    }
};

// Obtener un videojuego por ID
const obtenerVideojuegoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const consulta = 'SELECT * FROM videojuegos WHERE id = $1';
        const resultado = await pool.query(consulta, [id]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Videojuego no encontrado'
            });
        }

        res.status(200).json({
            exito: true,
            datos: resultado.rows[0]
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error al obtener el videojuego',
            error: error.message
        });
    }
};

// Crear un nuevo videojuego
const crearVideojuego = async (req, res) => {
    try {
        const { nombre, genero, plataforma, precio, fecha_lanzamiento, desarrollador, descripcion, url_img } = req.body;

        if (!nombre || !genero || !plataforma || !precio) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Los campos nombre, género, plataforma y precio son obligatorios'
            });
        }

        const consulta = `
            INSERT INTO videojuegos (nombre, genero, plataforma, precio, fecha_lanzamiento, desarrollador, descripcion, url_img)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;
        `;

        const valores = [nombre, genero, plataforma, precio, fecha_lanzamiento, desarrollador, descripcion, url_img];
        const resultado = await pool.query(consulta, valores);

        res.status(201).json({
            exito: true,
            mensaje: 'Videojuego creado exitosamente',
            datos: resultado.rows[0]
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error al crear el videojuego',
            error: error.message
        });
    }
};

// Actualizar un videojuego existente
const actualizarVideojuego = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, genero, plataforma, precio, fecha_lanzamiento, desarrollador, descripcion, url_img } = req.body;

        if (!nombre || !genero || !plataforma || !precio) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Los campos nombre, género, plataforma y precio son obligatorios'
            });
        }

        const consulta = `
            UPDATE videojuegos
            SET nombre = $1, genero = $2, plataforma = $3, precio = $4, fecha_lanzamiento = $5, desarrollador = $6,
                descripcion = $7, url_img = $8
            WHERE id = $9 RETURNING *;
        `;

        const valores = [nombre, genero, plataforma, precio, fecha_lanzamiento, desarrollador, descripcion, url_img, id];
        const resultado = await pool.query(consulta, valores);

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Videojuego no encontrado'
            });
        }

        res.status(200).json({
            exito: true,
            mensaje: 'Videojuego actualizado exitosamente',
            datos: resultado.rows[0]
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error al actualizar el videojuego',
            error: error.message
        });
    }
};

// Actualizar parcialmente un videojuego
const actualizarParcialVideojuego = async (req, res) => {
    try {
        const { id } = req.params;
        const campos = Object.keys(req.body);
        const valores = Object.values(req.body);

        if (campos.length === 0) {
            return res.status(400).json({
                exito: false,
                mensaje: 'No se enviaron campos para actualizar'
            });
        }

        // Construimos la consulta dinámicamente
        const setClause = campos.map((campo, i) => `${campo} = $${i + 1}`).join(', ');
        const consulta = `UPDATE videojuegos SET ${setClause} WHERE id = $${campos.length + 1} RETURNING *;`;

        valores.push(id);
        const resultado = await pool.query(consulta, valores);

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Videojuego no encontrado'
            });
        }

        res.status(200).json({
            exito: true,
            mensaje: 'Videojuego actualizado parcialmente',
            datos: resultado.rows[0]
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error al actualizar parcialmente el videojuego',
            error: error.message
        });
    }
};

// Eliminar un videojuego
const eliminarVideojuego = async (req, res) => {
    try {
        const { id } = req.params;
        const consulta = 'DELETE FROM videojuegos WHERE id = $1 RETURNING *';
        const resultado = await pool.query(consulta, [id]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Videojuego no encontrado'
            });
        }

        res.status(200).json({
            exito: true,
            mensaje: 'Videojuego eliminado exitosamente',
            datos: resultado.rows[0]
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error al eliminar el videojuego',
            error: error.message
        });
    }
};

// Listar nombres de videojuegos en orden ascendente
const obtenerNombresAsc = async (req, res) => {
    try {
        const consulta = 'SELECT nombre FROM videojuegos ORDER BY nombre ASC';
        const resultado = await pool.query(consulta);

        res.json({
            exito: true,
            mensaje: 'Nombres obtenidos correctamente en orden ascendente',
            datos: resultado.rows
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error al obtener los nombres',
            error: error.message
        });
    }
};

// Listar videojuegos por fecha de lanzamiento en orden ascendente
const obtenerFechasAsc = async (req, res) => {
    try {
        const consulta = 'SELECT fecha_lanzamiento FROM videojuegos ORDER BY fecha_lanzamiento ASC';
        const resultado = await pool.query(consulta);

        const datos = resultado.rows.map(v => {
            if (v.fecha_lanzamiento) {
                v.fecha_lanzamiento = new Date(v.fecha_lanzamiento).toISOString().split("T")[0];
            }
            return v;
        });

        res.json({
            exito: true,
            mensaje: 'Fechas obtenidas correctamente en orden ascendente',
            datos: datos
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error al obtener las fechas',
            error: error.message
        });
    }
};

module.exports = {
    obtenerTodosLosVideojuegos,
    obtenerVideojuegoPorId,
    crearVideojuego,
    actualizarVideojuego,
    actualizarParcialVideojuego,
    eliminarVideojuego,
    obtenerNombresAsc,
    obtenerFechasAsc
};
