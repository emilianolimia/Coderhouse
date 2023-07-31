CREATE SCHEMA spotify;
USE spotify;

CREATE TABLE styles(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    name VARCHAR(100) NOT NULL
);

CREATE TABLE artists(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    style_id INT NOT NULL, 
    FOREIGN KEY (style_id) REFERENCES styles(id)
);

CREATE TABLE formats(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    name VARCHAR(100) NOT NULL
);

CREATE TABLE genres(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    name VARCHAR(100) NOT NULL
);

CREATE TABLE albums(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    title VARCHAR(155) NOT NULL,
    year INT NOT NULL,
    artist_id INT NOT NULL, 
    format_id INT NOT NULL,
    genre_id INT NOT NULL, 
    FOREIGN KEY (artist_id) REFERENCES artists(id),
    FOREIGN KEY (format_id) REFERENCES formats(id),
    FOREIGN KEY (genre_id) REFERENCES genres(id)
);

CREATE TABLE songs(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    title VARCHAR(255) NOT NULL,
    duration float,
    album_id INT NOT NULL,
	FOREIGN KEY (album_id) REFERENCES albums(id)
);

CREATE TABLE countries(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    name VARCHAR(100) NOT NULL
);

CREATE TABLE users(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    username VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL,
    age INT,
    country_id INT NOT NULL,
	FOREIGN KEY (country_id) REFERENCES countries(id)
);

CREATE TABLE playlists(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    name VARCHAR(100) NOT NULL,
    tags VARCHAR(100),
    user_id INT NOT NULL,
	FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE playlist_song(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
	song_id INT NOT NULL,
    playlist_id INT NOT NULL,
	FOREIGN KEY (song_id) REFERENCES songs(id),
	FOREIGN KEY (playlist_id) REFERENCES playlists(id)
);

CREATE TABLE played_playlists(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
	user_id INT NOT NULL,
    playlist_id INT NOT NULL,
	date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (user_id) REFERENCES users(id),
	FOREIGN KEY (playlist_id) REFERENCES playlists(id)
);

CREATE TABLE shared_playlists(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
	user_id INT NOT NULL,
    playlist_id INT NOT NULL,
	date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (user_id) REFERENCES users(id),
	FOREIGN KEY (playlist_id) REFERENCES playlists(id)
);
