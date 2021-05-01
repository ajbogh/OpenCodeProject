const mysqldump = require('mysqldump');
const path = require('path');
const secrets = require('../../config/secrets.js');

mysqldump({
  connection: secrets.mysql,
  dumpToFile: path.resolve(__dirname, '../database/database_tables.sql'),
  dump: {
    schema: {
      table: {}
    },
    data: false,
  },
});

mysqldump({
  connection: secrets.mysql,
  dumpToFile: path.resolve(__dirname, '../database/database_backup.sql'),
  dump: {
    schema: false,
  },
});