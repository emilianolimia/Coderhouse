CREATE SCHEMA spotify;
USE spotify;

CREATE TABLE artists(
	id INT, 
    name VARCHAR(45),
    style VARCHAR(45),
    country VARCHAR(45)
);

CREATE TABLE albums(
	id INT, 
    title VARCHAR(45),
    genre VARCHAR(45),
    format VARCHAR(45),
    year INT
);

CREATE TABLE songs(
	id INT, 
    title VARCHAR(45),
    duration float
);

CREATE TABLE playlists(
	id INT, 
    name VARCHAR(45),
    tags VARCHAR(45)
);

CREATE TABLE users(
	id INT, 
    username VARCHAR(45),
    email VARCHAR(45),
	country VARCHAR(45),
    age VARCHAR(45)
);