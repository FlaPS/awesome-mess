-- MySQL dump 10.13  Distrib 5.7.12, for Win64 (x86_64)
--
-- Host: localhost    Database: next_reporting
-- ------------------------------------------------------
-- Server version	5.7.17-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `master_events`
--

DROP TABLE IF EXISTS `master_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `master_events` (
  `masterEventId` bigint(20) NOT NULL AUTO_INCREMENT,
  `guid` varchar(36) NOT NULL,
  `type` varchar(45) NOT NULL,
  `time` bigint(20) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `wellId` varchar(45) DEFAULT NULL,
  `key` varchar(255) DEFAULT NULL,
  `payload` text DEFAULT NULL,
  PRIMARY KEY (`masterEventId`),
  UNIQUE KEY `guid_UNIQUE` (`guid`),
  UNIQUE KEY `sequence_id_UNIQUE` (`masterEventId`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `meta`
--

DROP TABLE IF EXISTS `meta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `meta` (
  `key` varchar(255) NOT NULL,
  `value` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `slave_events`
--

DROP TABLE IF EXISTS `slave_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `slave_events` (
  `slaveEventId` bigint(20) NOT NULL AUTO_INCREMENT,
  `guid` varchar(36) NOT NULL,
  `type` varchar(45) NOT NULL,
  `time` bigint(20) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `wellId` varchar(45) DEFAULT NULL,
  `key` varchar(255) DEFAULT NULL,
  `payload` text DEFAULT NULL,
  `previousMasterEventId` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`slaveEventId`),
  UNIQUE KEY `guid_UNIQUE` (`guid`),
  UNIQUE KEY `slave_id_UNIQUE` (`slaveEventId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `snapshots`
--

DROP TABLE IF EXISTS `snapshots`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `snapshots` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `state` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `event_guid_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sync_keys`
--
/*DROP TABLE IF EXISTS `sync_keys`;*/
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
/*CREATE TABLE `sync_keys` (
  `wellId` bigint(20) DEFAULT NULL,
  `key` varchar(45) NOT NULL,
  `last_used_milis` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`key`),
  UNIQUE KEY `key_UNIQUE` (`key`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;*/
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

INSERT INTO `meta` (`key`, `value`) VALUES ('db_version', '1');
-- Dump completed on 2017-03-16 13:20:06
