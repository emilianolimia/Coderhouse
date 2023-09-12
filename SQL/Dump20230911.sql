-- MySQL dump 10.13  Distrib 8.0.33, for macos13 (arm64)
--
-- Host: localhost    Database: atacama
-- ------------------------------------------------------
-- Server version	8.0.33

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `audit_tours_booked`
--

DROP TABLE IF EXISTS `audit_tours_booked`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_tours_booked` (
  `id_log` int NOT NULL AUTO_INCREMENT,
  `tour_name` varchar(50) DEFAULT NULL,
  `customer_id` int DEFAULT NULL,
  `insert_date` date DEFAULT NULL,
  `insert_time` time DEFAULT NULL,
  `created_by` varchar(100) DEFAULT NULL,
  `last_update_date` date DEFAULT NULL,
  `last_update_time` time DEFAULT NULL,
  `last_updated_by` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_log`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_tours_booked`
--

LOCK TABLES `audit_tours_booked` WRITE;
/*!40000 ALTER TABLE `audit_tours_booked` DISABLE KEYS */;
/*!40000 ALTER TABLE `audit_tours_booked` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `audit_transfers_booked`
--

DROP TABLE IF EXISTS `audit_transfers_booked`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_transfers_booked` (
  `id_log` int NOT NULL AUTO_INCREMENT,
  `customer_transfer_id` int DEFAULT NULL,
  `insert_date` date DEFAULT NULL,
  `insert_time` time DEFAULT NULL,
  `created_by` varchar(100) DEFAULT NULL,
  `last_update_date` date DEFAULT NULL,
  `last_update_time` time DEFAULT NULL,
  `last_updated_by` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_log`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_transfers_booked`
--

LOCK TABLES `audit_transfers_booked` WRITE;
/*!40000 ALTER TABLE `audit_transfers_booked` DISABLE KEYS */;
/*!40000 ALTER TABLE `audit_transfers_booked` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cities`
--

DROP TABLE IF EXISTS `cities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cities` (
  `city_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `country` varchar(50) NOT NULL,
  PRIMARY KEY (`city_id`),
  UNIQUE KEY `city_id` (`city_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cities`
--

LOCK TABLES `cities` WRITE;
/*!40000 ALTER TABLE `cities` DISABLE KEYS */;
INSERT INTO `cities` VALUES (1,'Atacama','Chile'),(2,'Uyuni','Bolivia'),(3,'Piedras Rojas','Chile'),(4,'Puritama','Chile'),(5,'Rio de Janeiro','Brasil');
/*!40000 ALTER TABLE `cities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_books_package`
--

DROP TABLE IF EXISTS `customer_books_package`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_books_package` (
  `customer_package_id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int NOT NULL,
  `package_id` int NOT NULL,
  `book_date` date NOT NULL,
  `start_date` date NOT NULL,
  `people_amount` int NOT NULL,
  PRIMARY KEY (`customer_package_id`),
  UNIQUE KEY `customer_package_id` (`customer_package_id`),
  KEY `customer_id` (`customer_id`),
  KEY `package_id` (`package_id`),
  CONSTRAINT `customer_books_package_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`),
  CONSTRAINT `customer_books_package_ibfk_2` FOREIGN KEY (`package_id`) REFERENCES `packages` (`package_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_books_package`
--

LOCK TABLES `customer_books_package` WRITE;
/*!40000 ALTER TABLE `customer_books_package` DISABLE KEYS */;
INSERT INTO `customer_books_package` VALUES (1,1,1,'2023-07-21','2023-09-09',2),(2,2,2,'2023-07-25','2023-09-19',2),(3,3,3,'2023-07-28','2023-09-28',4),(4,4,4,'2023-07-31','2023-09-09',2),(5,5,5,'2023-08-01','2023-09-11',2);
/*!40000 ALTER TABLE `customer_books_package` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_books_room`
--

DROP TABLE IF EXISTS `customer_books_room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_books_room` (
  `customer_room_id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int NOT NULL,
  `room_id` int NOT NULL,
  `book_date` date NOT NULL,
  `arrival_date` date NOT NULL,
  `nights` int NOT NULL,
  PRIMARY KEY (`customer_room_id`),
  UNIQUE KEY `customer_room_id` (`customer_room_id`),
  KEY `customer_id` (`customer_id`),
  KEY `room_id` (`room_id`),
  CONSTRAINT `customer_books_room_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`),
  CONSTRAINT `customer_books_room_ibfk_2` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_books_room`
--

LOCK TABLES `customer_books_room` WRITE;
/*!40000 ALTER TABLE `customer_books_room` DISABLE KEYS */;
INSERT INTO `customer_books_room` VALUES (1,1,1,'2023-07-21','2023-09-08',7),(2,2,4,'2023-07-25','2023-09-18',7),(3,3,7,'2023-07-28','2023-09-27',7),(4,3,9,'2023-07-28','2023-09-27',7),(5,4,3,'2023-07-31','2023-09-08',6),(6,5,6,'2023-08-01','2023-09-10',5),(7,5,6,'2023-08-01','2023-09-18',1);
/*!40000 ALTER TABLE `customer_books_room` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_books_tour`
--

DROP TABLE IF EXISTS `customer_books_tour`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_books_tour` (
  `customer_tour_id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int NOT NULL,
  `tour_name` varchar(50) NOT NULL,
  `book_date` date NOT NULL,
  `start_date` date NOT NULL,
  `people_amount` int NOT NULL,
  PRIMARY KEY (`customer_tour_id`),
  UNIQUE KEY `customer_tour_id` (`customer_tour_id`),
  KEY `customer_id` (`customer_id`),
  KEY `tour_name` (`tour_name`),
  CONSTRAINT `customer_books_tour_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`),
  CONSTRAINT `customer_books_tour_ibfk_2` FOREIGN KEY (`tour_name`) REFERENCES `tours` (`tour_name`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_books_tour`
--

LOCK TABLES `customer_books_tour` WRITE;
/*!40000 ALTER TABLE `customer_books_tour` DISABLE KEYS */;
INSERT INTO `customer_books_tour` VALUES (1,6,'Valle de la Luna','2023-08-01','2023-09-15',1),(2,6,'Tour Astronómico','2023-08-01','2023-09-15',1),(3,7,'Valle del Arcoiris','2023-08-05','2023-09-20',2),(4,7,'Laguna Cejar','2023-08-05','2023-09-20',2),(5,8,'Piedras Rojas','2023-08-09','2023-09-09',3),(6,8,'Geyser del Tatio','2023-08-09','2023-09-10',1),(7,9,'Ruta de los Salares','2023-08-02','2023-09-20',2),(8,9,'Termas de Puritama','2023-08-02','2023-09-21',2),(9,10,'Valle de la Luna','2023-08-08','2023-09-15',2),(10,10,'Laguna Cejar','2023-08-08','2023-09-15',2);
/*!40000 ALTER TABLE `customer_books_tour` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_books_transfer`
--

DROP TABLE IF EXISTS `customer_books_transfer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_books_transfer` (
  `customer_transfer_id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int NOT NULL,
  `transfer_id` int NOT NULL,
  `book_date` date NOT NULL,
  `start_date` date NOT NULL,
  `people_amount` int NOT NULL,
  PRIMARY KEY (`customer_transfer_id`),
  UNIQUE KEY `customer_transfer_id` (`customer_transfer_id`),
  KEY `customer_id` (`customer_id`),
  KEY `transfer_id` (`transfer_id`),
  CONSTRAINT `customer_books_transfer_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`),
  CONSTRAINT `customer_books_transfer_ibfk_2` FOREIGN KEY (`transfer_id`) REFERENCES `transfers` (`transfer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_books_transfer`
--

LOCK TABLES `customer_books_transfer` WRITE;
/*!40000 ALTER TABLE `customer_books_transfer` DISABLE KEYS */;
INSERT INTO `customer_books_transfer` VALUES (1,1,2,'2023-07-21','2023-09-08',2),(2,1,1,'2023-07-21','2023-09-15',2),(3,2,2,'2023-07-25','2023-09-18',2),(4,2,1,'2023-07-25','2023-09-25',2),(5,3,4,'2023-07-28','2023-09-27',4),(6,3,3,'2023-07-28','2023-10-04',4),(7,4,4,'2023-07-31','2023-09-08',2),(8,4,3,'2023-07-31','2023-09-14',2),(9,5,2,'2023-08-01','2023-09-10',2),(10,5,1,'2023-08-01','2023-09-19',2),(11,5,5,'2023-08-01','2023-09-15',2),(12,5,6,'2023-08-01','2023-09-18',2);
/*!40000 ALTER TABLE `customer_books_transfer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `customer_id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(50) DEFAULT NULL,
  `document_type` enum('ID','Passport','Driver License') NOT NULL,
  `document_number` varchar(20) NOT NULL,
  `nationality` varchar(50) DEFAULT NULL,
  `gender` enum('Male','Female','Other') DEFAULT NULL,
  `age` int DEFAULT NULL,
  PRIMARY KEY (`customer_id`),
  UNIQUE KEY `customer_id` (`customer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (1,'Juan Pérez','ID','A1234567','Chile','Male',35),(2,'María García','Passport','B7890123','Argentina','Female',36),(3,'Carlos Rodríguez','Passport','C2345678','Argentina','Male',22),(4,'Laura Martínez','Passport','D4567890','Brasil','Female',27),(5,'Andrés López','Passport','E5678901','EEUU',NULL,54),(6,'Ana Sánchez','ID','F1234567','Alemania','Female',43),(7,'Javier Fernández','ID','G2345678','Brasil','Male',38),(8,'Sofia González','Driver License','H3456789','Brasil','Female',25),(9,'Alejandro Ramírez','Passport','I4567890',NULL,'Male',20),(10,'Valentina Torres','Passport','J5678901','Chile','Other',NULL);
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lodging`
--

DROP TABLE IF EXISTS `lodging`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lodging` (
  `lodging_id` int NOT NULL AUTO_INCREMENT,
  `city_id` int NOT NULL,
  `stars` enum('1','2','3','4','5','6') DEFAULT NULL,
  `name` varchar(50) NOT NULL,
  `check_in_time` decimal(5,2) DEFAULT NULL,
  `check_out_time` decimal(5,2) DEFAULT NULL,
  `food` enum('None','Breakfast included','Breakfast & dinner','All inclusive') DEFAULT NULL,
  `wifi` tinyint(1) DEFAULT NULL,
  `swimming_pool` tinyint(1) DEFAULT NULL,
  `pets` tinyint(1) DEFAULT NULL,
  `description` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`lodging_id`),
  UNIQUE KEY `lodging_id` (`lodging_id`),
  KEY `city_id` (`city_id`),
  CONSTRAINT `lodging_ibfk_1` FOREIGN KEY (`city_id`) REFERENCES `cities` (`city_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lodging`
--

LOCK TABLES `lodging` WRITE;
/*!40000 ALTER TABLE `lodging` DISABLE KEYS */;
INSERT INTO `lodging` VALUES (1,1,'4','Tierra Atacama Hotel & Spa',13.00,10.00,'Breakfast included',1,1,0,'Ubicado en medio del impresionante paisaje desértico, el Tierra Atacama ofrece una experiencia de lujo con toques locales.'),(2,1,'5','Alto Atacama Desert Lodge & Spa',14.00,11.00,'Breakfast & dinner',1,1,0,'Ofrece una experiencia enriquecedora con excursiones guiadas y una conexión profunda con la cultura local.'),(3,1,'4','Hotel Cumbres San Pedro de Atacama',14.00,10.00,'Breakfast included',1,1,1,'Su diseño refleja la esencia del desierto y ofrece una mezcla de lujo y autenticidad.'),(4,1,'3','Explora Atacama',13.00,10.00,'Breakfast included',1,0,1,'Diseñado para los amantes de la aventura y la exploración.'),(5,2,'3','Hotel de Sal Luna Salada',13.00,10.00,'Breakfast included',1,0,1,' Este hotel único está construido principalmente con bloques de sal, lo que le da un encanto rústico y auténtico.'),(6,2,'3','Cristal Samaña',13.00,10.00,'Breakfast included',1,0,0,'Este hotel boutique es conocido por su diseño elegante y atención personalizada.'),(7,5,'5','Hotel Copacabana Palace',13.00,11.00,'All inclusive',1,1,0,'Este icónico hotel de lujo se encuentra en la famosa playa de Copacabana y ofrece una experiencia de hospedaje excepcional.');
/*!40000 ALTER TABLE `lodging` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `lodgings_atacama`
--

DROP TABLE IF EXISTS `lodgings_atacama`;
/*!50001 DROP VIEW IF EXISTS `lodgings_atacama`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `lodgings_atacama` AS SELECT 
 1 AS `name`,
 1 AS `stars`,
 1 AS `description`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `lodgings_atacama_premium`
--

DROP TABLE IF EXISTS `lodgings_atacama_premium`;
/*!50001 DROP VIEW IF EXISTS `lodgings_atacama_premium`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `lodgings_atacama_premium` AS SELECT 
 1 AS `name`,
 1 AS `price_night`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `packages`
--

DROP TABLE IF EXISTS `packages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `packages` (
  `package_id` int NOT NULL AUTO_INCREMENT,
  `duration` int NOT NULL,
  `description` varchar(300) NOT NULL,
  `price` decimal(9,2) NOT NULL,
  `package_name` varchar(50) NOT NULL,
  PRIMARY KEY (`package_id`),
  UNIQUE KEY `package_id` (`package_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `packages`
--

LOCK TABLES `packages` WRITE;
/*!40000 ALTER TABLE `packages` DISABLE KEYS */;
INSERT INTO `packages` VALUES (1,3,'Son 3 días y 2 noches que incluyen transporte, hospedajes, desayunos, almuerzos y cenas.',173000.00,'Salar de Uyuni - 3 días y 2 noches'),(2,4,'Son 4 días y 3 noches que incluyen traslados ida y vuelta a San Pedro de Atacama, hospedajes, desayunos, almuerzos y cenas.',213000.00,'Salar de Uyuni - 4 días y 3 noches'),(3,4,'Día 1: Valle de la Luna y Tour Astronómico - Día 2: Valle del Arcoiris y Laguna Cejar - Día 3: Piedras Rojas - Día 4: Geyser del Tatio',196230.00,'Superpostales Atacama - 4 días'),(4,5,'Día 1: Valle de la Luna y Tour Astronómico - Día 2: Valle del Arcoiris y Laguna Cejar - Día 3: Piedras Rojas - Día 4: Ruta de los Salares - Día 5: Geyser del Tatio',239400.00,'Superpostales Atacama - 5 días'),(5,6,'Día 1: Valle de la Luna - Día 2: Valle del Arcoiris y Laguna Cejar - Día 3: Trekking Termas y Cascadas y Tour Astronómico - Día 4: Piedras Rojas - Día 5: Ruta de los Salares - Día 6: Geyser del Tatio',263120.00,'Superpostales Atacama - 6 días'),(6,7,'Combina los paquetes Superpostales Atacama - 4 días + Salar de Uyuni - 3 días y 2 noches (incluye Termas de Puritama y no incluye el Valle del Arcoiris)',387000.00,'Atacama + Uyuni / Sin retorno'),(7,8,'Combina los paquetes Superpostales Atacama - 4 días + Salar de Uyuni - 3 días y 2 noches (incluye Termas de Puritama y no incluye el Valle del Arcoiris)',405000.00,'Atacama + Uyuni / Con retorno');
/*!40000 ALTER TABLE `packages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rooms` (
  `room_id` int NOT NULL AUTO_INCREMENT,
  `lodging_id` int NOT NULL,
  `type` enum('Shared','Double','Triple','Suite','Premium') DEFAULT NULL,
  `price_night` decimal(9,2) NOT NULL,
  PRIMARY KEY (`room_id`),
  UNIQUE KEY `room_id` (`room_id`),
  KEY `lodging_id` (`lodging_id`),
  CONSTRAINT `rooms_ibfk_1` FOREIGN KEY (`lodging_id`) REFERENCES `lodging` (`lodging_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (1,1,'Double',100.00),(2,1,'Triple',130.00),(3,1,'Premium',150.00),(4,2,'Double',120.00),(5,2,'Suite',150.00),(6,2,'Premium',200.00),(7,3,'Double',90.00),(8,3,'Triple',120.00),(9,3,'Suite',130.00),(10,4,'Shared',50.00),(11,4,'Double',90.00),(12,4,'Triple',110.00),(13,5,'Shared',40.00),(14,5,'Double',80.00),(15,5,'Triple',100.00),(16,6,'Shared',40.00),(17,6,'Double',90.00),(18,6,'Triple',120.00),(19,7,'Suite',150.00),(20,7,'Premium',180.00);
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tours`
--

DROP TABLE IF EXISTS `tours`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tours` (
  `tour_name` varchar(50) NOT NULL,
  `city_id` int NOT NULL,
  `duration` decimal(5,2) NOT NULL,
  `price` decimal(9,2) NOT NULL,
  `description` varchar(300) NOT NULL,
  PRIMARY KEY (`tour_name`),
  UNIQUE KEY `tour_name` (`tour_name`),
  KEY `city_id` (`city_id`),
  CONSTRAINT `tours_ibfk_1` FOREIGN KEY (`city_id`) REFERENCES `cities` (`city_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tours`
--

LOCK TABLES `tours` WRITE;
/*!40000 ALTER TABLE `tours` DISABLE KEYS */;
INSERT INTO `tours` VALUES ('Geyser del Tatio',1,7.50,35000.00,'Inicia a las 5am. Incluye pickup en hospedaje, traslado y desayuno.'),('Laguna Cejar',1,5.00,29000.00,'Nos encontramos a las 14hs en la agencia. Incluye traslado, guiado y cóctel.'),('Lagunas Escondidas de Baltinache',1,5.00,35000.00,'Nos encontramos a las 14hs en la agencia. Incluye traslado, guiado y cóctel.'),('Piedras Rojas',3,10.00,57000.00,'Inicia 6.40hs. Incluye pickup en hospedaje, traslado, guiado, desayuno y almuerzo.'),('Ruta de los Salares',1,8.50,45000.00,'Inicia 7.30hs. Incluye pickup en hospedaje, traslado, guiado, desayuno y almuerzo.'),('Termas de Puritama',4,5.00,59000.00,'Inicia 8.30hs (incluye pickup en hospedaje) y 13.20 (encuentro en la agencia). Incluye ticket de ingreso, traslado, guiado y desayuno o cóctel.'),('Tour Astronómico',1,2.00,25000.00,'Nos encontramos a las 21.30hs en la agencia. Cosmovisión Andina y Atacameña. Astrofotografía. Incluye traslado, guiado, cóctel y 2 fotos de alta calidad digital'),('Trekking Termas y Cascadas',4,5.00,28000.00,'Inicia 8.00hs (incluye pickup en hospedaje) y 15.00 (encuentro en la agencia). Incluye traslado, guiado y desayuno o cóctel.'),('Valle de la Luna',1,4.00,35000.00,'Nos encontramos a las 15hs en la agencia. Se recorren las Tres Marías, las Minas de Sal y la Coordillera de sal. Incluye traslado, guiado y cóctel.'),('Valle del Arcoiris',1,5.00,30000.00,'Inicia a las 7.30hs. Tour arqueológico y Petroglifos. Incluye pickup en hospedaje, traslado, guiado y desayuno.'),('Vallecito y Bus Abandonado',1,4.00,28000.00,'Nos encontramos a las 15.15hs en la agencia. Incluye traslado, guiado y cóctel.');
/*!40000 ALTER TABLE `tours` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `tours_atacama`
--

DROP TABLE IF EXISTS `tours_atacama`;
/*!50001 DROP VIEW IF EXISTS `tours_atacama`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `tours_atacama` AS SELECT 
 1 AS `tour_name`,
 1 AS `description`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `tours_booked_september`
--

DROP TABLE IF EXISTS `tours_booked_september`;
/*!50001 DROP VIEW IF EXISTS `tours_booked_september`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `tours_booked_september` AS SELECT 
 1 AS `full_name`,
 1 AS `tour_name`,
 1 AS `start_date`,
 1 AS `people_amount`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `transfers`
--

DROP TABLE IF EXISTS `transfers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transfers` (
  `transfer_id` int NOT NULL AUTO_INCREMENT,
  `company` varchar(50) DEFAULT NULL,
  `destination` varchar(50) NOT NULL,
  `departure` varchar(50) NOT NULL,
  `duration` decimal(5,2) NOT NULL,
  `price` decimal(9,2) NOT NULL,
  `type` enum('Private','Shared') NOT NULL,
  PRIMARY KEY (`transfer_id`),
  UNIQUE KEY `transfer_id` (`transfer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transfers`
--

LOCK TABLES `transfers` WRITE;
/*!40000 ALTER TABLE `transfers` DISABLE KEYS */;
INSERT INTO `transfers` VALUES (1,'Tapi','San Pedro de Atacama','Aeropuerto Atacama',1.00,10000.00,'Shared'),(2,'Tapi','Aeropuerto Atacama','San Pedro de Atacama',1.00,10000.00,'Shared'),(3,'Combi','San Pedro de Atacama','Aeropuerto Atacama',1.00,12000.00,'Shared'),(4,'Combi','Aeropuerto Atacama','San Pedro de Atacama',1.00,12000.00,'Shared'),(5,'Tapi','San Pedro de Atacama','Uyuni',1.00,30000.00,'Private'),(6,'Tapi','Uyuni','San Pedro de Atacama',1.00,30000.00,'Private');
/*!40000 ALTER TABLE `transfers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `transfers_airport`
--

DROP TABLE IF EXISTS `transfers_airport`;
/*!50001 DROP VIEW IF EXISTS `transfers_airport`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `transfers_airport` AS SELECT 
 1 AS `company`,
 1 AS `departure`,
 1 AS `destination`,
 1 AS `type`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `lodgings_atacama`
--

/*!50001 DROP VIEW IF EXISTS `lodgings_atacama`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `lodgings_atacama` AS select `lodging`.`name` AS `name`,`lodging`.`stars` AS `stars`,`lodging`.`description` AS `description` from `lodging` where (`lodging`.`city_id` = 1) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `lodgings_atacama_premium`
--

/*!50001 DROP VIEW IF EXISTS `lodgings_atacama_premium`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `lodgings_atacama_premium` AS select `l`.`name` AS `name`,`r`.`price_night` AS `price_night` from (`rooms` `r` join `lodging` `l` on((`r`.`lodging_id` = `l`.`lodging_id`))) where ((`l`.`city_id` = 1) and (`r`.`type` = 'Premium')) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `tours_atacama`
--

/*!50001 DROP VIEW IF EXISTS `tours_atacama`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `tours_atacama` AS select `tours`.`tour_name` AS `tour_name`,`tours`.`description` AS `description` from `tours` where (`tours`.`city_id` = 1) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `tours_booked_september`
--

/*!50001 DROP VIEW IF EXISTS `tours_booked_september`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `tours_booked_september` AS select `c`.`full_name` AS `full_name`,`cbt`.`tour_name` AS `tour_name`,`cbt`.`start_date` AS `start_date`,`cbt`.`people_amount` AS `people_amount` from (`customer_books_tour` `cbt` join `customers` `c` on((`cbt`.`customer_id` = `c`.`customer_id`))) where (month(`cbt`.`start_date`) = 9) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `transfers_airport`
--

/*!50001 DROP VIEW IF EXISTS `transfers_airport`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `transfers_airport` AS select `transfers`.`company` AS `company`,`transfers`.`departure` AS `departure`,`transfers`.`destination` AS `destination`,`transfers`.`type` AS `type` from `transfers` where (`transfers`.`departure` = 'Aeropuerto Atacama') */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-09-11 21:55:19
