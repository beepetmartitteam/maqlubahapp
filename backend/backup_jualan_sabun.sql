-- MySQL dump 10.13  Distrib 9.4.0, for macos13.7 (x86_64)
--
-- Host: localhost    Database: maqlubah_db
-- ------------------------------------------------------
-- Server version	9.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ahlis`
--

DROP TABLE IF EXISTS `ahlis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ahlis` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `folderId` varchar(50) NOT NULL,
  `folderLabel` varchar(100) NOT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ahlis_folder_id` (`folderId`),
  KEY `ahlis_name` (`name`),
  KEY `ahlis_is_active` (`isActive`),
  CONSTRAINT `ahlis_ibfk_1` FOREIGN KEY (`folderId`) REFERENCES `folders` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ahlis`
--

LOCK TABLES `ahlis` WRITE;
/*!40000 ALTER TABLE `ahlis` DISABLE KEYS */;
INSERT INTO `ahlis` VALUES (1,'TC','S13','📁 S13',1,'2026-05-08 07:56:42','2026-05-08 07:56:42'),(2,'TFY','S13','📁 S13',1,'2026-05-08 07:56:42','2026-05-08 07:56:42'),(3,'TAA','S13','📁 S13',1,'2026-05-08 07:56:42','2026-05-08 07:56:42'),(4,'THAH','S13','📁 S13',1,'2026-05-08 07:56:42','2026-05-08 07:56:42'),(5,'MSMN','S13','📁 S13',1,'2026-05-08 07:56:42','2026-05-08 07:56:42'),(6,'AL','S13','📁 S13',1,'2026-05-08 07:56:42','2026-05-08 07:56:42'),(7,'E ZAHID','S13','📁 S13',1,'2026-05-08 07:56:42','2026-05-08 07:56:42'),(8,'E SAYUTI','S13','📁 S13',1,'2026-05-08 07:56:42','2026-05-08 07:56:42'),(9,'E ABU','S13','📁 S13',1,'2026-05-08 07:56:42','2026-05-08 07:56:42'),(10,'E FAJRUL','S13','📁 S13',1,'2026-05-08 07:56:42','2026-05-08 07:56:42'),(11,'P AZURA','S13','📁 S13',1,'2026-05-08 07:56:42','2026-05-08 07:56:42'),(12,'T ABIL','MKN','📁 MKN ++',1,'2026-05-08 07:56:42','2026-05-08 07:56:42'),(13,'T FATEH','MKN','📁 MKN ++',1,'2026-05-08 07:56:42','2026-05-08 07:56:42'),(14,'TN SYARIF','MKN','📁 MKN ++',1,'2026-05-08 07:56:42','2026-05-08 07:56:42'),(15,'TN WAJI','MKN','📁 MKN ++',1,'2026-05-08 07:56:42','2026-05-08 07:56:42'),(16,'E KHUSAIRI','MKN','📁 MKN ++',1,'2026-05-08 07:56:42','2026-05-08 07:56:42'),(17,'T NHAZANI','MKN','📁 MKN ++',1,'2026-05-08 07:56:42','2026-05-08 07:56:42'),(18,'TN ANUAR','MKN','📁 MKN ++',1,'2026-05-08 07:56:42','2026-05-08 07:56:42'),(19,'TN HAMDI','MKN','📁 MKN ++',1,'2026-05-08 07:56:42','2026-05-08 07:56:42'),(20,'TN FIDA','MKN','📁 MKN ++',1,'2026-05-08 07:56:42','2026-05-08 07:56:42'),(21,'PN KAKAK','MUSLIMAH','📁 MUSLIMAH',1,'2026-05-08 07:56:42','2026-05-08 07:56:42'),(22,'P KHAULAH','MUSLIMAH','📁 MUSLIMAH',1,'2026-05-08 07:56:42','2026-05-08 07:56:42'),(23,'PN QAYAH','MUSLIMAH','📁 MUSLIMAH',1,'2026-05-08 07:56:42','2026-05-08 07:56:42'),(24,'C YAH','MUSLIMAH','📁 MUSLIMAH',1,'2026-05-08 07:56:42','2026-05-08 07:56:42'),(25,'T ABBAD','L_LELAKI','📁 LAIN² LELAKI',1,'2026-05-08 07:56:42','2026-05-08 07:56:42'),(26,'PAK NANANG','L_LELAKI','📁 LAIN² LELAKI',1,'2026-05-08 07:56:42','2026-05-08 07:56:42'),(27,'EN NIK H','L_LELAKI','📁 LAIN² LELAKI',1,'2026-05-08 07:56:42','2026-05-08 07:56:42'),(28,'EN ABE THAI','L_LELAKI','📁 LAIN² LELAKI',1,'2026-05-08 07:56:42','2026-05-08 07:56:42'),(29,'TN MAAROF','L_LELAKI','📁 LAIN² LELAKI',1,'2026-05-08 07:56:42','2026-05-08 07:56:42'),(30,'EN P WAHAB','L_LELAKI','📁 LAIN² LELAKI',1,'2026-05-08 07:56:42','2026-05-08 07:56:42'),(31,'EN IKRIMAH','L_LELAKI','📁 LAIN² LELAKI',1,'2026-05-08 07:56:42','2026-05-08 07:56:42'),(32,'AM KAMIL','L_LELAKI','📁 LAIN² LELAKI',1,'2026-05-08 07:56:42','2026-05-08 07:56:42'),(33,'T AMIN','L_LELAKI','📁 LAIN² LELAKI',1,'2026-05-08 07:56:42','2026-05-08 07:56:42'),(34,'HJ KUDUS','L_LELAKI','📁 LAIN² LELAKI',1,'2026-05-08 07:56:42','2026-05-08 07:56:42'),(35,'EN YUSNIZA','L_LELAKI','📁 LAIN² LELAKI',1,'2026-05-08 07:56:42','2026-05-08 07:56:42'),(36,'EN ALI HASAN','L_LELAKI','📁 LAIN² LELAKI',1,'2026-05-08 07:56:42','2026-05-08 07:56:42'),(37,'EN AROBI','L_LELAKI','📁 LAIN² LELAKI',1,'2026-05-08 07:56:42','2026-05-08 07:56:42'),(38,'EN KHALID','L_LELAKI','📁 LAIN² LELAKI',1,'2026-05-08 07:56:42','2026-05-08 07:56:42'),(39,'EN JAFAR','L_LELAKI','📁 LAIN² LELAKI',1,'2026-05-08 07:56:42','2026-05-08 07:56:42'),(40,'TN RIDWAN','L_LELAKI','📁 LAIN² LELAKI',1,'2026-05-08 07:56:42','2026-05-08 07:56:42'),(41,'C AZIE','L_MUSLIMAH','📁 LAIN2 MUSLIMAH',1,'2026-05-08 07:56:42','2026-05-08 07:56:42'),(42,'C K NGAH','L_MUSLIMAH','📁 LAIN2 MUSLIMAH',1,'2026-05-08 07:56:42','2026-05-08 07:56:42'),(43,'C SAKINAH','L_MUSLIMAH','📁 LAIN2 MUSLIMAH',1,'2026-05-08 07:56:42','2026-05-08 07:56:42'),(44,'C ASILAH','L_MUSLIMAH','📁 LAIN2 MUSLIMAH',1,'2026-05-08 07:56:42','2026-05-08 07:56:42'),(45,'C Ita','L_MUSLIMAH','📁 LAIN2 MUSLIMAH',1,'2026-05-08 07:56:42','2026-05-08 07:56:42'),(46,'C YATI','L_MUSLIMAH','📁 LAIN2 MUSLIMAH',1,'2026-05-08 07:56:42','2026-05-08 07:56:42'),(47,'C (OM)','L_MUSLIMAH','📁 LAIN2 MUSLIMAH',1,'2026-05-08 07:56:42','2026-05-08 07:56:42'),(48,'C HAFIZAH','L_MUSLIMAH','📁 LAIN2 MUSLIMAH',1,'2026-05-08 07:56:42','2026-05-08 07:56:42'),(49,'C SAL','L_MUSLIMAH','📁 LAIN2 MUSLIMAH',1,'2026-05-08 07:56:42','2026-05-08 07:56:42'),(50,'C FAH','L_MUSLIMAH','📁 LAIN2 MUSLIMAH',1,'2026-05-08 07:56:42','2026-05-08 07:56:42'),(51,'I GINA','L_MUSLIMAH','📁 LAIN2 MUSLIMAH',1,'2026-05-08 07:56:42','2026-05-08 07:56:42'),(52,'APS','KOMUNITI','📁 KOMUNITI',1,'2026-05-08 07:56:42','2026-05-08 07:56:42'),(53,'AMCA','KOMUNITI','📁 KOMUNITI',1,'2026-05-08 07:56:42','2026-05-08 07:56:42'),(54,'DUNGUN','KOMUNITI','📁 KOMUNITI',1,'2026-05-08 07:56:42','2026-05-08 07:56:42'),(55,'LB','KOMUNITI','📁 KOMUNITI',1,'2026-05-08 07:56:42','2026-05-08 07:56:42'),(56,'PERAK','KOMUNITI','📁 KOMUNITI',1,'2026-05-08 07:56:42','2026-05-08 07:56:42');
/*!40000 ALTER TABLE `ahlis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jualan_sabun_details`
--

DROP TABLE IF EXISTS `jualan_sabun_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jualan_sabun_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `record_id` int NOT NULL COMMENT 'Reference to main record',
  `folder_id` varchar(20) NOT NULL COMMENT 'Folder reference',
  `folder_label` varchar(100) NOT NULL COMMENT 'Folder name at time of record',
  `amount` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT 'Payment amount',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `ahli_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_record_id` (`record_id`),
  KEY `idx_folder_id` (`folder_id`),
  KEY `idx_ahli_id` (`ahli_id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jualan_sabun_details`
--

LOCK TABLES `jualan_sabun_details` WRITE;
/*!40000 ALTER TABLE `jualan_sabun_details` DISABLE KEYS */;
INSERT INTO `jualan_sabun_details` VALUES (34,2,'S13','📁 S13',50.00,'2026-05-09 00:30:52','2026-05-09 00:30:52',6),(35,2,'L_MUSLIMAH','📁 LAIN2 MUSLIMAH',50.00,'2026-05-09 00:30:52','2026-05-09 00:30:52',41),(36,1,'MKN','📁 MKN ++',50.00,'2026-05-09 00:31:03','2026-05-09 00:31:03',13),(37,1,'MKN','📁 MKN ++',50.00,'2026-05-09 00:31:03','2026-05-09 00:31:03',16),(38,1,'L_MUSLIMAH','📁 LAIN2 MUSLIMAH',50.00,'2026-05-09 00:31:03','2026-05-09 00:31:03',41),(39,1,'L_MUSLIMAH','📁 LAIN2 MUSLIMAH',50.00,'2026-05-09 00:31:03','2026-05-09 00:31:03',47),(40,1,'L_LELAKI','📁 LAIN² LELAKI',100.00,'2026-05-09 00:31:03','2026-05-09 00:31:03',28),(41,1,'L_LELAKI','📁 LAIN² LELAKI',100.00,'2026-05-09 00:31:03','2026-05-09 00:31:03',32),(42,1,'KOMUNITI','📁 KOMUNITI',40.00,'2026-05-09 00:31:03','2026-05-09 00:31:03',53);
/*!40000 ALTER TABLE `jualan_sabun_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jualan_sabun_records`
--

DROP TABLE IF EXISTS `jualan_sabun_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jualan_sabun_records` (
  `id` int NOT NULL AUTO_INCREMENT,
  `month` int NOT NULL COMMENT 'Month (1-12)',
  `week` int NOT NULL COMMENT 'Week (1-4)',
  `year` int NOT NULL COMMENT 'Year (e.g., 2026)',
  `total_amount` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT 'Total sales amount',
  `total_members` int NOT NULL DEFAULT '0' COMMENT 'Total number of members',
  `paid_members` int NOT NULL DEFAULT '0' COMMENT 'Number of paid members',
  `record_date` date NOT NULL COMMENT 'Record date',
  `status` enum('active','completed') NOT NULL DEFAULT 'active' COMMENT 'Record status',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `folderId` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_month_week_year` (`month`,`week`,`year`),
  KEY `idx_status` (`status`),
  KEY `idx_record_date` (`record_date`),
  KEY `folderId` (`folderId`),
  CONSTRAINT `jualan_sabun_records_ibfk_1` FOREIGN KEY (`folderId`) REFERENCES `folders` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jualan_sabun_records`
--

LOCK TABLES `jualan_sabun_records` WRITE;
/*!40000 ALTER TABLE `jualan_sabun_records` DISABLE KEYS */;
INSERT INTO `jualan_sabun_records` VALUES (1,5,1,2026,440.00,56,7,'2026-05-09','active','2026-05-08 09:02:21','2026-05-09 00:31:03',NULL),(2,5,2,2026,100.00,56,2,'2026-05-09','active','2026-05-09 00:18:03','2026-05-09 00:30:52',NULL);
/*!40000 ALTER TABLE `jualan_sabun_records` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `folders`
--

DROP TABLE IF EXISTS `folders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `folders` (
  `id` varchar(20) NOT NULL COMMENT 'Folder ID (S13, MKN, etc.)',
  `label` varchar(100) NOT NULL COMMENT 'Folder display name with emoji',
  `color` varchar(7) NOT NULL COMMENT 'Folder color code',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `folders`
--

LOCK TABLES `folders` WRITE;
/*!40000 ALTER TABLE `folders` DISABLE KEYS */;
INSERT INTO `folders` VALUES ('KOMUNITI','📁 KOMUNITI','#534AB7','2026-05-07 23:29:53','2026-05-07 23:29:53'),('L_LELAKI','📁 LAIN² LELAKI','#854F0B','2026-05-07 23:29:53','2026-05-07 23:29:53'),('L_MUSLIMAH','📁 LAIN2 MUSLIMAH','#72243E','2026-05-07 23:29:53','2026-05-07 23:29:53'),('MKN','📁 MKN ++','#185FA5','2026-05-07 23:29:53','2026-05-07 23:29:53'),('MUSLIMAH','📁 MUSLIMAH','#993556','2026-05-07 23:29:53','2026-05-07 23:29:53'),('S13','📁 S13','#0F6E56','2026-05-07 23:29:53','2026-05-07 23:29:53');
/*!40000 ALTER TABLE `folders` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-09  9:05:22
