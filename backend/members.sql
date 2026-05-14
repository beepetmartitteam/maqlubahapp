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
-- Table structure for table `members`
--

DROP TABLE IF EXISTS `members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `members` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `husband_name` varchar(255) NOT NULL,
  `age` int DEFAULT NULL,
  `phone` varchar(20) NOT NULL,
  `home_address` text,
  `district` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `wives` json DEFAULT NULL,
  `married_children` int NOT NULL DEFAULT '0',
  `unmarried_children` int NOT NULL DEFAULT '0',
  `current_job` varchar(255) DEFAULT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `struggle_understanding` text,
  `family_situation` text,
  `welfare_status` text,
  `five_p_activities` json DEFAULT NULL,
  `compliance_level` text,
  `struggle_assessment` int NOT NULL DEFAULT '3',
  `family_management_assessment` int NOT NULL DEFAULT '3',
  `welfare_assessment` int NOT NULL DEFAULT '3',
  `five_p_assessment` int NOT NULL DEFAULT '3',
  `compliance_assessment` int NOT NULL DEFAULT '3',
  `summary` text,
  `status` enum('active','inactive','pending') NOT NULL DEFAULT 'active',
  `join_date` date NOT NULL,
  `last_updated` datetime NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `phone` (`phone`),
  KEY `userId` (`userId`),
  CONSTRAINT `members_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `members`
--

LOCK TABLES `members` WRITE;
/*!40000 ALTER TABLE `members` DISABLE KEYS */;
INSERT INTO `members` VALUES (1,1,'Nanang',42,'818223304','Jl Bogor ','Bogor','Wilayah Persekutuan','[]',4,2,'Niaga Besi','As Salam','🎯 Understanding of the Struggle\n','👨‍👩‍👧‍👦 Family Situation\n','🏠 Welfare Status\n','[]','📖 Compliance Level\n',2,2,2,2,2,'','active','2026-05-14','2026-05-14 00:07:12','2026-05-14 00:07:12','2026-05-14 00:31:34'),(2,1,'Ahmad bin Ibrahim',42,'+60123456789','No. 123, Jalan Utama, Taman Permai','Klang','Selangor','[\"Fatimah binti Ali\", \"Fatimah binti husain\"]',2,3,'Business Owner','Ahmad Enterprise','Still searching for truth, believes struggle continues','Children in local schools, working on self-improvement','House in good condition, some debts from previous operations','[\"Business\", \"Agriculture\"]','Good understanding of fatwa compliance',4,3,3,4,3,'Active member with good business background, working on family welfare improvement','active','2020-01-15','2026-05-14 07:08:51','2026-05-14 07:08:51','2026-05-14 08:21:51'),(3,1,'Mohammad bin Hassan',38,'+60123456790','No. 456, Jalan Raya, Kampung Baru','Kuala Lumpur','Wilayah Persekutuan','[\"Norhayati binti Ahmad\"]',1,3,'Farmer',NULL,'Strong commitment to the struggle, believes in continuous improvement','Family supportive, children progressing well in education','Basic housing, working on improving living conditions','[\"Agriculture\", \"Livestock\"]','Moderate understanding, needs more guidance',3,4,2,3,3,'Dedicated farmer with strong family values, needs support in business development','active','2021-02-28','2026-05-14 07:08:51','2026-05-14 07:08:51','2026-05-14 07:08:51'),(4,1,'Ismail bin Bakar',48,'+60123456793','No. 654, Jalan Utama, Bandar Baru','Klang','Selangor','[\"Aminah binti Rahman\", \"Salwah binti Ismail\", \"Nurul binti Hassan\", \"Siti binti Mohammad\"]',5,3,'Business Owner','Ismail Trading Group','Very committed, strong leadership qualities','Large family, managing well despite challenges','Good living standards, some business-related debt','[\"Business\", \"Agriculture\", \"Livestock\"]','Excellent compliance and understanding',5,4,4,5,5,'Strong leader with large family, excellent business acumen and high compliance','active','2017-11-15','2026-05-14 07:08:51','2026-05-14 07:08:51','2026-05-14 08:17:19'),(5,1,'Rashid bin Osman',35,'+60123456791','No. 789, Jalan Perak, Ipoh Garden','Ipoh','Perak','[\"Salmah binti Kassim\"]',0,4,'Teacher',NULL,'Understanding developing, seeking more knowledge','Young family, focused on children education','Comfortable housing, no major issues','[\"Business\"]','Good compliance, willing to learn',3,4,4,3,4,'Young professional with growing family, good potential for leadership','active','2022-03-10','2026-05-14 07:08:51','2026-05-14 07:08:51','2026-05-14 07:08:51'),(6,1,'Zainal bin Abidin',45,'+60123456792','No. 321, Jalan Pantai, Kuala Terengganu','Kuala Terengganu','Terengganu','[\"Zainab binti Sulaiman\"]',2,2,'Fisherman',NULL,'Deeply committed, strong spiritual foundation','Family well-established, children grown up','Adequate housing, minimal debt','[\"Fishing\", \"Agriculture\"]','Excellent understanding and practice',4,5,4,4,4,'Dedicated fisherman with strong family values and good compliance','active','2021-02-28','2026-05-14 07:08:51','2026-05-14 07:08:51','2026-05-14 07:08:51'),(7,1,'Budiman',12,'88777666','Jl SUbang','Subang','Selangor','[\"syahidah\", \"Syahidah 2\"]',2,0,'Peniaga','comany name','','','','[]','',3,3,3,3,3,'','active','2026-05-14','2026-05-14 06:44:10','2026-05-14 06:44:10','2026-05-14 08:21:22'),(8,1,'zahirtamimi',21,'0818223304','Victoria sentul city','','Selangor','[\"petana\", \"petana2\"]',2,0,'petani','','','','','[]','',2,5,2,5,2,'','active','2026-05-14','2026-05-14 09:01:27','2026-05-14 09:01:27','2026-05-14 09:02:09');
/*!40000 ALTER TABLE `members` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-14 22:31:11
