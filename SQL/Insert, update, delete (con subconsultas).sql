USE gammers_model;

SELECT * FROM CLASS;
SELECT * FROM LEVEL_GAME;

# INSERT
CREATE TABLE NEW_CLASS(
	id_level INT NOT NULL,
    id_class INT NOT NULL,
    description VARCHAR(200) NOT NULL,
    PRIMARY KEY(id_class, id_level)
);

CREATE TABLE NEW_LEVEL_GAME (
	id_level INT NOT NULL,
    description VARCHAR(200) NOT NULL,
    PRIMARY KEY (id_level)
);

INSERT INTO NEW_CLASS (id_level, id_class, description) VALUES
(17, 10, 'Adventure Other'),
(15, 1, 'Spy Other'),
(17, 20, 'British Comedy'),
(17, 30, 'Adventure'),
(14, 1, ''),
(18, 1, '');

SELECT * FROM NEW_CLASS;

SELECT * FROM NEW_LEVEL_GAME;
SELECT * FROM LEVEL_GAME;

SELECT DISTINCT id_level, 'New level'
    FROM NEW_CLASS 
    WHERE id_level NOT IN (
		SELECT id_level FROM level_game
    );

INSERT INTO NEW_LEVEL_GAME (id_level, description) (
	SELECT DISTINCT id_level, 'New level'
    FROM NEW_CLASS 
    WHERE id_level NOT IN (
		SELECT id_level FROM level_game
    )
);

SELECT * FROM LEVEL_GAME;
SELECT * FROM NEW_LEVEL_GAME;

/* ALUMNOS APROBADOS */
DROP TABLE IF EXISTS alumnos;
DROP TABLE IF EXISTS aprobados;
 
 CREATE TABLE alumnos(
  documento CHAR(8) NOT NULL,
  nombre VARCHAR(30),
  nota DECIMAL(4,2),
  PRIMARY KEY(documento)
 );

 CREATE TABLE aprobados(
  documento CHAR(8) NOT NULL,
  nota DECIMAL(4,2),
  PRIMARY KEY(documento)
 );

 INSERT INTO alumnos VALUES('30000000','Ana Acosta',8);
 INSERT INTO alumnos VALUES('30111111','Betina Bustos',9);
 INSERT INTO alumnos VALUES('30222222','Carlos Caseros',2.5); 
 INSERT INTO alumnos VALUES('30333333','Daniel Duarte',7.7);
 INSERT INTO alumnos VALUES('30444444','Estela Esper',3.4);

SELECT * FROM alumnos;

 INSERT INTO aprobados 
  SELECT documento,nota
   FROM alumnos
   WHERE nota>=4;

 SELECT * FROM aprobados;
/* ALUMNOS APROBADOS*/

SELECT * FROM PLAY WHERE completed = FALSE;

CREATE TABLE PLAY_INCOMPLETED
(SELECT * FROM PLAY WHERE completed = FALSE);

SELECT * FROM PLAY_INCOMPLETED;

CREATE TABLE PLAY_INCOMPLETED_W
(SELECT id_game, id_system_user FROM PLAY
WHERE completed = FALSE);

SELECT * FROM PLAY_INCOMPLETED_W;

# UPDATE
SELECT * FROM NEW_CLASS;
SELECT * FROM NEW_LEVEL_GAME;

UPDATE NEW_CLASS SET id_level = 20
WHERE id_level IN (SELECT id_level FROM NEW_LEVEL_GAME);

SELECT * FROM NEW_CLASS;

UPDATE NEW_CLASS SET id_level = 18
WHERE id_level = 20;

# DELETE
SELECT * FROM NEW_CLASS;
SELECT * FROM NEW_LEVEL_GAME;

DELETE FROM NEW_CLASS
WHERE id_level NOT IN (SELECT id_level 
  FROM NEW_LEVEL_GAME);
  
SELECT * FROM NEW_CLASS;

/* LIBROS Y EDITORIALES */
 DROP TABLE IF EXISTS editoriales;
 DROP TABLE IF EXISTS libros;
 
 CREATE TABLE editoriales(
  codigo INT AUTO_INCREMENT,
  nombre VARCHAR(30),
  PRIMARY KEY (codigo)
 );
 
 CREATE TABLE libros (
  codigo INT AUTO_INCREMENT,
  titulo VARCHAR(40),
  autor VARCHAR(30),
  codigoeditorial SMALLINT,
  precio DECIMAL(5,2),
  PRIMARY KEY(codigo)
 );

# Ingresamos algunos registros:
INSERT INTO editoriales(nombre) VALUES('Planeta');
INSERT INTO editoriales(nombre) VALUES('Emece');
INSERT INTO editoriales(nombre) VALUES('Paidos');
INSERT INTO editoriales(nombre) VALUES('Siglo XXI');

INSERT INTO libros(titulo,autor,codigoeditorial,precio) 
VALUES('Uno','Richard Bach',1,15);
INSERT INTO libros(titulo,autor,codigoeditorial,precio)
VALUES('Ilusiones','Richard Bach',2,20);
INSERT INTO libros(titulo,autor,codigoeditorial,precio)
VALUES('El aleph','Borges',3,10);
INSERT INTO libros(titulo,autor,codigoeditorial,precio)
VALUES('Aprenda PHP','Mario Molina',4,40);
INSERT INTO libros(titulo,autor,codigoeditorial,precio)
VALUES('Poemas','Juan Perez',1,20);
INSERT INTO libros(titulo,autor,codigoeditorial,precio)
VALUES('Cuentos','Juan Perez',3,25);
INSERT INTO libros(titulo,autor,codigoeditorial,precio)
VALUES('Java en 10 minutos','Marcelo Perez',2,30);

SELECT * FROM libros;
SELECT * FROM editoriales;

# Actualizamos el precio de todos los libros de la editorial "Emece" incrementándolos en un 10%
UPDATE libros SET precio=Precio+(Precio*0.1)
WHERE codigoeditorial= (SELECT codigo
     FROM editoriales
     WHERE nombre='Emece');

# Eliminamos todos los libros de la editorial "Planeta"
DELETE FROM libros
WHERE codigoeditorial = (SELECT e.Codigo
       FROM editoriales AS e
       WHERE nombre='Planeta');