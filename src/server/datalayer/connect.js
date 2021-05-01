const mysql = require('mysql');
const secrets = require('../../../config/secrets.js');

function handleDisconnect(dbconn){
  dbconn.on('error', function(err){

    console.log('\nRe-connecting lost connection: ' +err.stack);
    db.destroy();

    db = mysql.createConnection(db.config);
    handleDisconnect(db);
    db.connect(() => {
      console.log('Database connected!');
    });
  });
}

const db = mysql.createConnection({ ...secrets.mysql });

db.connect((err) => {
  if (err) {
    console.error('\nDatabase connection failed: ' +err.stack);
    db.destroy();
    return;
  }
  console.log('Database connected!');
  
  handleDisconnect(db);

  var del = db._protocol._delegateError;
  db._protocol._delegateError = function(err, sequence){
    if (err.fatal) {
      console.trace('fatal error: ' + err.message);
    }
    return del.call(this, err, sequence);
  };
});

// const db = { 
//   createConnection: (opts) => mysql.createConnection({ ...secrets.mysql, ...opts }),
//   connect: async (db) => new Promise((resolve, reject) => db.connect((err) => {
//     if (err) {
//       reject(err);
//       return;
//     }
//     handleDisconnect(db);

//     var del = db._protocol._delegateError;
//     db._protocol._delegateError = function(err, sequence){
//       if (err.fatal) {
//         console.trace('fatal error: ' + err.message);
//       }
//       return del.call(this, err, sequence);
//     };

//     resolve();
//   })),
//   disconnect: async (db) => new Promise((resolve, reject) => db.end((err) => {
//     if(err) {
//       return reject(err);
//     }
//     resolve();
//   }))
// };



module.exports = db;
