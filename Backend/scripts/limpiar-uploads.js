// Lista (o borra) las imágenes de uploads/ que ninguna publicación ni perfil usa.
//   npm run limpiar-uploads            → solo muestra la lista
//   npm run limpiar-uploads -- --borrar → además las borra
const fs = require("fs");
const { db } = require("../src/db");
const { uploadsDir } = require("../src/config");
const { PROTEGIDAS, archivosEnUso, borrarImagenesSinUso } = require("../src/utils/archivos");

const main = async () => {
  const borrar = process.argv.includes("--borrar");
  const archivos = fs
    .readdirSync(uploadsDir, { withFileTypes: true })
    .filter((e) => e.isFile() && !PROTEGIDAS.has(e.name))
    .map((e) => e.name);

  const enUso = await archivosEnUso(archivos);
  const huerfanos = archivos.filter((a) => !enUso.has(a));

  if (huerfanos.length === 0) {
    console.log("No hay imágenes sin usar en uploads/.");
    return;
  }

  console.log(`${huerfanos.length} imagen(es) sin usar en uploads/:`);
  for (const a of huerfanos) {
    const kb = Math.round(fs.statSync(`${uploadsDir}/${a}`).size / 1024);
    console.log(`  ${a}  (${kb} KB)`);
  }

  if (borrar) {
    const borrados = await borrarImagenesSinUso(huerfanos);
    console.log(`Borradas: ${borrados.length}.`);
  } else {
    console.log("Nada se borró. Para borrarlas: npm run limpiar-uploads -- --borrar");
  }
};

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.end());
