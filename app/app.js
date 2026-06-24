const express = require("express");
const mysql = require("mysql2");
const axios = require("axios");

const app = express();

app.use(express.json());

const APP_NAME = process.env.APP_NAME || "APP";

const db = mysql.createPool({
    host: "mysql_maestro",
    user: "root",
    password: "root123",
    database: "mundial",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.getConnection((err, connection) => {

    if (err) {
        console.error("ERROR MYSQL:", err);
    } else {
        console.log("MySQL conectado");
        connection.release();
    }

});


// =======================
// INICIO
// =======================

app.get("/", (req, res) => {

    res.json({
        servidor: APP_NAME,
        mensaje: "Aplicación funcionando"
    });

});


// =======================
// CARGAR DATOS DESDE API
// =======================

app.get("/cargar", async (req, res) => {

    try {

        const respuesta = await axios.get(
            "http://172.31.118.15:3000/selecciones"
        );

        const datos = respuesta.data;

        for (const s of datos) {

            await db.promise().query(
                `INSERT IGNORE INTO selecciones
                (id,nombre,entrenador,ranking_fifa,participaciones,campeonatos)
                VALUES (?,?,?,?,?,?)`,
                [
                    s.id,
                    s.nombre,
                    s.entrenador,
                    s.ranking_fifa,
                    s.participaciones,
                    s.campeonatos
                ]
            );

        }

        res.json({
            mensaje: "Datos cargados correctamente",
            cantidad: datos.length
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });

    }

});


// =======================
// CONSULTAR TODOS
// =======================

app.get("/selecciones", async (req, res) => {

    try {

        const [rows] = await db.promise().query(
            "SELECT * FROM selecciones"
        );

        res.json(rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });

    }

});


// =======================
// CONSULTAR POR ID
// =======================

app.get("/selecciones/:id", async (req, res) => {

    try {

        const [rows] = await db.promise().query(
            "SELECT * FROM selecciones WHERE id = ?",
            [req.params.id]
        );

        res.json(rows);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});


// =======================
// CREAR
// =======================

app.post("/selecciones", async (req, res) => {

    try {

        const {
            id,
            nombre,
            entrenador,
            ranking_fifa,
            participaciones,
            campeonatos
        } = req.body;

        await db.promise().query(
            `INSERT INTO selecciones
            (id,nombre,entrenador,ranking_fifa,participaciones,campeonatos)
            VALUES (?,?,?,?,?,?)`,
            [
                id,
                nombre,
                entrenador,
                ranking_fifa,
                participaciones,
                campeonatos
            ]
        );

        res.json({
            mensaje: "Registro creado"
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});


// =======================
// ACTUALIZAR
// =======================

app.put("/selecciones/:id", async (req, res) => {

    try {

        const {
            nombre,
            entrenador,
            ranking_fifa,
            participaciones,
            campeonatos
        } = req.body;

        const [result] = await db.promise().query(
            `UPDATE selecciones
             SET nombre=?,
                 entrenador=?,
                 ranking_fifa=?,
                 participaciones=?,
                 campeonatos=?
             WHERE id=?`,
            [
                nombre,
                entrenador,
                ranking_fifa,
                participaciones,
                campeonatos,
                req.params.id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "Selección no encontrada"
            });
        }

        res.json({
            mensaje: "Registro actualizado correctamente"
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});



// =======================
// ELIMINAR
// =======================

app.delete("/selecciones/:id", async (req, res) => {

    try {

        const [result] = await db.promise().query(
            "DELETE FROM selecciones WHERE id=?",
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "Selección no encontrada"
            });
        }

        res.json({
            mensaje: "Registro eliminado correctamente"
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});



// =======================
// SERVIDOR
// =======================

app.listen(3000, () => {

    console.log(`${APP_NAME} ejecutándose`);

});
