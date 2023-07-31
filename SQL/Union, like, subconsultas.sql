USE gammers_model;

# UNION
SELECT id_game, name, description, id_level, id_class 
FROM game
WHERE id_level = 1
UNION 
SELECT id_game, name, description, id_level, id_class 
FROM game
WHERE id_level = 2;

#LIKE
SELECT * 
FROM game 
WHERE name LIKE 'FIFA%';

SELECT * 
FROM game 
WHERE name LIKE '%Ultimate%';

SELECT * 
FROM game 
WHERE name LIKE '%Team';

SELECT * 
FROM game 
WHERE name LIKE '_IFA%';

SELECT * 
FROM game 
WHERE name NOT LIKE 'FIFA%';

SELECT *
FROM system_user
WHERE last_name LIKE '%w%';


#SUBCONSULTAS
SELECT id_system_user, last_name, id_user_type
FROM system_user
WHERE id_user_type = (SELECT max(id_user_type) FROM user_type);


#Sin subconsultas:
SELECT max(id_user_type) FROM user_type;

SELECT id_system_user, last_name
FROM system_user
WHERE id_user_type = 500;

SELECT id_system_user, value
FROM vote WHERE value > (SELECT FLOOR(AVG(value)) FROM vote);

SELECT SUM(value) 
FROM vote
WHERE id_game = (SELECT min(id_game) FROM game);

SELECT id_system_user 
FROM vote
WHERE value > (SELECT avg(value) FROM vote);

#ORDENAMIENTO 
SELECT id_system_user, last_name
FROM system_user
WHERE id_user_type = (SELECT max(id_user_type) FROM user_type)
ORDER BY last_name ASC;

#GROUP BY
SELECT id_game, SUM(value) AS votos
FROM vote 
WHERE id_game IN (SELECT id_game 
FROM game WHERE id_level = 1)
GROUP BY id_game;

#HAVING 
SELECT id_game, name
FROM game
WHERE id_level = 1 AND
id_game IN 
(SELECT id_game
FROM vote
GROUP BY id_game
HAVING count(*) > 5);
