SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `consultation_planner`
--
CREATE DATABASE IF NOT EXISTS `consultation_planner` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_german2_ci;
USE `consultation_planner`;

-- --------------------------------------------------------

--
-- Table structure for table `beratungsformen`
--

CREATE TABLE `beratungsformen` (
  `formId` int(11) NOT NULL,
  `name` varchar(500) COLLATE utf8mb4_german2_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_german2_ci;

--
-- Dumping data for table `beratungsformen`
--

INSERT INTO `beratungsformen` (`formId`, `name`) VALUES
(1, 'student_analogue'),
(2, 'student_digital'),
(3, 'student_english_analogue'),
(4, 'student_english_digital'),
(5, 'textfeedback_analogue'),
(6, 'textfeedback_digital'),
(7, 'discipline_specific_analogue'),
(8, 'discipline_specific_digital'),
(9, 'phd_analogue'),
(10, 'phd_digital'),
(11, 'phd_english_analogue'),
(12, 'phd_english_digital'),
(13, 'research_analogue'),
(14, 'research_digital'),
(15, 'student_stem_analogue'),
(16, 'student_stem_digital'),
(17, 'methods_analogue'),
(18, 'methods_digital'),
(19, 'student_reading_analogue'),
(20, 'student_reading_digital');

-- --------------------------------------------------------

--
-- Table structure for table `peerTutors`
--

CREATE TABLE `peerTutors` (
  `ptId` int(11) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(500) NOT NULL,
  `subjects` varchar(100) NOT NULL,
  `languages` varchar(500) NOT NULL,
  `studentConsultations` tinyint(1) DEFAULT NULL,
  `phdConsultations` tinyint(1) DEFAULT NULL,
  `textFeedback` tinyint(1) DEFAULT NULL,
  `role` varchar(100) DEFAULT 'peertutor'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `protocols`
--

CREATE TABLE `protocols` (
  `protocolId` int(11) NOT NULL,
  `ptId` int(11) NOT NULL,
  `terminId` int(11) NOT NULL,
  `RSAnwesend` tinyint(1) DEFAULT NULL,
  `Beratungsschwerpunkt` varchar(1000) DEFAULT NULL,
  `Schreibphase` varchar(1000) DEFAULT NULL,
  `Verlauf` mediumtext,
  `ReflexionAllgemein` mediumtext,
  `ReflexionMethode` mediumtext,
  `ReflexionPersoenlich` mediumtext,
  `Arbeitsvereinbarung` mediumtext
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `ratsuchende`
--

CREATE TABLE `ratsuchende` (
  `rsId` int(11) NOT NULL,
  `firstName` varchar(500) DEFAULT NULL,
  `lastName` varchar(500) DEFAULT NULL,
  `email` varchar(500) DEFAULT NULL,
  `datenschutzBestaetigt` tinyint(1) DEFAULT NULL,
  `beratungsform` varchar(500) DEFAULT NULL,
  `angemeldetAls` varchar(100) DEFAULT NULL,
  `semester` varchar(10) DEFAULT NULL,
  `abschluss` varchar(100) DEFAULT NULL,
  `fachbereich` int(11) DEFAULT NULL,
  `fach` varchar(1000) DEFAULT NULL,
  `deutschAls` varchar(100) DEFAULT NULL,
  `erstStudierend` tinyint(1) DEFAULT NULL,
  `gender` varchar(100) DEFAULT NULL,
  `terminReasons` varchar(10000) DEFAULT NULL,
  `genre` varchar(100) DEFAULT NULL,
  `reachedBy` varchar(500) DEFAULT NULL,
  `commentField` mediumtext,
  `format` varchar(100) DEFAULT NULL,
  `otherTerminReasons` text,
  `topic` text,
  `elternHerkunft` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `termine`
--

CREATE TABLE `termine` (
  `terminId` int(11) NOT NULL,
  `datum` varchar(50) NOT NULL,
  `weekday` int(11) DEFAULT NULL,
  `timeslot` int(11) NOT NULL,
  `tutorId` int(11) NOT NULL,
  `available` tinyint(1) DEFAULT NULL,
  `archived` tinyint(1) DEFAULT '0',
  `rsId` int(11) DEFAULT NULL,
  `protocolId` int(11) DEFAULT NULL,
  `followUpId` int(11) DEFAULT NULL,
  `lastAccessed` datetime DEFAULT '2000-01-01 00:00:00',
  `evaluationSent` tinyint(1) DEFAULT '0',
  `guestRequest` tinyint(1) DEFAULT '0',
  `roomReservation` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `terminFormMap`
--

CREATE TABLE `terminFormMap` (
  `terminId` int(11) NOT NULL,
  `formId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_german2_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `beratungsformen`
--
ALTER TABLE `beratungsformen`
  ADD PRIMARY KEY (`formId`);

--
-- Indexes for table `peerTutors`
--
ALTER TABLE `peerTutors`
  ADD PRIMARY KEY (`ptId`);

--
-- Indexes for table `protocols`
--
ALTER TABLE `protocols`
  ADD PRIMARY KEY (`protocolId`),
  ADD KEY `ptId` (`ptId`),
  ADD KEY `terminId` (`terminId`);

--
-- Indexes for table `ratsuchende`
--
ALTER TABLE `ratsuchende`
  ADD PRIMARY KEY (`rsId`);

--
-- Indexes for table `termine`
--
ALTER TABLE `termine`
  ADD PRIMARY KEY (`terminId`),
  ADD KEY `tutorId` (`tutorId`),
  ADD KEY `rsId` (`rsId`),
  ADD KEY `protocolId` (`protocolId`);

--
-- Indexes for table `terminFormMap`
--
ALTER TABLE `terminFormMap`
  ADD PRIMARY KEY (`terminId`,`formId`),
  ADD KEY `formId` (`formId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `beratungsformen`
--
ALTER TABLE `beratungsformen`
  MODIFY `formId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `peerTutors`
--
ALTER TABLE `peerTutors`
  MODIFY `ptId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `protocols`
--
ALTER TABLE `protocols`
  MODIFY `protocolId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ratsuchende`
--
ALTER TABLE `ratsuchende`
  MODIFY `rsId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `termine`
--
ALTER TABLE `termine`
  MODIFY `terminId` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `terminFormMap`
--
ALTER TABLE `terminFormMap`
  ADD CONSTRAINT `terminformmap_ibfk_1` FOREIGN KEY (`terminId`) REFERENCES `termine` (`terminId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `terminformmap_ibfk_2` FOREIGN KEY (`formId`) REFERENCES `beratungsformen` (`formId`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
