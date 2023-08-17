USE atacama;

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