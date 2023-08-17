USE gamers_model;

DELIMITER $$
CREATE FUNCTION `calcular_litros_de_pintura`(largo INT, alto INT, total_manos INT) RETURNS float
    NO SQL
BEGIN
	DECLARE resultado FLOAT;
    DECLARE litro_x_m2 FLOAT;
    SET litro_x_m2 = 0.10;
	SET resultado = ((largo * alto)  * total_manos) * litro_x_m2;
    RETURN resultado;
END
$$

SELECT calcular_litros_de_pintura2(30, 5, 3) AS total_pintura;


DELIMITER //
CREATE FUNCTION saludar(nombre VARCHAR(50), apellido VARCHAR(50)) 
RETURNS VARCHAR(150)
DETERMINISTIC
  BEGIN
    DECLARE nombre_completo VARCHAR(100);
    SET nombre_completo = CONCAT(nombre, ' ', apellido);
    RETURN CONCAT('Bienvenido ', nombre_completo);
  END//

SELECT id, first_name, last_name, saludar(first_name, last_name) AS 'Saludo' FROM friends;


# Sitios webs (https://www.tutorialesprogramacionya.com/mysqlya/temarios/descripcion.php?inicio=105&cod=112&punto=109)
drop table if exists sitios;
create table sitios (
    url varchar(100),
    cantpaginas int,
    estrellas tinyint,
    primary key(url)
);

insert into sitios(url,cantpaginas,estrellas) values ('lanacion.com.ar',17000000,3);
insert into sitios(url,cantpaginas,estrellas) values ('clarin.com',42000000,3);
insert into sitios(url,cantpaginas,estrellas) values ('infobae.com',33000000,5);
insert into sitios(url,cantpaginas,estrellas) values ('lavoz.com.ar',25000000,2);

-- Implementemos una función que le enviemos la cantidad de estrellas que tiene un sitio y nos devuelva un varchar con tantos '*' como indica el parámetro:
drop function if exists f_estrellas;
delimiter //
create function f_estrellas(
  cant tinyint)
  returns varchar(15)
  deterministic
 begin
   declare estrellas varchar(15) default '';
   declare x int default 0;
   while x<cant do
     set estrellas=concat(estrellas,'*');
     set x=x+1;
   end while;
   return estrellas;
 end //
 delimiter ; 
 
select url,f_estrellas(estrellas) from sitios;

-- Confeccionemos una segunda función que le enviemos la cantidad de páginas que se visualizan por mes y nos retorne un varchar indicando si el sitio tiene 'tráfico bajo', 'tráfico medio' o 'alto tráfico'.
drop function if exists f_tipositio;
delimiter //
create function f_tipositio(
   cantidad int)
   returns varchar(20)
   deterministic
begin
	case 
    when cantidad<20000000 then
      return 'tráfico bajo';
    when cantidad>=20000000 and cantidad<40000000 then
      return 'tráfico medio';
    when cantidad>=40000000 then
      return 'tráfico alto';
	end case; 
 end //
 delimiter ;
 
select url,f_estrellas(estrellas), cantpaginas, f_tipositio(cantpaginas) from sitios; 

-- Ahora confeccionemos una función que retorne la 'url' del sitio que tiene mayor tráfico:
drop function if exists f_mayor_trafico;
delimiter //
 create function f_mayor_trafico()
   returns varchar(100)
   deterministic
 begin
   declare vurl varchar(100);
   select url into vurl from sitios order by cantpaginas desc limit 1;
   return vurl;
 end //
 delimiter ;
 
select f_mayor_trafico();

drop function f_tipositio;
drop function f_estrellas;
drop function f_mayor_trafico;

# Performance Tuning
EXPLAIN SELECT * FROM GAME LIMIT 10;

EXPLAIN 
SELECT * FROM GAME g
LEFT JOIN VOTE v
ON g.id_game = v.id_game

# Actividad en clase
DELIMITER $$
CREATE FUNCTION `get_game`(game INT) 
RETURNS VARCHAR(100)
DETERMINISTIC
READS SQL DATA
BEGIN
    RETURN (SELECT name FROM GAME WHERE id_game = game);
END
$$

SELECT get_game(1);

DROP FUNCTION get_game;
