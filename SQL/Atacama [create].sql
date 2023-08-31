CREATE SCHEMA atacama;
USE atacama;

CREATE TABLE customers(
	customer_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY UNIQUE, 
    name VARCHAR(50) NOT NULL,
    document_type ENUM('ID', 'Passport', 'Driver License') NOT NULL,
    document_number VARCHAR(20) NOT NULL,
    nationality VARCHAR(50)
);

CREATE TABLE cities (
	city_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY UNIQUE,
    name VARCHAR(50) NOT NULL,
    country VARCHAR(50) NOT NULL
);

CREATE TABLE tours(
	tour_name VARCHAR(50) NOT NULL PRIMARY KEY UNIQUE, 
    city_id INT NOT NULL,
    duration DECIMAL(5, 2) NOT NULL,
    price DECIMAL(9, 2) NOT NULL,
    description VARCHAR(300) NOT NULL,
    FOREIGN KEY (city_id) REFERENCES cities(city_id)
);

CREATE TABLE packages(
	package_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY UNIQUE, 
    duration INT NOT NULL,
    description VARCHAR(300) NOT NULL,
    price DECIMAL(9, 2) NOT NULL
);

CREATE TABLE transfers(
	transfer_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY UNIQUE, 
    empresa VARCHAR(50) NOT NULL,
    destination VARCHAR(50) NOT NULL,
    departure VARCHAR(50) NOT NULL,
    duration DECIMAL(5, 2) NOT NULL,
    price DECIMAL(9, 2) NOT NULL,
    type ENUM('Private', 'Shared') NOT NULL
);

CREATE TABLE lodging(
	lodging_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY UNIQUE, 
    city_id INT NOT NULL,
    stars ENUM('1', '2', '3', '4', '5', '6'),
    name VARCHAR(50) NOT NULL,
    check_in_time DECIMAL(5, 2),
    check_out_time DECIMAL(5, 2),
    food ENUM ('None', 'Breakfast included', 'Breakfast & dinner', 'All inclusive'),
    wifi BOOLEAN,
    swimming_pool BOOLEAN,
    pets BOOLEAN,
    description VARCHAR (300),
    FOREIGN KEY (city_id) REFERENCES cities(city_id)
);

CREATE TABLE rooms (
	room_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY UNIQUE,
    lodging_id INT NOT NULL,
    type ENUM('Shared','Double','Triple','Suite','Premium'),
    price_night DECIMAL(9, 2) NOT NULL,
    FOREIGN KEY (lodging_id) REFERENCES lodging(lodging_id)
);

CREATE TABLE customer_books_package (
	customer_package_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY UNIQUE,
    customer_id INT NOT NULL,
    package_id INT NOT NULL,
    book_date DATE NOT NULL,
    start_date DATE NOT NULL,
    people_amount INT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (package_id) REFERENCES packages(package_id)
);

CREATE TABLE customer_books_tour (
	customer_tour_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY UNIQUE,
    customer_id INT NOT NULL,
    tour_name VARCHAR(50) NOT NULL,
    book_date DATE NOT NULL,
    start_date DATE NOT NULL,
    people_amount INT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (tour_name) REFERENCES tours(tour_name)
);

CREATE TABLE customer_books_transfer (
	customer_transfer_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY UNIQUE,
    customer_id INT NOT NULL,
    transfer_id INT NOT NULL,
    book_date DATE NOT NULL,
    start_date DATE NOT NULL,
    people_amount INT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (transfer_id) REFERENCES transfers(transfer_id)
);

CREATE TABLE customer_books_room (
	customer_room_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY UNIQUE,
    customer_id INT NOT NULL,
    room_id INT NOT NULL,
    book_date DATE NOT NULL,
    arrival_date DATE NOT NULL,
    nights INT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (room_id) REFERENCES rooms(room_id)
);

-- Modificar el nombre de la columna 'name' a 'full_name'
ALTER TABLE customers
CHANGE COLUMN name full_name VARCHAR(50);

-- Agregar la columna 'gender'
ALTER TABLE customers
ADD COLUMN gender ENUM('Male', 'Female', 'Other');

-- Agregar la columna 'age'
ALTER TABLE customers
ADD COLUMN age INT;

-- Agregar la columna 'package_name'
ALTER TABLE packages
ADD COLUMN package_name VARCHAR(50) NOT NULL;

-- Modificar el nombre de la columna 'empresa' a 'company'
ALTER TABLE transfers
CHANGE COLUMN empresa company VARCHAR(50);

# 1 - Hospedajes de Atacama
CREATE OR REPLACE VIEW lodgings_atacama AS
(SELECT name, stars, description
	FROM lodging
    WHERE city_id = 1
);

# 2 - Tours de Atacama
CREATE OR REPLACE VIEW tours_atacama AS
(SELECT tour_name, description
	FROM tours
    WHERE city_id = 1
);

# 3 - Hospedajes de Atacama con habitación premium
CREATE OR REPLACE VIEW lodgings_atacama_premium AS
(SELECT l.name, r.price_night
	FROM rooms r
	JOIN lodging l
	ON r.lodging_id = l.lodging_id
    WHERE l.city_id = 1 AND r.type = 'Premium'
);

# 4 - Tours reservados para septiembre
CREATE OR REPLACE VIEW tours_booked_september AS
(SELECT c.full_name, cbt.tour_name, cbt.start_date, cbt.people_amount
	FROM customer_books_tour cbt
	JOIN customers c
	ON cbt.customer_id = c.customer_id
    WHERE month(cbt.start_date) = 9
);

# 5 - Transfers que salen desde el Aeropuerto
CREATE OR REPLACE VIEW transfers_airport AS
(SELECT company, departure, destination, type
	FROM transfers
    WHERE departure = 'Aeropuerto Atacama'
);

# Función para obtener el nombre de un paquete, pasándole por parámetro el package_id.
DELIMITER $$
CREATE FUNCTION `get_package_name`(id INT) 
RETURNS VARCHAR(50)
DETERMINISTIC
READS SQL DATA
BEGIN
    RETURN (SELECT package_name FROM packages WHERE package_id = id);
END
$$

# Función para obtener cantidad de reservas por mes de un tour determinado.
DELIMITER //
CREATE FUNCTION tour_reservations_per_month(tour VARCHAR(50), month INT)
RETURNS INT
READS SQL DATA
BEGIN
    DECLARE amount INT;
    SELECT COUNT(*) INTO amount
    FROM customer_books_tour
    WHERE MONTH(book_date) = month AND tour_name = tour;
    RETURN amount;
END;
//

-- SP al que le pasamos como primer parámetro el campo de ordenamiento a la tabla customer_books_tour
-- Y mediante un segundo parámetro le pasamos si el orden es descendente o ascendente.
DELIMITER $$
CREATE PROCEDURE `sp_booked_tours_order`(IN field CHAR(20), IN order_asc_desc CHAR(20))
BEGIN
	IF field <> '' THEN
		SET @tour_order = concat('ORDER BY ', field, ' ', order_asc_desc);
	ELSE
		SET @tour_order = '';
	END IF;
    
    SET @clausula = concat('SELECT * FROM customer_books_tour ', @tour_order);
	PREPARE runSQL FROM @clausula;
	EXECUTE runSQL;
	DEALLOCATE PREPARE runSQL;
END
$$

-- SP para insertar un registro en la tabla 'customers'.
DELIMITER $$
CREATE PROCEDURE `sp_insert_customer`(IN name VARCHAR(50), IN doc_type enum('ID','Passport','Driver License'), IN doc_num VARCHAR(20), nation VARCHAR(50), IN gen enum('Male','Female','Other'), IN years INT, OUT output VARCHAR(50))
BEGIN
	IF name <> '' AND doc_num <> '' THEN
		INSERT INTO customers (full_name, document_type, document_number, nationality, gender, age) VALUES (name, doc_type, doc_num, nation, gen, years);
        SET output = 'Inserción exitosa';
	ELSE
		SET output = 'ERROR: no se pudo crear el registro';
	END IF;
    
    SET @clausula = 'SELECT * FROM customers';
	PREPARE runSQL FROM @clausula;
	EXECUTE runSQL;
	DEALLOCATE PREPARE runSQL;
END
$$

# Tabla para auditar los logs sobre las reservas de tours 
CREATE TABLE audit_tours_booked (
    id_log INT PRIMARY KEY auto_increment,
    tour_name varchar(50),
    customer_id int,
    insert_date date,
    insert_time time,
    created_by varchar(100),
    last_update_date date,
    last_update_time time,
    last_updated_by varchar(100)
);

# Trigger para crear un log de los nuevos tours que se reservan 
DELIMITER //
CREATE TRIGGER `tr_insert_tour_booking`
AFTER INSERT ON `customer_books_tour`
FOR EACH ROW
BEGIN
	INSERT INTO `audit_tours_booked` (tour_name, customer_id, insert_date, insert_time, created_by, last_update_date, last_update_time, last_updated_by)
    VALUES (NEW.tour_name, NEW.customer_id, DATE(CURRENT_TIMESTAMP()), DATE(CURRENT_TIMESTAMP()), USER(), DATE(CURRENT_TIMESTAMP()), DATE(CURRENT_TIMESTAMP()), USER());
END;
//
DELIMITER ;

# Trigger para llevar el log de las actualizaciones que puedan sufrir las reservas de los tours
DELIMITER //
CREATE TRIGGER `tr_update_tour_booking`
BEFORE UPDATE ON `customer_books_tour`
FOR EACH ROW
BEGIN
    UPDATE `audit_tours_booked`
    SET last_update_date = DATE(CURRENT_TIMESTAMP()), last_update_time = TIME(CURRENT_TIMESTAMP()), last_updated_by = USER() 
    WHERE customer_id = OLD.customer_id AND tour_name = OLD.tour_name;
END;
//
DELIMITER ;

# Tabla para auditar los logs sobre las reservas de transfers 
CREATE TABLE audit_transfers_booked (
    id_log INT PRIMARY KEY auto_increment,
    customer_transfer_id int,
    insert_date date,
    insert_time time,
    created_by varchar(100),
    last_update_date date,
    last_update_time time,
    last_updated_by varchar(100)
);

# Trigger para crear un log de los nuevos transfers que se reservan 
DELIMITER //
CREATE TRIGGER `tr_insert_transfer_booking`
AFTER INSERT ON `customer_books_transfer`
FOR EACH ROW
BEGIN
    INSERT INTO `audit_transfers_booked` (customer_transfer_id, insert_date, insert_time, created_by, last_update_date, last_update_time, last_updated_by)
    VALUES (NEW.customer_transfer_id, DATE(CURRENT_TIMESTAMP()), TIME(CURRENT_TIMESTAMP()), USER(), DATE(CURRENT_TIMESTAMP()), TIME(CURRENT_TIMESTAMP()), USER());
END;
//
DELIMITER ;

# Trigger para llevar el log de las actualizaciones que puedan sufrir las reservas de los transfers
DELIMITER //
CREATE TRIGGER `tr_update_transfer_booking`
BEFORE UPDATE ON `customer_books_transfer`
FOR EACH ROW
BEGIN
    UPDATE `audit_transfers_booked`
    SET last_update_date = DATE(CURRENT_TIMESTAMP()), last_update_time = TIME(CURRENT_TIMESTAMP()), last_updated_by = USER() 
    WHERE customer_transfer_id = OLD.customer_transfer_id;
END;
//
DELIMITER ;