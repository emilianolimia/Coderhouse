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