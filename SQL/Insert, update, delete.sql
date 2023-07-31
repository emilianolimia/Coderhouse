USE gammers_model;

# Insert
INSERT INTO class(id_level, id_class, description) 
VALUES (1, 999, 'Spain comedy');

INSERT INTO class VALUES (1, 998, 'Terror comedy');

SELECT * FROM class ORDER BY id_level;

# Autoincrement
CREATE TABLE PAY(
	id_pay INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    amount REAL NOT NULL DEFAULT 0,
    currency VARCHAR(20) NOT NULL,
    date_pay DATE NOT NULL, 
    pay_type VARCHAR(50),
    id_system_user INT NOT NULL,
    id_game INT NOT NULL
);

INSERT INTO PAY VALUES (NULL, '250', 'U$S', '2021-07-22', 'Paypal', 850, 77);
SELECT * FROM PAY;

INSERT INTO PAY (currency, date_pay, pay_type, id_system_user, id_game) 
VALUES ('U$S', '2021-08-22', 'Paypal', 850, 77);
SELECT * FROM PAY;

INSERT INTO pay VALUES 
(NULL, 250, 'U$S', '2021-07-22', 'Paypal', 850, 77),
(NULL, 3700, 'Pesos Arg', '2021-07-22', 'Visa', 38, 31),
(NULL, 180, 'Libras', '2021-07-22', 'Transfer', 175, 16);
SELECT * FROM PAY;

# Update
SELECT * FROM PAY WHERE id_pay = 4;
UPDATE PAY SET currency = 'U$S' WHERE id_pay = 4;
SELECT * FROM PAY;

# Delete
DELETE FROM class 
WHERE id_level = 1 and id_class = 998;

DELETE FROM PAY;
TRUNCATE PAY;
SELECT * FROM PAY;

# Error FOREIGN KEY
DELETE FROM level_game WHERE id_level = 5;

