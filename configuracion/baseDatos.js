const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'videojuegosdb',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '123456',
});

const probarConexion = async () => {
    try {
        const cliente = await pool.connect();
        console.log(' Conexión exitosa a PostgreSQL');
        console.log(` Base de datos: ${process.env.DB_NAME}`);
        cliente.release(); 
    } catch (error) {
        console.error(' Error al conectar con PostgreSQL:', error.message);
        throw error; 
    }
};

module.exports = { pool, probarConexion };
