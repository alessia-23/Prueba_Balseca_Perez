CREATE DATABASE IF NOT EXISTS mundial;

USE mundial;

CREATE TABLE selecciones(
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100),
    grupo VARCHAR(10)
);
