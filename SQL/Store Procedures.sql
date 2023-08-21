USE gammers_model;

DELIMITER $$
CREATE PROCEDURE `sp_get_games`()
BEGIN
	SELECT * FROM GAME;
END
$$

CALL sp_get_games();

DELIMITER $$
CREATE PROCEDURE `sp_get_games_order`(IN field CHAR(20))
BEGIN
	IF field <> '' THEN
		SET @game_order = concat('ORDER BY ', field);
	ELSE
		SET @game_order = '';
	END IF;
    
    SET @clausula = concat('SELECT * FROM GAME ', @game_order);
	PREPARE runSQL FROM @clausula;
	EXECUTE runSQL;
	DEALLOCATE PREPARE runSQL;
END
$$

CALL sp_get_games_order('name');

DROP PROCEDURE sp_get_games_order;


# Empleados
create table empleados(
  documento char(8),
  nombre varchar(20),
  apellido varchar(20),
  sueldo decimal(6,2),
  cantidadhijos int,
  seccion varchar(20),
  primary key(documento)
);

insert into empleados values('22222222','Juan','Perez',300,2,'Contaduria');
insert into empleados values('22333333','Luis','Lopez',300,0,'Contaduria');
insert into empleados values ('22444444','Marta','Perez',500,1,'Sistemas');
insert into empleados values('22555555','Susana','Garcia',400,2,'Secretaria');
insert into empleados values('22666666','Jose Maria','Morales',400,3,'Secretaria');

-- SP sin parámetros
-- * SP que selecciona los nombres, apellidos y sueldos de los empleados.
drop procedure if exists pa_empleados_sueldo;
 delimiter //
 create procedure pa_empleados_sueldo()
 begin
   select nombre,apellido,sueldo
     from empleados;
 end //
delimiter ;
call pa_empleados_sueldo();

-- * SP que selecciona los nombres, apellidos y cantidad de hijos de los empleados con hijos.
drop procedure if exists pa_empleados_hijos;
delimiter //
create procedure pa_empleados_hijos()
begin
   select nombre,apellido,cantidadhijos
     from empleados
   where cantidadhijos>0;
end //
delimiter ;

call pa_empleados_hijos();
update empleados set cantidadhijos=1 where documento='22333333';
call pa_empleados_hijos();

-- SP con parámetros de entrada
-- * SP que selecciona los nombres, apellidos y sueldos de los empleados que tengan un sueldo superior o igual al enviado como parámetro.
drop procedure if exists pa_empleados_sueldo;
delimiter //
 create procedure pa_empleados_sueldo(
   in p_sueldo decimal(6,2))
 begin
   select nombre,apellido,sueldo
     from empleados
     where sueldo>=p_sueldo;
 end //
 delimiter ;
call pa_empleados_sueldo(400.0);
call pa_empleados_sueldo(500.0); 

-- * SP que actualiza los sueldos iguales al enviado como primer parámetro con el valor enviado como segundo parámetro.
drop procedure pa_empleados_actualizar_sueldo;
delimiter //
 create procedure pa_empleados_actualizar_sueldo
   (in p_sueldoanterior decimal(6,2),
    in p_sueldonuevo decimal(6,2))
 begin
   update empleados set sueldo=p_sueldonuevo
     where sueldo=p_sueldoanterior;
 end //
 delimiter ;

select * from empleados;
call pa_empleados_actualizar_sueldo(300, 350);
select * from empleados;
 
-- SP con parámetros de entrada y salida
-- * SP al cual le enviamos el nombre de una sección y nos retorna el promedio de sueldos de todos los empleados de esa sección y el valor mayor de sueldo
drop procedure if exists pa_seccion; 
delimiter //
 create procedure pa_seccion(
   in p_seccion varchar(20),
   out promedio float,
   out mayor float)
 begin
   select avg(sueldo) into promedio
     from empleados
     where seccion=p_seccion;
   select max(sueldo) into mayor
   from empleados
    where seccion=p_seccion; 
  end //  
 delimiter ;    

call pa_seccion('Contaduria', @p, @m);
select @p,@m;
 
call pa_seccion('Secretaria', @p, @m);
select @p,@m; 

# Actividad en clase
SELECT * FROM PRODUCTOS;

DELIMITER $$
CREATE PROCEDURE `sp_insert_product`(IN field CHAR(20), OUT output VARCHAR(50))
BEGIN
	IF field <> '' THEN
		INSERT INTO PRODUCTOS (nombre) VALUES (UCASE(field));
        SET output = 'Inserción exitosa';
	ELSE
		SET output = 'ERROR: no se pudo crear el producto indicado';
	END IF;
    
    SET @clausula = 'SELECT * FROM PRODUCTOS ORDER BY id DESC ';
	PREPARE runSQL FROM @clausula;
	EXECUTE runSQL;
	DEALLOCATE PREPARE runSQL;
END
$$

CALL sp_insert_product('Garmin forerunner', @result);
SELECT @result as result_insert_product

CALL sp_insert_product('', @result);
Select @result as result_insert_product
