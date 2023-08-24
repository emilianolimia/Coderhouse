USE atacama;

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