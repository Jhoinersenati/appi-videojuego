const { pool } = require('../configuracion/baseDatos');

// Obtener todos los videojuegos
const obtenertodosLosvideojuegos = async (req, res) => {
    try {
        const consulta = 'SELECT * FROM videojuegos ORDER BY id ASC';
        const resultado = await pool.query(consulta);

        res.json({
            exito: true,
            mensaje: 'Videojuegos obtenidos correctamente',
            datos: resultado.rows,
            total: resultado.rows.length
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

        res.json({
            exito: true,
            mensaje: 'Videojuego obtenido correctamente',
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

/*// Crear un videojuego
const crearVideojuego = async (req, res) => {
    try {
        const { nombre, genero, plataforma, precio, fecha_lanzamiento, desarrollador, descripcion } = req.body;

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
}

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
}
*/
module.exports = {
    obtenertodosLosvideojuegos,
    obtenerVideojuegoPorId,
    /*crearVideojuego,
    actualizarvideojuego,
    eliminarvideojuego*/
};
