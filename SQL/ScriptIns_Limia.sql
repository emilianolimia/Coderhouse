USE atacama;

-- Inserción de clientes
INSERT INTO customers(full_name, document_type, document_number, nationality, gender, age)
VALUES ('Juan Pérez', 'ID', 'A1234567', 'Chile', 'Male', '35'),
('María García', 'Passport', 'B7890123', 'Argentina', 'Female', '36'),
('Carlos Rodríguez', 'Passport', 'C2345678', 'Argentina', 'Male', '22'),
('Laura Martínez', 'Passport', 'D4567890', 'Brasil', 'Female', '27'),
('Andrés López', 'Passport', 'E5678901', 'EEUU', null, '54'),
('Ana Sánchez', 'ID', 'F1234567', 'Alemania', 'Female', '43'),
('Javier Fernández', 'ID', 'G2345678', 'Brasil', 'Male', '38'),
('Sofia González', 'Driver License', 'H3456789', 'Brasil', 'Female', '25'),
('Alejandro Ramírez', 'Passport', 'I4567890', null, 'Male', '20'),
('Valentina Torres', 'Passport', 'J5678901', 'Chile', 'Other', null);

-- Inserción de ciudades
INSERT INTO cities(name, country) VALUES 
("Atacama", "Chile"),
("Uyuni", "Bolivia"),
('Piedras Rojas', 'Chile'),
('Puritama', 'Chile'), 
('Rio de Janeiro', 'Brasil');

-- Inserción de tours
INSERT INTO tours(tour_name, city_id, duration, price, description) VALUES
("Valle de la Luna", 1, 4, 35000, 'Nos encontramos a las 15hs en la agencia. Se recorren las Tres Marías, las Minas de Sal y la Coordillera de sal. Incluye traslado, guiado y cóctel.'),
("Tour Astronómico", 1, 2, 25000, 'Nos encontramos a las 21.30hs en la agencia. Cosmovisión Andina y Atacameña. Astrofotografía. Incluye traslado, guiado, cóctel y 2 fotos de alta calidad digital'),
("Valle del Arcoiris", 1, 5, 30000, 'Inicia a las 7.30hs. Tour arqueológico y Petroglifos. Incluye pickup en hospedaje, traslado, guiado y desayuno.'),
('Laguna Cejar', 1, 5, 29000, 'Nos encontramos a las 14hs en la agencia. Incluye traslado, guiado y cóctel.'),
('Geyser del Tatio', 1, 7.5, 35000, 'Inicia a las 5am. Incluye pickup en hospedaje, traslado y desayuno.'),
('Lagunas Escondidas de Baltinache', 1, 5, 35000, 'Nos encontramos a las 14hs en la agencia. Incluye traslado, guiado y cóctel.'),
('Ruta de los Salares', 1, 8.5, 45000, 'Inicia 7.30hs. Incluye pickup en hospedaje, traslado, guiado, desayuno y almuerzo.'),
('Piedras Rojas', 3, 10, 57000, 'Inicia 6.40hs. Incluye pickup en hospedaje, traslado, guiado, desayuno y almuerzo.'),
('Termas de Puritama', 4, 5, 59000, 'Inicia 8.30hs (incluye pickup en hospedaje) y 13.20 (encuentro en la agencia). Incluye ticket de ingreso, traslado, guiado y desayuno o cóctel.'),
('Trekking Termas y Cascadas', 4, 5, 28000, 'Inicia 8.00hs (incluye pickup en hospedaje) y 15.00 (encuentro en la agencia). Incluye traslado, guiado y desayuno o cóctel.'),
('Vallecito y Bus Abandonado', 1, 4, 28000, 'Nos encontramos a las 15.15hs en la agencia. Incluye traslado, guiado y cóctel.');

-- Inserción de paquetes
INSERT INTO packages(duration, description, price, package_name) VALUES
(3, 'Son 3 días y 2 noches que incluyen transporte, hospedajes, desayunos, almuerzos y cenas.', 173000, "Salar de Uyuni - 3 días y 2 noches"),
(4, 'Son 4 días y 3 noches que incluyen traslados ida y vuelta a San Pedro de Atacama, hospedajes, desayunos, almuerzos y cenas.', 213000, "Salar de Uyuni - 4 días y 3 noches"),
(4, 'Día 1: Valle de la Luna y Tour Astronómico - Día 2: Valle del Arcoiris y Laguna Cejar - Día 3: Piedras Rojas - Día 4: Geyser del Tatio', 196230, "Superpostales Atacama - 4 días"),
(5, 'Día 1: Valle de la Luna y Tour Astronómico - Día 2: Valle del Arcoiris y Laguna Cejar - Día 3: Piedras Rojas - Día 4: Ruta de los Salares - Día 5: Geyser del Tatio', 239400, "Superpostales Atacama - 5 días"),
(6, 'Día 1: Valle de la Luna - Día 2: Valle del Arcoiris y Laguna Cejar - Día 3: Trekking Termas y Cascadas y Tour Astronómico - Día 4: Piedras Rojas - Día 5: Ruta de los Salares - Día 6: Geyser del Tatio', 263120, "Superpostales Atacama - 6 días"),
(7, 'Combina los paquetes Superpostales Atacama - 4 días + Salar de Uyuni - 3 días y 2 noches (incluye Termas de Puritama y no incluye el Valle del Arcoiris)', 387000, "Atacama + Uyuni / Sin retorno"),
(8, 'Combina los paquetes Superpostales Atacama - 4 días + Salar de Uyuni - 3 días y 2 noches (incluye Termas de Puritama y no incluye el Valle del Arcoiris)', 405000, "Atacama + Uyuni / Con retorno");

-- Inserción de transfers
INSERT INTO transfers(company, destination, departure, duration, price, type) VALUES 
("Tapi", 'San Pedro de Atacama', 'Aeropuerto Atacama', 1, 10000, 'Shared'),
("Tapi", 'Aeropuerto Atacama', 'San Pedro de Atacama', 1, 10000, 'Shared'),
("Combi", 'San Pedro de Atacama', 'Aeropuerto Atacama', 1, 12000, 'Shared'),
("Combi", 'Aeropuerto Atacama', 'San Pedro de Atacama', 1, 12000, 'Shared'),
("Tapi", 'San Pedro de Atacama', 'Uyuni', 1, 30000, 'Private'),
("Tapi", 'Uyuni', 'San Pedro de Atacama', 1, 30000, 'Private');

-- Inserción de hospedajes
INSERT INTO lodging(city_id, stars, name, check_in_time, check_out_time, food, wifi, swimming_pool, pets, description) VALUES 
(1, 4, 'Tierra Atacama Hotel & Spa', 13.00, 10.00, 'Breakfast included', true, true, false, 'Ubicado en medio del impresionante paisaje desértico, el Tierra Atacama ofrece una experiencia de lujo con toques locales.'),
(1, 5, "Alto Atacama Desert Lodge & Spa", 14.00, 11.00, 'Breakfast & dinner', true, true, false, 'Ofrece una experiencia enriquecedora con excursiones guiadas y una conexión profunda con la cultura local.'),
(1, 4, "Hotel Cumbres San Pedro de Atacama", 14.00, 10.00, 'Breakfast included', true, true, true, 'Su diseño refleja la esencia del desierto y ofrece una mezcla de lujo y autenticidad.'),
(1, 3, "Explora Atacama", 13.00, 10.00, 'Breakfast included', true, false, true, 'Diseñado para los amantes de la aventura y la exploración.'),
(2, 3, "Hotel de Sal Luna Salada", 13.00, 10.00, 'Breakfast included', true, false, true, ' Este hotel único está construido principalmente con bloques de sal, lo que le da un encanto rústico y auténtico.'),
(2, 3, "Cristal Samaña", 13.00, 10.00, 'Breakfast included', true, false, false, 'Este hotel boutique es conocido por su diseño elegante y atención personalizada.'),
(5, 5, "Hotel Copacabana Palace", 13.00, 11.00, 'All inclusive', true, true, false, 'Este icónico hotel de lujo se encuentra en la famosa playa de Copacabana y ofrece una experiencia de hospedaje excepcional.');

-- Inserción de habitaciones
INSERT INTO rooms(lodging_id, type, price_night) VALUES 
(1, "Double", 100),
(1, "Triple", 130),
(1, "Premium", 150),
(2, "Double", 120),
(2, "Suite", 150),
(2, "Premium", 200),
(3, "Double", 90),
(3, "Triple", 120),
(3, "Suite", 130),
(4, "Shared", 50),
(4, "Double", 90),
(4, "Triple", 110),
(5, "Shared", 40),
(5, "Double", 80),
(5, "Triple", 100),
(6, "Shared", 40),
(6, "Double", 90),
(6, "Triple", 120),
(7, "Suite", 150),
(7, "Premium", 180);

-- Inserción de reservas de paquetes
INSERT INTO customer_books_package(customer_id, package_id, book_date, start_date, people_amount) VALUES
(1, 1, '2023-07-21', '2023-09-09', 2),
(2, 2, '2023-07-25', '2023-09-19', 2),
(3, 3, '2023-07-28', '2023-09-28', 4),
(4, 4, '2023-07-31', '2023-09-09', 2),
(5, 5, '2023-08-01', '2023-09-11', 2);

-- Inseción de reservas de tours
INSERT INTO customer_books_tour(customer_id, tour_name, book_date, start_date, people_amount) VALUES 
(6, 'Valle de la Luna', '2023-08-01', '2023-09-15', 1),
(6, 'Tour Astronómico', '2023-08-01', '2023-09-15', 1),
(7, 'Valle del Arcoiris', '2023-08-05', '2023-09-20', 2),
(7, 'Laguna Cejar', '2023-08-05', '2023-09-20', 2),
(8, 'Piedras Rojas', '2023-08-09', '2023-09-09', 3),
(8, 'Geyser del Tatio', '2023-08-09', '2023-09-10', 1),
(9, 'Ruta de los Salares', '2023-08-02', '2023-09-20', 2),
(9, 'Termas de Puritama', '2023-08-02', '2023-09-21', 2),
(10, 'Valle de la Luna', '2023-08-08', '2023-09-15', 2),
(10, 'Laguna Cejar', '2023-08-08', '2023-09-15', 2);

-- Inserción de reservas de transfer
INSERT INTO customer_books_transfer(customer_id, transfer_id, book_date, start_date, people_amount) VALUES 
(1, 2, '2023-07-21', '2023-09-08', 2),
(1, 1, '2023-07-21', '2023-09-15', 2),
(2, 2, '2023-07-25', '2023-09-18', 2),
(2, 1, '2023-07-25', '2023-09-25', 2),
(3, 4, '2023-07-28', '2023-09-27', 4),
(3, 3, '2023-07-28', '2023-10-04', 4),
(4, 4, '2023-07-31', '2023-09-08', 2),
(4, 3, '2023-07-31', '2023-09-14', 2),
(5, 2, '2023-08-01', '2023-09-10', 2),
(5, 1, '2023-08-01', '2023-09-19', 2),
(5, 5, '2023-08-01', '2023-09-15', 2),
(5, 6, '2023-08-01', '2023-09-18', 2);

-- Inserción de reservas de habitación
INSERT INTO customer_books_room(customer_id, room_id, book_date, arrival_date, nights) VALUES 
(1, 1, '2023-07-21', '2023-09-08', 7),
(2, 4, '2023-07-25', '2023-09-18', 7),
(3, 7, '2023-07-28', '2023-09-27', 7),
(3, 9, '2023-07-28', '2023-09-27', 7),
(4, 3, '2023-07-31', '2023-09-08', 6),
(5, 6, '2023-08-01', '2023-09-10', 5),
(5, 6, '2023-08-01', '2023-09-18', 1);