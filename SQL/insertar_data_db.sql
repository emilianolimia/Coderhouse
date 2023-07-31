USE spotify;

-- Inserción de estilo
INSERT INTO styles(name) VALUES ('Rock en español');

-- Inserción de artista
INSERT INTO artists(first_name, last_name, style_id) VALUES 
("Andrés", "Calamaro", 1),
("Fito", "Paez", 1);

-- Inserción de formato
INSERT INTO formats(name) VALUES ("cd");

-- Inserción de genero
INSERT INTO genres(name) VALUES ("Rock");

-- Inserción de album
INSERT INTO albums(title, year, artist_id, format_id, genre_id) VALUES 
("Alta suciedad", 1997, 1, 1, 1),
("Tercer mundo", 1990, 2, 1, 1);

-- Inserción de canciones
INSERT INTO songs(title, duration, album_id) VALUES 
("Alta suciedad", 4.27, 1),
("Todo lo demás", 2.50, 1),
("Donde manda marinero", 4.04, 1),
("Loco", 3.41, 1),
("Flaca", 4.47, 1),
("¿Quién asó la manteca?", 4.25, 1),
("Media Verónica", 3.37, 1),
("El tercio de los sueños", 3.54, 1),
("Comida china", 2.10, 1),
("Elvis está vivo", 3.00, 1),
("Me arde", 3.37, 1),
("Crímenes perfectos", 4.24, 1),
("Nunca es igual", 7.44, 1),
("El novio del olvido", 2.24, 1),
("Catalina, Bahía", 5.12, 1),
("El chico de la tapa", 2.46, 2),
("B. Ode y Evelyn",	3.56, 2),
("Tercer mundo", 4.48, 2),
("Religion song", 4.56, 2),
("Fue amor", 4.17, 2),
("Yo te amé en Nicaragua", 5.02, 2),
("Hazte fama", 3.30, 2),
("Carabelas nada", 4.35, 2),
("Los buenos tiempos", 3.06, 2),
("Y dale alegría a mi corazón", 5.14, 2);

-- Inserción de paises
INSERT INTO countries(name) VALUES ("Argentina"), ("España");

-- Inserción de usuarios
INSERT INTO users(username, email, age, country_id) VALUES 
("martinrojas", "martin_1998@gmail.com", 29, 1),
("analiap", "analia.perez@outlook.com", 22, 1),
("ajuarez", "albertoj@gmail.com", 21, 1);

-- Inserción de playlists
INSERT INTO playlists(name, tags, user_id) VALUES
("Rock Argentino", "Rock,Argentino,Argento,Messi", 1);

-- Inseción de canciones a una playlist
INSERT INTO playlist_song(song_id, playlist_id) VALUES 
(1,1),
(2,1),
(3,1),
(16,1),
(17,1),
(18,1);

-- Inserción de playlists reproducidas
INSERT INTO played_playlists(user_id, playlist_id, date) VALUES 
(1,1, "2023-01-12"),
(2,1, "2023-02-12"),
(3,1, "2023-03-12");

-- Inserción de playlists compartidas
INSERT INTO shared_playlists(user_id, playlist_id, date) VALUES 
(1,1, "2023-01-13"),
(1,1, "2023-02-11");