-- MySQL dump 10.13  Distrib 8.0.37, for Linux (x86_64)
--
-- Host: localhost    Database: travel_explorer
-- ------------------------------------------------------
-- Server version	8.0.37-0ubuntu0.23.10.2

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
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (1,3,9,'2026-03-28',2,2,'nothing',252.00,'pending','2026-03-27 02:42:33');
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `community_posts`
--

LOCK TABLES `community_posts` WRITE;
/*!40000 ALTER TABLE `community_posts` DISABLE KEYS */;
INSERT INTO `community_posts` VALUES (1,4,'shreya',NULL,'hyderabad','city','Adventure',2000,'oct-dec','nice place',NULL,4,0,'2026-03-24 16:26:56'),(2,3,'test',NULL,'mumbai','city','Temple',15000,'march-apri','nice palce','lakes',4,2,'2026-03-25 06:10:01'),(3,4,'shreya',NULL,'araku','andhra','Adventure',3000,'dec-jan','whether is tooo good to feel','plan your trip with friends',5,1,'2026-03-26 15:49:05'),(4,4,'shreya',NULL,'bangalore','india','Food',1000,'jan - march','food is vey delicious','carry water bottle',4,0,'2026-03-26 15:53:47'),(5,4,'shreya',NULL,'asia','asia','City',10000,'jan-march','asia is good','nothing',4,0,'2026-03-26 16:02:20'),(6,4,'shreya',NULL,'hyderabad','city','Mountain',3000,'march - may','tyuiop;kj','dfcjkll',3,1,'2026-03-26 16:04:15'),(7,4,'shreya',NULL,'fghjk','dgj','Beach',456,'dfghjk','fghjkoiouyd','dfhghjkk',4,1,'2026-03-26 16:05:25'),(8,3,'test',NULL,'araku','anfhra pradeesh','Adventure',890,'fghjkl','sdfghjk','ertyuiokjh',4,0,'2026-03-26 18:12:35'),(9,3,'test',NULL,'beach','city','Beach',5000,'oct-dec','bvcxdrtyb','jhvcgtt7uh',4,0,'2026-03-26 18:58:05');
/*!40000 ALTER TABLE `community_posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `guide_availability`
--

LOCK TABLES `guide_availability` WRITE;
/*!40000 ALTER TABLE `guide_availability` DISABLE KEYS */;
INSERT INTO `guide_availability` VALUES (3,3,'mon-fri','9 am - 6 pm'),(5,5,'fri-sunday','10Am-9PM'),(9,9,'mon-fri','9am - 6pm'),(10,10,'mon-friday','9 to 11 am');
/*!40000 ALTER TABLE `guide_availability` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `guide_expertise`
--

LOCK TABLES `guide_expertise` WRITE;
/*!40000 ALTER TABLE `guide_expertise` DISABLE KEYS */;
INSERT INTO `guide_expertise` VALUES (3,3,'beaches','history'),(5,5,'beaches','photography'),(9,9,'history','history'),(10,10,'temples','hsitory');
/*!40000 ALTER TABLE `guide_expertise` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `guide_pricing`
--

LOCK TABLES `guide_pricing` WRITE;
/*!40000 ALTER TABLE `guide_pricing` DISABLE KEYS */;
INSERT INTO `guide_pricing` VALUES (3,3,300.00,4),(5,5,250.00,3),(9,9,500.00,3),(10,10,100.00,2);
/*!40000 ALTER TABLE `guide_pricing` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `guide_verification`
--

LOCK TABLES `guide_verification` WRITE;
/*!40000 ALTER TABLE `guide_verification` DISABLE KEYS */;
INSERT INTO `guide_verification` VALUES (3,3,1,1),(5,5,1,1),(9,9,1,1),(10,10,1,1);
/*!40000 ALTER TABLE `guide_verification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `guides`
--

LOCK TABLES `guides` WRITE;
/*!40000 ALTER TABLE `guides` DISABLE KEYS */;
INSERT INTO `guides` VALUES (3,5,'hyderabad','telugu',5,'Adventure','i am human being','uploads/profile_photos/1774289851767-WhatsApp Image 2026-03-11 at 2.38.26 PM.jpeg','uploads/government_ids/1774289851765-WhatsAppImage2026-01-31at1.06.02PM12.jpg','approved',1),(5,10,'maharashtra','tamil,malayalam',2,'Food','i am bhavya food guide','uploads/profile_photos/1774356172020-WhatsApp Image 2026-03-11 at 2.38.26 PM.jpeg','uploads/government_ids/1774356172019-WhatsApp Image 2026-03-11 at 2.38.26 PM.jpeg','approved',1),(9,14,'punjab','hindi,engkish',4,'Cultural','','uploads/profile_photos/1774418245031-WhatsApp Image 2026-03-11 at 2.38.26 PM.jpeg','uploads/government_ids/1774418245028-Screenshot from 2026-03-24 12-55-45.png','pending',1),(10,15,'chennai','tamil',10,'Cultural','i am aarunya','uploads/profile_photos/1774576862042-WhatsApp Image 2026-03-11 at 2.38.26 PM.jpeg','uploads/government_ids/1774576862041-WhatsApp Image 2026-03-11 at 2.38.26 PM.jpeg','pending',1);
/*!40000 ALTER TABLE `guides` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,9,'system_welcome','Welcome to the new TravelMate Notification System!',NULL,0,'2026-03-27 01:28:20'),(2,2,'system_welcome','Welcome to the new TravelMate Notification System!',NULL,0,'2026-03-27 01:28:20'),(3,10,'system_welcome','Welcome to the new TravelMate Notification System!',NULL,0,'2026-03-27 01:28:20'),(4,12,'system_welcome','Welcome to the new TravelMate Notification System!',NULL,0,'2026-03-27 01:28:20'),(5,13,'system_welcome','Welcome to the new TravelMate Notification System!',NULL,0,'2026-03-27 01:28:20'),(6,14,'system_welcome','Welcome to the new TravelMate Notification System!',NULL,0,'2026-03-27 01:28:20'),(7,11,'system_welcome','Welcome to the new TravelMate Notification System!',NULL,0,'2026-03-27 01:28:20'),(8,7,'system_welcome','Welcome to the new TravelMate Notification System!',NULL,0,'2026-03-27 01:28:20'),(9,6,'system_welcome','Welcome to the new TravelMate Notification System!',NULL,0,'2026-03-27 01:28:20'),(10,4,'system_welcome','Welcome to the new TravelMate Notification System!',NULL,0,'2026-03-27 01:28:20'),(11,3,'system_welcome','Welcome to the new TravelMate Notification System!',NULL,0,'2026-03-27 01:28:20'),(12,1,'system_welcome','Welcome to the new TravelMate Notification System!',NULL,0,'2026-03-27 01:28:20'),(13,5,'system_welcome','Welcome to the new TravelMate Notification System!',NULL,0,'2026-03-27 01:28:20'),(16,15,'guide_approved','Your guide account has been approved',NULL,0,'2026-03-27 02:02:39');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `post_comments`
--

LOCK TABLES `post_comments` WRITE;
/*!40000 ALTER TABLE `post_comments` DISABLE KEYS */;
INSERT INTO `post_comments` VALUES (1,2,3,'hi test','2026-03-26 18:53:14'),(2,7,3,'hi shreya','2026-03-26 18:53:41'),(3,9,3,'fgyhuji','2026-03-26 18:59:58'),(4,9,3,'hi','2026-03-26 19:50:55'),(5,7,3,'i am test','2026-03-26 19:51:17'),(6,4,3,'hi shreya','2026-03-27 02:37:37'),(7,4,7,'tell your name','2026-03-27 02:40:00');
/*!40000 ALTER TABLE `post_comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `post_images`
--

LOCK TABLES `post_images` WRITE;
/*!40000 ALTER TABLE `post_images` DISABLE KEYS */;
INSERT INTO `post_images` VALUES (1,3,'uploads/community_1774540145730.jpeg'),(2,4,'uploads/community_1774540427905.jpeg'),(3,4,'uploads/community_1774540427905.jpeg'),(4,5,'uploads/community_1774540940269.jpeg'),(5,5,'uploads/community_1774540940270.jpeg'),(6,5,'uploads/community_1774540940270.jpeg'),(7,6,'uploads/community_1774541055703.jpeg'),(8,6,'uploads/community_1774541055703.jpeg'),(9,6,'uploads/community_1774541055704.jpeg'),(10,6,'uploads/community_1774541055704.jpeg'),(11,7,'uploads/community_1774541125313.jpeg'),(12,7,'uploads/community_1774541125316.jpeg'),(13,7,'uploads/community_1774541125317.jpeg'),(14,7,'uploads/community_1774541125317.jpeg'),(15,7,'uploads/community_1774541125317.jpeg'),(16,8,'uploads/community_1774548755622.jpeg');
/*!40000 ALTER TABLE `post_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `post_likes`
--

LOCK TABLES `post_likes` WRITE;
/*!40000 ALTER TABLE `post_likes` DISABLE KEYS */;
INSERT INTO `post_likes` VALUES (3,2),(4,2),(4,3),(4,6),(4,7);
/*!40000 ALTER TABLE `post_likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Test User','testuser@gmail.com','9876543210','$2a$10$JUCFLxQcaM/voBv3zWzw/.fSd7eWN511noJdbklEqtvHQm3UhPmXS','User','2026-03-13 16:36:24','',NULL),(2,'archana','archana@gmail.com','6304467434','$2a$10$FYDNFO4LBuudRRbJJcr21OGOa19e3B.4EO2oJdwpGIfFuIXQh6Ts.','User','2026-03-13 18:00:59','',NULL),(3,'test','test@gmail.com','6304467434','$2a$10$TCbzRBPSoB/Y0pbvG7RTteCyIaddVwz/Hpe0RQbJQ9iF5dLXjaTzm','User','2026-03-23 12:33:00','usa','i am test'),(4,'shreya','shreya@gmail.com','1234567890','$2a$10$pVpqXZs3TVaRMouqo9WxHO81.Byymq1l7cbRL1YL5O9wqLH1CYzP6','User','2026-03-23 12:36:11','vijag','i am human being'),(5,'vijaya','vijaya@gmail.com','9014578854','$2a$10$.5Bxpc9Oslv4pc6dPAKe2eq24WZSu/Ieg1AjzcHsstzv6WvlT5./.','Guide','2026-03-23 17:32:42','',NULL),(6,'lakshmi','lakshmi@gmail.com','9014578854','$2a$10$J91.IP9.1fab/EPAyt3xu.u8FxA7D8EI27m57iVs5eEWaVKviZ2d6','User','2026-03-23 17:36:48','',NULL),(7,'kumar','kumar@gmail.com','0987654321','$2a$10$WSHJvwBF4R0gh44pjl09r.GeIL9Pg84qiMhTC7bwG4Ln5FwXqYkPO','User','2026-03-24 07:44:52','',NULL),(9,'Admin2','Admin2@gmail.com','1122334455','$2a$10$E9QWouH7JK9b0AcUXMYMPuxjNCk/a1cqyXXHEfZkndCGKlyw45qpW','Admin','2026-03-24 12:26:30','',NULL),(10,'bhavya','bhavya@gmail.com','9898989898','$2a$10$XBNQN/nS9hemicVpEhtXnutt/nvllKMfcnY6VTOaE4dmdweqYCURC','Guide','2026-03-24 12:36:53','america','i am bhavya'),(11,'kranthi','kranthi@gmail.om','9014578854','$2a$10$n2m.haKWqpUa7yR2GmkopeJIO912X83OpHloFUNxVrJ2psiOxNqKa','User','2026-03-24 14:22:13','',NULL),(12,'guide1','guide1@gmail.com','6304467434','$2a$10$vl6RDW/2v4AMhEuJLm98W.NEmO.ZIAWhpk.ukxkCLN2zBoiKoQAu6','Guide','2026-03-24 16:45:35','',NULL),(13,'guide2','guide2@gmail.com','6304467434','$2a$10$hGyxOgc/1hmT7b99wgYXbOdQ.RxfjO7t4V41heEWxZEr5rbxWD3Ja','User','2026-03-25 05:29:32','',NULL),(14,'guide3','guide3@gmail.com','6304409876','$2a$10$TeOzKQglVkiDXAs/HXab9uTEONVcBhAO7dTdQl76zI1i3ljQKAtWO','Guide','2026-03-25 05:57:25','',NULL),(15,'aarunya','aarunya@gmail.com','7777777777','$2a$10$scfWx4BG7i9snE0z1G6cvumbsU7vvYQMgp1AW79p4FKo.CQUdVnM6','Guide','2026-03-27 02:01:02','',NULL);
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

-- Dump completed on 2026-03-27 15:59:37
