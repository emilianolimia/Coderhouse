USE gamers_model;

# Ejemplo en vivo
CREATE TABLE NEW_GAMES (
	id_game INT PRIMARY KEY,
    name VARCHAR(100),
    description VARCHAR(300)
);
SELECT * FROM NEW_GAMES;
SELECT * FROM GAME;

CREATE TRIGGER `tr_add_new_game`
AFTER INSERT ON `game`
FOR EACH ROW
INSERT INTO `NEW_GAMES`(id_game, name, description) VALUES (NEW.id_game, NEW.name, NEW.description);

INSERT INTO GAME (id_game, name, description, id_level, id_class) 
VALUES (150, 'Mortal Kombat', 'play station', 2, 143);

SELECT * FROM GAME WHERE id_game > 150; 
SELECT * FROM NEW_GAMES;

INSERT INTO GAME (id_game, name, description, id_level, id_class) 
VALUES (151, 'Mortal Kombat2', 'play station', 2, 143),
(152, 'Mortal Kombat3', 'play station', 2, 143);

# Alumnos
CREATE TABLE alumnos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido1 VARCHAR(50) NOT NULL,
    apellido2 VARCHAR(50), 
    nota FLOAT
);

DELIMITER $$
CREATE TRIGGER trigger_check_nota_before_insert
BEFORE INSERT ON alumnos 
FOR EACH ROW
BEGIN
  IF NEW.nota < 0 THEN
    set NEW.nota = 0;
  ELSEIF NEW.nota > 10 THEN
    set NEW.nota = 10;
  END IF;
END$$

DELIMITER $$
CREATE TRIGGER trigger_check_nota_before_update
BEFORE UPDATE ON alumnos 
FOR EACH ROW
BEGIN
  IF NEW.nota < 0 THEN
    set NEW.nota = 0;
  ELSEIF NEW.nota > 10 THEN
    set NEW.nota = 10;
  END IF;
END$$

DELIMITER ;
INSERT INTO alumnos VALUES (1, 'Pepe', 'López', 'López', -1);
INSERT INTO alumnos VALUES (2, 'María', 'Sánchez', 'Sánchez', 11);
INSERT INTO alumnos VALUES (3, 'Juan', 'Pérez', 'Pérez', 8.5);

SELECT * FROM alumnos;

UPDATE alumnos SET nota = -4 WHERE id = 3;
UPDATE alumnos SET nota = 14 WHERE id = 3;
UPDATE alumnos SET nota = 9.5 WHERE id = 3;

SELECT * FROM alumnos;

# Funciones de fecha y hora
SELECT NOW();
SELECT CURRENT_DATE();
SELECT CURDATE();
SELECT CURRENT_TIME();
SELECT CURTIME();
SELECT CURRENT_TIMESTAMP();

# Funciones de usuario
SELECT SESSION_USER();
SELECT SYSTEM_USER();
SELECT USER();

# Funciones de plataforma
SELECT DATABASE();
SELECT VERSION();

# Audit table
CREATE TABLE audits (
	id_log INT PRIMARY KEY auto_increment,
    entity varchar(100),
    entity_id int,
    insert_dt datetime,
    created_by varchar(100),
    last_update_dt datetime,
    last_updated_by varchar(100)
);

CREATE TRIGGER `tr_insert_game_aud`
AFTER INSERT ON `game`
FOR EACH ROW
INSERT INTO `audits`(entity, entity_id, insert_dt, created_by, last_update_dt, last_updated_by) 
VALUES ('game', NEW.id_game, CURRENT_TIMESTAMP(), USER(), CURRENT_TIMESTAMP(), USER());

INSERT INTO GAME (id_game, name, description, id_level, id_class) 
VALUES (153, 'Mortal Kombat 10', 'play station 10', 2, 143);

SELECT * FROM GAME where id_game=153;
SELECT * FROM audits;
SELECT * FROM NEW_GAMES;

CREATE TRIGGER `tr_update_game_aud`
AFTER UPDATE ON `game`
FOR EACH ROW
UPDATE `audits` SET last_update_dt = CURRENT_TIMESTAMP(), last_updated_by = USER() 
WHERE entity_id = OLD.id_game;

UPDATE GAME SET name = 'New Mortal Kombat 10' WHERE id_game = 153;

SELECT * FROM audits;

CREATE TRIGGER `tr_insert_level_aud`
AFTER INSERT ON `LEVEL_GAME`
FOR EACH ROW
INSERT INTO `audits`(entity, entity_id, insert_dt, created_by, last_update_dt, last_updated_by) 
VALUES ('level_game', NEW.id_level, CURRENT_TIMESTAMP(), USER(), CURRENT_TIMESTAMP(), USER());

Select * from LEVEL_GAME;

INSERT INTO LEVEL_GAME(id_level, description) VALUES 
(18, 'new_level3'),
(19, 'new_level4');

SELECT * FROM LEVEL_GAME ORDER BY id_level DESC;

SELECT * FROM audits;

## Ejemplo ventas
CREATE TABLE ventas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fecha DATE,
    monto DECIMAL(10,2),
    cantidad_vendida INT,
    total DECIMAL(10,2)
);

DELIMITER $$
CREATE TRIGGER calcular_total_venta
BEFORE INSERT ON ventas
FOR EACH ROW 
BEGIN
	SET NEW.total = NEW.monto * NEW.cantidad_vendida;
END$$

INSERT INTO ventas(fecha, monto, cantidad_vendida) VALUES
('2023-05-01', 200.00, 3);

SELECT * FROM ventas;

# Drops
DROP TRIGGER tr_insert_level_aud;
DROP TRIGGER tr_add_new_game;
DROP TRIGGER tr_insert_game_aud;
DROP TRIGGER tr_update_game_aud;
DROP TRIGGER trigger_check_nota_before_insert;
DROP TRIGGER trigger_check_nota_before_update;
DROP TRIGGER calcular_total_venta;
DROP TABLE ventas;
DROP TABLE alumnos;
DROP TABLE NEW_GAMES;
DROP TABLE audits;
