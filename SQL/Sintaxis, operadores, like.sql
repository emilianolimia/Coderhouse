USE gammers_model;

#Sintaxis
SELECT id_class, description FROM class;
SELECT * FROM class;

# Select - Consulta de selección 
SELECT id_class, description FROM class;
SELECT * FROM system_user;

# Select distinct 
SELECT DISTINCT 
id_system_user, first_name
FROM system_user;
SELECT DISTINCT first_name
FROM system_user;

# Select - Actividad en clase
SELECT * 
FROM system_user;
SELECT first_name, last_name 
FROM system_user;
SELECT first_name, last_name, email 
FROM system_user;
SELECT id_system_user, first_name, last_name
FROM system_user;

# Operadores de comparación
SELECT id_system_user, first_name, last_name
FROM system_user
WHERE id_system_user = 56;

# Operadores de comparación - Actividad en clase
SELECT * FROM system_user WHERE first_name = 'Gillie';
SELECT first_name, last_name FROM system_user WHERE id_user_type = 334;
SELECT first_name, last_name FROM system_user WHERE id_system_user = 56;
SELECT * FROM system_user WHERE first_name = 'Reinaldos';

# Operador > y <
SELECT id_system_user, first_name, last_name 
FROM system_user 
WHERE id_system_user >= 50 AND id_system_user <= 60;

# Operador Like
SELECT * FROM system_user WHERE first_name LIKE '%Gi%';
