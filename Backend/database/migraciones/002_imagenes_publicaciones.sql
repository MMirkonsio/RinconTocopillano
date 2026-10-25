-- Varias fotos por publicación (hasta 8). `publicaciones.imagen_contenido` se mantiene como
-- portada (la primera foto) para que las vistas que solo usan una imagen sigan funcionando.
--   mysql -u root -p rinconbd2 < Backend/database/migraciones/002_imagenes_publicaciones.sql

CREATE TABLE IF NOT EXISTS `publicacion_imagenes` (
  `imagen_id` int NOT NULL AUTO_INCREMENT,
  `publicacion_id` int NOT NULL,
  `archivo` varchar(255) NOT NULL,
  `orden` tinyint unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`imagen_id`),
  KEY `idx_imagenes_publicacion` (`publicacion_id`, `orden`),
  CONSTRAINT `fk_imagenes_publicacion` FOREIGN KEY (`publicacion_id`)
    REFERENCES `publicaciones` (`publicacion_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Las publicaciones existentes pasan a tener su foto actual como única imagen
INSERT INTO `publicacion_imagenes` (`publicacion_id`, `archivo`, `orden`)
SELECT p.`publicacion_id`, p.`imagen_contenido`, 0
FROM `publicaciones` p
WHERE p.`imagen_contenido` IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM `publicacion_imagenes` i WHERE i.`publicacion_id` = p.`publicacion_id`);
