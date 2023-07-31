Use gammers_model;

SELECT * FROM game;

# Vistas
CREATE VIEW games AS 
SELECT * FROM game;

SELECT * from games;

# Nombres y descripciones de los juegos
CREATE VIEW games_name_description AS 
(SELECT name, description FROM game);

SELECT * FROM games_name_description;

# Videojuegos con nombre “Call of duty”
CREATE VIEW games_call_of_duty AS
(SELECT name, description FROM game
	WHERE name like upper('%Call of Duty%')
);

SELECT * FROM games_call_of_duty;

# 2- OR REPLACE
CREATE VIEW games AS
(SELECT name, description FROM game
	WHERE name like upper('%Call of Duty%')
);

SELECT * FROM games;

CREATE OR REPLACE VIEW games AS
(SELECT name, description FROM game
	WHERE name like upper('%Call of Duty%')
);

SELECT * FROM games;

# Filtros
CREATE OR REPLACE VIEW games AS
(SELECT name, description FROM game
	ORDER BY name DESC
);

SELECT * FROM games;

# Crear una vista con mas de una tabla
SELECT * FROM game;
SELECT * FROM play;

CREATE OR REPLACE VIEW games AS
(SELECT name, description, p.id_system_user 
	FROM game v 
	JOIN play p
	ON v.id_game = p.id_game
    WHERE p.completed = false
);

SELECT * FROM games where id_system_user = 62;
SELECT * FROM play where id_system_user = 62;
SELECT * FROM game where id_game IN (1,51);

# Modificar una vista existente
CREATE OR REPLACE VIEW games AS
(SELECT name, description, p.id_system_user 
	FROM game v 
	JOIN play p
	ON v.id_game = p.id_game
    WHERE p.completed = true
);

# Eliminar una vista existente
DROP VIEW games_call_of_duty;
DROP VIEW games_name_description;
DROP VIEW games;


# REPASO JOIN
SELECT * FROM play;
SELECT * FROM system_user;

-- Nombre y apellido de usuarios
SELECT first_name, last_name 
FROM system_user;

-- Relación entre usuarios y jugadas
SELECT p.*, u.*
FROM system_user u
JOIN play p 
ON u.id_system_user = p.id_system_user;

-- Nombre y apellido de usuarios que completaron juegos
SELECT u.first_name, u.last_name 
FROM system_user u
JOIN play p 
ON u.id_system_user = p.id_system_user
WHERE p.completed = true;

-- Qué juego completaron
SELECT first_name, last_name, p.id_game 
FROM system_user u
JOIN play p 
ON u.id_system_user = p.id_system_user
WHERE p.completed = true;

-- De nuevo, qué juego completaron
SELECT first_name, last_name, p.id_game, g.name 
FROM system_user u
JOIN play p 
ON u.id_system_user = p.id_system_user
JOIN game g
ON p.id_game = g.id_game
WHERE p.completed = true;

# Actividad en clase
# 1 - Usuarios que tengan mail ‘webnode.com’
SELECT * FROM system_user;
CREATE OR REPLACE VIEW user_webnode AS
(SELECT first_name, last_name
	FROM system_user 
    WHERE email like '%webnode.com%'
);

SELECT * FROM user_webnode;

# 2 - Juegos que han finalizado.
SELECT * FROM game;
SELECT * FROM play;

CREATE OR REPLACE VIEW completed_games AS
(SELECT g.*, p.id_system_user, p.completed
	FROM game g 
	JOIN play p
	ON g.id_game = p.id_game
    WHERE p.completed = true
);

SELECT * FROM completed_games;

# 3 - Juegos que tuvieron una votación mayor a 9.
SELECT * FROM game;
SELECT * FROM vote;

CREATE OR REPLACE VIEW games_votes AS
(SELECT g.name, v.value
	FROM game g 
	JOIN vote v
	ON g.id_game = v.id_game
    WHERE v.value > 9
);

SELECT * FROM games_votes;

# 4 - Nombre, apellido y mail de los usuarios que juegan al juego FIFA 22.
SELECT * FROM system_user;
SELECT * FROM game;
SELECT * FROM play;

CREATE OR REPLACE VIEW user_fifa_22 AS
(SELECT g.name, p.id_system_user
	FROM game g 
	JOIN play p
	ON g.id_game = p.id_game
    WHERE g.name = 'FIFA 22'
);

SELECT * FROM user_fifa_22;

CREATE OR REPLACE VIEW user_fifa_22 AS
(SELECT u.first_name, u.last_name, u.email
	FROM game g 
	JOIN play p
	ON g.id_game = p.id_game
    JOIN system_user u
    ON p.id_system_user = u.id_system_user
    WHERE g.name = 'FIFA 22'
);

SELECT * FROM user_fifa_22;

SELECT * FROM system_user WHERE first_name = 'Silvia' and last_name = 'Trenam';
SELECT * FROM play where id_system_user = 145;
SELECT * FROM game where id_game IN (1, 45, 87);