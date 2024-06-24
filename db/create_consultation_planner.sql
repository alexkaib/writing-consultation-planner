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
-- Tabellenstruktur für Tabelle `consultationTypes`
--

CREATE TABLE `consultationTypes` (
  `id` int(11) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `name_de` varchar(50) NOT NULL,
  `name_en` varchar(50) NOT NULL,
  `audience` varchar(500) NOT NULL,
  `info_de` varchar(500) DEFAULT NULL,
  `info_en` varchar(500) DEFAULT NULL,
  `min_date` int(11) NOT NULL DEFAULT '2',
  `max_date` int(11) NOT NULL DEFAULT '21',
  `send_cal_invite` tinyint(1) NOT NULL DEFAULT '0',
  `confirmation_mail` text,
  `eval_mail` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_german2_ci;

--
-- Daten für Tabelle `consultationTypes`
--

INSERT INTO `consultationTypes` (`id`, `active`, `name_de`, `name_en`, `audience`, `info_de`, `info_en`, `min_date`, `max_date`, `send_cal_invite`, `confirmation_mail`, `eval_mail`) VALUES
(1, 1, 'Platzhalter Typ', 'Placeholder Type', 'students', 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores.', 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores.', 2, 21, 0, 'Danke für die Anmeldung zur Beratung!', 'Bitte fülle die folgende Umfrage aus: LINK'),
(2, 1, 'Platzhalter Promovierende', 'Placeholder PHD students', 'phds', 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores.', 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores.', 2, 21, 0, 'Danke für die Anmeldung zur Beratung!', 'Bitte fülle folgende Evaluation aus: LINK');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `peerTutors`
--

CREATE TABLE `peerTutors` (
  `ptId` int(11) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(500) NOT NULL,
  `subjects` varchar(100) DEFAULT NULL,
  `role` varchar(100) NOT NULL DEFAULT 'peertutor',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `mailText` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_german2_ci;

--
-- Daten für Tabelle `peerTutors`
--

INSERT INTO `peerTutors` (`ptId`, `firstName`, `lastName`, `email`, `password`, `subjects`, `role`, `active`, `mailText`) VALUES
(1, 'Vorname', 'Nachname', 'admin@localhost.com', '$2y$10$L811JQ5mWaNzqtMTjkyYo.jvVg.Mmr8oC4Z7Hi/3AzaTmnTGrsZgW', 'Platzhalter Fach', 'admin', 1, NULL);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `protocols`
--

CREATE TABLE `protocols` (
  `protocolId` int(11) NOT NULL,
  `ptId` int(11) NOT NULL,
  `terminId` int(11) NOT NULL,
  `RSAnwesend` tinyint(1) NOT NULL,
  `Beratungsschwerpunkt` text,
  `Schreibphase` text,
  `Verlauf` text,
  `ReflexionAllgemein` text,
  `ReflexionMethode` text,
  `ReflexionPersoenlich` text,
  `Arbeitsvereinbarung` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_german2_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `ratsuchende`
--

CREATE TABLE `ratsuchende` (
  `rsId` int(11) NOT NULL,
  `first_name` varchar(500) NOT NULL,
  `last_name` varchar(500) NOT NULL,
  `email` varchar(500) NOT NULL,
  `semester` varchar(10) DEFAULT NULL,
  `subject` tinytext,
  `target_degree` tinytext,
  `reached_by` varchar(1000) DEFAULT NULL,
  `reason` text,
  `comment` text,
  `bookedTypeId` int(11) DEFAULT NULL,
  `bookedFormat` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_german2_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `termine`
--

CREATE TABLE `termine` (
  `terminId` int(11) NOT NULL,
  `datum` varchar(50) NOT NULL,
  `fromTime` varchar(10) NOT NULL,
  `toTime` varchar(10) NOT NULL,
  `analogue` tinyint(1) NOT NULL DEFAULT '0',
  `digital` tinyint(1) NOT NULL DEFAULT '0',
  `tutorId` int(11) NOT NULL,
  `available` tinyint(1) DEFAULT NULL,
  `archived` tinyint(1) DEFAULT '0',
  `rsId` int(11) DEFAULT NULL,
  `protocolId` int(11) DEFAULT NULL,
  `followUpId` int(11) DEFAULT NULL,
  `predecessorId` int(11) DEFAULT NULL,
  `lastAccessed` datetime DEFAULT '2000-01-01 00:00:00',
  `evaluationSent` tinyint(1) DEFAULT '0',
  `guestRequest` tinyint(1) DEFAULT '0',
  `roomReservation` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_german2_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `terminFormMap`
--

CREATE TABLE `terminFormMap` (
  `terminId` int(11) NOT NULL,
  `formId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_german2_ci;

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `consultationTypes`
--
ALTER TABLE `consultationTypes`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `peerTutors`
--
ALTER TABLE `peerTutors`
  ADD PRIMARY KEY (`ptId`);

--
-- Indizes für die Tabelle `protocols`
--
ALTER TABLE `protocols`
  ADD PRIMARY KEY (`protocolId`),
  ADD KEY `ptId` (`ptId`),
  ADD KEY `terminId` (`terminId`);

--
-- Indizes für die Tabelle `ratsuchende`
--
ALTER TABLE `ratsuchende`
  ADD PRIMARY KEY (`rsId`);

--
-- Indizes für die Tabelle `termine`
--
ALTER TABLE `termine`
  ADD PRIMARY KEY (`terminId`),
  ADD KEY `tutorId` (`tutorId`),
  ADD KEY `rsId` (`rsId`),
  ADD KEY `protocolId` (`protocolId`);

--
-- Indizes für die Tabelle `terminFormMap`
--
ALTER TABLE `terminFormMap`
  ADD PRIMARY KEY (`terminId`,`formId`),
  ADD KEY `formId` (`formId`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `consultationTypes`
--
ALTER TABLE `consultationTypes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT für Tabelle `peerTutors`
--
ALTER TABLE `peerTutors`
  MODIFY `ptId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT für Tabelle `protocols`
--
ALTER TABLE `protocols`
  MODIFY `protocolId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `ratsuchende`
--
ALTER TABLE `ratsuchende`
  MODIFY `rsId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `termine`
--
ALTER TABLE `termine`
  MODIFY `terminId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `terminFormMap`
--
ALTER TABLE `terminFormMap`
  ADD CONSTRAINT `terminformmap_ibfk_1` FOREIGN KEY (`terminId`) REFERENCES `termine` (`terminId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `terminformmap_ibfk_2` FOREIGN KEY (`formId`) REFERENCES `consultationTypes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
