CREATE DATABASE IF NOT EXISTS mundial;

USE mundial;

CREATE TABLE selecciones (
    id INT PRIMARY KEY,
    nombre VARCHAR(100),
    entrenador VARCHAR(100),
    ranking_fifa INT,
    participaciones INT,
    campeonatos INT
);
