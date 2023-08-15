Use atacama;

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