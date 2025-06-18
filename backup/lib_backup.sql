/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-11.7.2-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: lib
-- ------------------------------------------------------
-- Server version	11.7.2-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `books`
--

DROP TABLE IF EXISTS `books`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `books` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `title` text NOT NULL,
  `year` int(11) NOT NULL,
  `author` varchar(64) NOT NULL,
  `pages` int(11) DEFAULT NULL,
  `isbn` bigint(20) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `numbersOfView` int(11) DEFAULT 0,
  `wantCount` int(11) DEFAULT 0,
  `cover` varchar(255) NOT NULL DEFAULT 'public/images/1.webp',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `books`
--

LOCK TABLES `books` WRITE;
/*!40000 ALTER TABLE `books` DISABLE KEYS */;
INSERT INTO `books` VALUES
(1,'Clean Code',2008,'Robert C. Martin',464,9780132350884,'A handbook of agile software craftsmanship that emphasizes writing clean, understandable, and maintainable code.',1,0,'1.webp'),
(2,'The Pragmatic Programmer',1999,'Andrew Hunt and David Thomas',352,9780201616224,'Tips and techniques for becoming a more effective and adaptive software developer.',13,0,'1.webp'),
(3,'Design Patterns: Elements of Reusable Object-Oriented Software',1994,'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides',395,9780201633610,'A catalog of simple and succinct solutions to common software design problems.',3,0,'1.webp'),
(4,'Refactoring: Improving the Design of Existing Code',1999,'Martin Fowler',464,9780201485677,'Techniques for restructuring an existing body of code, altering its internal structure without changing its external behavior.',1,0,'1.webp'),
(5,'Domain-Driven Design: Tackling Complexity in the Heart of Software',2003,'Eric Evans',560,9780321125217,'A comprehensive guide to designing complex software applications using domain modeling.',1,0,'1.webp'),
(6,'Working Effectively with Legacy Code',2004,'Michael Feathers',456,9780131177055,'Strategies for dealing with legacy code and making it more testable and maintainable.',0,0,'1.webp'),
(7,'Software Architecture in Practice',2012,'Len Bass, Paul Clements, Rick Kazman',624,9780321815736,'A practical guide to designing and evaluating software architectures in real-world projects.',0,0,'1.webp'),
(9,'Clean Agile: Back to Basics',2019,'Robert C. Martin',240,9780135781869,'A return to the original ideas of Agile development from one of its early proponents.',0,0,'1.webp'),
(11,'Accelerate: The Science of Lean Software and DevOps',2018,'Nicole Forsgren, Jez Humble, Gene Kim',288,9781942788331,'Research-based strategies to improve software delivery performance and organizational outcomes.',0,0,'1.webp'),
(12,'The Clean Coder: A Code of Conduct for Professional Programmers',2011,'Robert C. Martin',256,9780137081073,'Insights into the mindset and habits of professional software developers.',0,0,'1.webp'),
(13,'Software Engineering at Google: Lessons Learned from Programming Over Time',2020,'Titus Winters, Tom Manshreck, Hyrum Wright',592,9781492082798,'A detailed look at how Google manages software development at scale.',0,0,'1.webp'),
(14,'Growing Object-Oriented Software, Guided by Tests',2009,'Steve Freeman and Nat Pryce',384,9780321503626,'A test-driven approach to building well-designed and maintainable object-oriented systems.',0,0,'1.webp'),
(15,'Architecture Patterns with Python',2020,'Harry Percival and Bob Gregory',304,9781492052203,'A practical book on applying DDD and clean architecture principles in Python applications.',0,0,'1.webp'),
(16,'The Great Gatsby',1925,'F. Scott Fitzgerald',218,9780743273565,'A novel about the American dream.',0,0,'1.webp'),
(17,'To Kill a Mockingbird',1960,'Harper Lee',281,9780061120084,'A story of racial injustice in the Deep South.',0,0,'1.webp'),
(18,'1984',1949,'George Orwell',328,9780451524935,'A dystopian novel about surveillance and control.',0,0,'1.webp'),
(19,'Brave New World',1932,'Aldous Huxley',311,9780060850524,'A futuristic society controlled by technology and conditioning.',0,0,'1.webp'),
(20,'The Catcher in the Rye',1951,'J.D. Salinger',277,9780316769488,'A teenager’s perspective on the adult world.',0,0,'1.webp'),
(21,'Moby-Dick',1851,'Herman Melville',635,9781503280786,'The quest for revenge against the white whale.',0,0,'1.webp'),
(22,'Pride and Prejudice',1813,'Jane Austen',279,9781503290563,'Love and social standing in 19th-century England.',0,5,'1.webp'),
(23,'The Hobbit',1937,'J.R.R. Tolkien',310,9780547928227,'A hobbit’s adventure to reclaim a treasure guarded by a dragon.',0,0,'1.webp'),
(24,'Fahrenheit 451',1953,'Ray Bradbury',194,9781451673319,'A society where books are outlawed and burned.',0,0,'1.webp'),
(25,'Crime and Punishment',1866,'Fyodor Dostoevsky',671,9780486415871,'A psychological drama of guilt and redemption.',0,0,'1.webp'),
(26,'The Great Gatsby',1925,'F. Scott Fitzgerald',218,9780743273565,'A novel about the American dream.',0,0,'1.webp'),
(27,'To Kill a Mockingbird',1960,'Harper Lee',281,9780061120084,'A story of racial injustice in the Deep South.',1,0,'1.webp'),
(28,'1984',1949,'George Orwell',328,9780451524935,'A dystopian novel about surveillance and control.',1,0,'1.webp'),
(29,'Brave New World',1932,'Aldous Huxley',311,9780060850524,'A futuristic society controlled by technology and conditioning.',1,0,'1.webp'),
(30,'The Catcher in the Rye',1951,'J.D. Salinger',277,9780316769488,'A teenager’s perspective on the adult world.',0,0,'1.webp'),
(31,'Moby-Dick',1851,'Herman Melville',635,9781503280786,'The quest for revenge against the white whale.',0,0,'1.webp'),
(32,'Pride and Prejudice',1813,'Jane Austen',279,9781503290563,'Love and social standing in 19th-century England.',0,0,'1.webp'),
(62,'testbook1',1234,'test author',33,1321450978,'test description',0,0,'410051508.jpg');
/*!40000 ALTER TABLE `books` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2025-06-18 22:53:54
