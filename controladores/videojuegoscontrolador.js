const { pool } = require('../configuracion/baseDatos');

// Obtener todos los videojuegos
const obtenertodosLosvideojuegos = async (req, res) => {
    try {
        const consulta = 'SELECT * FROM videojuegos ORDER BY id ASC';
        const resultado = await pool.query(consulta);

        // Formatear las fechas antes de enviarlas
        const videojuegos = resultado.rows.map(v => {
            if (v.fecha_lanzamiento) {
                v.fecha_lanzamiento = new Date(v.fecha_lanzamiento).toISOString().split("T")[0];
            }
            if (v.fecha_creacion) {
                v.fecha_creacion = new Date(v.fecha_creacion).toISOString().split("T")[0];
            }
            return v;
        });

        res.json({
            exito: true,
            mensaje: 'Videojuegos obtenidos correctamente',
            datos: videojuegos,
            total: videojuegos.length
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

// Obtener videojuego por ID
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

        // Formatear las fechas del videojuego encontrado
        let videojuego = resultado.rows[0];
        if (videojuego.fecha_lanzamiento) {
            videojuego.fecha_lanzamiento = new Date(videojuego.fecha_lanzamiento).toISOString().split("T")[0];
        }
        if (videojuego.fecha_creacion) {
            videojuego.fecha_creacion = new Date(videojuego.fecha_creacion).toISOString().split("T")[0];
        }

        res.json({
            exito: true,
            mensaje: 'Videojuego obtenido correctamente',
            datos: videojuego
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


// Crear un videojuego
const crearVideojuego = async (req, res) => {
    try {
        const { nombre, genero, plataforma, precio, fecha_lanzamiento, desarrollador, descripcion } = req.body;

        // Validación de campos obligatorios
        if (!nombre || !genero || !plataforma || !precio) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Los campos nombre, género, plataforma y precio son obligatorios'
            });
        }

        const consulta = `
            INSERT INTO videojuegos (nombre, genero, plataforma, precio, fecha_lanzamiento, desarrollador, descripcion) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;

        const valores = [nombre, genero, plataforma, precio, fecha_lanzamiento, desarrollador, descripcion];
        const resultado = await pool.query(consulta, valores);

        // Obtenemos el videojuego insertado
        let videojuego = resultado.rows[0];

        // Formateamos las fechas si existen
        if (videojuego.fecha_lanzamiento) {
            videojuego.fecha_lanzamiento = new Date(videojuego.fecha_lanzamiento).toISOString().split("T")[0];
        }
        if (videojuego.fecha_creacion) {
            videojuego.fecha_creacion = new Date(videojuego.fecha_creacion).toISOString().split("T")[0];
        }

        // Respondemos con el videojuego formateado
        res.status(201).json({
            exito: true,
            mensaje: 'Videojuego creado exitosamente',
            datos: videojuego
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


const actualizarvideojuego = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, genero, plataforma, precio, fecha_lanzamiento, desarrollador, descripcion } = req.body;

        
        if (!nombre || !genero || !plataforma || !precio) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Los campos nombre, género, plataforma y precio son obligatorios'
            });
        }

        const consulta = `
            UPDATE videojuegos
            SET nombre = $1, genero = $2, plataforma = $3, precio = $4, fecha_lanzamiento = $5, desarrollador = $6, 
            descripcion = $7 WHERE id = $8 RETURNING *
        `;

        const valores = [nombre, genero, plataforma, precio, fecha_lanzamiento, desarrollador, descripcion, id];
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
}
// Actualizar parcialmente un videojuego (PATCH)
const actualizarParcialVideojuego = async (req, res) => {
    try {
        const { id } = req.params;
        const campos = req.body; // Los campos que sí se envían

        // Si no se envía nada
        if (Object.keys(campos).length === 0) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Debes enviar al menos un campo para actualizar'
            });
        }

        // Generar dinámicamente el SET para SQL según los campos enviados
        const columnas = Object.keys(campos).map((columna, i) => `${columna} = $${i + 1}`);
        const valores = Object.values(campos);

        const consulta = `
            UPDATE videojuegos
            SET ${columnas.join(', ')}
            WHERE id = $${valores.length + 1}
            RETURNING *;
        `;

        valores.push(id); // El último valor es el ID para el WHERE

        const resultado = await pool.query(consulta, valores);

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Videojuego no encontrado'
            });
        }

        res.json({
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

// Eliminar
const eliminarvideojuego = async (req, res) =>{
    try {
         const {id} = req.params;
        
        const consulta = 'DELETE FROM videojuegos WHERE id = $1 RETURNING * ';
        const resultado = await pool.query(consulta, [id]);

         if (resultado.rows.length === 0) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Videojuego no encontrado'
            });
        }

        res.json({
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
        const consulta = 'SELECT nombre, fecha_lanzamiento FROM videojuegos ORDER BY fecha_lanzamiento ASC';
        const resultado = await pool.query(consulta);

        // Formatear las fechas
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
    obtenertodosLosvideojuegos,
    obtenerVideojuegoPorId,
    crearVideojuego,
    actualizarvideojuego,
    actualizarParcialVideojuego, 
    eliminarvideojuego,
    obtenerNombresAsc,    
    obtenerFechasAsc 
};
