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
-- Table structure for table `customer_notes`
--

DROP TABLE IF EXISTS `customer_notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_notes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int NOT NULL,
  `caption` varchar(500) DEFAULT NULL,
  `note` text,
  `images` json DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_customer_id` (`customer_id`),
  KEY `idx_customer_notes_user_id` (`user_id`),
  CONSTRAINT `customer_notes_ibfk_69` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `customer_notes_ibfk_70` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_notes`
--

LOCK TABLES `customer_notes` WRITE;
/*!40000 ALTER TABLE `customer_notes` DISABLE KEYS */;
INSERT INTO `customer_notes` VALUES (3,2,'Ulangtahun syarikat','Merayakan ulangtahun syarikat ke-25 dengan acara sukan dan aktiviti keluarga.','[\"http://localhost:5000/uploads/anniversary1.jpg\", \"http://localhost:5000/uploads/anniversary2.jpg\", \"http://localhost:5000/uploads/anniversary3.jpg\"]','2026-05-04 09:44:14','2026-05-04 09:44:14',1),(4,1,'--','bismillahasd','[]','2026-05-04 22:48:44','2026-05-04 22:48:44',1),(5,1,'title','asdadasd','[]','2026-05-04 22:54:47','2026-05-04 22:54:47',1),(6,1,'title','bismillan','[\"https://res.cloudinary.com/dzbfpxsob/image/upload/v1777937381/customer/b6hwkocp7gv9ybdslbox.jpg\", \"https://res.cloudinary.com/dzbfpxsob/image/upload/v1777937387/customer/c6hilq9ownfugapzdu9s.jpg\"]','2026-05-04 23:29:48','2026-05-04 23:29:48',1),(7,1,'Pertemuan kedua\n','Pertemuan pertama dan Kedua \nPertemuan pertama dan Kedua \nPertemuan pertama dan Kedua \n','[]','2026-05-04 23:36:59','2026-05-04 23:36:59',1),(8,1,'pertemutan ke 3','bismillah Pertemuan pertama dan Kedua \nbismillah Pertemuan pertama dan Kedua \nbismillah Pertemuan pertama dan Kedua \n','[\"https://res.cloudinary.com/dzbfpxsob/image/upload/v1777937869/customer/gmzfvimxji2htatpwcsi.jpg\", \"https://res.cloudinary.com/dzbfpxsob/image/upload/v1777937880/customer/y5uy1r616zbovjah3rxs.jpg\"]','2026-05-04 23:38:03','2026-05-04 23:38:03',1),(11,3,'Pertemuan pertama','bismillah','[]','2026-05-05 00:55:54','2026-05-05 00:55:54',1),(12,5,'Pertemuan pertama','dalam pertemuan perteama ini belum ada gambar','[]','2026-05-05 01:30:00','2026-05-05 01:30:00',1),(13,5,'pertemuan kedua sudah ada gambar','note','[\"https://res.cloudinary.com/dzbfpxsob/image/upload/v1777944641/customer/xf5x7kxkfyfrhu0bhw0n.jpg\", \"https://res.cloudinary.com/dzbfpxsob/image/upload/v1777944645/customer/s22hf9sgghkzt5lx7u5z.jpg\"]','2026-05-05 01:30:45','2026-05-05 01:30:45',1);
/*!40000 ALTER TABLE `customer_notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `address` text,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `age` varchar(10) DEFAULT NULL,
  `kerjaya` text,
  `kerjasama` text,
  `kehidupan_keluarga` text,
  `notes` text,
  `avatar_url` varchar(500) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  CONSTRAINT `customers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (1,1,'DARWIS NURHADI','Medan','1997-02-14','No. 18, Jalan Anggerik 3/2, Seksyen 3, 40000 Shah Alam, Selangor','+601234567890','darwis@example.com','27 tahun','Usahawan','Telah bekerjasama dalam pelbagai projek perniagaan dan pembangunan komuniti. Sangat komited dan profesional dalam semua urusan.','Berkeluarga bahagia dengan 3 orang anak. Sangat mementingkan masa berkualiti bersama keluarga dan keseimbangan hidup.','Catitan Pertemuan',NULL,'2026-05-04 09:44:14','2026-05-04 09:44:14'),(2,2,'Tn SHukri Md Nor','Kuala Lumpur','1985-06-15','Jalan Raja Chulan 1/2, 50200 Kuala Lumpur','+601234567891','shukri@example.com','38 tahun','Pengurus Syarikat','Pengalaman lebih 15 tahun dalam pengurusan syarikat teknologi.','Berkeluarga dengan 4 orang anak, mengutamakan pendidikan anak-anak.','Pelanggan setia sejak 2020',NULL,'2026-05-04 09:44:14','2026-05-04 09:44:14'),(3,1,'NANANG SETYA','BANDUNG',NULL,'49, JALAN TIMUR 6, BANDAR BARU ENSTEK, 71800 BANDAR BARU ENSTEK, NEGERI SEMBILAN,','0818223304','nswardana@gmail.com','41','Niaga','Belum ada kerja sama','1 istri 4 anak','taubatkan kami','https://res.cloudinary.com/dzbfpxsob/image/upload/v1777942435/customer/zvpo3hpfrhpjhkwab8ji.jpg','2026-05-05 00:27:47','2026-05-05 00:53:56'),(4,1,'ADIB','SENTUL',NULL,'sentul city','09776253533','sentul@adib.com','32','-','-','-','-','https://res.cloudinary.com/dzbfpxsob/image/upload/v1777944051/customer/mrqveejx9dzxkh8tpk2o.jpg','2026-05-05 01:20:20','2026-05-05 01:20:59'),(5,1,'M Fatah','BANDUNG',NULL,'JL BANDUNG BOGOER 1','081823344','email@eemail.com','31','-','-','-','-','https://res.cloudinary.com/dzbfpxsob/image/upload/v1777944530/customer/oelfx0lhjcwmjszmcrcu.jpg','2026-05-05 01:29:25','2026-05-05 01:31:16');
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `note_images`
--

DROP TABLE IF EXISTS `note_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `note_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `note_id` int NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `image_name` varchar(255) DEFAULT NULL,
  `file_size` int DEFAULT NULL,
  `mime_type` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_note_id` (`note_id`),
  CONSTRAINT `note_images_ibfk_1` FOREIGN KEY (`note_id`) REFERENCES `customer_notes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `note_images`
--

LOCK TABLES `note_images` WRITE;
/*!40000 ALTER TABLE `note_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `note_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oauth_users`
--

DROP TABLE IF EXISTS `oauth_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oauth_users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `provider` enum('google','facebook') NOT NULL,
  `provider_id` varchar(255) NOT NULL,
  `user_id` int DEFAULT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_provider_user` (`provider`,`provider_id`),
  KEY `idx_provider` (`provider`),
  KEY `idx_user_id` (`user_id`),
  KEY `oauth_users_provider` (`provider`),
  KEY `oauth_users_user_id` (`user_id`),
  CONSTRAINT `oauth_users_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oauth_users`
--

LOCK TABLES `oauth_users` WRITE;
/*!40000 ALTER TABLE `oauth_users` DISABLE KEYS */;
/*!40000 ALTER TABLE `oauth_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `session_id` varchar(255) NOT NULL,
  `data` text,
  `expires_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`session_id`),
  KEY `idx_expires_at` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `avatar_url` varchar(500) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email_verified` tinyint(1) DEFAULT '0',
  `oauth_provider` enum('local','google','facebook') DEFAULT 'local',
  `oauth_id` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `email_3` (`email`),
  UNIQUE KEY `email_4` (`email`),
  UNIQUE KEY `email_5` (`email`),
  UNIQUE KEY `email_6` (`email`),
  UNIQUE KEY `email_7` (`email`),
  UNIQUE KEY `email_8` (`email`),
  UNIQUE KEY `email_9` (`email`),
  UNIQUE KEY `email_10` (`email`),
  UNIQUE KEY `email_11` (`email`),
  UNIQUE KEY `email_12` (`email`),
  UNIQUE KEY `email_13` (`email`),
  UNIQUE KEY `email_14` (`email`),
  UNIQUE KEY `email_15` (`email`),
  UNIQUE KEY `email_16` (`email`),
  UNIQUE KEY `email_17` (`email`),
  UNIQUE KEY `email_18` (`email`),
  UNIQUE KEY `email_19` (`email`),
  UNIQUE KEY `email_20` (`email`),
  UNIQUE KEY `email_21` (`email`),
  UNIQUE KEY `email_22` (`email`),
  UNIQUE KEY `email_23` (`email`),
  UNIQUE KEY `email_24` (`email`),
  UNIQUE KEY `email_25` (`email`),
  UNIQUE KEY `email_26` (`email`),
  UNIQUE KEY `email_27` (`email`),
  UNIQUE KEY `email_28` (`email`),
  UNIQUE KEY `email_29` (`email`),
  UNIQUE KEY `email_30` (`email`),
  UNIQUE KEY `email_31` (`email`),
  UNIQUE KEY `email_32` (`email`),
  UNIQUE KEY `email_33` (`email`),
  UNIQUE KEY `email_34` (`email`),
  UNIQUE KEY `email_35` (`email`),
  UNIQUE KEY `email_36` (`email`),
  UNIQUE KEY `email_37` (`email`),
  UNIQUE KEY `email_38` (`email`),
  UNIQUE KEY `email_39` (`email`),
  UNIQUE KEY `email_40` (`email`),
  UNIQUE KEY `email_41` (`email`),
  UNIQUE KEY `email_42` (`email`),
  UNIQUE KEY `email_43` (`email`),
  UNIQUE KEY `email_44` (`email`),
  UNIQUE KEY `email_45` (`email`),
  UNIQUE KEY `email_46` (`email`),
  UNIQUE KEY `email_47` (`email`),
  UNIQUE KEY `email_48` (`email`),
  UNIQUE KEY `email_49` (`email`),
  UNIQUE KEY `email_50` (`email`),
  UNIQUE KEY `email_51` (`email`),
  UNIQUE KEY `email_52` (`email`),
  UNIQUE KEY `email_53` (`email`),
  UNIQUE KEY `email_54` (`email`),
  UNIQUE KEY `email_55` (`email`),
  UNIQUE KEY `email_56` (`email`),
  KEY `idx_email` (`email`),
  KEY `idx_oauth` (`oauth_provider`,`oauth_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin@maqlubah.com','$2a$10$7F6hVKQboPOR4voW17vv6ePh3DVdXZMjJmtWfdOs/OY8MUOvIj5E2','Admin','User','Medan',NULL,NULL,0,'local',NULL,'2026-05-04 09:44:14','2026-05-04 10:01:51'),(2,'customer1@example.com','$2a$10$rK8QqK8QqK8QqK8QqK8QqK8QqK8QqK8QqK8QqK8QqK8QqK8QqK8QqK8QqK8Qq','Darwis','Nurhadi','Medan',NULL,NULL,0,'local',NULL,'2026-05-04 09:44:14','2026-05-04 09:44:14');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-05  9:47:46
