USE atacama;

-- Iniciar una transacción
START TRANSACTION;

-- Realizar operaciones de eliminación de registros:
DELETE FROM customer_books_transfer WHERE customer_id = 1;

-- Para realizar un rollback, descomentar la siguiente línea
-- ROLLBACK;

-- Para confirmar la transacción, descomentar la siguiente línea
-- COMMIT;

-- Fin de la transacción

-- Iniciar otra transacción
START TRANSACTION;

-- Insertamos los primeros 4 registros
INSERT INTO customers (full_name, document_type, document_number, nationality, gender, age)
VALUES ('Carlos Pérez', 'ID', 'K1234567', 'Chile', 'Male', 40);

INSERT INTO customers (full_name, document_type, document_number, nationality, gender, age)
VALUES ('Luisa Rodríguez', 'Passport', 'L2345678', 'Perú', 'Female', 29);

INSERT INTO customers (full_name, document_type, document_number, nationality, gender, age)
VALUES ('Ana González', 'Passport', 'M3456789', 'Argentina', 'Female', 32);

INSERT INTO customers (full_name, document_type, document_number, nationality, gender, age)
VALUES ('Pedro Martínez', 'Passport', 'N4567890', 'México', 'Male', 45);

-- Agregamos un savepoint después del registro #4
SAVEPOINT savepoint_after_4;

-- Insertamos otros 4 registros
INSERT INTO customers (full_name, document_type, document_number, nationality, gender, age)
VALUES ('Elena Torres', 'Passport', 'O5678901', 'Brasil', 'Female', 28);

INSERT INTO customers (full_name, document_type, document_number, nationality, gender, age)
VALUES ('Diego Sánchez', 'ID', 'P1234567', 'Chile', 'Male', 33);

INSERT INTO customers (full_name, document_type, document_number, nationality, gender, age)
VALUES ('Patricia López', 'ID', 'Q2345678', 'Argentina', 'Female', 31);

INSERT INTO customers (full_name, document_type, document_number, nationality, gender, age)
VALUES ('Miguel González', 'Driver License', 'R3456789', 'España', 'Male', 37);

-- Agregamos un savepoint después del registro #8
SAVEPOINT savepoint_after_8;

-- Agregamos una sentencia de eliminación de savepoint
-- ROLLBACK TO savepoint_after_4;

-- Fin de la transacción