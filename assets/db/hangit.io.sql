-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: mysql-m2x.alwaysdata.net
-- Generation Time: Nov 30, 2021 at 12:31 PM
-- Server version: 10.4.20-MariaDB
-- PHP Version: 7.4.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `m2x_game`
--

-- --------------------------------------------------------

--
-- Table structure for table `game`
--

CREATE TABLE `game` (
  `id_game` int(11) NOT NULL,
  `round_number` int(11) NOT NULL,
  `max_player` int(11) NOT NULL,
  `player_activ` int(11) NOT NULL,
  `link_game` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `hidden_word`
--

CREATE TABLE `hidden_word` (
  `id_word` int(11) NOT NULL,
  `word` varchar(50) NOT NULL,
  `try` int(11) NOT NULL,
  `id_player` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `message`
--

CREATE TABLE `message` (
  `id_message` int(11) NOT NULL,
  `text` varchar(250) NOT NULL,
  `id_game` int(11) NOT NULL,
  `id_player` int(11) NOT NULL,
  `auto` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `player`
--

CREATE TABLE `player` (
  `id_player` int(11) NOT NULL,
  `nickname` varchar(25) NOT NULL,
  `score` int(11) NOT NULL,
  `id_game` int(11) NOT NULL,
  `nicknameColor` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `round`
--

CREATE TABLE `round` (
  `id_round` int(11) NOT NULL,
  `id_game` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `round_player`
--

CREATE TABLE `round_player` (
  `id_player` int(11) NOT NULL,
  `id_round` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `game`
--
ALTER TABLE `game`
  ADD PRIMARY KEY (`id_game`);

--
-- Indexes for table `hidden_word`
--
ALTER TABLE `hidden_word`
  ADD PRIMARY KEY (`id_word`),
  ADD KEY `hidden_word_player_FK` (`id_player`);

--
-- Indexes for table `message`
--
ALTER TABLE `message`
  ADD PRIMARY KEY (`id_message`),
  ADD KEY `message_game_FK` (`id_game`),
  ADD KEY `message_player0_FK` (`id_player`);

--
-- Indexes for table `player`
--
ALTER TABLE `player`
  ADD PRIMARY KEY (`id_player`),
  ADD KEY `player_game_FK` (`id_game`);

--
-- Indexes for table `round`
--
ALTER TABLE `round`
  ADD PRIMARY KEY (`id_round`),
  ADD KEY `round_game_FK` (`id_game`);

--
-- Indexes for table `round_player`
--
ALTER TABLE `round_player`
  ADD PRIMARY KEY (`id_player`,`id_round`),
  ADD KEY `relation2_round0_FK` (`id_round`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `game`
--
ALTER TABLE `game`
  MODIFY `id_game` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hidden_word`
--
ALTER TABLE `hidden_word`
  MODIFY `id_word` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `message`
--
ALTER TABLE `message`
  MODIFY `id_message` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `player`
--
ALTER TABLE `player`
  MODIFY `id_player` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `round`
--
ALTER TABLE `round`
  MODIFY `id_round` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `hidden_word`
--
ALTER TABLE `hidden_word`
  ADD CONSTRAINT `hidden_word_player_FK` FOREIGN KEY (`id_player`) REFERENCES `player` (`id_player`);

--
-- Constraints for table `message`
--
ALTER TABLE `message`
  ADD CONSTRAINT `message_game_FK` FOREIGN KEY (`id_game`) REFERENCES `game` (`id_game`),
  ADD CONSTRAINT `message_player0_FK` FOREIGN KEY (`id_player`) REFERENCES `player` (`id_player`);

--
-- Constraints for table `player`
--
ALTER TABLE `player`
  ADD CONSTRAINT `player_game_FK` FOREIGN KEY (`id_game`) REFERENCES `game` (`id_game`);

--
-- Constraints for table `round`
--
ALTER TABLE `round`
  ADD CONSTRAINT `round_game_FK` FOREIGN KEY (`id_game`) REFERENCES `game` (`id_game`);

--
-- Constraints for table `round_player`
--
ALTER TABLE `round_player`
  ADD CONSTRAINT `relation2_player_FK` FOREIGN KEY (`id_player`) REFERENCES `player` (`id_player`),
  ADD CONSTRAINT `relation2_round0_FK` FOREIGN KEY (`id_round`) REFERENCES `round` (`id_round`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
