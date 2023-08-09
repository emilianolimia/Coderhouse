USE gammers_model;

CREATE TABLE PRODUCTOS (
	id int NOT NULL AUTO_INCREMENT, 
	nombre varchar(40) NOT NULL, 
	existencia int NOT NULL DEFAULT 0, 
	precio float NOT NULL DEFAULT 0, 
	precio_compra float NOT NULL DEFAULT 0, 
PRIMARY KEY (id)
);

SELECT * FROM PRODUCTOS;
TRUNCATE PRODUCTOS;
DROP TABLE PRODUCTOS;


-- Consola:
/*
mysql -u root -p
show databases;
use gammers_model;
show tables;
explain productos;
LOAD DATA LOCAL INFILE '/Users/lblanc/Desktop/productos.csv' INTO TABLE productos FIELDS TERMINATED BY ',' LINES TERMINATED BY '\n' IGNORE 1 LINES (nombre,existencia,precio,precio_compra);
*/
