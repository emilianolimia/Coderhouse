USE spotify;

## Consultas simples
-- Canciones del álbum “Alta suciedad”
SELECT * FROM songs WHERE album_id = 1;

-- Canciones que duren más de 3 minutos
SELECT * FROM songs WHERE duration > 3;

-- Reproducciones ordenadas por fecha de la playlist “Rock Argentino”
SELECT * FROM played_playlists WHERE playlist_id = 1 ORDER BY date;

-- Última reproducción que tuvo la playlist “Rock Argentino”
SELECT MAX(date) FROM played_playlists WHERE playlist_id = 1;

# Consultas complejas
-- Canciones del álbum +“Tercer mundo”
SELECT * FROM songs WHERE 
album_id = (SELECT id FROM albums WHERE title = 'Tercer mundo');

-- Usuarios que reprodujeron la playlist “Rock Argentino”
SELECT username FROM played_playlists p
JOIN users u
ON p.user_id = u.id
WHERE p.playlist_id = 1;

SELECT username FROM played_playlists p
JOIN users u
ON p.user_id = u.id
WHERE p.playlist_id = (SELECT id FROM playlists 
WHERE name='Rock Argentino');

-- Nombre de playlists y cantidad de reproducciones de las playlists
SELECT p.name, count(*) FROM played_playlists pp
JOIN playlists p
ON pp.playlist_id = p.id
GROUP BY p.name;
