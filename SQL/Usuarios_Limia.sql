USE atacama;

# Creamos 2 usuarios nuevos:
CREATE USER usuario1@localhost IDENTIFIED BY '1234';
CREATE USER usuario2@localhost IDENTIFIED BY '1234';

# Damos permisos de sólo lectura sobre todas las tablas al usuario1
GRANT SELECT ON * TO usuario1@localhost;

# Damos permisos de lectura, inserción y modificación de datos a usuario2
GRANT SELECT, INSERT, UPDATE ON * TO usuario2@localhost;

# Ninguno de los dos usuarios debe poder eliminar registros de ninguna tabla
REVOKE DELETE ON * FROM usuario1@localhost;
REVOKE DELETE ON * FROM usuario2@localhost;