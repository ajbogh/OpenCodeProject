const Importer = require('mysql-import');
const path = require('path');
const secrets = require('../../config/secrets.js');

const { host, user, password } = secrets.mysql;

const importer = new Importer({ host, user, password});

importer.onProgress(progress=>{
  var percent = Math.floor(progress.bytes_processed / progress.total_bytes * 10000) / 100;
  console.log(`${percent}% Completed`);
});

// IIFE
(async function importDB() {
  await importer.import(path.resolve(__dirname, '../database/database.sql')).then(()=>{
    var files_imported = importer.getImported();
    console.log(`${files_imported.length} SQL file(s) imported.`);
  }).catch(err=>{
    console.error(err);
  });

  await(importer.use(secrets.mysql.database));

  await importer.import(path.resolve(__dirname, '../database/database_tables.sql')).then(()=>{
    var files_imported = importer.getImported();
    console.log(`${files_imported.length} SQL file(s) imported.`);
  }).catch(err=>{
    console.error(err);
  });

  await importer.import(path.resolve(__dirname, '../database/database_backup.sql')).then(()=>{
    var files_imported = importer.getImported();
    console.log(`${files_imported.length} SQL file(s) imported.`);
  }).catch(err=>{
    console.error(err);
  });
})();
