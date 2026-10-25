-- Esquema de la base de datos de Rincón Tocopillano (MySQL 8+).
-- Reemplaza al volcado antiguo rinconbd2.sql: tablas InnoDB, utf8mb4 (soporta emojis),
-- claves foráneas y valores por defecto compatibles con el modo estricto de MySQL 8.
--
-- Uso:  mysql -u root -p < Backend/database/rinconbd.sql
-- ¡Ojo! Borra y vuelve a crear las tablas: los datos actuales se pierden.

CREATE DATABASE IF NOT EXISTS `rinconbd2`
  DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci;
USE `rinconbd2`;

SET NAMES utf8mb4;
SET time_zone = "+00:00";
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `notificaciones`, `seguidores`, `votos`, `guardados`,
  `comentarios`, `publicacion_imagenes`, `publicaciones`, `categorias`, `usuarios`;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre_usuario` varchar(25) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `telefono` varchar(20) NOT NULL DEFAULT '',
  `password` varchar(255) NOT NULL,
  `foto_perfil` varchar(255) NOT NULL DEFAULT 'default.webp',
  `descripcion` varchar(255) NOT NULL DEFAULT '',
  `direccion` varchar(255) NOT NULL DEFAULT '',
  `horario` varchar(100) NOT NULL DEFAULT '',
  `creado_en` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_usuarios_nombre` (`nombre_usuario`),
  UNIQUE KEY `uq_usuarios_correo` (`correo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

CREATE TABLE `categorias` (
  `categoria_id` int NOT NULL AUTO_INCREMENT,
  `nombre_categoria` varchar(100) NOT NULL,
  PRIMARY KEY (`categoria_id`),
  UNIQUE KEY `uq_categorias_nombre` (`nombre_categoria`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

CREATE TABLE `publicaciones` (
  `publicacion_id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `categoria_id` int NOT NULL,
  `titulo` varchar(75) NOT NULL,
  `contenido` varchar(255) NOT NULL,
  `precio` decimal(10,0) NOT NULL DEFAULT 0,
  `estado` enum('disponible','reservado','vendido') NOT NULL DEFAULT 'disponible',
  `imagen_contenido` varchar(255) DEFAULT NULL,
  `tiempo_publicacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`publicacion_id`),
  KEY `idx_publicaciones_usuario` (`usuario_id`),
  KEY `idx_publicaciones_categoria` (`categoria_id`),
  KEY `idx_publicaciones_estado` (`estado`),
  CONSTRAINT `fk_publicaciones_usuario` FOREIGN KEY (`usuario_id`)
    REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_publicaciones_categoria` FOREIGN KEY (`categoria_id`)
    REFERENCES `categorias` (`categoria_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Fotos de cada publicación (hasta 8, en orden). `publicaciones.imagen_contenido` guarda la
-- portada (la primera) para las vistas que solo muestran una imagen.
CREATE TABLE `publicacion_imagenes` (
  `imagen_id` int NOT NULL AUTO_INCREMENT,
  `publicacion_id` int NOT NULL,
  `archivo` varchar(255) NOT NULL,
  `orden` tinyint unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`imagen_id`),
  KEY `idx_imagenes_publicacion` (`publicacion_id`, `orden`),
  CONSTRAINT `fk_imagenes_publicacion` FOREIGN KEY (`publicacion_id`)
    REFERENCES `publicaciones` (`publicacion_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Las respuestas son comentarios con `comentario_padre_id` apuntando al comentario original.
-- `usuario_reply_id` es el usuario al que se responde (para mostrar "En respuesta a @...").
CREATE TABLE `comentarios` (
  `comentario_id` int NOT NULL AUTO_INCREMENT,
  `publicacion_id` int NOT NULL,
  `usuario_id` int NOT NULL,
  `comentario_padre_id` int DEFAULT NULL,
  `usuario_reply_id` int DEFAULT NULL,
  `contenido` text NOT NULL,
  `tiempo_comentario` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`comentario_id`),
  KEY `idx_comentarios_publicacion` (`publicacion_id`),
  KEY `idx_comentarios_usuario` (`usuario_id`),
  KEY `idx_comentarios_padre` (`comentario_padre_id`),
  CONSTRAINT `fk_comentarios_publicacion` FOREIGN KEY (`publicacion_id`)
    REFERENCES `publicaciones` (`publicacion_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_comentarios_usuario` FOREIGN KEY (`usuario_id`)
    REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_comentarios_padre` FOREIGN KEY (`comentario_padre_id`)
    REFERENCES `comentarios` (`comentario_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_comentarios_usuario_reply` FOREIGN KEY (`usuario_reply_id`)
    REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

CREATE TABLE `guardados` (
  `guardado_id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `publicacion_id` int NOT NULL,
  `tipo` varchar(15) NOT NULL DEFAULT 'guardado',
  PRIMARY KEY (`guardado_id`),
  UNIQUE KEY `uq_guardados_usuario_publicacion` (`usuario_id`, `publicacion_id`),
  KEY `idx_guardados_publicacion` (`publicacion_id`),
  CONSTRAINT `fk_guardados_usuario` FOREIGN KEY (`usuario_id`)
    REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_guardados_publicacion` FOREIGN KEY (`publicacion_id`)
    REFERENCES `publicaciones` (`publicacion_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- tipo: 'upvote', 'downvote' o 'unvote' (voto retirado)
CREATE TABLE `votos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `publicacion_id` int NOT NULL,
  `usuario_id` int NOT NULL,
  `tipo` varchar(10) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_votos_publicacion_usuario` (`publicacion_id`, `usuario_id`),
  KEY `idx_votos_usuario` (`usuario_id`),
  CONSTRAINT `fk_votos_publicacion` FOREIGN KEY (`publicacion_id`)
    REFERENCES `publicaciones` (`publicacion_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_votos_usuario` FOREIGN KEY (`usuario_id`)
    REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

CREATE TABLE `seguidores` (
  `seguidor_id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `usuario_seguido_id` int NOT NULL,
  `tiempo_seguimiento` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`seguidor_id`),
  UNIQUE KEY `uq_seguidores` (`usuario_id`, `usuario_seguido_id`),
  KEY `idx_seguidores_seguido` (`usuario_seguido_id`),
  CONSTRAINT `fk_seguidores_usuario` FOREIGN KEY (`usuario_id`)
    REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_seguidores_seguido` FOREIGN KEY (`usuario_seguido_id`)
    REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

CREATE TABLE `notificaciones` (
  `notificacion_id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `tipo` varchar(20) DEFAULT NULL,
  `publicacion_id` int DEFAULT NULL,
  `leido` tinyint(1) NOT NULL DEFAULT 0,
  `creado_en` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`notificacion_id`),
  KEY `idx_notificaciones_usuario` (`usuario_id`),
  KEY `idx_notificaciones_publicacion` (`publicacion_id`),
  CONSTRAINT `fk_notificaciones_usuario` FOREIGN KEY (`usuario_id`)
    REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_notificaciones_publicacion` FOREIGN KEY (`publicacion_id`)
    REFERENCES `publicaciones` (`publicacion_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- ---------------------------------------------------------------------------
-- Datos de ejemplo (los del volcado antiguo, sin los votos que apuntaban a
-- publicaciones que ya no existían).
-- ---------------------------------------------------------------------------

INSERT INTO `categorias` (`categoria_id`, `nombre_categoria`) VALUES
(1, 'Comida'),
(2, 'Ropa'),
(3, 'Electrónicos'),
(4, 'Juguetes y juegos'),
(5, 'Productos para mascotas'),
(6, 'Artículos deportivos'),
(7, 'Otros');

INSERT INTO `usuarios` (`id`, `nombre_usuario`, `correo`, `telefono`, `password`, `foto_perfil`) VALUES
(33, 'CALVO', 'nose@gmail.com', '5235435', '$2a$10$lRbiJG/OhBrSaOjkoiaJpet78J3S5Y3h8w7XjWDw6MN.YC57/O97.', 'default.webp'),
(34, 'CALVO2', 'nose3@gmail.com', '5435', '$2a$10$xEErttUSBXCk1ahi2rTRou5SH/9dqpnvyINmVl0lHR1xQyt7WMoQa', 'default.webp'),
(35, 'Christonsio', 'christonsio4k@gmail.cl', '45435', '$2a$10$g4Ypu5m5lARERC5IWNvs.uaFEHKu3o1p6ee0/KcEEuuGgJCSi2VC6', 'pasajero.png');

INSERT INTO `publicaciones` (`publicacion_id`, `usuario_id`, `categoria_id`, `titulo`, `contenido`, `precio`, `imagen_contenido`, `tiempo_publicacion`) VALUES
(39, 35, 1, 'EMPANADAS FRITAS', 'empanadas sabor ano', 2500, 'Empanada.jpg', '2024-03-15 08:44:54'),
(41, 34, 6, 'AUTO ', 'auto con 3 rueda', 2000000, 'auto.jpg', '2024-03-16 06:14:07'),
(44, 33, 1, 'HAMBURGUESA RICA ', 'sabor ano', 2500, 'hamburguesa_incorruptible.webp', '2024-03-16 07:36:07'),
(45, 33, 6, 'TOCOTURBOO', 'servicio auto 3 rueda', 2500, 'auto.jpg', '2024-03-17 03:38:10'),
(65, 35, 2, 'Lorem ipsum dolor sit amet consectetur adipiscing elit taciti habitant plat', 'Lorem ipsum dolor sit amet consectetur adipiscing elit taciti habitant platea nullam scelerisque, libero feugiat tempus dis sed ac velit vestibulum tempor tortor. Accumsan donec laoreet etiam justo tellus blandit viverra neque, nam habitant platea condime', 5435, 'image-w1280.webp', '2024-03-27 05:38:56');

INSERT INTO `publicacion_imagenes` (`publicacion_id`, `archivo`, `orden`)
SELECT `publicacion_id`, `imagen_contenido`, 0 FROM `publicaciones` WHERE `imagen_contenido` IS NOT NULL;

INSERT INTO `comentarios` (`comentario_id`, `publicacion_id`, `usuario_id`, `contenido`, `tiempo_comentario`) VALUES
(27, 65, 33, 'Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industria', '2024-03-29 00:43:08'),
(30, 65, 33, 'Es un hecho establecido hace demasiado tiempo que un lector se distraerá con el contenido del texto de un sitio mientras que mira su diseño. El punto ', '2024-03-29 01:44:59'),
(31, 65, 33, 'l contrario del pensamiento popular, el texto de Lorem Ipsum no es simplemente texto aleatorio. Tiene sus raices en una pieza cl´sica de la literatura', '2024-03-29 01:46:03'),
(38, 65, 33, 'Hay muchas variaciones de los pasajes de Lorem Ipsum disponibles, pero la mayoría sufrió alteraciones en alguna manera, ya sea porque se le agregó hum', '2024-03-29 01:58:53'),
(39, 65, 33, 'fea la wea', '2024-03-29 09:06:19'),
(40, 65, 33, 'bvfdbbdfbbfdbf', '2024-03-29 19:03:33'),
(41, 65, 33, 'jivneijnvvmji', '2024-03-30 04:19:55'),
(42, 39, 33, 'eyyyyy', '2024-03-30 04:20:09'),
(43, 65, 33, 'xddd', '2024-03-30 21:47:45'),
(44, 65, 35, 'XUPALO', '2024-04-01 03:24:39'),
(45, 44, 35, 'fea la wea', '2024-04-01 03:25:55');

INSERT INTO `guardados` (`guardado_id`, `usuario_id`, `publicacion_id`, `tipo`) VALUES
(107, 35, 65, 'guardado'),
(109, 35, 41, 'guardado'),
(110, 33, 41, 'guardado');

INSERT INTO `votos` (`id`, `publicacion_id`, `usuario_id`, `tipo`) VALUES
(584, 45, 35, 'upvote'),
(585, 44, 35, 'unvote'),
(586, 41, 35, 'upvote'),
(588, 39, 35, 'upvote'),
(592, 45, 33, 'unvote'),
(593, 44, 33, 'unvote'),
(594, 41, 33, 'unvote'),
(596, 39, 33, 'unvote'),
(598, 44, 34, 'upvote'),
(599, 41, 34, 'upvote'),
(605, 45, 34, 'upvote'),
(608, 39, 34, 'upvote'),
(612, 65, 35, 'downvote'),
(613, 65, 33, 'upvote');
