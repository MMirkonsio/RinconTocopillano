-- Estado de venta de cada publicación: disponible, reservado o vendido.
-- Para una base de datos ya creada con rinconbd.sql (los datos se conservan):
--   mysql -u root -p rinconbd2 < Backend/database/migraciones/001_estado_publicaciones.sql

ALTER TABLE `publicaciones`
  ADD COLUMN `estado` ENUM('disponible', 'reservado', 'vendido') NOT NULL DEFAULT 'disponible' AFTER `precio`,
  ADD KEY `idx_publicaciones_estado` (`estado`);
