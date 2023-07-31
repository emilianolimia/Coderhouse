use gammers_model;

#Data Definition Language
#CREATE
CREATE TABLE friend (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	first_name VARCHAR(30) NOT NULL,
	last_name VARCHAR(30) NOT NULL,
	email VARCHAR(30)
);

#ALTER
ALTER TABLE friend ADD age INT;

ALTER TABLE friend
MODIFY email VARCHAR(300) NOT NULL;

ALTER TABLE friend RENAME COLUMN age TO edad;
ALTER TABLE friend DROP COLUMN edad;
ALTER TABLE friend RENAME TO friends;

#DROP
DROP TABLE friends;

#TRUNCATE
use gammers_model;
TRUNCATE TABLE friends;

SELECT * FROM friends;


#Funciones Escalares
#Cadenas
SELECT concat(first_name, last_name)
AS complete_name
FROM system_user;
SELECT UCASE(description) FROM class;
SELECT LCASE(description) FROM class;
SELECT description, REVERSE(description) FROM class;

#Numéricas
SELECT (21 / 3) AS resultado;
SELECT (7 * 3) AS resultado;
SELECT (18 + 3) AS resultado;
SELECT (30 - 9) AS resultado;


SELECT CONCAT("LUCIA", "_", "BLANC") AS nombre_completo;
SELECT CONCAT_WS(" ", "LUCIA", "SOLEDAD", "BLANC") AS nombre_completo;
SELECT LCASE(CONCAT("LUCIA", "_", "BLANC")) AS nombre_completo;
SELECT (1991 / 1912) AS resultado;
SELECT round(1991 / 1912) as resultado;
SELECT round(1991 / 1912, 2) as resultado;
SELECT (datediff("2022-11-23", "1991-12-19") / 365) AS date_diff;
SELECT dayname("1991-12-19") AS date;