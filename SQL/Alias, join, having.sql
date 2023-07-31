USE gammers_model;

# Alias
SELECT 
     id_system_user, 
     last_name,
     password
FROM system_user 
ORDER BY id_system_user;

SELECT 
     u.id_system_user AS id,
     u.last_name AS l_n,     
     u.password AS pass
FROM system_user u
ORDER BY u.id_system_user;

# Funciones de Agregación
SELECT * FROM level_game;

SELECT COUNT(*) AS total_level
FROM level_game;

SELECT MIN(Id_level) AS min_level
FROM level_game;

SELECT MAX(Id_level) AS max_level
FROM level_game;

SELECT * FROM vote ORDER BY id_game;

SELECT SUM(Value) AS SUM_GAME_1
FROM vote
WHERE id_game = 1;

SELECT AVG(Value) 
FROM vote
WHERE id_game = 1;

# Sentencia GROUP BY
SELECT * FROM play wHERE id_system_user=13;

SELECT id_system_user, COUNT(*) FROM PLAY
GROUP BY id_system_user;

SELECT id_system_user AS user, completed, COUNT(*) AS games_by_user
FROM play
GROUP BY id_system_user, completed
ORDER BY id_system_user;

SELECT * FROM play WHERE id_system_user = 3;

# Sentencia HAVING
SELECT * FROM play wHERE id_system_user = 13;

SELECT id_system_user AS user, COUNT(*) AS games_by_user
FROM play
GROUP BY id_system_user
HAVING COUNT(*) > 1;

SELECT id_system_user AS user, COUNT(*) AS games_by_user
FROM play
WHERE completed = 1
GROUP BY id_system_user
HAVING COUNT(*) > 1;

# Actividad en clase
SELECT * FROM commentary;
SELECT * FROM commentary ORDER BY id_system_user dESC;
SELECT * FROM commentary ORDER BY id_system_user LIMIT 3;
SELECT COUNT(Id_system_user) AS comments, id_system_user 
FROM commentary GROUP BY id_system_user ;

SELECT COUNT(*) AS comments, id_system_user 
FROM commentary 
GROUP BY id_system_user 
HAVING comments > 2;

SELECT id_system_user, COUNT(*) AS comments
FROM commentary 
GROUP BY id_system_user;

SELECT * FROM commentary;

# Sentencias JOIN
# INNER JOIN

SELECT * FROM play;
SELECT * FROM game WHERE id_game = 1;


SELECT id_system_user aS user, g.Id_game aS game, name, id_level aS level
FROM play p 
INNER JOIN game g 
ON (P.Id_game = g.Id_game);

SELECT id_system_user, g.*
FROM play p 
INNER JOIN game g 
ON (P.Id_game = g.Id_game);

SELECT *
FROM play p 
INNER JOIN game g 
ON (P.Id_game = g.Id_game);

# LEFT JOIN
SELECT id_system_user aS user, g.Id_game aS game, 
name, id_level aS level
FROM game g LEFT JOIN play p
ON (P.Id_game = g.Id_game);

#RIGHT JOIN
SELECT id_system_user aS user, g.Id_game aS game, 
name, id_level aS level
FROM play p RIGHT JOIN game g
ON (P.Id_game = g.Id_game);

# Friends + Cities
CREATE TABLE friends (
    id iNT AUTO_INCREMENT pRIMARY kEY,
    name vARCHAR(255),
    last_name vARCHAR(255),
    city iNT
);

CREATE TABLE cities (
    id iNT AUTO_INCREMENT pRIMARY kEY,
    name vARCHAR(255)
);

ALTER TABLE friends ADD CONSTRAINT FK_CITY FOREIGN KEY FK_CITY (City)
    REFERENCES cities (Id);
    
SELECT * fROM cities;
SELECT * fROM friends;

SELECT * FROM FRIENDS F
INNER JOIN CITIES C ON
F.city = C.id;

SELECT * FROM FRIENDS F
LEFT JOIN CITIES C ON
F.city = C.id;

SELECT * FROM FRIENDS F
RIGHT JOIN CITIES C ON
F.city = C.id;