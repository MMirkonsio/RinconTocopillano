-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 05-04-2024 a las 01:47:37
-- Versión del servidor: 8.0.31
-- Versión de PHP: 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `rinconbd2`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

DROP TABLE IF EXISTS `categorias`;
CREATE TABLE IF NOT EXISTS `categorias` (
  `categoria_id` int NOT NULL AUTO_INCREMENT,
  `nombre_categoria` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci DEFAULT NULL,
  PRIMARY KEY (`categoria_id`),
  UNIQUE KEY `nombre_categoria` (`nombre_categoria`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`categoria_id`, `nombre_categoria`) VALUES
(3, 'Electrónicos'),
(1, 'Comida'),
(2, 'Ropa'),
(4, 'Juguetes y juegos'),
(5, 'Productos para mascotas'),
(6, 'Artículos deportivos'),
(7, 'Otros');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comentarios`
--

DROP TABLE IF EXISTS `comentarios`;
CREATE TABLE IF NOT EXISTS `comentarios` (
  `comentario_id` int NOT NULL AUTO_INCREMENT,
  `publicacion_id` int DEFAULT NULL,
  `usuario_id` int DEFAULT NULL,
  `contenido` text COLLATE utf8mb3_spanish_ci,
  `tiempo_comentario` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`comentario_id`),
  KEY `publicacion_id` (`publicacion_id`),
  KEY `usuario_id` (`usuario_id`)
) ENGINE=MyISAM AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

--
-- Volcado de datos para la tabla `comentarios`
--

INSERT INTO `comentarios` (`comentario_id`, `publicacion_id`, `usuario_id`, `contenido`, `tiempo_comentario`) VALUES
(39, 65, 33, 'fea la wea', '2024-03-29 09:06:19'),
(38, 65, 33, 'Hay muchas variaciones de los pasajes de Lorem Ipsum disponibles, pero la mayoría sufrió alteraciones en alguna manera, ya sea porque se le agregó hum', '2024-03-29 01:58:53'),
(27, 65, 33, 'Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industria', '2024-03-29 00:43:08'),
(31, 65, 33, 'l contrario del pensamiento popular, el texto de Lorem Ipsum no es simplemente texto aleatorio. Tiene sus raices en una pieza cl´sica de la literatura', '2024-03-29 01:46:03'),
(30, 65, 33, 'Es un hecho establecido hace demasiado tiempo que un lector se distraerá con el contenido del texto de un sitio mientras que mira su diseño. El punto ', '2024-03-29 01:44:59'),
(40, 65, 33, 'bvfdbbdfbbfdbf', '2024-03-29 19:03:33'),
(41, 65, 33, 'jivneijnvvmji', '2024-03-30 04:19:55'),
(42, 39, 33, 'eyyyyy', '2024-03-30 04:20:09'),
(43, 65, 33, 'xddd', '2024-03-30 21:47:45'),
(44, 65, 35, 'XUPALO', '2024-04-01 03:24:39'),
(45, 44, 35, 'fea la wea', '2024-04-01 03:25:55');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `guardados`
--

DROP TABLE IF EXISTS `guardados`;
CREATE TABLE IF NOT EXISTS `guardados` (
  `guardado_id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int DEFAULT NULL,
  `publicacion_id` int DEFAULT NULL,
  `tipo` varchar(15) COLLATE utf8mb3_spanish_ci NOT NULL,
  PRIMARY KEY (`guardado_id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `publicacion_id` (`publicacion_id`)
) ENGINE=MyISAM AUTO_INCREMENT=114 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

--
-- Volcado de datos para la tabla `guardados`
--

INSERT INTO `guardados` (`guardado_id`, `usuario_id`, `publicacion_id`, `tipo`) VALUES
(107, 35, 65, 'guardado'),
(109, 35, 41, 'guardado'),
(110, 33, 41, 'guardado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificaciones`
--

DROP TABLE IF EXISTS `notificaciones`;
CREATE TABLE IF NOT EXISTS `notificaciones` (
  `notificacion_id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int DEFAULT NULL,
  `tipo` varchar(20) COLLATE utf8mb3_spanish_ci DEFAULT NULL,
  `publicacion_id` int DEFAULT NULL,
  `leido` tinyint(1) DEFAULT '0',
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`notificacion_id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `publicacion_id` (`publicacion_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `publicaciones`
--

DROP TABLE IF EXISTS `publicaciones`;
CREATE TABLE IF NOT EXISTS `publicaciones` (
  `publicacion_id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `categoria_id` int NOT NULL,
  `titulo` varchar(75) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `contenido` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `precio` decimal(10,0) NOT NULL,
  `comentarios` int NOT NULL,
  `imagen_contenido` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `tiempo_publicacion` timestamp NOT NULL,
  `notificacion_id` int DEFAULT NULL,
  PRIMARY KEY (`publicacion_id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `categorias` (`categoria_id`)
) ENGINE=MyISAM AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

--
-- Volcado de datos para la tabla `publicaciones`
--

INSERT INTO `publicaciones` (`publicacion_id`, `usuario_id`, `categoria_id`, `titulo`, `contenido`, `precio`, `comentarios`, `imagen_contenido`, `tiempo_publicacion`, `notificacion_id`) VALUES
(44, 33, 1, 'HAMBURGUESA RICA ', 'sabor ano', '2500', 0, 'hamburguesa_incorruptible.webp', '2024-03-16 07:36:07', NULL),
(41, 34, 6, 'AUTO ', 'auto con 3 rueda', '2000000', 0, 'auto.jpg', '2024-03-16 06:14:07', NULL),
(45, 33, 6, 'TOCOTURBOO', 'servicio auto 3 rueda', '2500', 0, 'auto.jpg', '2024-03-17 03:38:10', NULL),
(39, 35, 1, 'EMPANADAS FRITAS', 'empanadas sabor ano', '2500', 0, 'Empanada.jpg', '2024-03-15 08:44:54', NULL),
(65, 35, 2, 'Lorem ipsum dolor sit amet consectetur adipiscing elit taciti habitant plat', 'Lorem ipsum dolor sit amet consectetur adipiscing elit taciti habitant platea nullam scelerisque, libero feugiat tempus dis sed ac velit vestibulum tempor tortor. Accumsan donec laoreet etiam justo tellus blandit viverra neque, nam habitant platea condime', '5435', 0, 'image-w1280.webp', '2024-03-27 05:38:56', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `seguidores`
--

DROP TABLE IF EXISTS `seguidores`;
CREATE TABLE IF NOT EXISTS `seguidores` (
  `seguidor_id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int DEFAULT NULL,
  `usuario_seguido_id` int DEFAULT NULL,
  `tiempo_seguimiento` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`seguidor_id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `usuario_seguido_id` (`usuario_seguido_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre_usuario` varchar(25) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci DEFAULT NULL,
  `correo` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `telefono` int NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `foto_perfil` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `descripcion` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `direccion` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `horario` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre_usuario`, `correo`, `telefono`, `password`, `foto_perfil`, `descripcion`, `direccion`, `horario`) VALUES
(35, 'Christonsio', 'christonsio4k@gmail.cl', 45435, '$2a$10$g4Ypu5m5lARERC5IWNvs.uaFEHKu3o1p6ee0/KcEEuuGgJCSi2VC6', 'pasajero.png', '', '', ''),
(34, 'CALVO2', 'nose3@gmail.com', 5435, '$2a$10$xEErttUSBXCk1ahi2rTRou5SH/9dqpnvyINmVl0lHR1xQyt7WMoQa', 'default.webp', '', '', ''),
(33, 'CALVO', 'nose@gmail.com', 5235435, '$2a$10$lRbiJG/OhBrSaOjkoiaJpet78J3S5Y3h8w7XjWDw6MN.YC57/O97.', 'default.webp', '', '', '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `votos`
--

DROP TABLE IF EXISTS `votos`;
CREATE TABLE IF NOT EXISTS `votos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `publicacion_id` int DEFAULT NULL,
  `usuario_id` int DEFAULT NULL,
  `tipo` varchar(10) COLLATE utf8mb3_spanish_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `publicacion_id` (`publicacion_id`),
  KEY `usuario_id` (`usuario_id`)
) ENGINE=MyISAM AUTO_INCREMENT=614 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

--
-- Volcado de datos para la tabla `votos`
--

INSERT INTO `votos` (`id`, `publicacion_id`, `usuario_id`, `tipo`) VALUES
(591, 47, 35, 'upvote'),
(586, 41, 35, 'upvote'),
(585, 44, 35, 'unvote'),
(584, 45, 35, 'upvote'),
(583, 46, 35, 'unvote'),
(582, 46, 34, 'upvote'),
(581, 38, 34, 'downvote'),
(580, 46, 33, 'upvote'),
(588, 39, 35, 'upvote'),
(592, 45, 33, 'unvote'),
(593, 44, 33, 'unvote'),
(612, 65, 35, 'downvote'),
(594, 41, 33, 'unvote'),
(595, 40, 33, 'downvote'),
(596, 39, 33, 'unvote'),
(605, 45, 34, 'upvote'),
(598, 44, 34, 'upvote'),
(599, 41, 34, 'upvote'),
(607, 40, 34, 'upvote'),
(606, 55, 34, 'upvote'),
(608, 39, 34, 'upvote'),
(609, 59, 33, 'downvote'),
(610, 61, 33, 'upvote'),
(611, 64, 35, 'upvote'),
(613, 65, 33, 'upvote');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
