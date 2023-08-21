USE atacama;

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