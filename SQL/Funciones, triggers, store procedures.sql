USE coderhouse;

#Tablas
CREATE TABLE cities(
	id INT, 
    name VARCHAR(45),
    PRIMARY KEY(id)
);

INSERT INTO cities(id, name) VALUES
(1, 'Córdoba'),
(2, 'Rosario'),
(3, 'Colón');

SELECT * FROM cities;

CREATE TABLE friends (
	id INT, 
	first_name VARCHAR(30),
	last_name VARCHAR(30),
	city INT,
	primary key(id),
	FOREIGN KEY(city) REFERENCES cities(id)
);

INSERT INTO friends(id, first_name, last_name, city) VALUES
(1, 'Alberto', 'Nuñez', 2),
(2, 'Rodrigo', 'Forclaz', 2),
(3, 'Maria', 'Paz', 3),
(4, 'Florencia', 'Arletaz', 1),
(5, 'Carla', 'Ramos', 2),
(6, 'Ben', 'Mark', 1);

SELECT * FROM friends;

DELETE FROM friends WHERE id = 6;
DELETE FROM cities WHERE id = 2;

DROP TABLE cities;

# Vistas
CREATE VIEW friends_from_rosario AS
	SELECT * FROM friends WHERE city = 2;
    
SELECT * FROM friends_from_rosario;
SELECT * FROM friends;

#Funciones
CREATE FUNCTION count_friends_from (id_city INT) 
RETURNS INT
DETERMINISTIC
RETURN (SELECT COUNT(*) FROM friends WHERE city = id_city);

-- Amigos de Córdoba
SELECT count_friends_from(1);
-- Amigos de Rosario
SELECT count_friends_from(2);
-- Amigos de Colón
SELECT count_friends_from(3);

#Triggers
DELIMITER $$
CREATE TRIGGER tr_city_default_name
BEFORE INSERT ON cities FOR EACH ROW
BEGIN
	IF NEW.name = '' THEN
		SET NEW.name = 'Default Name';
        END IF;
	END
$$

INSERT INTO cities(id, name) VALUES
(6, '');

SELECT * FROM cities;

#Stored procedure
DELIMITER $$
CREATE PROCEDURE friend_name (name VARCHAR(30))
BEGIN
	SELECT * FROM friends
    WHERE first_name = name;
END $$ 

CALL friend_name('Alberto');