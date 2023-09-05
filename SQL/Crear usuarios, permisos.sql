USE sys;
SELECT * FROM sys_config;

USE mysql;
SHOW tables;
SELECT * FROM user;

# Create user+dominio
CREATE USER prueba@localhost; 

# Create user+dominio+password
CREATE USER prueba@localhost IDENTIFIED BY '1234';
SHOW VARIABLES LIKE 'validate_password%';

CREATE USER prueba@localhost IDENTIFIED BY 'Coder1234_';
SELECT * FROM user;

# Modificar constraseña
ALTER USER prueba@localhost IDENTIFIED BY 'Coder1234@';
SELECT * FROM user;

# Renombrar usuario
RENAME USER prueba@localhost TO coderhouse@localhost;
SELECT * FROM user;

# Eliminar usuario
DROP USER coderhouse@localhost;
SELECT * FROM user;

# Permisos
CREATE USER coderhouse@localhost IDENTIFIED BY 'Coder1234_';

SELECT * FROM mysql.user WHERE user LIKE 'coderhouse';

SHOW GRANTS FOR coderhouse@localhost;
SHOW GRANTS FOR root@localhost;

GRANT ALL ON *.* TO coderhouse@localhost;
SHOW GRANTS FOR coderhouse@localhost;
SELECT * FROM mysql.user WHERE user LIKE 'coderhouse';

# Permisos sobre tablas
GRANT ALL ON gammers_model.level_game TO coderhouse@localhost;
SHOW GRANTS FOR coderhouse@localhost;

GRANT ALL ON gammers_model.class TO coderhouse@localhost;
GRANT ALL ON gammers_model.game TO coderhouse@localhost;
SHOW GRANTS FOR coderhouse@localhost;

# Permisos selectivos
GRANT SELECT, UPDATE ON gammers_model.level_game TO coderhouse@localhost;
SHOW GRANTS FOR coderhouse@localhost;

GRANT UPDATE, SELECT (description) ON gammers_model.level_game TO coderhouse@localhost;
SHOW GRANTS FOR coderhouse@localhost;

# Revoke
GRANT ALL ON *.* TO coderhouse@localhost;
SHOW GRANTS FOR coderhouse@localhost;

REVOKE ALL ON *.* FROM coderhouse@localhost;
SHOW GRANTS FOR coderhouse@localhost;

# Revoke especifico
GRANT UPDATE ON gammers_model.level_game TO coderhouse@localhost;
SHOW GRANTS FOR coderhouse@localhost;
REVOKE UPDATE ON *.* FROM coderhouse@localhost;
REVOKE UPDATE ON gammers_model.level_game FROM coderhouse@localhost;

GRANT ALL ON gammers_model.* TO coderhouse@localhost;
REVOKE ALL ON gammers_model.* FROM coderhouse@localhost;

SHOW GRANTS FOR coderhouse@localhost;

# Stored procedures y funciones
GRANT EXECUTE ON `gammers_model`.* TO coderhouse@localhost;
REVOKE EXECUTE ON `gammers_model`.*  FROM coderhouse@localhost;

# Ejemplo en vivo
-- Creación de usuario
USE mysql;
DROP USER coderhouse@localhost;
SELECT * FROM user;
CREATE USER coderhouse@localhost IDENTIFIED BY 'Coder1234_';

-- Acceso a columnas específicas
GRANT SELECT (description) ON gammers_model.level_game TO coderhouse@localhost;

-- Acceso a acciones específicas
GRANT UPDATE ON gammers_model.level_game TO coderhouse@localhost;
DELETE FROM gammers_model.LEVEL_GAME WHERE description like 'new_level3%';

-- Acceso a tablas específicas
GRANT ALL ON gammers_model.class TO coderhouse@localhost;
GRANT ALL ON gammers_model.game TO coderhouse@localhost;

-- Acceso a stored procedures y funciones
GRANT EXECUTE ON `gammers_model`.* TO coderhouse@localhost;
-- REVOKE EXECUTE ON `gammers_model`.*  FROM coderhouse@localhost;

-- Acceso a todo el esquema gammers
GRANT ALL ON gammers_model.* TO coderhouse@localhost;
REVOKE SELECT (`description`), UPDATE ON `gammers_model`.`level_game` FROM coderhouse@localhost;
REVOKE ALL ON gammers_model.* FROM coderhouse@localhost;
REVOKE ALL ON gammers_model.class FROM coderhouse@localhost;
REVOKE ALL ON gammers_model.game FROM coderhouse@localhost;

-- Acceso a todas las bd
GRANT ALL ON *.* TO coderhouse@localhost;
REVOKE ALL ON *.* FROM coderhouse@localhost;

SHOW GRANTS FOR coderhouse@localhost;
